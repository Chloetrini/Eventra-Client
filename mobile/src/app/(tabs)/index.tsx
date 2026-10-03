import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchCategories, fetchEvents, fetchFeaturedEvents } from '@/api/events'
import { CardSkeleton, EventCard, FeaturedCard } from '@/components/event-card'
import { Text } from '@/components/text'
import { Chip, Empty, Skeleton } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { font, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

export default function Discover() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<string>()
  const [free, setFree] = useState(false)
  const browsing = !q && !category && !free

  const categories = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const featured = useQuery({ queryKey: ['featured'], queryFn: () => fetchFeaturedEvents(), enabled: browsing })
  const events = useInfiniteQuery({
    queryKey: ['events', q, category, free],
    queryFn: ({ pageParam }) => fetchEvents({ q, category, type: free ? 'free' : undefined, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.hasMore ? all.length + 1 : undefined),
  })
  const items = events.data?.pages.flatMap((p) => p.events) ?? []
  const firstName = user?.fullname?.split(' ')[0]

  const header = (
    <View>
      <View style={[s.top, { paddingTop: insets.top + 10 }]}>
        <View style={{ flex: 1 }}>
          <Text variant="small" color="muted">{firstName ? `Hi ${firstName} 👋` : 'Welcome to Eventra'}</Text>
          <Text variant="title">Find your next event</Text>
        </View>
        <Pressable onPress={() => router.push('/profile')} style={[s.avatar, { backgroundColor: colors.primarySoft }]}>
          {user ? (
            <Text variant="h3" color="primary">{user.fullname.slice(0, 1).toUpperCase()}</Text>
          ) : (
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          )}
        </Pressable>
      </View>

      <View style={[s.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={19} color={colors.subtle} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => setQ(search.trim())}
          returnKeyType="search"
          placeholder="Search events, artists, venues"
          placeholderTextColor={colors.subtle}
          style={{ flex: 1, fontFamily: font.medium, fontSize: 15, color: colors.text, paddingVertical: 13 }}
        />
        {search ? (
          <Pressable onPress={() => { setSearch(''); setQ('') }} hitSlop={10}>
            <Ionicons name="close-circle" size={19} color={colors.subtle} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        <Chip label="All" active={!category && !free} onPress={() => { setCategory(undefined); setFree(false) }} />
        <Chip label="Free" icon="gift-outline" active={free} onPress={() => setFree((f) => !f)} />
        {categories.data?.map((c) => (
          <Chip key={c._id} label={c.name} active={category === c._id} onPress={() => setCategory(category === c._id ? undefined : c._id)} />
        ))}
      </ScrollView>

      {browsing && (featured.isLoading || (featured.data?.length ?? 0) > 0) ? (
        <View style={{ marginTop: 8 }}>
          <Text variant="h2" style={s.section}>Featured</Text>
          {featured.isLoading ? (
            <Skeleton style={{ height: 350, width: 270, marginLeft: 20, borderRadius: radius.xl }} />
          ) : (
            <FlatList
              horizontal
              data={featured.data}
              keyExtractor={(e) => e._id}
              renderItem={({ item }) => <FeaturedCard event={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              snapToInterval={284}
              decelerationRate="fast"
            />
          )}
        </View>
      ) : null}

      <Text variant="h2" style={[s.section, { marginTop: 22 }]}>
        {q ? `Results for “${q}”` : 'Upcoming events'}
      </Text>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={items}
        keyExtractor={(e) => e._id}
        renderItem={({ item }) => <View style={{ paddingHorizontal: 20 }}><EventCard event={item} /></View>}
        ListHeaderComponent={header}
        ListEmptyComponent={
          events.isLoading ? (
            <View style={{ paddingHorizontal: 20 }}><CardSkeleton /><CardSkeleton /></View>
          ) : events.isError ? (
            <Empty icon="cloud-offline-outline" title="Couldn't load events" hint={events.error.message} action={{ label: 'Try again', onPress: () => events.refetch() }} />
          ) : (
            <Empty icon="calendar-outline" title="No events found" hint="Try a different search or category." />
          )
        }
        ListFooterComponent={events.isFetchingNextPage ? <View style={{ paddingHorizontal: 20 }}><CardSkeleton /></View> : <View style={{ height: 24 }} />}
        onEndReached={() => events.hasNextPage && !events.isFetchingNextPage && events.fetchNextPage()}
        onEndReachedThreshold={0.6}
        refreshControl={<RefreshControl refreshing={events.isRefetching} onRefresh={() => { events.refetch(); featured.refetch() }} tintColor={colors.primary} />}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  )
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5 },
  chips: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  section: { paddingHorizontal: 20, marginBottom: 12 },
})
