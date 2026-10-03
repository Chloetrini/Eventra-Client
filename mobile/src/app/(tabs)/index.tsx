import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { fetchCategories, fetchEvents } from '@/api/events'
import { Empty, Loading } from '@/components/ui'
import { EventCard } from '@/components/event-card'
import { colors } from '@/lib/theme'

export default function Discover() {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<string>()

  const categories = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const events = useInfiniteQuery({
    queryKey: ['events', q, category],
    queryFn: ({ pageParam }) => fetchEvents({ q, category, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.hasMore ? all.length + 1 : undefined),
  })

  const items = events.data?.pages.flatMap((p) => p.events) ?? []

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={s.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => setQ(search.trim())}
          returnKeyType="search"
          placeholder="Search events"
          placeholderTextColor={colors.muted}
          style={s.search}
        />
      </View>
      <View style={{ height: 48 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          <Chip label="All" active={!category} onPress={() => setCategory(undefined)} />
          {categories.data?.map((c) => (
            <Chip key={c._id} label={c.name} active={category === c._id} onPress={() => setCategory(c._id)} />
          ))}
        </ScrollView>
      </View>
      {events.isLoading ? (
        <Loading />
      ) : events.isError ? (
        <Empty title="Couldn't load events" hint={events.error.message} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(e) => e._id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={() => events.hasNextPage && !events.isFetchingNextPage && events.fetchNextPage()}
          refreshControl={<RefreshControl refreshing={events.isRefetching} onRefresh={() => events.refetch()} />}
          ListEmptyComponent={<Empty title="No events found" hint="Try a different search or category." />}
        />
      )}
    </View>
  )
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  searchWrap: { padding: 16, paddingBottom: 8 },
  search: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 16, color: colors.text },
  chips: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.mint },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primaryDark, fontWeight: '600' },
})
