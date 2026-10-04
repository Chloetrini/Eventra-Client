// Extends app.json with the Google sign-in settings. None of these are secrets
// (they're public OAuth client ids), but they differ per environment, so they
// come from EXPO_PUBLIC_* variables (set in EAS or a local .env).
module.exports = ({ config }) => {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME // e.g. com.googleusercontent.apps.123-abc

  const plugins = [...(config.plugins ?? [])]
  // iOS needs its reversed client id registered as a URL scheme. Android needs no plugin.
  if (iosUrlScheme) plugins.push(['@react-native-google-signin/google-signin', { iosUrlScheme }])

  return {
    ...config,
    plugins,
    extra: { ...config.extra, googleWebClientId: webClientId },
  }
}
