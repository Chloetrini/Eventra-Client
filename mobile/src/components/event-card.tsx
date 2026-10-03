import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import type { EventSummary } from '@/api/types'
import { formatDate, priceLabel, venueLabel } from '@/lib/format'
import { useSaved } from '@/lib/saved'
import { cardShadow, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'
import { Text } from './text'
import { Skeleton } from './ui'

const open = (slug: string) => router.push({ pathname: '/event/[slug]', params: { slug } })

export function DateBadge({ iso }: { iso: string }) {
  const { colors } = useTheme()
  const d = new Date(iso)
  return (
    <View style={[s.badge, { backgroundColor: colors.surface }]}>
      <Text variant="caption" color="primary">{d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</Text>
      <Text variant="h2" style={{ lineHeight: 22 }}>{d.getDate()}</Text>
    </View>
  )
}

function Heart({ id, light }: { id: string; light?: boolean }) {
  const { colors } = useTheme()
  const { isSaved, toggle } = useSaved()
  const on = isSaved(id)
  return (
    <Pressable
      onPress={() => toggle(id)}
      hitSlop={8}
      style={[s.heart, { backgroundColor: light ? 'rgba(0,0,0,0.35)' : colors.surface }]}
    >
      <Ionicons name={on ? 'heart' : 'heart-outline'} size={19} color={on ? '#F43F5E' : light ? '#fff' : colors.text} />
    </Pressable>
  )
}

/** Wide card for the main list. */
export function EventCard({ event }: { event: EventSummary }) {
  const { colors, mode } = useTheme()
  return (
    <Pressable
      onPress={() => open(event.slug)}
      style={({ pressed }) => [s.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(mode), pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
    >
      <View>
        <Image source={event.coverImage} style={s.cardImg} contentFit="cover" transition={200} />
        <View style={s.topLeft}><DateBadge iso={event.startDate} /></View>
        <View style={s.topRight}><Heart id={event._id} light /></View>
      </View>
      <View style={s.cardBody}>
        <Text variant="h2" numberOfLines={2}>{event.title}</Text>
        <View style={s.row}>
          <Ionicons name="location-outline" size={15} color={colors.muted} />
          <Text variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>{venueLabel(event)}</Text>
        </View>
        <View style={[s.row, { justifyContent: 'space-between', marginTop: 4 }]}>
          <Text variant="small" color="muted">{formatDate(event.startDate)}</Text>
          <View style={[s.price, { backgroundColor: event.type === 'free' ? colors.primarySoft : colors.accentSoft }]}>
            <Text variant="label" color={event.type === 'free' ? 'primary' : 'accent'}>{priceLabel(event)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

/** Tall poster card for the featured carousel. */
export function FeaturedCard({ event }: { event: EventSummary }) {
  return (
    <Pressable onPress={() => open(event.slug)} style={({ pressed }) => [s.feat, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}>
      <Image source={event.coverImage} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
      <View style={s.topLeft}><DateBadge iso={event.startDate} /></View>
      <View style={s.topRight}><Heart id={event._id} light /></View>
      <View style={s.featBody}>
        <Text variant="title" color="#fff" numberOfLines={2}>{event.title}</Text>
        <View style={s.row}>
          <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
          <Text variant="small" color="rgba(255,255,255,0.85)" numberOfLines={1} style={{ flex: 1 }}>{venueLabel(event)}</Text>
        </View>
        <Text variant="label" color="#FCD34D">{priceLabel(event)}</Text>
      </View>
    </Pressable>
  )
}

export const CardSkeleton = () => (
  <View style={{ marginBottom: 18 }}>
    <Skeleton style={{ height: 190, borderRadius: radius.lg }} />
    <Skeleton style={{ height: 18, width: '70%', marginTop: 12 }} />
    <Skeleton style={{ height: 14, width: '45%', marginTop: 8 }} />
  </View>
)

const s = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: 18 },
  cardImg: { height: 190, width: '100%' },
  cardBody: { padding: 14, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  price: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill },
  topLeft: { position: 'absolute', top: 12, left: 12 },
  topRight: { position: 'absolute', top: 12, right: 12 },
  badge: { width: 48, paddingVertical: 6, borderRadius: 12, alignItems: 'center' },
  heart: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  feat: { width: 270, height: 350, borderRadius: radius.xl, overflow: 'hidden', marginRight: 14, backgroundColor: '#14532D' },
  featBody: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 6 },
})
