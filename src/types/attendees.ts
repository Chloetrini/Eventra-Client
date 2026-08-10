export interface Attendee {
    _id: string;
    eventId: string;
    name: string;
    email: string;
    referenceCode: string;
    checkedIn: boolean
}