import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, View } from 'react-native'
import { eventStatus, fetchMyEvents } from '@/api/organizer'
import { Card, StatusBadge } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Chip, Empty, Skeleton } from '@/components/ui'
import { compactMoney, formatDate } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

const FILTERS = ['All', 'Live', 'Draft', 'Pending', 'Past'] as const

export default function OrganizerEvents() {
  const { colors } = useTheme()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const q = useQuery({ queryKey: ['org-events'], queryFn: fetchMyEvents })
  const rows = (q.data?.events ?? [])
    .map((e) => ({ e, status: eventStatus(e) }))
    .filter((r) => filter === 'All' || r.status === filter || (filter === 'Live' && r.status === 'Sold out'))

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="Events" sub="Manage everything you host" right={
        <Pressable onPress={() => router.push('/create-event')} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="add" size={24} color={colors.primaryText} />
        </Pressable>
      } />
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
        {FILTERS.map((f) => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.e._id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
        ListEmptyComponent={q.isLoading ? <Skeleton style={{ height: 96 }} /> : (
          <Empty icon="calendar-outline" title={filter === 'All' ? 'No events yet' : `No ${filter.toLowerCase()} events`} hint="Create your first event and start selling tickets." action={{ label: 'Create event', onPress: () => router.push('/create-event') }} />
        )}
        renderItem={({ item: { e, status } }) => {
          const sold = e.type === 'free' ? e.reservationsCount ?? 0 : e.ticketsSoldCount ?? 0
          return (
            <Card onPress={() => router.push({ pathname: '/manage/[id]', params: { id: e._id } })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Image source={e.coverImage} style={{ width: 72, height: 72, borderRadius: 14, backgroundColor: colors.surfaceAlt }} contentFit="cover" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="h3" numberOfLines={2}>{e.title ?? 'Untitled event'}</Text>
                <Text variant="small" color="muted">{e.startDate ? formatDate(e.startDate) : 'Date not set'}</Text>
                <Text variant="small" color="muted">{sold}{e.capacity ? ` / ${e.capacity}` : ''} {e.type === 'free' ? 'RSVPs' : 'sold'}{e.type === 'paid' && e.revenueTotal ? ` · ${compactMoney(e.revenueTotal, q.data?.currency)}` : ''}</Text>
              </View>
              <StatusBadge status={status} />
            </Card>
          )
        }}
      />
    </View>
  )
}
