import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert, RefreshControl, View } from 'react-native'
import { approveEvent, approveOrganizer, fetchPendingEvents, fetchPendingOrganizers, rejectEvent, rejectOrganizer } from '@/api/admin'
import { Card, DashScroll, ReasonModal, Segmented, StatusBadge } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Button, Empty, Skeleton } from '@/components/ui'
import { formatDate } from '@/lib/format'
import { useTheme } from '@/lib/theme-context'

type Reject = { kind: 'event' | 'organizer'; id: string; name: string }

export default function Approvals() {
  const { colors } = useTheme()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'events' | 'organizers'>('events')
  const [rejecting, setRejecting] = useState<Reject>()
  const events = useQuery({ queryKey: ['admin-pending-events'], queryFn: fetchPendingEvents })
  const orgs = useQuery({ queryKey: ['admin-pending-orgs'], queryFn: fetchPendingOrganizers })

  const refresh = () => ['admin-pending-events', 'admin-pending-orgs', 'admin-nav-counts', 'admin-overview'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
  const approve = useMutation({
    mutationFn: ({ kind, id }: { kind: 'event' | 'organizer'; id: string }) => (kind === 'event' ? approveEvent(id) : approveOrganizer(id)),
    onSuccess: refresh,
    onError: (e) => Alert.alert('Could not approve', e.message),
  })
  const confirmApprove = (kind: 'event' | 'organizer', id: string, name: string) =>
    Alert.alert(`Approve ${kind}?`, name, [{ text: 'Cancel', style: 'cancel' }, { text: 'Approve', onPress: () => approve.mutate({ kind, id }) }])

  const current = tab === 'events' ? events : orgs
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="Approvals" sub="Review what's waiting" />
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <Segmented value={tab} onChange={setTab} options={[{ key: 'events', label: `Events${events.data ? ` (${events.data.length})` : ''}` }, { key: 'organizers', label: `Organizers${orgs.data ? ` (${orgs.data.length})` : ''}` }]} />
      </View>
      <DashScroll refreshControl={<RefreshControl refreshing={current.isRefetching} onRefresh={() => current.refetch()} tintColor={colors.primary} />}>
        {current.isLoading ? <Skeleton style={{ height: 130 }} /> : current.isError ? <Card><Text color="danger">{current.error.message}</Text></Card> : tab === 'events' ? (
          events.data?.length ? events.data.map((e) => (
            <Card key={e._id} style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <Text variant="h3" style={{ flex: 1 }} numberOfLines={2}>{e.title ?? 'Untitled event'}</Text>
                <StatusBadge status={e.type === 'free' ? 'Free' : 'Paid'} />
              </View>
              <Text variant="small" color="muted">By {e.organizer?.organizerProfile?.businessName ?? e.organizer?.fullname ?? 'Unknown'} · {e.startDate ? formatDate(e.startDate) : 'No date'}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Button title="Reject" variant="danger" onPress={() => setRejecting({ kind: 'event', id: e._id, name: e.title ?? 'this event' })} style={{ flex: 1, paddingVertical: 11 }} />
                <Button title="Approve" onPress={() => confirmApprove('event', e._id, e.title ?? 'this event')} loading={approve.isPending && approve.variables?.id === e._id} style={{ flex: 1, paddingVertical: 11 }} />
              </View>
            </Card>
          )) : <Empty icon="checkmark-done-circle-outline" title="All caught up" hint="No events are waiting for review." />
        ) : (
          orgs.data?.length ? orgs.data.map((o) => (
            <Card key={o._id} style={{ gap: 6 }}>
              <Text variant="h3">{o.organizerProfile?.businessName ?? o.fullname}</Text>
              <Text variant="small" color="muted">{o.fullname}{o.email ? ` · ${o.email}` : ''}</Text>
              {o.organizerProfile?.category ? <Text variant="small" color="muted">Category: {o.organizerProfile.category}</Text> : null}
              {o.organizerProfile?.bankName ? <Text variant="small" color="muted">Bank: {o.organizerProfile.bankName}{o.organizerProfile.accountName ? ` · ${o.organizerProfile.accountName}` : ''}</Text> : null}
              {o.organizerProfile?.bio ? <Text variant="small" numberOfLines={3}>{o.organizerProfile.bio}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Button title="Reject" variant="danger" onPress={() => setRejecting({ kind: 'organizer', id: o._id, name: o.organizerProfile?.businessName ?? o.fullname })} style={{ flex: 1, paddingVertical: 11 }} />
                <Button title="Approve" onPress={() => confirmApprove('organizer', o._id, o.organizerProfile?.businessName ?? o.fullname)} loading={approve.isPending && approve.variables?.id === o._id} style={{ flex: 1, paddingVertical: 11 }} />
              </View>
            </Card>
          )) : <Empty icon="checkmark-done-circle-outline" title="All caught up" hint="No organizers are waiting for verification." />
        )}
      </DashScroll>
      <ReasonModal
        visible={!!rejecting}
        title={`Reject ${rejecting?.kind ?? ''}`}
        hint={`Tell ${rejecting?.name ?? 'them'} why. They will see this reason.`}
        required={rejecting?.kind === 'event'}
        confirmLabel="Reject"
        onClose={() => setRejecting(undefined)}
        onConfirm={async (reason) => {
          try {
            if (rejecting!.kind === 'event') await rejectEvent(rejecting!.id, reason)
            else await rejectOrganizer(rejecting!.id, reason || undefined)
            setRejecting(undefined)
            refresh()
          } catch (e) {
            Alert.alert('Could not reject', (e as Error).message)
          }
        }}
      />
    </View>
  )
}
