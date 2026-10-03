import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, RefreshControl, View } from 'react-native'
import { fetchOverview, fetchProfile, type Period } from '@/api/organizer'
import { Bars, Card, DashScroll, Section, Segmented, StatCard, StatusBadge } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Skeleton } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { compactMoney, formatDate } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

export default function OrganizerOverview() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const [period, setPeriod] = useState<Period>('30d')
  const q = useQuery({ queryKey: ['org-overview', period], queryFn: () => fetchOverview(period) })
  const profile = useQuery({ queryKey: ['org-profile'], queryFn: fetchProfile })
  const o = q.data
  const cur = o?.currency
  const status = profile.data?.approvalStatus

  const pct = (v: number | null | undefined) => (v == null ? 'No prior data' : `${v >= 0 ? '+' : ''}${v}% vs last period`)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader
        sub={`Hi ${user?.fullname?.split(' ')[0] ?? 'there'} 👋`}
        title="Your dashboard"
        right={<Pressable onPress={() => router.push('/create-event')} style={{ backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 }}>
          <Ionicons name="add" size={18} color={colors.primaryText} /><Text variant="label" color={colors.primaryText}>New event</Text>
        </Pressable>}
      />
      <DashScroll refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); profile.refetch() }} tintColor={colors.primary} />}>
        {status && status !== 'approved' ? (
          <Card style={{ backgroundColor: colors.accentSoft, borderColor: colors.accentSoft, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Ionicons name="alert-circle" size={22} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text variant="h3">{status === 'pending' ? 'Your account is under review' : status === 'rejected' ? 'Your account was not approved' : 'Finish setting up your organizer account'}</Text>
              <Text variant="small" color="muted">You can build events as drafts. Publishing needs an approved account. Complete your business profile on the Eventra website.</Text>
            </View>
          </Card>
        ) : null}

        <Segmented value={period} onChange={setPeriod} options={[{ key: '7d', label: '7 days' }, { key: '30d', label: '30 days' }, { key: '1m', label: 'This month' }]} />

        {q.isLoading ? (
          <View style={{ gap: 12 }}><Skeleton style={{ height: 110 }} /><Skeleton style={{ height: 110 }} /></View>
        ) : q.isError ? (
          <Card><Text color="danger">{q.error.message}</Text></Card>
        ) : o ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <StatCard icon="ticket" label="Tickets sold" value={o.ticketsSold.toLocaleString()} sub={pct(o.ticketsSoldChangePct)} />
              <StatCard icon="cash" label="Revenue" value={compactMoney(o.revenue, cur)} sub={pct(o.revenueChangePct)} tone="accent" />
              <StatCard icon="radio" label="Live events" value={String(o.liveEventsCount)} sub={o.liveEventsCount ? 'Selling now' : 'None right now'} />
              <StatCard icon="wallet" label="Payout due" value={compactMoney(o.payoutDue, cur)} sub={o.nextPayoutInDays != null ? `Next in ${o.nextPayoutInDays} days` : 'None scheduled'} tone="accent" />
            </View>

            <Section title="Revenue" />
            <Card><Bars data={o.revenueSeries} format={(n) => compactMoney(n, cur)} /></Card>

            {o.ticketsByType.length ? (
              <>
                <Section title="Tickets by type" />
                <Card style={{ gap: 12 }}>
                  {o.ticketsByType.map((t) => (
                    <View key={t.name}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text variant="label">{t.name}</Text><Text variant="small" color="muted">{t.count} · {Math.round(t.percentage)}%</Text>
                      </View>
                      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt, marginTop: 6 }}>
                        <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.primary, width: `${Math.min(100, t.percentage)}%` }} />
                      </View>
                    </View>
                  ))}
                </Card>
              </>
            ) : null}

            <Section title="Recent events" action="See all" onAction={() => router.push('/organizer/events')} />
            {o.recentEvents.length === 0 ? (
              <Card><Text color="muted">No events yet. Tap “New event” to create your first one.</Text></Card>
            ) : o.recentEvents.map((e) => (
              <Card key={e._id} onPress={() => router.push({ pathname: '/manage/[id]', params: { id: e._id } })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Image source={e.coverImage} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.surfaceAlt }} contentFit="cover" />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="h3" numberOfLines={1}>{e.title}</Text>
                  <Text variant="small" color="muted">{formatDate(e.startDate)} · {e.soldCount}{e.capacity ? ` / ${e.capacity}` : ''} sold</Text>
                </View>
                <StatusBadge status={e.statusLabel ?? e.status} />
              </Card>
            ))}
          </>
        ) : null}
      </DashScroll>
    </View>
  )
}
