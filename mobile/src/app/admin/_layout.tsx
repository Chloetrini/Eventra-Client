import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { Redirect, Tabs } from 'expo-router'
import { Platform, type ColorValue } from 'react-native'
import { fetchNavCounts } from '@/api/admin'
import { useAuth } from '@/lib/auth-context'
import { font } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

type Name = keyof typeof Ionicons.glyphMap
const icon = (on: Name, off: Name) =>
  ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => <Ionicons name={focused ? on : off} color={color} size={size + 1} />

export default function AdminLayout() {
  const { colors } = useTheme()
  const { user, loading } = useAuth()
  const counts = useQuery({ queryKey: ['admin-nav-counts'], queryFn: fetchNavCounts, enabled: user?.role === 'admin', refetchInterval: 60_000 })
  if (!loading && user?.role !== 'admin') return <Redirect href="/" />
  const badge = (n?: number) => (n ? { tabBarBadge: n > 99 ? '99+' : n, tabBarBadgeStyle: { backgroundColor: colors.danger, color: '#fff', fontFamily: font.bold } } : {})
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
      <Tabs.Screen name="approvals" options={{ title: 'Approvals', tabBarIcon: icon('shield-checkmark', 'shield-checkmark-outline'), ...badge(counts.data?.pendingApprovals) }} />
      <Tabs.Screen name="refunds" options={{ title: 'Refunds', tabBarIcon: icon('return-down-back', 'return-down-back-outline'), ...badge(counts.data?.pendingRefunds) }} />
      <Tabs.Screen name="payouts" options={{ title: 'Payouts', tabBarIcon: icon('wallet', 'wallet-outline') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon('ellipsis-horizontal-circle', 'ellipsis-horizontal-circle-outline') }} />
    </Tabs>
  )
}
