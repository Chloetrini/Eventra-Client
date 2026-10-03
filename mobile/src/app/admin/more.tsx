import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { MoreMenu } from '@/components/more-menu'
import { Card } from '@/components/dash'
import { Text } from '@/components/text'
import { View } from 'react-native'
import { useTheme } from '@/lib/theme-context'

export default function AdminMore() {
  const { colors } = useTheme()
  return (
    <MoreMenu roleLabel="Admin">
      <Card onPress={() => router.push('/admin-users')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="people" size={22} color={colors.primary} /></View>
        <View style={{ flex: 1 }}><Text variant="h3">Users</Text><Text variant="small" color="muted">Search, suspend and restore accounts</Text></View>
        <Ionicons name="chevron-forward" size={18} color={colors.subtle} />
      </Card>
    </MoreMenu>
  )
}
