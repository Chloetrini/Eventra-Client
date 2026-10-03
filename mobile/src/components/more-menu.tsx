import { Ionicons } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'
import { Card, DashScroll } from '@/components/dash'
import { DashHeader } from '@/components/dash-header'
import { Text } from '@/components/text'
import { Button } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { browseAsAttendee } from '@/lib/mode'
import { useTheme, type ThemePref } from '@/lib/theme-context'
import type { ReactNode } from 'react'

const OPTIONS: { key: ThemePref; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
]

/** Shared "More" tab for organizer and admin dashboards. */
export function MoreMenu({ roleLabel, children }: { roleLabel: string; children?: ReactNode }) {
  const { colors, pref, setPref } = useTheme()
  const { user, signOut } = useAuth()
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DashHeader title="More" />
      <DashScroll>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="title" color={colors.primaryText}>{user?.fullname.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="h2" numberOfLines={1}>{user?.fullname}</Text>
            <Text color="muted" numberOfLines={1}>{user?.email}</Text>
            <Text variant="caption" color="primary" style={{ marginTop: 4 }}>{roleLabel.toUpperCase()}</Text>
          </View>
        </Card>
        {children}
        <Text variant="label" color="muted" style={{ marginTop: 8 }}>APPEARANCE</Text>
        <View style={{ flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: colors.surfaceAlt, gap: 4 }}>
          {OPTIONS.map((o) => (
            <Pressable key={o.key} onPress={() => setPref(o.key)} style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 10, backgroundColor: pref === o.key ? colors.surface : 'transparent' }}>
              <Ionicons name={o.icon} size={16} color={pref === o.key ? colors.primary : colors.muted} />
              <Text variant="label" color={pref === o.key ? 'text' : 'muted'}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
        <Button title="Browse events as an attendee" variant="secondary" icon="compass-outline" onPress={browseAsAttendee} style={{ marginTop: 8 }} />
        <Button title="Log out" variant="danger" icon="log-out-outline" onPress={signOut} />
      </DashScroll>
    </View>
  )
}
