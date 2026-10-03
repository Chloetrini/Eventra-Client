import { router, usePathname } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useAuth } from './auth-context'

// Organizers and admins land on their dashboard after login / on launch.
// "Browse as attendee" sets this flag so we stop redirecting them.
let browsingAsAttendee = false
export const browseAsAttendee = () => { browsingAsAttendee = true; router.replace('/') }
export const openDashboard = (role: string) => { browsingAsAttendee = false; router.replace(role === 'admin' ? '/admin' : '/organizer') }

export function RoleRedirect({ enabled }: { enabled: boolean }) {
  const { user } = useAuth()
  const path = usePathname()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const id = user?._id ?? null
    if (last.current === id) return
    last.current = id
    if (!user) { browsingAsAttendee = false; return }
    if (user.role === 'attendee' || browsingAsAttendee) return
    if (path.startsWith('/auth') || path === '/' || path.startsWith('/profile') || path === '/saved' || path === '/tickets') {
      router.replace(user.role === 'admin' ? '/admin' : '/organizer')
    }
  }, [enabled, user, path])

  return null
}
