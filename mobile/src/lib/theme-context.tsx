import * as SecureStore from 'expo-secure-store'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { palettes, type Palette, type ThemeMode } from './theme'

export type ThemePref = 'system' | 'light' | 'dark'

type ThemeState = {
  colors: Palette
  mode: ThemeMode
  isDark: boolean
  pref: ThemePref
  setPref: (p: ThemePref) => void
}

const KEY = 'eventra-theme'
const Ctx = createContext<ThemeState | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme()
  const [pref, setPrefState] = useState<ThemePref>('system')

  useEffect(() => {
    SecureStore.getItemAsync(KEY)
      .then((v) => v && setPrefState(v as ThemePref))
      .catch(() => {})
  }, [])

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p)
    SecureStore.setItemAsync(KEY, p).catch(() => {})
  }, [])

  const mode: ThemeMode = pref === 'system' ? (system === 'dark' ? 'dark' : 'light') : pref
  const value = useMemo(
    () => ({ colors: palettes[mode], mode, isDark: mode === 'dark', pref, setPref }),
    [mode, pref, setPref],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used inside ThemeProvider')
  return v
}
