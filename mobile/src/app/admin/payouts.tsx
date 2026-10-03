import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert, RefreshControl, View } from 'react-native'
import { fetchAwaiting, fetchPayoutOverview, releasePayout } from '@/api/admin'
import { Card, DashScroll, Section, StatCard, StatusBadge } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Button, Skeleton } from '@/components/ui'
import { compactMoney, formatDate, money } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

export default function AdminPayouts() {
  const { colors } = useTheme()
  const qc = useQueryClient()
  const [busy, setBusy] = useState<string>()
  const ov = useQuery({ queryKey: ['admin-payout-overview'], queryFn: fetchPayoutOverview })
  const aw = useQuery({ queryKey: ['admin-awaiting'], queryFn: fetchAwaiting })
  const cur = ov.data?.currency

  const release = (p: { organizerId: string; eventId: string; organizerName: string; eventTitle: string; amount: number }) =>
    Alert.alert('Release payout?', `${money(p.amount, aw.data?.currency)} to ${p.organizerName} for “${p.eventTitle}”. This sends real money.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Release', style: 'destructive', onPress: async () => {
        setBusy(p.eventId)
        try {
          await releasePayout(p.organizerId, p.eventId)
          qc.invalidateQueries({ queryKey: ['admin-awaiting'] }); qc.invalidateQueries({ queryKey: ['admin-payout-overview'] })
          Alert.alert('Payout released')
        } catch (e) { Alert.alert('Could not release', (e as Error).message) } finally { setBusy(undefined) }
      } },
    ])

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="Payouts" sub="Money owed to organizers" />
      <DashScroll refreshControl={<RefreshControl refreshing={ov.isRefetching || aw.isRefetching} onRefresh={() => { ov.refetch(); aw.refetch() }} tintColor={colors.primary} />}>
        {ov.data ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <StatCard icon="lock-closed" label="Held in escrow" value={compactMoney(ov.data.heldInEscrow, cur)} sub={`${ov.data.heldInEscrowEventsCount} events`} />
            <StatCard icon="checkmark-circle" label="Ready to release" value={compactMoney(ov.data.readyToRelease, cur)} tone="accent" />
            <StatCard icon="send" label="Paid out (all time)" value={compactMoney(ov.data.paidOutAllTime, cur)} />
            <StatCard icon="trending-up" label="Commission" value={compactMoney(ov.data.commissionCollected, cur)} tone="accent" />
          </View>
        ) : ov.isLoading ? <Skeleton style={{ height: 120 }} /> : null}

        <Section title="Awaiting payout" />
        {aw.isLoading ? <Skeleton style={{ height: 100 }} /> : !aw.data?.payouts.length ? <Card><Text color="muted">No payouts waiting.</Text></Card> : aw.data.payouts.map((p) => (
          <Card key={p.eventId + p.organizerId} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <Text variant="h3" style={{ flex: 1 }} numberOfLines={2}>{p.eventTitle}</Text>
              <StatusBadge status={p.status} />
            </View>
            <Text variant="small" color="muted">{p.organizerName}{p.releaseDate ? ` · releases ${formatDate(p.releaseDate)}` : ''}</Text>
            <Text variant="title" color="primary">{money(p.amount, aw.data?.currency)}</Text>
            {p.status === 'ready' ? <Button title="Release payout" icon="send-outline" onPress={() => release(p)} loading={busy === p.eventId} style={{ paddingVertical: 11 }} /> : null}
          </Card>
        ))}
      </DashScroll>
    </View>
  )
}
