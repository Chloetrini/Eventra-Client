import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { fetchMyTickets, fetchQr } from '@/api/tickets'
import { Text } from '@/components/text'
import { Empty, Loading } from '@/components/ui'
import { formatDate, formatTime, venueLabel } from '@/lib/format'
import { radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, isDark } = useTheme()
  const tickets = useQuery({ queryKey: ['my-tickets'], queryFn: fetchMyTickets })
  const qr = useQuery({ queryKey: ['qr', id], queryFn: () => fetchQr(id), staleTime: Infinity })
  const t = tickets.data?.find((x) => x._id === id)

  if (tickets.isLoading) return <Loading />
  if (!t) return <Empty icon="ticket-outline" title="Ticket not found" />

  const valid = t.status === 'valid'
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20 }}>
      <LinearGradient colors={isDark ? ['#0F6E56', '#0B4A3A'] : ['#0F6E56', '#0A5642']} style={s.top}>
        <Text variant="caption" color="rgba(255,255,255,0.7)">EVENTRA TICKET</Text>
        <Text variant="title" color="#fff" style={{ marginTop: 6 }}>{t.event.title}</Text>
        <View style={s.meta}>
          <Meta icon="calendar" text={`${formatDate(t.event.startDate)} · ${formatTime(t.event.startDate)}`} />
          <Meta icon="location" text={venueLabel(t.event)} />
        </View>
      </LinearGradient>

      <View style={[s.notchRow, { backgroundColor: colors.surface }]}>
        <View style={[s.notch, { left: -12, backgroundColor: colors.bg }]} />
        <View style={[s.dash, { borderColor: colors.border }]} />
        <View style={[s.notch, { right: -12, backgroundColor: colors.bg }]} />
      </View>

      <View style={[s.bottom, { backgroundColor: colors.surface }]}>
        <View style={s.qr}>
          {qr.data ? (
            <Image source={qr.data.qrCodeDataUrl} style={{ width: 210, height: 210 }} contentFit="contain" />
          ) : qr.isError ? (
            <Text color="danger">Couldn't load QR code</Text>
          ) : (
            <Loading />
          )}
        </View>
        <Text variant="h2" color="primary" style={{ letterSpacing: 1.5, marginTop: 16 }}>{t.ticketId}</Text>
        <Text color="muted" style={{ marginTop: 4 }}>{t.attendeeName} · {t.ticketType?.name ?? 'Free'}</Text>
        <View style={[s.status, { backgroundColor: valid ? colors.primarySoft : colors.surfaceAlt }]}>
          <Ionicons name={valid ? 'checkmark-circle' : 'information-circle'} size={16} color={valid ? colors.primary : colors.muted} />
          <Text variant="label" color={valid ? 'primary' : 'muted'}>{valid ? 'Valid · show this at the entrance' : t.status === 'checked_in' ? 'Already checked in' : t.status}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

function Meta({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name={icon} size={15} color="rgba(255,255,255,0.8)" />
      <Text variant="small" color="rgba(255,255,255,0.9)" style={{ flex: 1 }}>{text}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  top: { padding: 22, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  meta: { gap: 8, marginTop: 16 },
  notchRow: { height: 24, justifyContent: 'center' },
  notch: { position: 'absolute', width: 24, height: 24, borderRadius: 12, top: 0 },
  dash: { marginHorizontal: 20, borderTopWidth: 2, borderStyle: 'dashed' },
  bottom: { alignItems: 'center', padding: 24, paddingTop: 12, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  qr: { width: 238, height: 238, borderRadius: radius.lg, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill },
})
