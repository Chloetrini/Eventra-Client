import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  markAllEnquiriesRead,
  deleteEnquiries,
  type ContactFormValues,
} from '../lib/enquiryService'
import { useEffect } from 'react'

export const enquiryKeys = {
  all: ['enquiries'] as const,
  list: (page: number) => [...enquiryKeys.all, 'list', page] as const,
  detail: (id: string) => [...enquiryKeys.all, 'detail', id] as const,
}

/**
 * Contact form submission — public, unauthenticated.
 */
export const useSubmitEnquiry = () => {
  return useMutation({
    mutationFn: (data: ContactFormValues) => submitEnquiry(data),
  })
}

/**
 * Enquiries list + unread count, for the admin list page and the nav badge.
 * Both consumers can share this one query/cache entry — no need for a
 * separate "count-only" hook.
 */
export const useEnquiries = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: enquiryKeys.list(page),
    queryFn: () => getEnquiries(page, limit),
    select: (res) => res.body,
    placeholderData: (prev) => prev,
  })
}

/**
 * Single enquiry detail. Marks it read server-side on fetch, so on success
 * we invalidate the list query — the badge count and that row's bold state
 * update without a manual refetch call at the call site.
 */
export const useEnquiry = (id: string | undefined) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: enquiryKeys.detail(id ?? ''),
    queryFn: () => getEnquiryById(id as string),
    select: (res) => res.body,
    enabled: !!id,
  })

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.all })
    }
  }, [query.isSuccess, queryClient])

  return query
}

/**
 * "Mark all as read" — bulk-marks every unread enquiry read in one call,
 * then invalidates the list so the page refetches with everything showing
 * as read (and the unread badge count drops to 0) without a manual reload.
 */
export const useMarkAllEnquiriesRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllEnquiriesRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.all })
    },
  })
}

/**
 * Bulk delete for the admin list's checkbox-select + delete action.
 * Invalidates the list on success so deleted rows disappear and the
 * pagination meta (total count, hasMore) is recomputed server-side.
 */
export const useDeleteEnquiries = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => deleteEnquiries(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.all })
    },
  })
}
