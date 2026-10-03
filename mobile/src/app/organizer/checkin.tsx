import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { FlatList, RefreshControl, View } from 'react-native'
import { eventStatus, fetchMyEvents } from '@/api/organizer'
import { Card, StatusBadge } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Empty, Skeleton } from '@/components/ui'
import { formatDate } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

export default function CheckInPicker() {
  const { colors } = useTheme()
  const q = useQuery({ queryKey: ['org-events'], queryFn: fetchMyEvents })
  // Only events that can have attendees: approved ones that haven't finished long ago.
  const rows = (q.data?.events ?? [])
    .map((e) => ({ e, status: eventStatus(e) }))
    .filter((r) => ['Live', 'Sold out', 'Past'].includes(r.status))
    .sort((a, b) => (a.status === 'Past' ? 1 : 0) - (b.status === 'Past' ? 1 : 0))

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="Check-in" sub="Scan tickets at the door" />
      <FlatList
        data={rows}
        keyExtractor={(r) => r.e._id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
        ListEmptyComponent={q.isLoading ? <Skeleton style={{ height: 80 }} /> : <Empty icon="scan-outline" title="No events to check in" hint="Once an event is approved and live, it shows up here." />}
        renderItem={({ item: { e, status } }) => (
          <Card onPress={() => router.push({ pathname: '/scan/[eventId]', params: { eventId: e._id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="qr-code" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="h3" numberOfLines={1}>{e.title}</Text>
              <Text variant="small" color="muted">{e.startDate ? formatDate(e.startDate) : ''}</Text>
            </View>
            <StatusBadge status={status} />
          </Card>
        )}
      />
    </View>
  )
}
