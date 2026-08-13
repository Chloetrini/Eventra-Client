import { api } from "@/lib/api";

const CREATED_EVENT_ID_KEY = "eventra-create-event-id";

export function getCreatedEventId(): string | null {
  return localStorage.getItem(CREATED_EVENT_ID_KEY);
}

export function setCreatedEventId(id: string) {
  localStorage.setItem(CREATED_EVENT_ID_KEY, id);
}

export function clearCreatedEventId() {
  localStorage.removeItem(CREATED_EVENT_ID_KEY);
}

// --- Step 1: creates the draft event, returns its real _id ---
export async function createEvent(payload: { type: "free" | "paid" }) {
  const res = await api.post("/events", payload);
  console.log("FULL RES:", JSON.stringify(res, null, 2));
  const event = res.body as { _id: string };
  console.log("EVENT ID FIELD:", event._id);
  setCreatedEventId(event._id);
  return event;
}

// --- Steps 2-6: patches the draft event with each step's fields ---
export async function updateEvent(eventId: string, payload: Record<string, unknown>) {
  const res = await api.patch(`/events/${eventId}`, payload);
  return res.body;
}

// --- Review step: submits the draft for admin approval ---
export async function submitEventForApproval(eventId: string) {
  const res = await api.post(`/events/${eventId}/submit`, {});
  return res.body as { message: string };
}

export async function getEvent(eventId: string) {
  const res = await api.get(`/events/mine/${eventId}`); // organizer-specific fetch-by-id, matches getMyEventById
  return res.body;
}