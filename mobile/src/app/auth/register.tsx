import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import * as authApi from '@/api/auth'
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Field label="Full name" value={fullname} onChangeText={setFullname} autoCapitalize="words" />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
        <Field label="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Create account" onPress={submit} loading={busy} disabled={!fullname || !email || password.length < 8} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
