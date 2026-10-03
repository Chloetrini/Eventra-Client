import { useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native'
import * as authApi from '@/api/auth'
import { Button, Field } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/lib/theme'

export default function Login() {
  const { setUser } = useAuth()
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      const user = await authApi.login(email.trim().toLowerCase(), password)
      setUser(user)
      qc.invalidateQueries()
      router.back()
    } catch (e) {
      const msg = (e as Error).message
      if (msg.toLowerCase().includes('verify your email')) {
        router.replace({ pathname: '/auth/verify', params: { email: email.trim().toLowerCase() } })
      } else {
        Alert.alert('Could not log in', msg)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" />
        <Button title="Log in" onPress={submit} loading={busy} disabled={!email || !password} />
        <Text style={{ color: colors.primary, textAlign: 'center', marginTop: 20, fontWeight: '600' }}
          onPress={() => router.replace('/auth/register')}>
          New here? Create an account
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
