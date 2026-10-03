import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '@/lib/auth-context'
import { colors } from '@/lib/theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerTintColor: colors.primaryDark, headerShadowVisible: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="event/[slug]" options={{ title: '' }} />
          <Stack.Screen name="ticket/[id]" options={{ title: 'Your ticket' }} />
          <Stack.Screen name="auth/login" options={{ title: 'Log in', presentation: 'modal' }} />
          <Stack.Screen name="auth/register" options={{ title: 'Create account', presentation: 'modal' }} />
          <Stack.Screen name="auth/verify" options={{ title: 'Verify email', presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  )
}
