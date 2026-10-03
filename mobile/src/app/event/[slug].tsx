import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import * as WebBrowser from 'expo-web-browser'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { fetchEvent } from '@/api/events'
import { fetchSavedEvents, getOrderByReference, initializeCheckout, rsvpFreeEvent, saveEvent, unsaveEvent } from '@/api/tickets'
import type { EventDetail } from '@/api/types'
import { Button, Empty, Loading } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { formatDate, formatTime, money, venueLabel } from '@/lib/format'
import { colors } from '@/lib/theme'

export default function EventScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const q = useQuery({ queryKey: ['event', slug], queryFn: () => fetchEvent(slug) })
  const { user } = useAuth()
  const qc = useQueryClient()

  const saved = useQuery({ queryKey: ['saved'], queryFn: fetchSavedEvents, enabled: !!user })
  const isSaved = !!saved.data?.some((e) => e._id === q.data?._id)
  const toggleSave = useMutation({
    mutationFn: () => (isSaved ? unsaveEvent(q.data!._id) : saveEvent(q.data!._id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved'] }),
    onError: (e) => Alert.alert('Could not update saved events', e.message),
  })

  if (q.isLoading) return <Loading />
  if (q.isError || !q.data) return <Empty title="Event not found" hint={q.error?.message} />
  const e = q.data

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              hitSlop={12}
              onPress={() => (user ? toggleSave.mutate() : router.push('/auth/login'))}
            >
              <Text style={{ fontSize: 22, color: colors.danger }}>{isSaved ? '♥' : '♡'}</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 48 }}>
        <Image source={e.coverImage} style={s.cover} contentFit="cover" />
        <View style={s.body}>
          <Text style={s.title}>{e.title}</Text>
          <Text style={s.meta}>{formatDate(e.startDate)} · {formatTime(e.startDate)}</Text>
          <Text style={s.meta}>{venueLabel(e)}</Text>
          {e.organizer ? (
            <Text style={s.meta}>By {e.organizer.organizerProfile?.businessName ?? e.organizer.fullname}</Text>
          ) : null}
          {e.description ? <Text style={s.desc}>{e.description}</Text> : null}
          <Tickets event={e} />
        </View>
      </ScrollView>
    </>
  )
}

function Tickets({ event }: { event: EventDetail }) {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [qty, setQty] = useState<Record<string, number>>({})
  const [busy, setBusy] = useState(false)

  const requireLogin = () => {
    if (user) return true
    router.push('/auth/login')
    return false
  }

  async function rsvp() {
    if (!requireLogin()) return
    setBusy(true)
    try {
      await rsvpFreeEvent(event._id)
      qc.invalidateQueries({ queryKey: ['my-tickets'] })
      Alert.alert("You're in!", 'Your free ticket is in the Tickets tab.', [
        { text: 'View tickets', onPress: () => router.push('/tickets') },
        { text: 'OK' },
      ])
    } catch (e) {
      Alert.alert('Could not reserve', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function checkout() {
    if (!requireLogin()) return
    const items = Object.entries(qty).filter(([, n]) => n > 0).map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }))
    setBusy(true)
    try {
      const order = await initializeCheckout(event._id, items)
      // Paystack hosts the payment page; the order is confirmed server-side,
      // so once the sheet closes we just poll the order's status.
      await WebBrowser.openBrowserAsync(order.authorizationUrl)
      let status = 'pending'
      for (let i = 0; i < 5 && status === 'pending'; i++) {
        status = (await getOrderByReference(order.reference)).status
        if (status === 'pending') await new Promise((r) => setTimeout(r, 1500))
      }
      qc.invalidateQueries({ queryKey: ['my-tickets'] })
      qc.invalidateQueries({ queryKey: ['event', event.slug] })
      if (status === 'paid') {
        Alert.alert('Payment received', 'Your tickets are ready.', [
          { text: 'View tickets', onPress: () => router.push('/tickets') },
        ])
      } else {
        Alert.alert('Payment not confirmed', 'If you were charged, your tickets will appear in the Tickets tab shortly.')
      }
    } catch (e) {
      Alert.alert('Checkout failed', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (event.type === 'free') {
    return (
      <View style={s.section}>
        <Button title="Reserve free ticket" onPress={rsvp} loading={busy} />
      </View>
    )
  }

  const currency = event.currency
  const total = event.ticketTypes.reduce((sum, t) => sum + (qty[t._id] ?? 0) * t.price, 0)
  const count = Object.values(qty).reduce((a, b) => a + b, 0)

  return (
    <View style={s.section}>
      <Text style={s.h2}>Tickets</Text>
      {event.ticketTypes.map((t) => {
        const left = t.quantity - t.quantitySold
        const n = qty[t._id] ?? 0
        return (
          <View key={t._id} style={s.tier}>
            <View style={{ flex: 1 }}>
              <Text style={s.tierName}>{t.name}</Text>
              <Text style={s.meta}>{money(t.price, currency)}{left <= 0 ? ' · Sold out' : left <= 10 ? ` · ${left} left` : ''}</Text>
            </View>
            <View style={s.stepper}>
              <Pressable disabled={n === 0} onPress={() => setQty({ ...qty, [t._id]: n - 1 })} style={s.stepBtn}>
                <Text style={s.stepTxt}>−</Text>
              </Pressable>
              <Text style={s.qty}>{n}</Text>
              <Pressable disabled={left <= 0 || n >= Math.min(left, 10)} onPress={() => setQty({ ...qty, [t._id]: n + 1 })} style={s.stepBtn}>
                <Text style={s.stepTxt}>+</Text>
              </Pressable>
            </View>
          </View>
        )
      })}
      <Button title={count ? `Pay ${money(total, currency)}` : 'Select tickets'} onPress={checkout} loading={busy} disabled={!count} />
    </View>
  )
}

const s = StyleSheet.create({
  cover: { height: 220, backgroundColor: colors.mint },
  body: { padding: 20, gap: 6 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  meta: { color: colors.muted, fontSize: 14 },
  desc: { color: colors.text, lineHeight: 22, marginTop: 14 },
  section: { marginTop: 24, gap: 12 },
  h2: { fontSize: 18, fontWeight: '800', color: colors.text },
  tier: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14 },
  tierName: { fontWeight: '700', fontSize: 16, color: colors.text },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 20, color: colors.primaryDark, fontWeight: '700' },
  qty: { minWidth: 18, textAlign: 'center', fontWeight: '700' },
})
