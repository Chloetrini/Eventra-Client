import axios from 'axios';

function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return '/api/v1'
  const trimmed = raw.replace(/\/+$/, '')
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`
}

const BASE_URL = resolveBaseUrl()

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// auth.middleware.ts (backend) sends this exact string on every route that
// requires a session and doesn't have one — verifySession, requireRole,
// requireAdmin, all of it. It's meant as an API error code, not user-facing
// copy: a login *attempt* that fails (wrong password, unverified email,
// etc.) always gets its own specific message from auth.controller.ts
// instead, so this string only ever means "some request needed a session
// and there wasn't one" — that covers a genuinely expired session, but
// also a brand-new session where the just-set login cookie hasn't fully
// landed yet (see the login()/googleAuth() comments in auth.context.tsx
// for the specific case this caught on mobile). Either way it's not
// something to assert as fact ("your session expired") when it might be
// someone's very first login attempt. Most mutations across the app do
// `onError: (err) => toast.error(err.message)` with no filtering, and
// react-toastify's container lives at the app root, so this raw string can
// end up as a toast sitting on top of the *login* page after a redirect —
// reading as a non sequitur while the person is already looking at the
// login form. Rewrite it once here, at the single place every
// request/upload error passes through, into wording that's accurate
// either way.
const SESSION_MISSING_MESSAGE = 'Unauthorized: please log in to continue'
function friendlyErrorMessage(message: string | undefined): string | undefined {
  return message === SESSION_MISSING_MESSAGE ? "We couldn't verify your session. Please try again." : message
}

async function request(
  method: string,
  path: string,
  body?: unknown
): Promise<{ success: boolean; message: string; body?: unknown }> {
  try {
    const response = await axiosClient.request({
      method,
      url: path,
      data: body,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { message } = error.response.data ?? {}
      throw new Error(friendlyErrorMessage(message) || 'Request failed', { cause: error })
    }
    throw new Error('Network error', { cause: error })
  }
}

// Multipart uploads (FormData) need their own path: the client's default
// 'Content-Type: application/json' header must NOT be sent, or the browser
// never gets a chance to set the multipart boundary itself and the server
// can't parse the body. Overriding it to `undefined` here drops it for this
// request only.
async function upload(
  path: string,
  formData: FormData
): Promise<{ success: boolean; message: string; body?: unknown }> {
  try {
    const response = await axiosClient.post(path, formData, {
      headers: { 'Content-Type': undefined },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { message } = error.response.data ?? {}
      throw new Error(friendlyErrorMessage(message) || 'Upload failed', { cause: error })
    }
    throw new Error('Network error', { cause: error })
  }
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: unknown) => request('POST', path, body),
  patch: (path: string, body: unknown) => request('PATCH', path, body),
  delete: (path: string) => request('DELETE', path),
  upload,
}
