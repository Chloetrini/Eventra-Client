import { router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Loading } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/lib/theme'

export default function Profile() {
  const { user, loading, signOut } = useAuth()
  if (loading) return <Loading />

  if (!user) {
    return (
      <View style={s.wrap}>
        <Text style={s.name}>Welcome to Eventra</Text>
        <Text style={s.email}>Log in to buy tickets, save events and view your passes.</Text>
        <Button title="Log in" onPress={() => router.push('/auth/login')} />
        <Button title="Create account" variant="outline" onPress={() => router.push('/auth/register')} />
      </View>
    )
  }

  return (
    <View style={s.wrap}>
      <Text style={s.name}>{user.fullname}</Text>
      <Text style={s.email}>{user.email}</Text>
      <Button title="Log out" variant="outline" onPress={signOut} />
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24, gap: 12, backgroundColor: colors.bg },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  email: { color: colors.muted, marginBottom: 12 },
})
