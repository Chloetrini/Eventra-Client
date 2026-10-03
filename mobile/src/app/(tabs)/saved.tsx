import { router } from 'expo-router'
import { FlatList, RefreshControl, View } from 'react-native'
import { EventCard } from '@/components/event-card'
import { ScreenHeader } from '@/components/screen-header'
import { SignInPrompt } from '@/components/sign-in-prompt'
import { Empty, Skeleton } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { useSaved } from '@/lib/saved'
import { useTheme } from '@/lib/theme-context'

export default function Saved() {
  const { colors } = useTheme()
  const { user, loading } = useAuth()
  const saved = useSaved()
  const items = (saved.events ?? []).filter((e) => e.slug)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Saved" sub="Events you're keeping an eye on" />
      {!loading && !user ? (
        <SignInPrompt text="Log in to see events you've saved." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(e) => e._id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          ListEmptyComponent={
            saved.isLoading ? <Skeleton style={{ height: 240 }} /> : (
              <Empty icon="heart-outline" title="Nothing saved yet" hint="Tap the heart on any event to save it here." action={{ label: 'Browse events', onPress: () => router.push('/') }} />
            )
          }
        />
      )}
    </View>
  )
}
