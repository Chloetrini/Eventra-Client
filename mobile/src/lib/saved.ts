import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { fetchSavedEvents, saveEvent, unsaveEvent } from '@/api/tickets'
import type { EventSummary } from '@/api/types'
import { useAuth } from './auth-context'

/** Saved-events state with an optimistic heart toggle. Sends guests to login. */
export function useSaved() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const key = ['saved']
  const q = useQuery({ queryKey: key, queryFn: fetchSavedEvents, enabled: !!user })

  const m = useMutation({
    mutationFn: ({ id, saved }: { id: string; saved: boolean }) => (saved ? unsaveEvent(id) : saveEvent(id)),
    onMutate: async ({ id, saved }) => {
      await qc.cancelQueries({ queryKey: key })
      const prev = qc.getQueryData<EventSummary[]>(key)
      qc.setQueryData<EventSummary[]>(key, (old = []) =>
        saved ? old.filter((e) => e._id !== id) : [...old, { _id: id } as EventSummary],
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => qc.setQueryData(key, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  })

  const ids = new Set((q.data ?? []).map((e) => e._id))
  return {
    events: q.data,
    isLoading: q.isLoading,
    isSaved: (id: string) => ids.has(id),
    toggle: (id: string) => {
      if (!user) return router.push('/auth/login')
      m.mutate({ id, saved: ids.has(id) })
    },
  }
}
