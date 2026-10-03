import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from './text'

export function ScreenHeader({ title, sub }: { title: string; sub?: string }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: 14 }}>
      <Text variant="display">{title}</Text>
      {sub ? <Text color="muted" style={{ marginTop: 2 }}>{sub}</Text> : null}
    </View>
  )
}
