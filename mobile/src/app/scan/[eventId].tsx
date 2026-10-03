import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { FlatList, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { checkIn, fetchAttendees, type Attendee } from '@/api/organizer'
import { Segmented, StatusBadge } from '@/components/dash'
import { Text } from '@/components/text'
import { Button, Empty, IconButton, Loading } from '@/components/ui'
import { font, radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

type Result = { kind: 'ok' | 'dup' | 'bad'; title: string; sub?: string }

export default function Scan() {
  const { eventId, tab: initial } = useLocalSearchParams<{ eventId: string; tab?: string }>()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'scan' | 'list'>(initial === 'list' ? 'list' : 'scan')
  const [perm, askPerm] = useCameraPermissions()
  const [result, setResult] = useState<Result>()
  const [search, setSearch] = useState('')
  const lock = useRef(false)
  const att = useQuery({ queryKey: ['org-attendees', eventId], queryFn: () => fetchAttendees(eventId) })

  const m = useMutation({
    mutationFn: (code: string) => checkIn(eventId, code),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ['org-attendees', eventId] })
      if (r.result === 'valid') setResult({ kind: 'ok', title: `${r.ticket?.attendeeName ?? 'Guest'} checked in`, sub: r.ticket?.ticketType?.name ?? 'RSVP' })
      else if (r.result === 'already_used') setResult({ kind: 'dup', title: 'Already checked in', sub: r.ticket?.attendeeName })
      else setResult({ kind: 'bad', title: 'Not a valid ticket for this event' })
    },
    onError: (e) => setResult({ kind: 'bad', title: (e as Error).message }),
  })

  const onScan = (code: string) => {
    if (lock.current) return
    lock.current = true
    m.mutate(code)
    // Brief pause so one QR isn't scanned a dozen times in a row.
    setTimeout(() => { lock.current = false; setResult(undefined) }, 2600)
  }

  const stats = att.data?.stats
  const pct = stats && stats.total ? (stats.checkedIn / stats.total) * 100 : 0
  const tint = result ? { ok: colors.primary, dup: colors.accent, bad: colors.danger }[result.kind] : undefined
  const guests = (att.data?.tickets ?? []).filter((t) => !search || t.attendeeName.toLowerCase().includes(search.toLowerCase()) || t.ticketId.toLowerCase().includes(search.toLowerCase()) || t.attendeeEmail.toLowerCase().includes(search.toLowerCase()))

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, gap: 12, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconButton icon="chevron-back" onPress={() => router.back()} bg={colors.surfaceAlt} />
          <View style={{ flex: 1 }}>
            <Text variant="h2">Check-in</Text>
            <Text variant="small" color="muted">{stats ? `${stats.checkedIn} of ${stats.total} checked in` : 'Loading guests…'}</Text>
          </View>
        </View>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt }}>
          <View style={{ height: 8, borderRadius: 4, width: `${pct}%`, backgroundColor: colors.primary }} />
        </View>
        <Segmented value={tab} onChange={setTab} options={[{ key: 'scan', label: 'Scan QR' }, { key: 'list', label: 'Guest list' }]} />
      </View>

      {tab === 'scan' ? (
        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}>
          {!perm ? <Loading /> : !perm.granted ? (
            <Empty icon="camera-outline" title="Camera access needed" hint="Allow the camera to scan attendee QR codes." action={{ label: perm.canAskAgain ? 'Allow camera' : 'Open settings in your phone', onPress: askPerm }} />
          ) : (
            <View style={{ flex: 1, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: '#000' }}>
              <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={result ? undefined : ({ data }) => onScan(data)}
              />
              <View style={styles.frameWrap} pointerEvents="none">
                <View style={[styles.frame, { borderColor: tint ?? '#fff' }]} />
              </View>
              {result ? (
                <View style={[styles.banner, { backgroundColor: tint }]}>
                  <Ionicons name={result.kind === 'ok' ? 'checkmark-circle' : result.kind === 'dup' ? 'alert-circle' : 'close-circle'} size={30} color="#fff" />
                  <View style={{ flex: 1 }}>
                    <Text variant="h3" color="#fff">{result.title}</Text>
                    {result.sub ? <Text variant="small" color="rgba(255,255,255,0.9)">{result.sub}</Text> : null}
                  </View>
                </View>
              ) : (
                <View style={styles.hint}><Text variant="label" color="#fff">Point the camera at the guest's QR code</Text></View>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface }}>
            <Ionicons name="search" size={18} color={colors.subtle} />
            <TextInput value={search} onChangeText={setSearch} placeholder="Search name, email or ticket ID" placeholderTextColor={colors.subtle} style={{ flex: 1, paddingVertical: 12, fontFamily: font.medium, fontSize: 15, color: colors.text }} />
          </View>
          {result ? <Text variant="label" color={tint} style={{ paddingHorizontal: 20, paddingBottom: 6 }}>{result.title}</Text> : null}
          <FlatList
            data={guests}
            keyExtractor={(t) => t._id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16, gap: 10 }}
            ListEmptyComponent={att.isLoading ? <Loading /> : <Empty icon="people-outline" title="No guests found" />}
            renderItem={({ item }) => <Guest t={item} busy={m.isPending} onCheckIn={() => { setResult(undefined); m.mutate(item.code) }} />}
          />
        </View>
      )}
    </View>
  )
}

function Guest({ t, onCheckIn, busy }: { t: Attendee; onCheckIn: () => void; busy: boolean }) {
  const { colors } = useTheme()
  const done = t.status === 'checked_in'
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
      <View style={{ flex: 1 }}>
        <Text variant="h3" numberOfLines={1}>{t.attendeeName}</Text>
        <Text variant="small" color="muted" numberOfLines={1}>{t.ticketType?.name ?? 'RSVP'} · {t.ticketId}</Text>
      </View>
      {t.status === 'valid' ? <Button title="Check in" onPress={onCheckIn} disabled={busy} style={{ paddingVertical: 10, paddingHorizontal: 16 }} /> : <StatusBadge status={done ? 'checked_in' : t.status} />}
    </View>
  )
}

const styles = StyleSheet.create({
  frameWrap: { ...(Platform.OS === 'web' ? {} : {}), position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 240, height: 240, borderRadius: 28, borderWidth: 4 },
  hint: { position: 'absolute', bottom: 24, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  banner: { position: 'absolute', left: 16, right: 16, bottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: radius.lg },
})
