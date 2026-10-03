import { router } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'
import * as authApi from '@/api/auth'
import { AuthShell, Link } from '@/components/auth-shell'
import { Button, Field } from '@/components/ui'

export default function Register() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      const cleanEmail = email.trim().toLowerCase()
      await authApi.register({ fullname: fullname.trim(), email: cleanEmail, password, phone: phone.trim() || undefined })
      router.replace({ pathname: '/auth/verify', params: { email: cleanEmail } })
    } catch (e) {
      Alert.alert('Could not create account', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Create account" sub="Join Eventra to find events and get tickets.">
      <Field label="Full name" icon="person-outline" value={fullname} onChangeText={setFullname} autoCapitalize="words" placeholder="Ada Okafor" />
      <Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" placeholder="you@example.com" />
      <Field label="Phone (optional)" icon="call-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="0801 234 5678" />
      <Field label="Password" icon="lock-closed-outline" secure value={password} onChangeText={setPassword} placeholder="At least 8 characters" error={password && password.length < 8 ? 'Use at least 8 characters' : undefined} />
      <Button title="Create account" onPress={submit} loading={busy} disabled={!fullname || !email || password.length < 8} style={{ marginTop: 8 }} />
      <Link prefix="Already have an account?" label="Log in" onPress={() => router.replace('/auth/login')} />
    </AuthShell>
  )
}
