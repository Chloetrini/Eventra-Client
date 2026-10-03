import { Text as RNText, type TextProps } from 'react-native'
import { font, type Palette } from '@/lib/theme'
import { useTheme } from '@/lib/theme-context'

const variants = {
  display: { fontFamily: font.black, fontSize: 32, lineHeight: 38, letterSpacing: -0.8 },
  title: { fontFamily: font.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h2: { fontFamily: font.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  h3: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 23 },
  small: { fontFamily: font.regular, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: font.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: font.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.6 },
}

export type TextVariant = keyof typeof variants

export function Text({
  variant = 'body',
  color = 'text',
  style,
  ...props
}: TextProps & { variant?: TextVariant; color?: keyof Palette | (string & {}) }) {
  const { colors } = useTheme()
  const resolved = (colors as Record<string, string>)[color] ?? color
  return <RNText {...props} style={[variants[variant], { color: resolved }, style]} />
}
