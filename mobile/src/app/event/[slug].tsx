import { Ionicons } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchEvent } from '@/api/events'
import { getOrderByReference, initializeCheckout, rsvpFreeEvent } from '@/api/tickets'
import type { EventDetail } from '@/api/types'
import { Text } from '@/components/text'
import { Button, Empty, IconButton, Pill, Skeleton } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { formatDate, formatTime, money, venueLabel } from '@/lib/format'
import { useSaved } from '@/lib/saved'
import { radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

export default function EventScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { user, setUser } = useAuth()
  const qc = useQueryClient()
  const { isSaved, toggle } = useSaved()
  const q = useQuery({ queryKey: ['event', slug], queryFn: () => fetchEvent(slug) })
  const [qty, setQty] = useState<Record<string, number>>({})
  const [busy, setBusy] = useState(false)
  const [more, setMore] = useState(false)

  if (q.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Skeleton style={{ height: 340, borderRadius: 0 }} />
        <View style={{ padding: 20, gap: 12 }}>
          <Skeleton style={{ height: 28, width: '80%' }} />
          <Skeleton style={{ height: 70 }} />
          <Skeleton style={{ height: 70 }} />
        </View>
      </View>
    )
  }
  if (q.isError || !q.data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}>
        <Empty icon="alert-circle-outline" title="Event not found" hint={q.error?.message} action={{ label: 'Go back', onPress: () => router.back() }} />
      </View>
    )
  }
  const e: EventDetail = q.data
  const free = e.type === 'free'
  const currency = e.currency
  const total = e.ticketTypes.reduce((sum, t) => sum + (qty[t._id] ?? 0) * t.price, 0)
  const count = Object.values(qty).reduce((a, b) => a + b, 0)
  const categoryName = typeof e.category === 'object' && e.category ? e.category.name : undefined
  const host = e.organizer?.organizerProfile?.businessName ?? e.organizer?.fullname

  // The server says "log in or give your name" when it didn't receive our session.
  // Treat that as an expired login instead of a mysterious failure.
  const sessionLost = (err: unknown) => {
    if (!(err instanceof Error) || !err.message.toLowerCase().includes('log in, or provide your name')) return false
    setUser(null)
    Alert.alert('Please log in again', 'Your login expired. Log in to continue buying.', [{ text: 'Log in', onPress: () => router.push('/auth/login') }])
    return true
  }

  const needLogin = () => {
    if (user) return false
    router.push('/auth/login')
    return true
  }

  async function reserve() {
    if (needLogin()) return
    setBusy(true)
    try {
      await rsvpFreeEvent(e._id)
      qc.invalidateQueries({ queryKey: ['my-tickets'] })
      Alert.alert("You're in! 🎉", 'Your free ticket is in the Tickets tab.', [
        { text: 'View tickets', onPress: () => router.replace('/tickets') },
        { text: 'OK' },
      ])
    } catch (err) {
      if (!sessionLost(err)) Alert.alert('Could not reserve', (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function pay() {
    if (needLogin()) return
    const items = Object.entries(qty).filter(([, n]) => n > 0).map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }))
    setBusy(true)
    try {
      const order = await initializeCheckout(e._id, items)
      // Paystack hosts the payment page. The server confirms the order, so once
      // the sheet closes we just poll its status.
      await WebBrowser.openBrowserAsync(order.authorizationUrl)
      let status = 'pending'
      for (let i = 0; i < 5 && status === 'pending'; i++) {
        status = (await getOrderByReference(order.reference)).status
        if (status === 'pending') await new Promise((r) => setTimeout(r, 1500))
      }
      qc.invalidateQueries({ queryKey: ['my-tickets'] })
      qc.invalidateQueries({ queryKey: ['event', e.slug] })
      setQty({})
      if (status === 'paid') {
        Alert.alert('Payment received 🎉', 'Your tickets are ready.', [{ text: 'View tickets', onPress: () => router.replace('/tickets') }])
      } else {
        Alert.alert('Payment not confirmed', 'If you were charged, your tickets will appear in the Tickets tab shortly.')
      }
    } catch (err) {
      if (!sessionLost(err)) Alert.alert('Checkout failed', (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={e.coverImage} style={{ height: 360, width: '100%', backgroundColor: colors.surfaceAlt }} contentFit="cover" transition={250} />
          <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent']} style={[StyleSheet.absoluteFill, { height: 140 }]} />
        </View>

        <View style={[s.sheet, { backgroundColor: colors.bg }]}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            {categoryName ? <Pill label={categoryName} /> : null}
            <Pill label={free ? 'Free' : 'Ticketed'} tone={free ? 'primary' : 'accent'} />
          </View>
          <Text variant="title" style={{ fontSize: 28, lineHeight: 34 }}>{e.title}</Text>
          {host ? (
            <View style={s.host}>
              <View style={[s.hostAvatar, { backgroundColor: colors.primarySoft }]}>
                <Text variant="label" color="primary">{host.slice(0, 1).toUpperCase()}</Text>
              </View>
              <Text color="muted">Hosted by <Text variant="label">{host}</Text></Text>
            </View>
          ) : null}

          <View style={{ gap: 12, marginTop: 20 }}>
            <InfoRow icon="calendar" title={formatDate(e.startDate)} sub={`${formatTime(e.startDate)}${e.endDate ? ` – ${formatTime(e.endDate)}` : ''}`} />
            <InfoRow icon="location" title={e.venue?.name ?? (e.isOnline ? 'Online event' : 'Venue to be announced')} sub={e.venue ? [e.venue.address, e.venue.city].filter(Boolean).join(', ') : venueLabel(e)} />
          </View>

          {e.description ? (
            <View style={{ marginTop: 26 }}>
              <Text variant="h2" style={{ marginBottom: 8 }}>About this event</Text>
              <Text color="muted" numberOfLines={more ? undefined : 5}>{e.description}</Text>
              {e.description.length > 220 ? (
                <Pressable onPress={() => setMore((m) => !m)} hitSlop={8}>
                  <Text variant="label" color="primary" style={{ marginTop: 6 }}>{more ? 'Show less' : 'Read more'}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {e.lineup?.length ? (
            <View style={{ marginTop: 26 }}>
              <Text variant="h2" style={{ marginBottom: 12 }}>Lineup</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {e.lineup.map((l) => (
                  <View key={l._id} style={[s.lineup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="mic-outline" size={14} color={colors.primary} />
                    <Text variant="label">{l.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {!free ? (
            <View style={{ marginTop: 26, gap: 10 }}>
              <Text variant="h2">Choose tickets</Text>
              {e.ticketTypes.map((t) => {
                const left = t.quantity - t.quantitySold
                const n = qty[t._id] ?? 0
                const soldOut = left <= 0
                return (
                  <View key={t._id} style={[s.tier, { backgroundColor: colors.surface, borderColor: n ? colors.primary : colors.border }]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="h3">{t.name}</Text>
                      <Text variant="h2" color="primary">{money(t.price, currency)}</Text>
                      <Text variant="small" color={soldOut ? 'danger' : left <= 10 ? 'accent' : 'muted'}>
                        {soldOut ? 'Sold out' : left <= 10 ? `Only ${left} left` : 'Available'}
                      </Text>
                    </View>
                    <View style={s.stepper}>
                      <Step icon="remove" disabled={n === 0} onPress={() => setQty({ ...qty, [t._id]: n - 1 })} />
                      <Text variant="h3" style={{ minWidth: 20, textAlign: 'center' }}>{n}</Text>
                      <Step icon="add" disabled={soldOut || n >= Math.min(left, 10)} onPress={() => setQty({ ...qty, [t._id]: n + 1 })} />
                    </View>
                  </View>
                )
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[s.floating, { top: insets.top + 8 }]} pointerEvents="box-none">
        <IconButton icon="chevron-back" onPress={() => router.back()} bg="rgba(255,255,255,0.92)" color="#0B1F1A" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <IconButton icon="share-outline" onPress={() => Share.share({ message: `${e.title} on Eventra` })} bg="rgba(255,255,255,0.92)" color="#0B1F1A" />
          <IconButton
            icon={isSaved(e._id) ? 'heart' : 'heart-outline'}
            onPress={() => toggle(e._id)}
            bg="rgba(255,255,255,0.92)"
            color={isSaved(e._id) ? '#F43F5E' : '#0B1F1A'}
          />
        </View>
      </View>

      <View style={[s.bar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text variant="small" color="muted">{free ? 'Admission' : count ? `${count} ticket${count > 1 ? 's' : ''}` : 'From'}</Text>
          <Text variant="title">{free ? 'Free' : money(count ? total : e.minPrice, currency)}</Text>
        </View>
        <Button
          style={{ flex: 1, marginLeft: 20 }}
          title={free ? 'Reserve my spot' : count ? 'Checkout' : 'Select tickets'}
          icon={free ? 'ticket-outline' : 'lock-closed-outline'}
          onPress={free ? reserve : pay}
          loading={busy}
          disabled={!free && !count}
        />
      </View>
    </View>
  )
}

function InfoRow({ icon, title, sub }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub?: string }) {
  const { colors } = useTheme()
  return (
    <View style={[s.info, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[s.infoIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="h3">{title}</Text>
        {sub ? <Text variant="small" color="muted">{sub}</Text> : null}
      </View>
    </View>
  )
}

function Step({ icon, onPress, disabled }: { icon: 'add' | 'remove'; onPress: () => void; disabled: boolean }) {
  const { colors } = useTheme()
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[s.step, { backgroundColor: colors.primarySoft }, disabled && { opacity: 0.4 }]}>
      <Ionicons name={icon} size={18} color={colors.primary} />
    </Pressable>
  )
}

const s = StyleSheet.create({
  sheet: { marginTop: -28, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingTop: 24 },
  host: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  hostAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  info: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: radius.md, borderWidth: 1 },
  infoIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  lineup: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  tier: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: radius.md, borderWidth: 1.5 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  step: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  floating: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
})
