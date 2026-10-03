import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'
import { colors } from '@/lib/theme'

export function Button({
  title, onPress, loading, disabled, variant = 'primary',
}: {
  title: string; onPress: () => void; loading?: boolean; disabled?: boolean; variant?: 'primary' | 'outline'
}) {
  const off = disabled || loading
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={[s.btn, variant === 'outline' && s.btnOutline, off && { opacity: 0.55 }]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} />
      ) : (
        <Text style={[s.btnText, variant === 'outline' && { color: colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  )
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} autoCapitalize="none" {...props} style={s.input} />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  )
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={{ padding: 32, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{title}</Text>
      {hint ? <Text style={{ color: colors.muted, marginTop: 6, textAlign: 'center' }}>{hint}</Text> : null}
    </View>
  )
}

export const Loading = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color={colors.primary} />
  </View>
)

const s = StyleSheet.create({
  btn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 16, color: colors.text, backgroundColor: '#fff',
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
})
