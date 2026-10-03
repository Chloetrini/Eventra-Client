import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Pressable, RefreshControl, View } from 'react-native'
import { fetchAdminOverview } from '@/api/admin'
import { Bars, Card, DashScroll, Section, StatCard } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Skeleton } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { compactMoney, timeAgo } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

export default function AdminOverview() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const q = useQuery({ queryKey: ['admin-overview'], queryFn: () => fetchAdminOverview('30d') })
  const o = q.data
  const cur = o?.currency
  const todo = o ? [
    { n: o.needsAction.pendingEventsCount, label: 'Events to review', to: '/admin/approvals' },
    { n: o.needsAction.organizersToVerifyCount, label: 'Organizers to verify', to: '/admin/approvals' },
    { n: o.needsAction.pendingRefundsCount, label: 'Refund requests', to: '/admin/refunds' },
  ] : []

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader sub={`Hi ${user?.fullname?.split(' ')[0] ?? 'there'} 👋`} title="Admin console" />
      <DashScroll refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}>
        {q.isLoading ? <View style={{ gap: 12 }}><Skeleton style={{ height: 90 }} /><Skeleton style={{ height: 120 }} /></View> : q.isError ? <Card><Text color="danger">{q.error.message}</Text></Card> : o ? (
          <>
            <Section title="Needs your attention" />
            <Card style={{ gap: 4, paddingVertical: 8 }}>
              {todo.map((t, i) => (
                <Pressable key={t.label} onPress={() => router.push(t.to as never)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border }}>
                    <View style={{ minWidth: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: t.n ? colors.accentSoft : colors.primarySoft }}>
                      <Text variant="h3" color={t.n ? 'accent' : 'primary'}>{t.n}</Text>
                    </View>
                    <Text variant="h3" style={{ flex: 1 }}>{t.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.subtle} />
                  </View>
                </Pressable>
              ))}
            </Card>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <StatCard icon="cash" label="Gross ticket sales" value={compactMoney(o.stats.grossTicketSales, cur)} sub="Last 30 days" />
              <StatCard icon="trending-up" label="Platform revenue" value={compactMoney(o.stats.platformRevenue, cur)} sub={o.stats.platformRevenueChangePct == null ? `${o.stats.commissionRatePct}% commission` : `${o.stats.platformRevenueChangePct >= 0 ? '+' : ''}${o.stats.platformRevenueChangePct}% vs last period`} tone="accent" />
              <StatCard icon="lock-closed" label="Held in escrow" value={compactMoney(o.stats.heldInEscrow, cur)} />
              <StatCard icon="calendar" label="Active events" value={String(o.stats.activeEventsCount)} sub={`${o.stats.activeOrganizersCount} organizers`} tone="accent" />
            </View>

            <Section title="Platform revenue" />
            <Card><Bars data={o.revenueSeries} format={(n) => compactMoney(n, cur)} /></Card>

            <Section title="Trust & safety" />
            <Card style={{ gap: 10 }}>
              <Row k="Flagged events" v={String(o.trustAndSafety.flaggedEventsCount)} />
              <Row k="Open payment disputes" v={String(o.trustAndSafety.openPaymentDisputesCount)} />
              <Row k="Refund rate (30 days)" v={`${o.trustAndSafety.refundRate30d}%`} />
              <Row k="New organizers today" v={String(o.trustAndSafety.newOrganizersToday)} />
            </Card>

            {o.topOrganizers.length ? (<>
              <Section title="Top organizers" />
              <Card style={{ gap: 10 }}>{o.topOrganizers.map((t, i) => <Row key={t.organizerId} k={`${i + 1}. ${t.businessName}`} v={compactMoney(t.grossSales, cur)} />)}</Card>
            </>) : null}

            <Section title="Recent activity" />
            {o.recentActivity.length === 0 ? <Card><Text color="muted">Nothing yet.</Text></Card> : o.recentActivity.slice(0, 8).map((a) => (
              <Card key={a.id} style={{ gap: 2 }}>
                <Text variant="h3">{a.message}</Text>
                <Text variant="small" color="muted">{a.actorName} · {timeAgo(a.createdAt)}</Text>
              </Card>
            ))}
          </>
        ) : null}
      </DashScroll>
    </View>
  )
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
    <Text color="muted" style={{ flex: 1 }} numberOfLines={1}>{k}</Text><Text variant="h3">{v}</Text>
  </View>
)
