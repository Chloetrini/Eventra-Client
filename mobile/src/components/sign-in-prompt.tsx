import { router } from 'expo-router'
import { Empty } from './ui'

export function SignInPrompt({ text }: { text: string }) {
  return (
    <Empty
      icon="lock-closed-outline"
      title="You're not logged in"
      hint={text}
      action={{ label: 'Log in', onPress: () => router.push('/auth/login') }}
    />
  )
}
