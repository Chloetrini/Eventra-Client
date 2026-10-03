// Brand colours come from the Eventra logo (#0F6E56) and the web client's
// green / mint / amber palette. Dark mode lifts the green so it keeps contrast.
export const palettes = {
  light: {
    bg: '#F6F8F7',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF3F1',
    text: '#0B1F1A',
    muted: '#5F7068',
    subtle: '#93A19B',
    border: '#E2E9E6',
    primary: '#0F6E56',
    primaryText: '#FFFFFF',
    primarySoft: '#E3F2EC',
    accent: '#F59E0B',
    accentSoft: '#FEF3DC',
    danger: '#DC2626',
    dangerSoft: '#FDE8E8',
    overlay: 'rgba(8,20,16,0.55)',
  },
  dark: {
    bg: '#08100D',
    surface: '#111A16',
    surfaceAlt: '#1A2621',
    text: '#EEF5F2',
    muted: '#9BAAA3',
    subtle: '#68776F',
    border: '#22302A',
    primary: '#3CCB9C',
    primaryText: '#04140E',
    primarySoft: '#12332A',
    accent: '#FBBF24',
    accentSoft: '#3A2E0E',
    danger: '#F87171',
    dangerSoft: '#3A1818',
    overlay: 'rgba(0,0,0,0.6)',
  },
}

export type Palette = typeof palettes.light
export type ThemeMode = 'light' | 'dark'

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 }
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  black: 'Inter_800ExtraBold',
}

export const cardShadow = (mode: ThemeMode) =>
  mode === 'dark'
    ? {}
    : {
        shadowColor: '#0B1F1A',
        shadowOpacity: 0.07,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
      }
