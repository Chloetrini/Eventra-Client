import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Platform, type ColorValue } from 'react-native'
import { font } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

type Name = keyof typeof Ionicons.glyphMap
const icon = (on: Name, off: Name) =>
  ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <Ionicons name={focused ? on : off} color={color} size={size + 1} />
  )

export default function TabsLayout() {
  const { colors } = useTheme()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtle,
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Discover', tabBarIcon: icon('compass', 'compass-outline') }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: icon('heart', 'heart-outline') }} />
      <Tabs.Screen name="tickets" options={{ title: 'Tickets', tabBarIcon: icon('ticket', 'ticket-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person', 'person-outline') }} />
    </Tabs>
  )
}
