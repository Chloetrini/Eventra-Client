import { events} from "@/lib/dummy-event";
import type { Event } from "@/types/event";

export async function getEvents(): Promise<Event[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return events;
}