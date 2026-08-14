import CreateEventSidebar from '@/components/dashboard-create-event/create-event-sidebar'
import { Outlet } from 'react-router'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventFormValues } from '@/lib/schema'
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getEvent, setCreatedEventId } from "@/lib/create-event-api";
export const CREATE_EVENT_STORAGE_KEY = 'eventra-create-event'

const emptyValues: EventFormValues = {
  eventType: undefined as any,
  eventName: '',
  category: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  coverImage: '',
  locationType: 'physical',
  venueName: '',
  address: '',
  platform: '',
  link: '',
  hasRsvpLimit: false,
  rsvpLimit: undefined,
  hasLineup: false,
  acts: [],
  hasGallery: false,
  photos: [],
  hasAgePolicy: false,
  policyText: '',
  hasRefundPolicy: false,
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

    getEvent(editEventId).then((event: any) => {
       console.log("LOADED EVENT FOR EDIT:", event);
      methods.reset({
        eventType: event.type,
        eventName: event.title ?? "",
        category: event.category?.name ?? event.category ?? "",
        date: event.startDate ?? "",
        startTime: event.startDate ?? "",
        endTime: event.endDate ?? "",
        description: event.description ?? "",
        coverImage: event.coverImage ?? "",
        locationType: event.isOnline ? "online" : "physical",
        venueName: event.venue?.name ?? "",
        address: event.venue?.address ?? "",
        platform: event.onlinePlatform ?? "",
        link: event.onlineJoinLink ?? "",
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