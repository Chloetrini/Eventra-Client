import { Ionicons } from '@expo/vector-icons'
import { useState, type ReactNode } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cardShadow, font, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'
import { Text } from './text'
import { Button } from './ui'

type IconName = keyof typeof Ionicons.glyphMap

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { colors, mode } = useTheme()
  const base = [s.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(mode), style]
  if (!onPress) return <View style={base}>{children}</View>
  return <Pressable onPress={onPress} style={({ pressed }) => [...base, pressed && { opacity: 0.9 }]}>{children}</Pressable>
}

export function StatCard({ icon, label, value, sub, tone = 'primary', style }: { icon: IconName; label: string; value: string; sub?: string; tone?: 'primary' | 'accent' | 'danger'; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme()
  const c = { primary: [colors.primarySoft, colors.primary], accent: [colors.accentSoft, colors.accent], danger: [colors.dangerSoft, colors.danger] }[tone]
  return (
    <Card style={[{ flex: 1, minWidth: '46%', gap: 4 }, style]}>
      <View style={[s.statIcon, { backgroundColor: c[0] }]}><Ionicons name={icon} size={18} color={c[1]} /></View>
      <Text variant="small" color="muted" style={{ marginTop: 6 }}>{label}</Text>
      <Text variant="title" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      {sub ? <Text variant="small" color="subtle">{sub}</Text> : null}
    </Card>
  )
}

export const Section = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
  <View style={s.section}>
    <Text variant="h2">{title}</Text>
    {action ? <Text variant="label" color="primary" onPress={onAction}>{action}</Text> : null}
  </View>
)

const TONES: Record<string, 'primary' | 'accent' | 'danger' | 'muted'> = {
  live: 'primary', approved: 'primary', paid: 'primary', ready: 'primary', verified: 'primary', valid: 'primary',
  pending: 'accent', draft: 'muted', held: 'accent', processing: 'accent', postponed: 'accent', 'sold out': 'accent',
  rejected: 'danger', cancelled: 'danger', suspended: 'danger', refunded: 'danger',
  past: 'muted', checked_in: 'muted',
}
export function StatusBadge({ status }: { status: string }) {
  const { colors } = useTheme()
  const tone = TONES[status.toLowerCase()] ?? 'muted'
  const [bg, fg] = { primary: [colors.primarySoft, colors.primary], accent: [colors.accentSoft, colors.accent], danger: [colors.dangerSoft, colors.danger], muted: [colors.surfaceAlt, colors.muted] }[tone]
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
      <Text variant="caption" color={fg}>{status.replace('_', ' ').toUpperCase()}</Text>
    </View>
  )
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { key: T; label: string }[] }) {
  const { colors, mode } = useTheme()
  return (
    <View style={[s.seg, { backgroundColor: colors.surfaceAlt }]}>
      {options.map((o) => (
        <Pressable key={o.key} onPress={() => onChange(o.key)} style={[s.segItem, value === o.key && { backgroundColor: colors.surface }, value === o.key && cardShadow(mode)]}>
          <Text variant="label" color={value === o.key ? 'text' : 'muted'}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

export function Bars({ data, format }: { data: { label: string; amount: number }[]; format: (n: number) => string }) {
  const { colors } = useTheme()
  const max = Math.max(1, ...data.map((d) => d.amount))
  if (!data.length) return <Text color="muted">No sales in this period yet.</Text>
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4 }}>
        {data.map((d) => (
          <View key={d.label} style={{ flex: 1, height: `${Math.max(4, (d.amount / max) * 100)}%`, backgroundColor: d.amount ? colors.primary : colors.surfaceAlt, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text variant="caption" color="subtle">{data[0].label.slice(-5)}</Text>
        <Text variant="caption" color="muted">Peak {format(max)}</Text>
        <Text variant="caption" color="subtle">{data[data.length - 1].label.slice(-5)}</Text>
      </View>
    </View>
  )
}

/** Asks for a reason (rejecting an event, refund, organizer…). */
export function ReasonModal({ visible, title, hint, required, confirmLabel, onClose, onConfirm }: { visible: boolean; title: string; hint: string; required?: boolean; confirmLabel: string; onClose: () => void; onConfirm: (reason: string) => Promise<void> | void }) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    setBusy(true)
    try { await onConfirm(reason.trim()); setReason('') } finally { setBusy(false) }
  }
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <View style={[s.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 }]}>
          <Text variant="h2">{title}</Text>
          <Text color="muted" style={{ marginTop: 4, marginBottom: 14 }}>{hint}</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Write a short reason…"
            placeholderTextColor={colors.subtle}
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: 12, fontFamily: font.regular, fontSize: 15, color: colors.text }}
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Button title="Cancel" variant="outline" onPress={onClose} style={{ flex: 1 }} />
            <Button title={confirmLabel} variant="danger" onPress={submit} loading={busy} disabled={required && reason.trim().length < 3} style={{ flex: 1 }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export function DashScroll({ children, refreshControl }: { children: ReactNode; refreshControl?: React.ReactElement<any> }) {
  const { colors } = useTheme()
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 14 }} refreshControl={refreshControl as any} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  card: { padding: 16, borderRadius: radius.lg, borderWidth: 1 },
  statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  seg: { flexDirection: 'row', padding: 4, borderRadius: radius.md, gap: 4 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.md - 4 },
  sheet: { padding: 20, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
})
