import { useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'
import * as authApi from '@/api/auth'
import { AuthShell, Link } from '@/components/auth-shell'
import { Button, Field } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'

export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const { setUser } = useAuth()
  const qc = useQueryClient()
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      // Verifying also starts a session on the backend, so we're logged in after this.
      setUser(await authApi.verifyEmail(email, otp.trim()))
      qc.invalidateQueries()
      router.dismissAll()
    } catch (e) {
      Alert.alert('Verification failed', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    try {
      await authApi.resendOtp(email)
      Alert.alert('Code sent', 'Check your email for a new code.')
    } catch (e) {
      Alert.alert('Could not resend', (e as Error).message)
    }
  }

  return (
    <AuthShell title="Check your email" sub={`We sent a 6-digit code to ${email}.`}>
      <Field label="Verification code" icon="keypad-outline" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="123456" />
      <Button title="Verify" onPress={submit} loading={busy} disabled={otp.length !== 6} style={{ marginTop: 8 }} />
      <Link prefix="Didn't get it?" label="Resend code" onPress={resend} />
    </AuthShell>
  )
}
