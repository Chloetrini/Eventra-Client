import { useQuery } from '@tanstack/react-query'
import { RefreshControl, View } from 'react-native'
import { fetchPayouts } from '@/api/organizer'
import { Card, DashScroll, Section, StatCard, StatusBadge } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Skeleton } from '@/components/ui'
import { compactMoney, formatDate, money } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

const LABEL = { held: 'Held', ready: 'Ready', paid: 'Paid', free_no_payout: 'Free' } as const

export default function OrganizerPayouts() {
  const { colors } = useTheme()
  const q = useQuery({ queryKey: ['org-payouts'], queryFn: fetchPayouts })
  const d = q.data
  const cur = d?.currency
  const earned = d?.earningsByEvent.reduce((s, r) => s + r.earnings, 0) ?? 0
  const ready = d?.earningsByEvent.filter((r) => r.status === 'ready').reduce((s, r) => s + r.earnings, 0) ?? 0
  const paid = d?.payoutHistory.reduce((s, r) => s + r.amount, 0) ?? 0

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="Payouts" sub="Your earnings" />
      <DashScroll refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}>
        {q.isLoading ? <Skeleton style={{ height: 120 }} /> : q.isError ? <Card><Text color="danger">{q.error.message}</Text></Card> : d ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <StatCard icon="trending-up" label="Total earned" value={compactMoney(earned, cur)} />
              <StatCard icon="checkmark-circle" label="Ready to pay out" value={compactMoney(ready, cur)} tone="accent" />
              <StatCard icon="wallet" label="Paid to you" value={compactMoney(paid, cur)} style={{ minWidth: '100%' }} />
            </View>
            <Section title="Earnings by event" />
            {d.earningsByEvent.length === 0 ? <Card><Text color="muted">Earnings appear here once you sell tickets.</Text></Card> : d.earningsByEvent.map((r) => (
              <Card key={r.eventId} style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <Text variant="h3" style={{ flex: 1 }} numberOfLines={2}>{r.eventTitle}</Text>
                  <StatusBadge status={LABEL[r.status]} />
                </View>
                <Row k="Gross sales" v={money(r.grossSales, cur)} />
                <Row k="Platform commission" v={`- ${money(r.commission, cur)}`} />
                <Row k="Your earnings" v={money(r.earnings, cur)} bold />
              </Card>
            ))}
            <Section title="Payout history" />
            {d.payoutHistory.length === 0 ? <Card><Text color="muted">No payouts yet.</Text></Card> : d.payoutHistory.map((p, i) => (
              <Card key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View><Text variant="h3">{money(p.amount, cur)}</Text><Text variant="small" color="muted">{p.bankLabel ?? 'Bank account'}</Text></View>
                <Text variant="small" color="muted">{formatDate(p.date)}</Text>
              </Card>
            ))}
          </>
        ) : null}
      </DashScroll>
    </View>
  )
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text variant="small" color="muted">{k}</Text>
      <Text variant={bold ? 'h3' : 'small'} color={bold ? 'primary' : 'text'}>{v}</Text>
    </View>
  )
}
