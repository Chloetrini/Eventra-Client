import { Ionicons } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, RefreshControl, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { duplicateEvent, eventStatus, fetchAttendees, fetchEventDashboard, fetchMyEvents, submitEvent } from '@/api/organizer'
import { Card, Section, StatCard, StatusBadge } from '@/components/dash'
import { Text } from '@/components/text'
import { Button, Empty, IconButton, Loading } from '@/components/ui'
import { compactMoney, formatDate, formatTime } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

export default function ManageEvent() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const qc = useQueryClient()
  const [busy, setBusy] = useState<string>()
  const dash = useQuery({ queryKey: ['org-event', id], queryFn: () => fetchEventDashboard(id) })
  const list = useQuery({ queryKey: ['org-events'], queryFn: fetchMyEvents })
  const att = useQuery({ queryKey: ['org-attendees', id], queryFn: () => fetchAttendees(id) })

  if (dash.isLoading) return <Loading />
  if (dash.isError || !dash.data) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}><Empty icon="alert-circle-outline" title="Couldn't load this event" hint={dash.error?.message} action={{ label: 'Go back', onPress: () => router.back() }} /></View>

  const d = dash.data
  const row = list.data?.events.find((e) => e._id === id)
  const status = row ? eventStatus(row) : d.event.status
  const free = d.event.type === 'free'
  const sold = free ? d.reservationsCount ?? 0 : d.ticketsSoldCount ?? 0
  const canScan = ['Live', 'Sold out', 'Past'].includes(status)
  const canSubmit = ['Draft', 'Rejected'].includes(status)

  const run = async (key: string, fn: () => Promise<unknown>, done: string) => {
    setBusy(key)
    try {
      await fn()
      qc.invalidateQueries({ queryKey: ['org-events'] })
      qc.invalidateQueries({ queryKey: ['org-event', id] })
      Alert.alert(done)
    } catch (e) {
      Alert.alert('Something went wrong', (e as Error).message)
    } finally {
      setBusy(undefined)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={dash.isRefetching} onRefresh={() => { dash.refetch(); att.refetch(); list.refetch() }} tintColor={colors.primary} />}>
        <View>
          <Image source={d.event.coverImage} style={{ height: 220, backgroundColor: colors.surfaceAlt }} contentFit="cover" />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120 }} />
        </View>
        <View style={{ padding: 20, gap: 14, marginTop: -24, backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <StatusBadge status={status} />
          <Text variant="title">{d.event.title}</Text>
          {d.event.startDate ? <Text color="muted">{formatDate(d.event.startDate)} · {formatTime(d.event.startDate)}{d.event.venue ? ` · ${d.event.venue.name}, ${d.event.venue.city}` : d.event.isOnline ? ' · Online' : ''}</Text> : null}

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <StatCard icon="ticket" label={free ? 'RSVPs' : 'Tickets sold'} value={`${sold}${d.capacity ? ` / ${d.capacity}` : ''}`} />
            {!free ? <StatCard icon="cash" label="Revenue" value={compactMoney(d.revenueTotal ?? 0, d.currency)} tone="accent" /> : null}
            <StatCard icon="checkmark-done" label="Checked in" value={att.data ? `${att.data.stats.checkedIn} / ${att.data.stats.total}` : '–'} sub={att.data && att.data.stats.total ? `${Math.round((att.data.stats.checkedIn / att.data.stats.total) * 100)}% arrived` : undefined} />
          </View>

          <View style={{ gap: 10 }}>
            {canScan ? <Button title="Scan tickets" icon="qr-code-outline" onPress={() => router.push({ pathname: '/scan/[eventId]', params: { eventId: id } })} /> : null}
            {canSubmit ? <Button title="Submit for approval" icon="paper-plane-outline" loading={busy === 'submit'} onPress={() => Alert.alert('Submit this event?', 'Our team will review it before it goes live.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Submit', onPress: () => run('submit', () => submitEvent(id), 'Submitted for review') }])} /> : null}
            {status === 'Pending' ? <Card style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Ionicons name="time-outline" size={20} color={colors.accent} /><Text color="muted" style={{ flex: 1 }}>Waiting for admin approval.</Text></Card> : null}
            <Button title="Duplicate event" variant="secondary" icon="copy-outline" loading={busy === 'dup'} onPress={() => run('dup', () => duplicateEvent(id), 'Duplicated as a new draft')} />
          </View>

          <Section title="Recent attendees" action={att.data && att.data.stats.total > 6 ? 'Open guest list' : undefined} onAction={() => router.push({ pathname: '/scan/[eventId]', params: { eventId: id, tab: 'list' } })} />
          {att.isLoading ? null : !att.data?.tickets.length ? <Card><Text color="muted">No attendees yet.</Text></Card> : att.data.tickets.slice(0, 6).map((t) => (
            <Card key={t._id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text variant="h3" numberOfLines={1}>{t.attendeeName}</Text>
                <Text variant="small" color="muted" numberOfLines={1}>{t.ticketType?.name ?? 'RSVP'} · {t.ticketId}</Text>
              </View>
              <StatusBadge status={t.status} />
            </Card>
          ))}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', top: insets.top + 8, left: 16 }}>
        <IconButton icon="chevron-back" onPress={() => router.back()} bg="rgba(255,255,255,0.92)" color="#0B1F1A" />
      </View>
    </View>
  )
}
