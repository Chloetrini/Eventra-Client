export interface Event {
    _id: string;
    eventTitle: string;
    eventNumber: string;
    category: string;
    coverImage: string;
    date: string | null // ISO date string, e.g. "2026-02-14", or null if not yet scheduled
    EventType: "Free" | "Paid";
    sold: number | null;
    capacity: number | null;
    revenue: number | null;
    status: "Live" | "Draft" | "Pending" | "Sold out" | "Past" | "Rejected" | "Cancelled" | "Postponed";
}