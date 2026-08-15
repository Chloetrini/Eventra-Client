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
function buildEventPayload(values: EventFormValues, categoryId: string) {
  const isOnline = values.locationType === "online"

  return {
    title: values.title,
    category: categoryId,
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
  const {
    handleSubmit,
    trigger,
    formState: { isValid, errors },
  } = useFormContext<EventFormValues>()
  console.log("form errors:", errors)

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

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true)
    try {
      console.log("submitting", values)

      const categoryId = categories.find((c) => c.name === values.category)?._id
      if (!categoryId) {
        toast.error("Couldn't match your selected category. Please reselect it and try again.")
        return
      }

      // Reuse an existing draft id if one's already around (e.g. editing
      // an in-progress event) rather than creating a duplicate event.
      const existingEventId = getCreatedEventId()
      let event: { _id: string }

      if (existingEventId) {
        event = { _id: existingEventId }
      } else {
        try {
          event = await createEvent({ type: values.eventType })
        } catch {
          toast.error("Couldn't create your event. Please try again.")
          return
        }
      }

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
          showSubmit
          submitOnClick={handleSubmit(onSubmit)}
          disableSubmit={!isValid || isSubmitting} />
      </div>
    </PageWrapper>
  )
}

export default Review