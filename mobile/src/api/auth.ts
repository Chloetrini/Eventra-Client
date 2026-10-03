import { api } from './client'
import type { User } from './types'

export const login = (email: string, password: string) =>
  api.post<User>('/auth/login', { email, password })

export const register = (p: { fullname: string; email: string; password: string; phone?: string }) =>
  api.post<{ email: string }>('/auth/register', { ...p, role: 'attendee' })

export const verifyEmail = (email: string, otp: string) =>
  api.post<User>('/auth/verify-email', { email, otp })

export const resendOtp = (email: string) => api.post('/auth/resend-otp', { email })
export const logout = () => api.post('/auth/logout')
export const fetchMe = () => api.get<User>('/auth/me')
