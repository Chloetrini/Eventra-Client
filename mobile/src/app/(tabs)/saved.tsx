import { useQuery } from '@tanstack/react-query'
import { FlatList } from 'react-native'
import { fetchSavedEvents } from '@/api/tickets'
import { EventCard } from '@/components/event-card'
import { SignInPrompt } from '@/components/sign-in-prompt'
import { Empty, Loading } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'

export default function Saved() {
  const { user, loading } = useAuth()
  const q = useQuery({ queryKey: ['saved'], queryFn: fetchSavedEvents, enabled: !!user })

  if (loading || (user && q.isLoading)) return <Loading />
  if (!user) return <SignInPrompt text="Log in to see events you've saved." />
  return (
    <FlatList
      data={q.data ?? []}
      keyExtractor={(e) => e._id}
      renderItem={({ item }) => <EventCard event={item} />}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Empty title="Nothing saved yet" hint="Tap the heart on an event to save it." />}
    />
  )
}
