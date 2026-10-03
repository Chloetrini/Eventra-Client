import axios from 'axios'
import Constants from 'expo-constants'

// The backend authenticates with an httpOnly session cookie (`_evtSessionId`).
// On iOS/Android the native networking stack keeps that cookie in its own jar
// and replays it automatically, so `withCredentials` is all that's needed —
// no token handling and no backend changes.
const raw: string =
  process.env.EXPO_PUBLIC_API_URL ?? (Constants.expoConfig?.extra?.apiUrl as string)

const trimmed = raw.replace(/\/+$/, '')
export const BASE_URL = trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`

const http = axios.create({ baseURL: BASE_URL, withCredentials: true, timeout: 20000 })

type Envelope<T> = { success: boolean; message: string; body: T }

async function call<T>(method: string, url: string, data?: unknown): Promise<T> {
  try {
    const res = await http.request<Envelope<T>>({ method, url, data })
    return res.data.body
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      throw new Error(e.response.data?.message || 'Request failed')
    }
    throw new Error('Network error. Check your connection.')
  }
}

async function upload<T>(url: string, form: FormData): Promise<T> {
  try {
    // Drop the JSON content-type so the platform sets the multipart boundary.
    const res = await http.post<Envelope<T>>(url, form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
    return res.data.body
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) throw new Error(e.response.data?.message || 'Upload failed')
    throw new Error('Network error. Check your connection.')
  }
}

export const api = {
  upload,
  patch: <T>(url: string, data?: unknown) => call<T>('PATCH', url, data ?? {}),
  get: <T>(url: string) => call<T>('GET', url),
  post: <T>(url: string, data?: unknown) => call<T>('POST', url, data ?? {}),
  delete: <T>(url: string) => call<T>('DELETE', url),
}
