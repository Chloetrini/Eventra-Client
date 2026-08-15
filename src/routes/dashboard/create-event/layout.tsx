import CreateEventSidebar from '@/components/dashboard-create-event/create-event-sidebar'
import { Outlet } from 'react-router'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventFormValues } from '@/lib/schema'
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getEvent, setCreatedEventId, fetchTicketTypesForEvent } from "@/lib/create-event-api";
export const CREATE_EVENT_STORAGE_KEY = 'eventra-create-event'

const emptyValues: EventFormValues = {
  eventType: undefined as any,
  title: '',
  category: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  coverImage: '',
  locationType: 'physical',
  venueName: '',
  address: '',
  city: '',
  state: '',
  onlinePlatform: '',
  onlineJoinLink: '',
  hasRsvpLimit: false,
  rsvpLimit: undefined,
  hasLineup: false,
  acts: [{
    name: '',
    role: '',
    imageUrl: ''
  }],
  // hasGallery: false,
  // photos: [],
  hasAgePolicy: false,
  policyText: '',
  hasRefundPolicy: false,
  refundPolicyType: undefined,
  refundDaysBefore: undefined,
  tickets: []
}

const getSavedValues = (): Partial<EventFormValues> => {
  try {
    const raw = localStorage.getItem(CREATE_EVENT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const CreateEventLayout = () => {
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormValues>,
    mode: 'onBlur',
    defaultValues: { ...emptyValues, ...getSavedValues() },
  })
  const [searchParams] = useSearchParams();
  const editEventId = searchParams.get("eventId");
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editEventId));

  useEffect(() => {
    if (!editEventId) return;

    setCreatedEventId(editEventId);

    Promise.all([
      getEvent(editEventId),
      // Free events / events with no ticket types yet -> empty list rather
      // than failing the whole edit load (backend 404s ticket-types for
      // free events, since getOwnedPaidEvent only allows paid ones).
      fetchTicketTypesForEvent(editEventId).catch(() => []),
    ]).then(([event, ticketTypes]: [any, any[]]) => {
      console.log("LOADED EVENT FOR EDIT:", event);

      const hasLineup = Array.isArray(event.lineup) && event.lineup.length > 0
      const hasRefundPolicy = Boolean(event.refundPolicy && event.refundPolicy.type === "refund-until-days-before")

      methods.reset({
        eventType: event.type,
        title: event.title ?? "",
        category: event.category?.name ?? event.category ?? "",
        date: event.startDate ?? "",
        startTime: event.startDate ?? "",
        endTime: event.endDate ?? "",
        description: event.description ?? "",
        coverImage: event.coverImage ?? "",
        locationType: event.isOnline ? "online" : "physical",
        venueName: event.venue?.name ?? "",
        address: event.venue?.address ?? "",
        city: event.venue?.city ?? "",
        state: event.venue?.state ?? "",
        onlinePlatform: event.onlinePlatform ?? "",
        onlineJoinLink: event.onlineJoinLink ?? "",
        hasRsvpLimit: event.capacity !== undefined && event.capacity !== null,
        rsvpLimit: event.capacity ?? undefined,
        hasLineup,
        acts: hasLineup
          ? event.lineup.map((member: any) => ({
              name: member.name ?? "",
              role: member.role ?? "",
              imageUrl: member.imageUrl ?? "",
            }))
          : [{ name: "", role: "", imageUrl: "" }],
        hasAgePolicy: Boolean(event.agePolicy),
        policyText: event.agePolicy ?? "",
        hasRefundPolicy,
        refundPolicyType: event.refundPolicy?.type,
        refundDaysBefore: event.refundPolicy?.daysBefore,
        tickets: ticketTypes.map((tt) => ({
          id: tt._id,
          name: tt.name,
          price: tt.price,
          quantity: tt.quantity,
          purchaseLimitPerPerson: tt.purchaseLimitPerPerson,
        })),
      });
      setIsLoadingEdit(false);
    }).catch(() => setIsLoadingEdit(false));
  }, [editEventId]);

  useEffect(() => {
    const subscription = methods.watch((values) => {
      try {
        localStorage.setItem(CREATE_EVENT_STORAGE_KEY, JSON.stringify(values))
      } catch {
        // storage full or unavailable — form still works in-memory
      }
    })
    return () => subscription.unsubscribe()
  }, [methods])

  // Early return comes AFTER all hooks are declared — this is now safe.
  if (isLoadingEdit) {
    return <div className="p-10 text-center text-muted-foreground">Loading your event…</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className='h-full min-h-0'>
        <div className='flex pt-10 h-full min-h-0'>
          <CreateEventSidebar />
          <div className='flex-1 min-h-0 overflow-y-auto'>
            <Outlet />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default CreateEventLayout