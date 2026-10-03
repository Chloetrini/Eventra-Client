import { useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'
import * as authApi from '@/api/auth'
import { AuthShell, Link } from '@/components/auth-shell'
import { Button, Field } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'

export default function Login() {
  const { setUser } = useAuth()
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      setUser(await authApi.login(email.trim().toLowerCase(), password))
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
    <AuthShell title="Welcome back" sub="Log in to your Eventra account.">
      <Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" placeholder="you@example.com" />
      <Field label="Password" icon="lock-closed-outline" secure value={password} onChangeText={setPassword} autoComplete="password" placeholder="Your password" />
      <Button title="Log in" onPress={submit} loading={busy} disabled={!email || !password} style={{ marginTop: 8 }} />
      <Link prefix="New to Eventra?" label="Create an account" onPress={() => router.replace('/auth/register')} />
    </AuthShell>
  )
}
