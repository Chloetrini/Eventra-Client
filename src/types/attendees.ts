export interface Attendee {
    _id: string;
    eventId: string;
    name: string;
    email: string;
    referenceCode: string;
    checkedIn: boolean;
    ticketType: "VIP" | "Regular"  | "Table";
    tableSize: number | null;
    purchasedDate: string;
    avatarUrl?: string
    
}