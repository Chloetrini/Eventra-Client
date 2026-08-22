export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  ticketReference: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  avatar?: string | null;
  eventId: string;
  eventName: string;
  tableNumber?: string;
  ticketTier?: string;
  orderId?: string;
  isScanned?: boolean;
}

export interface CheckInStats {
  totalAttendees: number;
  checkedIn: number;
  remaining: number;
  checkInRate: number;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  attendee?: Attendee;
  error?: string;
}

export interface EventCheckInData {
  eventId: string;
  eventName: string;
  eventImage?: string | null;
  attendees: Attendee[];
  stats: CheckInStats;
  recentScan?: Attendee;
}