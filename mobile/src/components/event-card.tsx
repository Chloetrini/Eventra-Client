import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { EventSummary } from '@/api/types'
import { formatDate, priceLabel, venueLabel } from '@/lib/format'
import { colors } from '@/lib/theme'

export function EventCard({ event }: { event: EventSummary }) {
  return (
    <Link href={{ pathname: '/event/[slug]', params: { slug: event.slug } }} asChild>
      <Pressable style={s.card}>
        <Image source={event.coverImage} style={s.img} contentFit="cover" transition={150} />
        <View style={s.body}>
          <Text style={s.date}>{formatDate(event.startDate)}</Text>
          <Text style={s.title} numberOfLines={2}>{event.title}</Text>
          <Text style={s.meta} numberOfLines={1}>{venueLabel(event)}</Text>
          <Text style={s.price}>{priceLabel(event)}</Text>
        </View>
      </Pressable>
    </Link>
  )
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  img: { height: 160, backgroundColor: colors.mint },
  body: { padding: 14, gap: 4 },
  date: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  title: { color: colors.text, fontWeight: '700', fontSize: 17 },
  meta: { color: colors.muted, fontSize: 13 },
  price: { color: colors.primary, fontWeight: '700', marginTop: 4 },
})
