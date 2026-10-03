import { Ionicons } from '@expo/vector-icons'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, FlatList, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchUsers, suspendUser, unsuspendUser, type AdminUser } from '@/api/admin'
import { Card, StatusBadge } from '@/components/dash'
import { Text } from '@/components/text'
import { Button, Empty, IconButton, Skeleton } from '@/components/ui'
import { compactMoney, formatDate } from '@/lib/format'
import { font, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

export default function AdminUsers() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const qc = useQueryClient()
  const [text, setText] = useState('')
  const [q, setQ] = useState('')
  const users = useInfiniteQuery({
    queryKey: ['admin-users', q],
    queryFn: ({ pageParam }) => fetchUsers({ q, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.meta.hasMore ? all.length + 1 : undefined),
  })
  const rows = users.data?.pages.flatMap((p) => p.users) ?? []
  const cur = users.data?.pages[0]?.currency

  const toggle = (u: AdminUser) =>
    Alert.alert(u.isSuspended ? 'Restore access?' : 'Suspend this account?', `${u.fullname} (${u.email})`, [
      { text: 'Cancel', style: 'cancel' },
      { text: u.isSuspended ? 'Restore' : 'Suspend', style: u.isSuspended ? 'default' : 'destructive', onPress: async () => {
        try { await (u.isSuspended ? unsuspendUser(u._id) : suspendUser(u._id)); qc.invalidateQueries({ queryKey: ['admin-users'] }) } catch (e) { Alert.alert('Could not update', (e as Error).message) }
      } },
    ])

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, gap: 12, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconButton icon="chevron-back" onPress={() => router.back()} bg={colors.surfaceAlt} />
          <Text variant="title">Users</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface }}>
          <Ionicons name="search" size={18} color={colors.subtle} />
          <TextInput value={text} onChangeText={setText} onSubmitEditing={() => setQ(text.trim())} returnKeyType="search" placeholder="Search name or email" placeholderTextColor={colors.subtle} autoCapitalize="none" style={{ flex: 1, paddingVertical: 12, fontFamily: font.medium, fontSize: 15, color: colors.text }} />
        </View>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(u) => u._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16, gap: 10 }}
        onEndReached={() => users.hasNextPage && !users.isFetchingNextPage && users.fetchNextPage()}
        ListEmptyComponent={users.isLoading ? <Skeleton style={{ height: 90 }} /> : <Empty icon="people-outline" title="No users found" />}
        renderItem={({ item: u }) => (
          <Card style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <Text variant="h3" style={{ flex: 1 }} numberOfLines={1}>{u.fullname}</Text>
              <StatusBadge status={u.isDeleted ? 'Deleted' : u.isSuspended ? 'Suspended' : u.role} />
            </View>
            <Text variant="small" color="muted" numberOfLines={1}>{u.email}</Text>
            <Text variant="small" color="muted">Joined {formatDate(u.createdAt)} · {u.ordersCount} orders · {compactMoney(u.totalSpent, cur)} spent</Text>
            {u.role !== 'admin' && !u.isDeleted ? <Button title={u.isSuspended ? 'Restore access' : 'Suspend'} variant={u.isSuspended ? 'secondary' : 'danger'} onPress={() => toggle(u)} style={{ paddingVertical: 10, marginTop: 4 }} /> : null}
          </Card>
        )}
      />
    </View>
  )
}
