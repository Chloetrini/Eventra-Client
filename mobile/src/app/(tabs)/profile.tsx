import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { ScreenHeader } from '@/components/screen-header'
import { Text } from '@/components/text'
import { Button } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { openDashboard } from '@/lib/mode'
import { cardShadow, radius } from '@/lib/theme'
import { useTheme, type ThemePref } from '@/lib/theme-context'

const OPTIONS: { key: ThemePref; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
]

export default function Profile() {
  const { colors, mode, pref, setPref } = useTheme()
  const { user, signOut } = useAuth()

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Profile" />
      <View style={{ paddingHorizontal: 20, gap: 20 }}>
        {user ? (
          <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(mode)]}>
            <View style={[s.avatar, { backgroundColor: colors.primary }]}>
              <Text variant="title" color={colors.primaryText}>{user.fullname.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="h2" numberOfLines={1}>{user.fullname}</Text>
              <Text color="muted" numberOfLines={1}>{user.email}</Text>
            </View>
          </View>
        ) : (
          <View style={[s.card, { flexDirection: 'column', alignItems: 'stretch', gap: 12, backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(mode)]}>
            <Text variant="h2">Join Eventra</Text>
            <Text color="muted">Log in to buy tickets, save events and keep your passes handy.</Text>
            <Button title="Log in" onPress={() => router.push('/auth/login')} />
            <Button title="Create account" variant="secondary" onPress={() => router.push('/auth/register')} />
          </View>
        )}

        {user && user.role !== 'attendee' ? (
          <Button title={user.role === 'admin' ? 'Open admin console' : 'Open organizer dashboard'} icon="grid-outline" onPress={() => openDashboard(user.role)} />
        ) : null}

        <View>
          <Text variant="label" color="muted" style={{ marginBottom: 10 }}>APPEARANCE</Text>
          <View style={[s.seg, { backgroundColor: colors.surfaceAlt }]}>
            {OPTIONS.map((o) => {
              const on = pref === o.key
              return (
                <Pressable key={o.key} onPress={() => setPref(o.key)} style={[s.segItem, on && { backgroundColor: colors.surface }, on && cardShadow(mode)]}>
                  <Ionicons name={o.icon} size={16} color={on ? colors.primary : colors.muted} />
                  <Text variant="label" color={on ? 'text' : 'muted'}>{o.label}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {user ? (
          <Button title="Log out" variant="danger" icon="log-out-outline" onPress={signOut} />
        ) : null}

        <Text variant="small" color="subtle" style={{ textAlign: 'center' }}>
          Eventra v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', padding: 4, borderRadius: radius.md, gap: 4 },
  segItem: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: radius.md - 4 },
})
