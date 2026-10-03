import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert, RefreshControl, View } from 'react-native'
import { approveRefund, fetchRefunds, rejectRefund } from '@/api/admin'
import { Card, DashScroll, ReasonModal } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Button, Empty, Skeleton } from '@/components/ui'
import { formatDate, money } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

export default function Refunds() {
  const { colors } = useTheme()
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['admin-refunds'], queryFn: fetchRefunds })
  const [rejecting, setRejecting] = useState<string>()
  const [busy, setBusy] = useState<string>()
  const refresh = () => ['admin-refunds', 'admin-nav-counts', 'admin-overview'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))

  const approve = (id: string, label: string) =>
    Alert.alert('Approve this refund?', `${label} will be refunded to the attendee.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve refund', onPress: async () => {
        setBusy(id)
        try { await approveRefund(id); refresh() } catch (e) { Alert.alert('Could not approve', (e as Error).message) } finally { setBusy(undefined) }
      } },
    ])

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="Refunds" sub="Requests from attendees" />
      <DashScroll refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}>
        {q.isLoading ? <Skeleton style={{ height: 140 }} /> : q.isError ? <Card><Text color="danger">{q.error.message}</Text></Card> : q.data?.length ? q.data.map((r) => (
          <Card key={r._id} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="h2" color="primary">{money(r.amount, r.currency)}</Text>
              <Text variant="small" color="muted">{formatDate(r.createdAt)}</Text>
            </View>
            <Text variant="h3" numberOfLines={2}>{r.event.title}</Text>
            <Text variant="small" color="muted">{r.ticket.attendeeName} · {r.ticket.attendeeEmail}</Text>
            <Text numberOfLines={4}>“{r.reason}”</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <Button title="Reject" variant="danger" onPress={() => setRejecting(r._id)} style={{ flex: 1, paddingVertical: 11 }} />
              <Button title="Approve" onPress={() => approve(r._id, money(r.amount, r.currency))} loading={busy === r._id} style={{ flex: 1, paddingVertical: 11 }} />
            </View>
          </Card>
        )) : <Empty icon="checkmark-done-circle-outline" title="No pending refunds" hint="New requests will show up here." />}
      </DashScroll>
      <ReasonModal
        visible={!!rejecting}
        title="Reject refund"
        hint="The attendee will see this reason."
        confirmLabel="Reject"
        onClose={() => setRejecting(undefined)}
        onConfirm={async (reason) => {
          try { await rejectRefund(rejecting!, reason || undefined); setRejecting(undefined); refresh() } catch (e) { Alert.alert('Could not reject', (e as Error).message) }
        }}
      />
    </View>
  )
}
