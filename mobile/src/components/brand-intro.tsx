import { Image } from 'expo-image'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useRef } from 'react'
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native'
import { useTheme } from '@/lib/theme-context'
import { Text } from './text'

const MIN_MS = 1700

/**
 * First thing people see: the Eventra mark exactly where the native splash put
 * it (so there is no jump), then the wordmark and tagline fade in. It stays at
 * least MIN_MS and until the app is ready, then fades out over the live app.
 */
export function BrandIntro({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { colors, isDark } = useTheme()
  const word = useRef(new Animated.Value(0)).current
  const tag = useRef(new Animated.Value(0)).current
  const fade = useRef(new Animated.Value(1)).current
  const start = useRef(Date.now()).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(word, { toValue: 1, duration: 600, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(tag, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start()
  }, [word, tag])

  useEffect(() => {
    if (!ready) return
    const wait = Math.max(0, MIN_MS - (Date.now() - start))
    const t = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 350, useNativeDriver: true }).start(onDone)
    }, wait)
    return () => clearTimeout(t)
  }, [ready, fade, onDone, start])

  const mark = isDark ? require('../../assets/splash-icon-dark.png') : require('../../assets/splash-icon.png')

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#08100D' : '#FFFFFF', opacity: fade }]}
      onLayout={() => SplashScreen.hideAsync().catch(() => {})}
      pointerEvents="auto"
    >
      <View style={styles.center}>
        <Image source={mark} style={{ width: 200, height: 200 }} contentFit="contain" />
      </View>
      <Animated.View
        style={[styles.words, { opacity: word, transform: [{ translateY: word.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}
      >
        <Text variant="display" color="primary" style={{ fontSize: 40, lineHeight: 46, letterSpacing: -1.2 }}>Eventra</Text>
        <Animated.View style={{ opacity: tag }}>
          <Text color="muted" style={{ marginTop: 6 }}>Discover. Book. Go.</Text>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.foot, { opacity: tag }]}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      </Animated.View>
    </Animated.View>
  )
}

const H = Dimensions.get('window').height
const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  words: { position: 'absolute', left: 0, right: 0, top: H / 2 + 100, alignItems: 'center' },
  foot: { position: 'absolute', bottom: 56, left: 0, right: 0, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, opacity: 0.6 },
})
