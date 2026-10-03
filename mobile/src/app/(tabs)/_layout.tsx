import type { ColorValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { colors } from '@/lib/theme'

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} color={color} size={size} />

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary, headerShadowVisible: false }}>
      <Tabs.Screen name="index" options={{ title: 'Discover', tabBarIcon: icon('compass-outline') }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: icon('heart-outline') }} />
      <Tabs.Screen name="tickets" options={{ title: 'Tickets', tabBarIcon: icon('ticket-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  )
}
