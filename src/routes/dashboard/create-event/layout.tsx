import CreateEventSidebar from '@/components/dashboard-create-event/create-event-sidebar'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventFormValues } from '@/lib/schema'
import { useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getEvent, getCreatedEventId, setCreatedEventId, clearCreatedEventId } from "@/lib/create-event-api";
import { useDraftEvent, useDraftEventTicketTypes, } from "@/hooks/use-create-event";
import { useCategories } from '@/hooks/use-event'
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
  const navigate = useNavigate();
  const location = useLocation();
  const editEventId = searchParams.get("eventId");
  const hasCheckedStaleDraft = useRef(false);
  // The wizard's step content lives inside this inner overflow-y-auto div,
  // not the page/window — so React Router's scroll restoration (and any
  // window.scrollTo-based fix) never reaches it. Whenever the active step
  // changes, reset this div's own scroll position so stepping into a step
  // (e.g. landing back on Basics after scrolling down elsewhere) doesn't
  // leave it visually scrolled partway down.
  const stepScrollRef = useRef<HTMLDivElement>(null);
  // Guards the form-reset effect below so it only runs once, the moment all
  // three queries have actually resolved — react-query re-runs effects on
  // every refetch/cache update, and we don't want to stomp on edits the
  // organizer has since made just because something in the background
  // invalidated one of these queries.
  const hasHydratedEditForm = useRef(false);

  const editEventQuery = useDraftEvent(editEventId);
  // Free events / events with no ticket types yet -> empty list rather than
  // failing the whole edit load (backend 404s ticket-types for free events,
  // since getOwnedPaidEvent only allows paid ones) — handled inside the hook.
  const editTicketTypesQuery = useDraftEventTicketTypes(editEventId);
  // Needed to resolve event.category (which may come back as a raw ObjectId
  // string rather than a populated { name } object) back to the category
  // NAME the form/select actually matches on.
  const editCategoriesQuery = useCategories();

  const isLoadingEdit =
    Boolean(editEventId) &&
    (editEventQuery.isLoading || editTicketTypesQuery.isLoading || editCategoriesQuery.isLoading);

  useEffect(() => {
    if (!editEventId || hasHydratedEditForm.current) return;
    if (editEventQuery.isLoading || editTicketTypesQuery.isLoading || editCategoriesQuery.isLoading) return;
    if (!editEventQuery.data) return;

    hasHydratedEditForm.current = true;

    const event = editEventQuery.data as any;
    const ticketTypes = editTicketTypesQuery.data ?? [];
    const categories = editCategoriesQuery.categories ?? [];

    // Only claim this event as "the" draft once we know it's real —
    // committing it beforehand meant a broken/edit link could poison
    // localStorage with an id that 404s on every future step.
    setCreatedEventId(editEventId);

    const hasLineup = Array.isArray(event.lineup) && event.lineup.length > 0
    const hasRefundPolicy = Boolean(event.refundPolicy && event.refundPolicy.type === "refund-until-days-before")

    // event.category comes back as either a populated { name, ... } object
    // or a raw ObjectId string depending on the endpoint — handle both. For
    // the id case, resolve it against the fetched category list so the
    // select (which stores/matches on category NAME, not id) actually lands
    // on the right selected option instead of silently falling back to the
    // first one.
    const resolvedCategoryName =
      typeof event.category === "object" && event.category?.name
        ? event.category.name
        : categories.find((c) => c._id === event.category)?.name ?? ""

    methods.reset({
      eventType: event.type,
      title: event.title ?? "",
      category: resolvedCategoryName,
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
  category: tt.category ?? "Regular",
  tableSize:
    tt.category === "Table"
      ? tt.tableSize
      : undefined,
  price: tt.price,
  quantity: tt.quantity,
  purchaseLimitPerPerson:
    tt.purchaseLimitPerPerson,
})),
    });
  }, [editEventId, editEventQuery.data, editEventQuery.isLoading, editTicketTypesQuery.data, editTicketTypesQuery.isLoading, editCategoriesQuery.categories, editCategoriesQuery.isLoading, methods]);

  useEffect(() => {
    if (editEventQuery.isError) {
      toast.error("Couldn't load that event — it may have been deleted.");
      navigate("/dashboard/events");
    }
  }, [editEventQuery.isError, navigate]);

  // Not editing an existing event — but a previous, abandoned draft may
  // still be cached in localStorage (its id + half-filled fields), left
  // over from a session that never reached Review (the only place that
  // clears it). If that draft was since deleted from the dashboard, or
  // came from a wiped/different backend, Review would silently try to
  // save onto an id that no longer exists ("Event not found") while the
  // form shows stale data the user never asked to see. Verify the cached
  // draft is still real before trusting it; if not, wipe it so "Create
  // Event" actually starts fresh.
  useEffect(() => {
    if (editEventId || hasCheckedStaleDraft.current) return;
    hasCheckedStaleDraft.current = true;

    const cachedId = getCreatedEventId();
    if (!cachedId) {
      // No event id was ever committed, but the form-values watcher below
      // mirrors every keystroke to localStorage regardless — including on
      // the very first step, before Continue (and createEvent) has even
      // been clicked. With no id to verify against the backend, the only
      // safe move is to drop it: otherwise picking a type on this step
      // alone is enough to leave data behind for whoever uses this device
      // next.
      localStorage.removeItem(CREATE_EVENT_STORAGE_KEY);
      return;
    }

    getEvent(cachedId).catch(() => {
      clearCreatedEventId();
      localStorage.removeItem(CREATE_EVENT_STORAGE_KEY);
      methods.reset(emptyValues);
    });
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

  useEffect(() => {
    stepScrollRef.current?.scrollTo({ top: 0 });
    // stepScrollRef sits inside the dashboard shell's own scrollable
    // <main> (DashBoardLayout) — if THAT outer region is scrolled down
    // (e.g. from a long step like Review) when the user navigates to
    // another step, resetting only stepScrollRef still leaves the new
    // step's heading/progress bar hidden above the fold. Walk up and
    // reset every scrolled ancestor too, not just this div.
    let node = stepScrollRef.current?.parentElement ?? null;
    while (node) {
      if (node.scrollTop > 0) node.scrollTo({ top: 0 });
      node = node.parentElement;
    }
  }, [location.pathname]);

  // Early return comes AFTER all hooks are declared — this is now safe.
  if (isLoadingEdit) {
    return <div className="p-10 text-center text-muted-foreground">Loading your event…</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className='h-full min-h-0'>
        {/* This used to switch to the side-by-side layout at `lg` (1024px) —
            the same breakpoint where the main dashboard's own SideBar (now
            320px wide, see SideBar.tsx) also goes from an off-canvas drawer
            to a permanent static column. Both switching at once meant that,
            right at 1024px and for a good stretch above it, the page had to
            fit the 320px organizer sidebar AND this 289px step sidebar
            side by side, leaving too little room for the actual form and
            forcing it to scroll horizontally. Pushing this one switch out
            to `xl` (1280px) keeps the step list as the horizontal strip
            (which already looked fine below 1024) all the way through that
            squeeze zone, only going side-by-side once there's real width
            to share it with the organizer sidebar. */}
        <div className='flex flex-col xl:flex-row gap-4 xl:gap-8 pt-4 xl:pt-10 h-full min-h-0'>
          <CreateEventSidebar />
          <div ref={stepScrollRef} className='flex-1 min-w-0 min-h-0 overflow-y-auto'>
            <Outlet />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default CreateEventLayout
