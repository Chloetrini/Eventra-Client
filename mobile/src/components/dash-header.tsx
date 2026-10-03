import type { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from './text'

export function DashHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        {sub ? <Text variant="small" color="muted">{sub}</Text> : null}
        <Text variant="title">{title}</Text>
      </View>
      {right}
    </View>
  )
}
