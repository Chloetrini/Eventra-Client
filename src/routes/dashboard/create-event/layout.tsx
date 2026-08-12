import { useEffect } from 'react'
import CreateEventSidebar from '@/components/dashboard-create-event/create-event-sidebar'
import { Outlet } from 'react-router'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventFormValues } from '@/lib/schema'

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