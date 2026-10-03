import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { BrandIntro } from '@/components/brand-intro'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { RoleRedirect } from '@/lib/mode'
import { font } from '@/lib/theme'
import { ThemeProvider, useTheme } from '@/lib/theme-context'

// Keep the native splash up until the fonts are in and the intro has mounted.
SplashScreen.preventAutoHideAsync().catch(() => {})

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
  })
  if (!fontsLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppGate />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function AppGate() {
  const { colors, isDark } = useTheme()
  const { loading } = useAuth()
  const [introDone, setIntroDone] = useState(false)
  const done = useCallback(() => setIntroDone(true), [])

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: font.bold },
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="organizer" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="manage/[id]" />
        <Stack.Screen name="scan/[eventId]" />
        <Stack.Screen name="create-event" options={{ presentation: 'modal' }} />
        <Stack.Screen name="admin-users" />
        <Stack.Screen name="event/[slug]" />
        <Stack.Screen name="ticket/[id]" options={{ headerShown: true, title: 'Your ticket' }} />
        <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/register" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/verify" options={{ presentation: 'modal' }} />
      </Stack>
      <RoleRedirect enabled={!loading} />
      {introDone ? null : <BrandIntro ready={!loading} onDone={done} />}
    </View>
  )
}
