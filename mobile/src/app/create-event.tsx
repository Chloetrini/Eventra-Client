import { Ionicons } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchCategories } from '@/api/events'
import { createEventDraft, createTicketType, submitEvent, uploadCover } from '@/api/organizer'
import { Card } from '@/components/dash'
import { DateTimeField } from '@/components/datetime-field'
import { Text } from '@/components/text'
import { Button, Chip, Field, IconButton } from '@/components/ui'
import { formatDate, formatTime, money } from '@/lib/format'
import { radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

type Tier = { name: string; price: string; quantity: string }
const STEPS = ['Type', 'Basics', 'When & where', 'Tickets', 'Cover & policy', 'Review']

export default function CreateEvent() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const qc = useQueryClient()
  const cats = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [type, setType] = useState<'free' | 'paid'>('paid')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>()
  const [online, setOnline] = useState(false)
  const [link, setLink] = useState('')
  const [venue, setVenue] = useState({ name: '', address: '', city: '', state: '' })
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  const [tiers, setTiers] = useState<Tier[]>([{ name: 'Regular', price: '', quantity: '' }])
  const [capacity, setCapacity] = useState('')
  const [cover, setCover] = useState<{ uri: string; mime: string }>()
  const [refund, setRefund] = useState<'no-refunds' | 'refund-until-days-before'>('no-refunds')
  const [days, setDays] = useState('3')

  const validTiers = tiers.filter((t) => t.name.trim() && t.price !== '' && Number(t.quantity) > 0 && Number(t.price) >= 0)
  const problem = [
    null,
    title.trim().length < 3 ? 'Give your event a title (at least 3 characters).' : description.trim().length < 10 ? 'Add a description (at least 10 characters).' : !category ? 'Choose a category.' : null,
    !start ? 'Choose when the event starts.' : end && end <= start ? 'The end must be after the start.' : online ? (link.trim().startsWith('http') ? null : 'Add the link people will use to join (starting with https://).') : !venue.name.trim() || !venue.address.trim() || !venue.city.trim() ? 'Add the venue name, address and city.' : null,
    type === 'paid' ? (validTiers.length ? null : 'Add at least one ticket type with a name, price and quantity.') : Number(capacity) > 0 ? null : 'How many people can attend? Enter a capacity.',
    null, null,
  ][step]

  async function pickCover() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.8 })
    if (!res.canceled) setCover({ uri: res.assets[0].uri, mime: res.assets[0].mimeType ?? 'image/jpeg' })
  }

  async function finish(submit: boolean) {
    setBusy(true)
    let id: string | undefined
    try {
      const coverImage = cover ? await uploadCover(cover.uri, cover.mime) : undefined
      const draft = await createEventDraft({
        type, title: title.trim(), description: description.trim(), category, coverImage,
        ...(online ? { isOnline: true, onlineJoinLink: link.trim() } : { isOnline: false, venue: { name: venue.name.trim(), address: venue.address.trim(), city: venue.city.trim(), ...(venue.state.trim() ? { state: venue.state.trim() } : {}) } }),
        startDate: start!.toISOString(), ...(end ? { endDate: end.toISOString() } : {}),
        ...(type === 'free' ? { capacity: Number(capacity) } : {}),
        refundPolicy: type === 'paid' ? (refund === 'no-refunds' ? { type: 'no-refunds' } : { type: 'refund-until-days-before', daysBefore: Number(days) || 0 }) : undefined,
      })
      id = draft._id
      if (type === 'paid') {
        for (const t of validTiers) await createTicketType(id, { name: t.name.trim(), price: Number(t.price), quantity: Number(t.quantity), currency: 'Naira' })
      }
      if (submit) await submitEvent(id)
      qc.invalidateQueries({ queryKey: ['org-events'] })
      qc.invalidateQueries({ queryKey: ['org-overview'] })
      router.dismissAll()
      router.push({ pathname: '/manage/[id]', params: { id } })
      Alert.alert(submit ? 'Submitted for review' : 'Draft saved', submit ? 'We will let you know once it is approved.' : 'You can submit it for approval any time.')
    } catch (e) {
      const msg = (e as Error).message
      if (id) {
        qc.invalidateQueries({ queryKey: ['org-events'] })
        Alert.alert(submit ? 'Saved as a draft' : 'Saved, with a problem', `${msg}\n\nYour event was saved as a draft so nothing is lost.`, [{ text: 'Open draft', onPress: () => { router.dismissAll(); router.push({ pathname: '/manage/[id]', params: { id: id! } }) } }])
      } else {
        Alert.alert('Could not create event', msg)
      }
    } finally {
      setBusy(false)
    }
  }

  const setTier = (i: number, patch: Partial<Tier>) => setTiers(tiers.map((t, j) => (j === i ? { ...t, ...patch } : t)))

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: Math.max(insets.top, 12) + 4, paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text variant="small" color="muted">Step {step + 1} of {STEPS.length}</Text>
            <Text variant="title">{STEPS[step]}</Text>
          </View>
          <IconButton icon="close" onPress={() => (step || title ? Alert.alert('Discard this event?', 'Nothing has been saved yet.', [{ text: 'Keep editing', style: 'cancel' }, { text: 'Discard', style: 'destructive', onPress: () => router.back() }]) : router.back())} bg={colors.surfaceAlt} />
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {STEPS.map((_, i) => <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= step ? colors.primary : colors.surfaceAlt }} />)}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ gap: 12 }}>
            <Text color="muted">What kind of event are you creating?</Text>
            {([['paid', 'Ticketed event', 'Sell tickets and get paid out after the event.', 'ticket'], ['free', 'Free event', 'Guests RSVP for free, with an optional limit.', 'gift']] as const).map(([k, t, d, ic]) => (
              <Card key={k} onPress={() => setType(k)} style={{ flexDirection: 'row', gap: 14, alignItems: 'center', borderColor: type === k ? colors.primary : colors.border, borderWidth: 2 }}>
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={ic} size={24} color={colors.primary} /></View>
                <View style={{ flex: 1 }}><Text variant="h3">{t}</Text><Text variant="small" color="muted">{d}</Text></View>
                <Ionicons name={type === k ? 'radio-button-on' : 'radio-button-off'} size={22} color={type === k ? colors.primary : colors.subtle} />
              </Card>
            ))}
          </View>
        )}

        {step === 1 && (
          <>
            <Field label="Event title" value={title} onChangeText={setTitle} autoCapitalize="sentences" placeholder="e.g. Lagos Jazz & Soul Night" />
            <Field label="Description" value={description} onChangeText={setDescription} autoCapitalize="sentences" multiline placeholder="Tell people what to expect…" style={{ minHeight: 110, textAlignVertical: 'top' }} />
            <Text variant="label" color="muted" style={{ marginBottom: 8 }}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {cats.data?.map((c) => <Chip key={c._id} label={c.name} active={category === c._id} onPress={() => setCategory(c._id)} />)}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <DateTimeField label="Starts" value={start} onChange={(d) => { setStart(d); if (end && end <= d) setEnd(null) }} minimumDate={new Date()} />
            <DateTimeField label="Ends (optional)" value={end} onChange={setEnd} minimumDate={start ?? new Date()} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flex: 1 }}><Text variant="h3">Online event</Text><Text variant="small" color="muted">No physical venue</Text></View>
              <Switch value={online} onValueChange={setOnline} trackColor={{ true: colors.primary }} />
            </View>
            {online ? (
              <Field label="Join link" icon="link-outline" value={link} onChangeText={setLink} keyboardType="url" placeholder="https://…" />
            ) : (
              <>
                <Field label="Venue name" value={venue.name} onChangeText={(v) => setVenue({ ...venue, name: v })} autoCapitalize="words" placeholder="Eko Convention Centre" />
                <Field label="Address" value={venue.address} onChangeText={(v) => setVenue({ ...venue, address: v })} autoCapitalize="words" placeholder="Street address" />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}><Field label="City" value={venue.city} onChangeText={(v) => setVenue({ ...venue, city: v })} autoCapitalize="words" placeholder="Lagos" /></View>
                  <View style={{ flex: 1 }}><Field label="State (optional)" value={venue.state} onChangeText={(v) => setVenue({ ...venue, state: v })} autoCapitalize="words" placeholder="Lagos" /></View>
                </View>
              </>
            )}
          </>
        )}

        {step === 3 && (type === 'free' ? (
          <Field label="How many people can attend?" value={capacity} onChangeText={(v) => setCapacity(v.replace(/\D/g, ''))} keyboardType="number-pad" placeholder="e.g. 200" />
        ) : (
          <View style={{ gap: 12 }}>
            {tiers.map((t, i) => (
              <Card key={i} style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="h3">Ticket type {i + 1}</Text>
                  {tiers.length > 1 ? <Text variant="label" color="danger" onPress={() => setTiers(tiers.filter((_, j) => j !== i))}>Remove</Text> : null}
                </View>
                <Field label="Name" value={t.name} onChangeText={(v) => setTier(i, { name: v })} autoCapitalize="words" placeholder="Regular, VIP…" />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}><Field label="Price (₦)" value={t.price} onChangeText={(v) => setTier(i, { price: v.replace(/[^\d.]/g, '') })} keyboardType="decimal-pad" placeholder="5000" /></View>
                  <View style={{ flex: 1 }}><Field label="Quantity" value={t.quantity} onChangeText={(v) => setTier(i, { quantity: v.replace(/\D/g, '') })} keyboardType="number-pad" placeholder="100" /></View>
                </View>
              </Card>
            ))}
            <Button title="Add another ticket type" variant="secondary" icon="add" onPress={() => setTiers([...tiers, { name: '', price: '', quantity: '' }])} />
          </View>
        ))}

        {step === 4 && (
          <>
            <Text variant="label" color="muted" style={{ marginBottom: 8 }}>Cover image</Text>
            <Pressable onPress={pickCover} style={{ height: 190, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
              {cover ? <Image source={cover.uri} style={{ width: '100%', height: '100%' }} contentFit="cover" /> : (
                <View style={{ alignItems: 'center', gap: 6 }}><Ionicons name="image-outline" size={34} color={colors.primary} /><Text variant="label" color="primary">Choose a photo</Text><Text variant="small" color="muted">16:9 works best</Text></View>
              )}
            </Pressable>
            {type === 'paid' ? (
              <View style={{ marginTop: 24, gap: 10 }}>
                <Text variant="label" color="muted">Refund policy</Text>
                <Chip label="No refunds" active={refund === 'no-refunds'} onPress={() => setRefund('no-refunds')} />
                <Chip label="Refunds until days before the event" active={refund === 'refund-until-days-before'} onPress={() => setRefund('refund-until-days-before')} />
                {refund === 'refund-until-days-before' ? <Field label="Days before" value={days} onChangeText={(v) => setDays(v.replace(/\D/g, ''))} keyboardType="number-pad" /> : null}
              </View>
            ) : null}
          </>
        )}

        {step === 5 && (
          <View style={{ gap: 12 }}>
            {cover ? <Image source={cover.uri} style={{ height: 170, borderRadius: radius.lg }} contentFit="cover" /> : null}
            <Card style={{ gap: 6 }}>
              <Text variant="h2">{title}</Text>
              <Text color="muted" numberOfLines={3}>{description}</Text>
              <Text variant="small" color="muted">{start ? `${formatDate(start.toISOString())} · ${formatTime(start.toISOString())}` : ''}</Text>
              <Text variant="small" color="muted">{online ? 'Online event' : `${venue.name}, ${venue.city}`}</Text>
              <Text variant="small" color="primary">{type === 'free' ? `Free · ${capacity} spots` : validTiers.map((t) => `${t.name} ${money(Number(t.price))} × ${t.quantity}`).join('  ·  ')}</Text>
            </Card>
            <Text variant="small" color="muted">Save it as a draft to keep editing on the website, or submit it now for our team to review.</Text>
            <Button title="Submit for approval" icon="paper-plane-outline" onPress={() => finish(true)} loading={busy} />
            <Button title="Save as draft" variant="outline" onPress={() => finish(false)} disabled={busy} />
          </View>
        )}

        {problem ? <Text color="danger" style={{ marginTop: 12 }}>{problem}</Text> : null}
      </ScrollView>

      {step < 5 ? (
        <View style={{ flexDirection: 'row', gap: 12, padding: 20, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }}>
          {step > 0 ? <Button title="Back" variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1 }} /> : null}
          <Button title="Continue" onPress={() => setStep(step + 1)} disabled={!!problem} style={{ flex: 2 }} />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  )
}
