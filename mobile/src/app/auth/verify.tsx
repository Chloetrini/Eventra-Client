import { useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, Text } from 'react-native'
import * as authApi from '@/api/auth'
import { Button, Field } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/lib/theme'

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
    <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: colors.muted, marginBottom: 16 }}>Enter the 6-digit code we sent to {email}.</Text>
      <Field label="Verification code" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} />
      <Button title="Verify" onPress={submit} loading={busy} disabled={otp.length !== 6} />
      <Text style={{ color: colors.primary, textAlign: 'center', marginTop: 20, fontWeight: '600' }} onPress={resend}>
        Resend code
      </Text>
    </ScrollView>
  )
}
