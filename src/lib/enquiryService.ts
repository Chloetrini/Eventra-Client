import { api } from "./api"
import { z } from 'zod'
import { contactSchema } from '@/lib/schema'


export type ContactFormValues = z.infer<typeof contactSchema>

export interface Enquiry {
  _id: string
  fullName: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read'
  createdAt: string
}

export interface PaginationMeta {
  currentPage: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface EnquiriesResponse {
  success: boolean
  message: string
  body: {
    enquiries: Enquiry[]
    unreadCount: number
    meta: PaginationMeta
  }
}

export interface EnquiryDetailResponse {
  success: boolean
  message: string
  body: Enquiry
}

export const submitEnquiry = (data: ContactFormValues) =>
  api.post('/enquiries', data)

export const getEnquiries = (page = 1, limit = 10) =>
  api.get(`/enquiries?page=${page}&limit=${limit}`) as Promise<EnquiriesResponse>

export const getEnquiryById = (id: string) =>
  api.get(`/enquiries/${id}`) as Promise<EnquiryDetailResponse>