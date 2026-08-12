import { attendees } from "../dummy-attendee";
import type { Attendee } from "@/types/attendees";

export async function getAttendees(): Promise<Attendee[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return attendees
}