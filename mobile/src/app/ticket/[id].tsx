import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { fetchMyTickets, fetchQr } from '@/api/tickets'
import { Empty, Loading } from '@/components/ui'
import { formatDate, formatTime, venueLabel } from '@/lib/format'
import { colors } from '@/lib/theme'

export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const tickets = useQuery({ queryKey: ['my-tickets'], queryFn: fetchMyTickets })
  const qr = useQuery({ queryKey: ['qr', id], queryFn: () => fetchQr(id), staleTime: Infinity })

  const ticket = tickets.data?.find((t) => t._id === id)
  if (tickets.isLoading) return <Loading />
  if (!ticket) return <Empty title="Ticket not found" />

  return (
    <View style={s.wrap}>
      <View style={s.card}>
        <Text style={s.title}>{ticket.event.title}</Text>
        <Text style={s.meta}>{formatDate(ticket.event.startDate)} · {formatTime(ticket.event.startDate)}</Text>
        <Text style={s.meta}>{venueLabel(ticket.event)}</Text>
        <View style={s.qrBox}>
          {qr.data ? (
            <Image source={qr.data.qrCodeDataUrl} style={{ width: 220, height: 220 }} contentFit="contain" />
          ) : qr.isError ? (
            <Text style={{ color: colors.danger }}>Couldn't load QR code</Text>
          ) : (
            <Loading />
          )}
        </View>
        <Text style={s.code}>{ticket.ticketId}</Text>
        <Text style={s.meta}>{ticket.attendeeName} · {ticket.ticketType?.name ?? 'Free'}</Text>
        <Text style={s.hint}>Show this code at the entrance.</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: colors.mint },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', gap: 6 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center' },
  meta: { color: colors.muted, textAlign: 'center' },
  qrBox: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  code: { fontSize: 18, fontWeight: '800', letterSpacing: 1, color: colors.primaryDark },
  hint: { color: colors.muted, fontSize: 12, marginTop: 8 },
})
