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
      throw new Error(message || 'Request failed', { cause: error })
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
      throw new Error(message || 'Upload failed', { cause: error })
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

