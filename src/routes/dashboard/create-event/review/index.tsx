import PageSwitcher from '@/components/onboarding/page-switcher'
import PageWrapper from '@/components/pageWrapper'
import type { EventFormValues } from '@/lib/schema'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { CREATE_EVENT_STORAGE_KEY } from '../layout'
import EventReview from '@/components/dashboard-create-event/event-review'
import { useCreateEventStep } from '@/components/dashboard-create-event/create-event-sidebar'
import {
  createEvent,
  updateEvent,
  submitEventForApproval,
  getCreatedEventId,
  clearCreatedEventId,
  fetchCategories,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  fetchTicketTypesForEvent,
  type EventCategory,
} from '@/lib/create-event-api'

// date/startTime/endTime are each their own field, but only carry one
// meaningful piece each: `date`'s time-of-day is arbitrary (whatever the
// calendar/typed value happened to produce), and startTime/endTime's date
// portion is arbitrary too (TimePickerInput doesn't care about it). This
// takes the calendar day from `dateIso` and the hour/minute from `timeIso`
// and merges them into one real datetime for the backend.
function combineDateAndTime(dateIso: string, timeIso: string): string {
  const datePart = new Date(dateIso)
  const timePart = new Date(timeIso)
  const combined = new Date(datePart)
  combined.setHours(timePart.getHours(), timePart.getMinutes(), 0, 0)
  return combined.toISOString()
}

// Maps the wizard's frontend field names/shapes to what the backend Event
// model actually expects. hasX toggles are UI-only — they gate which
// underlying fields get sent, not fields the backend stores itself.
// categoryId is optional here (unlike at submit time) because a draft can
// be saved before every step — including category — has been filled in;
// updateEventSchema on the backend is fully .partial(), so an omitted
// category just leaves whatever was there before untouched.
function buildEventPayload(values: EventFormValues, categoryId?: string) {
  const isOnline = values.locationType === "online"

  return {
    title: values.title,
    ...(categoryId ? { category: categoryId } : {}),
    description: values.description,
    coverImage: values.coverImage,
    isOnline,
    startDate: combineDateAndTime(values.date, values.startTime),
    endDate: combineDateAndTime(values.date, values.endTime),
    ...(isOnline
      ? {
          onlinePlatform: values.onlinePlatform,
          onlineJoinLink: values.onlineJoinLink,
        }
      : {
          venue: {
            name: values.venueName,
            address: values.address,
            city: values.city,
            state: values.state,
          },
        }),
    ...(values.hasRsvpLimit ? { capacity: Number(values.rsvpLimit) } : {}),
    lineup: values.hasLineup
      ? values.acts.map((act) => ({
          name: act.name,
          role: act.role,
          imageUrl: act.imageUrl,
        }))
      : [],
    ...(values.hasAgePolicy ? { agePolicy: values.policyText } : {}),
    ...(values.hasRefundPolicy && values.refundPolicyType
      ? {
          refundPolicy: {
            type: values.refundPolicyType,
            ...(values.refundPolicyType === "refund-until-days-before"
              ? { daysBefore: Number(values.refundDaysBefore) }
              : {}),
          },
        }
      : {}),
  }
}

