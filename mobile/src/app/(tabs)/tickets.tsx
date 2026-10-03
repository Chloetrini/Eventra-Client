import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import { fetchMyTickets } from '@/api/tickets'
import type { MyTicket } from '@/api/types'
import { ScreenHeader } from '@/components/screen-header'
import { SignInPrompt } from '@/components/sign-in-prompt'
import { Text } from '@/components/text'
import { Chip, Empty, Pill, Skeleton } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { formatDate, formatTime, isUpcoming, venueLabel } from '@/lib/format'
import { cardShadow, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

export default function Tickets() {
  const { colors, mode } = useTheme()
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const q = useQuery({ queryKey: ['my-tickets'], queryFn: fetchMyTickets, enabled: !!user })

  const all = q.data ?? []
  const data = all.filter((t) => (tab === 'upcoming') === (isUpcoming(t.event.startDate) && t.status === 'valid'))

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Tickets" sub="Your passes in one place" />
      {!loading && !user ? (
        <SignInPrompt text="Log in to see your tickets." />
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
            <Chip label="Upcoming" active={tab === 'upcoming'} onPress={() => setTab('upcoming')} />
            <Chip label="Past" active={tab === 'past'} onPress={() => setTab('past')} />
          </View>
          <FlatList
            data={data}
            keyExtractor={(t) => t._id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
            ListEmptyComponent={
              q.isLoading ? (
                <View style={{ gap: 12 }}><Skeleton style={{ height: 110 }} /><Skeleton style={{ height: 110 }} /></View>
              ) : (
                <Empty icon="ticket-outline" title={tab === 'upcoming' ? 'No upcoming tickets' : 'No past tickets'} hint="Tickets you get will show up here." action={tab === 'upcoming' ? { label: 'Find events', onPress: () => router.push('/') } : undefined} />
              )
            }
            renderItem={({ item: t }) => <TicketRow t={t} shadow={cardShadow(mode)} />}
          />
        </>
      )}
    </View>
  )
}

function TicketRow({ t, shadow }: { t: MyTicket; shadow: object }) {
  const { colors } = useTheme()
  const tone = t.status === 'valid' ? 'primary' : t.status === 'checked_in' ? 'muted' : 'danger'
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/ticket/[id]', params: { id: t._id } })}
      style={({ pressed }) => [s.card, { backgroundColor: colors.surface, borderColor: colors.border }, shadow, pressed && { opacity: 0.9 }]}
    >
      <Image source={t.event.coverImage} style={s.thumb} contentFit="cover" />
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="h3" numberOfLines={2}>{t.event.title}</Text>
        <View style={s.row}>
          <Ionicons name="calendar-outline" size={14} color={colors.muted} />
          <Text variant="small" color="muted">{formatDate(t.event.startDate)} · {formatTime(t.event.startDate)}</Text>
        </View>
        <View style={s.row}>
          <Ionicons name="location-outline" size={14} color={colors.muted} />
          <Text variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>{venueLabel(t.event)}</Text>
        </View>
        <View style={[s.row, { marginTop: 4, gap: 8 }]}>
          <Pill label={t.ticketType?.name ?? 'Free'} tone="accent" />
          <Pill label={t.status === 'checked_in' ? 'Checked in' : t.status} tone={tone} />
        </View>
      </View>
    </Pressable>
  )
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, padding: 12, borderRadius: radius.lg, borderWidth: 1, marginBottom: 14 },
  thumb: { width: 88, height: 104, borderRadius: radius.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
})
