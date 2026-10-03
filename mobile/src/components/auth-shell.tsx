import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme-context'
import { Text } from './text'
import { IconButton } from './ui'

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const mark = isDark ? require('../../assets/splash-icon-dark.png') : require('../../assets/splash-icon.png')
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: Math.max(insets.top, 16) + 8 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image source={mark} style={{ width: 44, height: 44, marginLeft: -6 }} contentFit="contain" />
            <Text variant="h2" color="primary" style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 20 }}>Eventra</Text>
          </View>
          <IconButton icon="close" onPress={() => router.back()} bg={colors.surfaceAlt} />
        </View>
        <Text variant="display" style={{ marginTop: 28 }}>{title}</Text>
        <Text color="muted" style={{ marginTop: 6, marginBottom: 28 }}>{sub}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export const Link = ({ prefix, label, onPress }: { prefix: string; label: string; onPress: () => void }) => (
  <Text color="muted" style={{ textAlign: 'center', marginTop: 22 }}>
    {prefix} <Text variant="label" color="primary" onPress={onPress}>{label}</Text>
  </Text>
)