const Review = () => {
  const { currentStep, totalSteps } = useCreateEventStep()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { isValid },
  } = useFormContext<EventFormValues>()

  const [categories, setCategories] = useState<EventCategory[]>([])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // Non-fatal here — if this fails, the categoryId lookup in onSubmit
        // just won't find a match and submission is blocked with a clear
        // toast, rather than silently sending a bad category value.
      })
  }, [])

  useEffect(() => {
    trigger()
  }, [trigger])

  // Reuse an existing draft id if one's already around (e.g. editing an
  // in-progress event) rather than creating a duplicate event. Shared by
  // both Submit and Save as draft — the only difference between the two
  // is what happens *after* this (submitEventForApproval or nothing).
  const getOrCreateEvent = async (eventType: EventFormValues["eventType"]): Promise<{ _id: string } | null> => {
    const existingEventId = getCreatedEventId()
    if (existingEventId) return { _id: existingEventId }
    try {
      return await createEvent({ type: eventType })
    } catch {
      toast.error("Couldn't create your event. Please try again.")
      return null
    }
  }

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true)
    try {
      const categoryId = categories.find((c) => c.name === values.category)?._id
      if (!categoryId) {
        toast.error("Couldn't match your selected category. Please reselect it and try again.")
        return
      }

      const event = await getOrCreateEvent(values.eventType)
      if (!event) return

try {
  await updateEvent(event._id, buildEventPayload(values, categoryId))
} catch (err: any) {
  console.error("updateEvent failed:", err.message)
  toast.error("Couldn't save your event details. Your draft is safe — try submitting again.")
  return
}

      if (values.eventType === "paid") {
        // Diff against what's actually on the backend for this event —
        // needed to tell "new ticket" (no id) apart from "existing ticket,
        // possibly edited" (has id), and to catch tickets the organizer
        // removed from the form entirely.
        let existingTicketTypes: { _id: string }[] = []
        try {
          existingTicketTypes = await fetchTicketTypesForEvent(event._id)
        } catch {
          existingTicketTypes = []
        }

        const currentIds = new Set(values.tickets.map((t) => t.id).filter(Boolean) as string[])
        const idsToDelete = existingTicketTypes
          .filter((tt) => !currentIds.has(tt._id))
          .map((tt) => tt._id)

        const creates = values.tickets.filter((t) => !t.id)
        const updates = values.tickets.filter((t) => t.id)

        const toPayload = (ticket: (typeof values.tickets)[number]) => ({
          name: ticket.name!,
          price: Number(ticket.price),
          quantity: Number(ticket.quantity),
          purchaseLimitPerPerson:
            ticket.purchaseLimitPerPerson !== undefined
              ? Number(ticket.purchaseLimitPerPerson)
              : undefined,
        })

        const createResults = await Promise.allSettled(
          creates.map((ticket) => createTicketType(event._id, toPayload(ticket)))
        )
        const updateResults = await Promise.allSettled(
          updates.map((ticket) => updateTicketType(event._id, ticket.id!, toPayload(ticket)))
        )
        const deleteResults = await Promise.allSettled(
          idsToDelete.map((id) => deleteTicketType(event._id, id))
        )

        const anyCreateFailed = createResults.some((r) => r.status === "rejected")
        const anyUpdateFailed = updateResults.some((r) => r.status === "rejected")
        const anyDeleteFailed = deleteResults.some((r) => r.status === "rejected")

        if (anyCreateFailed || anyUpdateFailed || anyDeleteFailed) {
          // Only the brand-new creations can be cleanly undone — an update
          // or delete can't be safely reverted without re-sending its prior
          // state, so those are left as-is and surfaced for manual review
          // rather than pretending we rolled them back too.
          const createdOk = createResults.filter(
            (r): r is PromiseFulfilledResult<{ _id: string }> => r.status === "fulfilled"
          )
          await Promise.allSettled(createdOk.map((r) => deleteTicketType(event._id, r.value._id)))

          toast.error(
            anyUpdateFailed || anyDeleteFailed
              ? "Some ticket changes couldn't be saved. Please check your event dashboard before trying again."
              : "Couldn't create your new ticket types. Nothing new was saved — please try again."
          )
          return
        }
      }

try {
  await submitEventForApproval(event._id)
} catch (err: any) {
  console.error("submitEventForApproval failed:", err.message)
  toast.error(err.message)
  return
}

      // TODO: create ticket types here next (paid events only), once that
      // flow is wired up — this is the point in the chain they belong,
      // after the event itself has a real _id.

      toast.success("Event submitted for review!")

      // flow is done — don't leave stale draft data behind
      localStorage.removeItem(CREATE_EVENT_STORAGE_KEY)
      clearCreatedEventId()
      navigate("/dashboard/overview")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Same underlying save as Submit — create/reuse the draft, patch its
  // fields, sync whatever ticket rows are actually filled in — just without
  // the final submitEventForApproval call, and without requiring the whole
  // form to be valid first (that's the entire point of a draft: it's fine
  // to leave it unfinished and come back later via Events > Edit).
  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const values = getValues()

      if (!values.eventType) {
        toast.error("Pick an event type before saving.")
        return
      }

      const categoryId = categories.find((c) => c.name === values.category)?._id

      const event = await getOrCreateEvent(values.eventType)
      if (!event) return

      try {
        await updateEvent(event._id, buildEventPayload(values, categoryId))
      } catch (err: any) {
        console.error("updateEvent (draft) failed:", err.message)
        toast.error("Couldn't save your draft. Please try again.")
        return
      }

      // Best-effort ticket sync — only rows that already look complete;
      // an incomplete row is just left for later rather than blocking the
      // whole draft save or sending the backend a half-filled ticket type.
      if (values.eventType === "paid" && values.tickets.length > 0) {
        const isCompleteTicket = (t: (typeof values.tickets)[number]) =>
          Boolean(t.name) &&
          Number.isFinite(Number(t.price)) &&
          Number.isFinite(Number(t.quantity)) &&
          Number(t.quantity) > 0

        const toPayload = (ticket: (typeof values.tickets)[number]) => ({
          name: ticket.name!,
          price: Number(ticket.price),
          quantity: Number(ticket.quantity),
          purchaseLimitPerPerson:
            ticket.purchaseLimitPerPerson !== undefined
              ? Number(ticket.purchaseLimitPerPerson)
              : undefined,
        })

        const completeTickets = values.tickets.filter(isCompleteTicket)
        const creates = completeTickets.filter((t) => !t.id)
        const updates = completeTickets.filter((t) => t.id)

        try {
          await Promise.allSettled([
            ...creates.map((ticket) => createTicketType(event._id, toPayload(ticket))),
            ...updates.map((ticket) => updateTicketType(event._id, ticket.id!, toPayload(ticket))),
          ])
        } catch {
          // Non-fatal for a draft — the event itself is already saved.
        }
      }

      toast.success("Draft saved")
      localStorage.removeItem(CREATE_EVENT_STORAGE_KEY)
      clearCreatedEventId()
      navigate("/dashboard/events")
    } finally {
      setIsSavingDraft(false)
    }
  }

  return (
    <PageWrapper className='pl-[16px] pr-[34px]'>
      <div>
        <p className='font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80]'>STEP {currentStep} OF {totalSteps}</p>
        <h1 className='text-[28px] font-bold font-grotesk'>Review & publish</h1>
        <p className='font-medium text-[14px] text-muted-foreground'>All events are reviewed by our team before going live</p>
      </div>
      <div className='mt-6 mb-9'>
        <EventReview />
      </div>
      <div>
        <PageSwitcher
          backOnClick={() => navigate("/dashboard/create-event/details")}
          showDraft
          draftOnClick={handleSaveDraft}
          draftText={isSavingDraft ? "Saving…" : "Save as draft"}
          disableDraft={isSavingDraft || isSubmitting}
          showSubmit
          submitOnClick={handleSubmit(onSubmit)}
          disableSubmit={!isValid || isSubmitting || isSavingDraft} />
      </div>
    </PageWrapper>
  )
}

export default Review