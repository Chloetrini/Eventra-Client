import { Ionicons } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { Platform, Pressable, View } from 'react-native'
import { radius } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'
import { Text } from './text'

export function DateTimeField({ label, value, onChange, minimumDate }: { label: string; value: Date | null; onChange: (d: Date) => void; minimumDate?: Date }) {
  const { colors, isDark } = useTheme()
  const shown = value ?? new Date()
  const text = value ? value.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Choose date & time'

  const openAndroid = () => {
    // Android can't pick date and time in one dialog, so ask for the date, then the time.
    DateTimePickerAndroid.open({
      value: shown, mode: 'date', minimumDate,
      onChange: (e, date) => {
        if (e.type !== 'set' || !date) return
        DateTimePickerAndroid.open({
          value: date, mode: 'time', is24Hour: true,
          onChange: (e2, time) => {
            if (e2.type !== 'set' || !time) return
            const d = new Date(date)
            d.setHours(time.getHours(), time.getMinutes(), 0, 0)
            onChange(d)
          },
        })
      },
    })
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text variant="label" color="muted" style={{ marginBottom: 8 }}>{label}</Text>
      {Platform.OS === 'ios' ? (
        <View style={{ alignItems: 'flex-start' }}>
          <DateTimePicker value={shown} mode="datetime" display="compact" themeVariant={isDark ? 'dark' : 'light'} minimumDate={minimumDate} onChange={(_, d) => d && onChange(d)} />
        </View>
      ) : (
        <Pressable onPress={openAndroid} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: 14, backgroundColor: colors.surface }}>
          <Ionicons name="calendar-outline" size={18} color={colors.subtle} />
          <Text color={value ? 'text' : 'subtle'}>{text}</Text>
        </Pressable>
      )}
    </View>
  )
}
