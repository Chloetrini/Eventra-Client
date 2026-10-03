import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native'
import { font, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'
import { Text } from './text'

type IconName = keyof typeof Ionicons.glyphMap

export function Button({
  title, onPress, loading, disabled, variant = 'primary', icon, style,
}: {
  title: string; onPress: () => void; loading?: boolean; disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'; icon?: IconName; style?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  const off = disabled || loading
  const bg = { primary: colors.primary, secondary: colors.primarySoft, outline: 'transparent', danger: colors.dangerSoft }[variant]
  const fg = { primary: colors.primaryText, secondary: colors.primary, outline: colors.text, danger: colors.danger }[variant]
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, borderColor: variant === 'outline' ? colors.border : 'transparent' },
        pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
        off && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text variant="h3" color={fg}>{title}</Text>
        </>
      )}
    </Pressable>
  )
}

export function IconButton({ icon, onPress, color, bg, size = 40 }: { icon: IconName; onPress: () => void; color?: string; bg?: string; size?: number }) {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: bg ?? colors.surface },
        pressed && { opacity: 0.8, transform: [{ scale: 0.94 }] },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color ?? colors.text} />
    </Pressable>
  )
}

export function Field({ label, error, icon, secure, ...props }: TextInputProps & { label: string; error?: string; icon?: IconName; secure?: boolean }) {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(!!secure)
  return (
    <View style={{ marginBottom: 16 }}>
      <Text variant="label" color="muted" style={{ marginBottom: 8 }}>{label}</Text>
      <View style={[s.field, { backgroundColor: colors.surface, borderColor: error ? colors.danger : focused ? colors.primary : colors.border }]}>
        {icon ? <Ionicons name={icon} size={18} color={colors.subtle} /> : null}
        <TextInput
          placeholderTextColor={colors.subtle}
          autoCapitalize="none"
          {...props}
          secureTextEntry={secure && hidden}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          style={{ flex: 1, fontFamily: font.medium, fontSize: 16, color: colors.text, paddingVertical: 14 }}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.subtle} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text variant="small" color="danger" style={{ marginTop: 4 }}>{error}</Text> : null}
    </View>
  )
}

export function Chip({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon?: IconName }) {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={14} color={active ? colors.primaryText : colors.muted} /> : null}
      <Text variant="label" color={active ? colors.primaryText : colors.text}>{label}</Text>
    </Pressable>
  )
}

export function Pill({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'accent' | 'danger' | 'muted' }) {
  const { colors } = useTheme()
  const map = {
    primary: [colors.primarySoft, colors.primary],
    accent: [colors.accentSoft, colors.accent],
    danger: [colors.dangerSoft, colors.danger],
    muted: [colors.surfaceAlt, colors.muted],
  }[tone]
  return (
    <View style={{ backgroundColor: map[0], paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
      <Text variant="caption" color={map[1]}>{label.toUpperCase()}</Text>
    </View>
  )
}

export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme()
  const o = useRef(new Animated.Value(0.45)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.45, duration: 800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [o])
  return <Animated.View style={[{ backgroundColor: colors.surfaceAlt, borderRadius: radius.md, opacity: o }, style]} />
}

export function Empty({ icon = 'sparkles-outline', title, hint, action }: { icon?: IconName; title: string; hint?: string; action?: { label: string; onPress: () => void } }) {
  const { colors } = useTheme()
  return (
    <View style={{ padding: 32, alignItems: 'center', gap: 8 }}>
      <View style={[s.emptyIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <Text variant="h2" style={{ marginTop: 8, textAlign: 'center' }}>{title}</Text>
      {hint ? <Text color="muted" style={{ textAlign: 'center', maxWidth: 280 }}>{hint}</Text> : null}
      {action ? <Button title={action.label} onPress={action.onPress} style={{ marginTop: 16, paddingHorizontal: 28 }} /> : null}
    </View>
  )
}

export const Loading = () => {
  const { colors } = useTheme()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  )
}

const s = StyleSheet.create({
  btn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, paddingVertical: 15, paddingHorizontal: 20, borderWidth: 1.5 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
})
