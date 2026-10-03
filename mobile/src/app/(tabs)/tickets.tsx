import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { fetchMyTickets } from '@/api/tickets'
import { SignInPrompt } from '@/components/sign-in-prompt'
import { Empty, Loading } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { formatDate, formatTime, venueLabel } from '@/lib/format'
import { colors } from '@/lib/theme'

export default function Tickets() {
  const { user, loading } = useAuth()
  const q = useQuery({ queryKey: ['my-tickets'], queryFn: fetchMyTickets, enabled: !!user })

  if (loading || (user && q.isLoading)) return <Loading />
  if (!user) return <SignInPrompt text="Log in to see your tickets." />

  return (
    <FlatList
      data={q.data ?? []}
      keyExtractor={(t) => t._id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} />}
      ListEmptyComponent={<Empty title="No tickets yet" hint="Tickets you get will show up here." />}
      renderItem={({ item: t }) => (
        <Pressable style={s.card} onPress={() => router.push({ pathname: '/ticket/[id]', params: { id: t._id } })}>
          <Text style={s.title} numberOfLines={2}>{t.event.title}</Text>
          <Text style={s.meta}>{formatDate(t.event.startDate)} · {formatTime(t.event.startDate)}</Text>
          <Text style={s.meta}>{venueLabel(t.event)}</Text>
          <View style={s.row}>
            <Text style={s.type}>{t.ticketType?.name ?? 'Free'}</Text>
            <Text style={[s.status, t.status !== 'valid' && { color: colors.muted }]}>
              {t.status === 'checked_in' ? 'Checked in' : t.status}
            </Text>
          </View>
        </Pressable>
      )}
    />
  )
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginBottom: 12, gap: 4 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  meta: { color: colors.muted, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  type: { color: colors.primaryDark, fontWeight: '700' },
  status: { color: colors.primary, fontWeight: '700', textTransform: 'capitalize' },
})
