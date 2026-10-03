import { useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import { useAuth } from '@/lib/auth-context'
import { googleEnabled, signInWithGoogle } from '@/lib/google'
import { Text } from './text'
import { Button } from './ui'

/** "Continue with Google" with an "or" divider. Renders nothing if Google sign-in isn't set up. */
export function GoogleButton({ label = 'Continue with Google' }: { label?: string }) {
  const { setUser } = useAuth()
  const qc = useQueryClient()
  const [busy, setBusy] = useState(false)
  if (!googleEnabled) return null

  async function go() {
    setBusy(true)
    try {
      const user = await signInWithGoogle()
      if (!user) return
      setUser(user)
      qc.invalidateQueries()
      router.dismissAll()
    } catch (e) {
      Alert.alert('Could not sign in with Google', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#8884' }} />
        <Text variant="small" color="muted">or</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#8884' }} />
      </View>
      <Button title={label} variant="outline" icon="logo-google" onPress={go} loading={busy} />
    </View>
  )
}
