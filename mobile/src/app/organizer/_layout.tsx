import { Ionicons } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'
import { Platform, type ColorValue } from 'react-native'
import { useAuth } from '@/lib/auth-context'
import { font } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

type Name = keyof typeof Ionicons.glyphMap
const icon = (on: Name, off: Name) =>
  ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => <Ionicons name={focused ? on : off} color={color} size={size + 1} />

export default function OrganizerLayout() {
  const { colors } = useTheme()
  const { user, loading } = useAuth()
  if (!loading && user?.role !== 'organizer') return <Redirect href="/" />
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtle,
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: Platform.OS === 'ios' ? 88 : 66, paddingTop: 6 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Overview', tabBarIcon: icon('grid', 'grid-outline') }} />
      <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: icon('calendar', 'calendar-outline') }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-in', tabBarIcon: icon('scan-circle', 'scan-circle-outline') }} />
      <Tabs.Screen name="payouts" options={{ title: 'Payouts', tabBarIcon: icon('wallet', 'wallet-outline') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon('ellipsis-horizontal-circle', 'ellipsis-horizontal-circle-outline') }} />
    </Tabs>
  )
}
