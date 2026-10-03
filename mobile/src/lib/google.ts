import Constants from 'expo-constants'
import * as authApi from '@/api/auth'
import type { User } from '@/api/types'

// The native module isn't in Expo Go (or on web), so load it defensively and
// simply hide the button when it's missing.
type GoogleLib = typeof import('@react-native-google-signin/google-signin')
let lib: GoogleLib | null = null
try {
  lib = require('@react-native-google-signin/google-signin') as GoogleLib
} catch {
  lib = null
}

const webClientId = Constants.expoConfig?.extra?.googleWebClientId as string | undefined

/** True only in a build that has the native module and a configured web client id. */
export const googleEnabled = !!(lib && webClientId)

let configured = false

/** Returns the signed-in user, or null if the person closed the Google sheet. */
export async function signInWithGoogle(): Promise<User | null> {
  if (!lib || !webClientId) throw new Error('Google sign-in is not available in this build')
  const { GoogleSignin, isCancelledResponse, isErrorWithCode, statusCodes } = lib
  if (!configured) {
    // webClientId makes Google issue an ID token for the same client the backend verifies against.
    GoogleSignin.configure({ webClientId })
    configured = true
  }
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const res = await GoogleSignin.signIn()
    if (isCancelledResponse(res)) return null
    const idToken = res.data.idToken
    if (!idToken) throw new Error('Google did not return a sign-in token. Please try again.')
    return await authApi.googleLogin(idToken)
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) return null
      if (e.code === statusCodes.IN_PROGRESS) return null
      if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) throw new Error('Google Play Services is not available on this phone.')
    }
    throw e
  }
}
