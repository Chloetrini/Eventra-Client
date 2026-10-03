import { router } from 'expo-router'
import { View } from 'react-native'
import { Button, Empty } from './ui'

export function SignInPrompt({ text }: { text: string }) {
  return (
    <View style={{ padding: 16 }}>
      <Empty title="You're not logged in" hint={text} />
      <Button title="Log in" onPress={() => router.push('/auth/login')} />
    </View>
  )
}
