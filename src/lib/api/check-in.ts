import type { Attendee, CheckInResponse, EventCheckInData, CheckInStats } from '@/types/check-in';
import { api } from '@/lib/api';

// ─── API Endpoints ──────────────────────────────────────────────

/**
 * Fetch all attendees for a specific event
 * GET /api/events/:eventId/attendees
 */
export const fetchEventAttendees = async (eventId: string): Promise<EventCheckInData> => {
  // ─── UNCOMMENT FOR REAL API ──────────────────────────────────
  // const response = await api.get(`/events/${eventId}/attendees`);
  // return response.data;

  // ─── MOCK DATA (DELETE WHEN REAL API IS READY) ──────────────
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        eventId,
        eventName: 'Afrobeats Night Market',
        eventImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', // replace with real event image field once wired to your API
        stats: {
          totalAttendees: 8,
          checkedIn: 3,
          remaining: 5,
          checkInRate: 37.5,
        },
        recentScan: {
          id: '6',
          name: 'Fola Adeyemi',
          email: 'folake@example.com',
          ticketType: 'VIP',
          ticketReference: 'EVT-TBL5',
          checkedIn: true,
          checkedInAt: '2024-02-14T13:45:00Z',
          eventId,
          eventName: 'Afrobeats Night Market',
          tableNumber: '5',
          ticketTier: 'VIP',
          isScanned: true,
        },
        attendees: [
          {
            id: '1',
            name: 'Ada Okafor',
            email: 'ada@example.com',
            ticketType: 'VIP',
            ticketReference: 'EVT-BFQ2',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            tableNumber: '5',
            ticketTier: 'VIP',
            isScanned: false,
          },
          {
            id: '2',
            name: 'Musa Ibrahim',
            email: 'musa@example.com',
            ticketType: 'Regular',
            ticketReference: 'EVT-9qw1',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            ticketTier: 'Regular',
            isScanned: false,
          },
          {
            id: '3',
            name: 'Tunde Bello',
            email: 'tunde@example.com',
            ticketType: 'Regular',
            ticketReference: 'EVT-1A20',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            ticketTier: 'Regular',
            isScanned: false,
          },
          {
            id: '4',
            name: 'Chioma Eze',
            email: 'chioma@example.com',
            ticketType: 'Regular',
            ticketReference: 'EVT-77kp',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            ticketTier: 'Regular',
            isScanned: false,
          },
          {
            id: '5',
            name: 'Zainab Yusuf',
            email: 'zainab@example.com',
            ticketType: 'Regular',
            ticketReference: 'EVT-882m',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            ticketTier: 'Regular',
            isScanned: false,
          },
          {
            id: '6',
            name: 'Fola Adeyemi',
            email: 'folake@example.com',
            ticketType: 'VIP',
            ticketReference: 'EVT-TBL5',
            checkedIn: true,
            checkedInAt: '2024-02-14T13:45:00Z',
            eventId,
            eventName: 'Afrobeats Night Market',
            tableNumber: '5',
            ticketTier: 'VIP',
            isScanned: true,
          },
          {
            id: '7',
            name: 'Oluwaseun Johnson',
            email: 'seun@example.com',
            ticketType: 'Regular',
            ticketReference: 'EVT-3k9p',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            ticketTier: 'Regular',
            isScanned: false,
          },
          {
            id: '8',
            name: 'Amina Bello',
            email: 'amina@example.com',
            ticketType: 'Regular',
            ticketReference: 'EVT-7h2q',
            checkedIn: false,
            checkedInAt: null,
            eventId,
            eventName: 'Afrobeats Night Market',
            ticketTier: 'Regular',
            isScanned: false,
          },
        ],
      });
    }, 500);
  });
};

/**
 * Check-in an attendee by scanning QR code
 * POST /api/events/:eventId/check-in
 */
export const checkInAttendee = async (
  eventId: string,
  ticketReference: string
): Promise<CheckInResponse> => {
  // ─── UNCOMMENT FOR REAL API ──────────────────────────────────
  // const response = await api.post(`/events/${eventId}/check-in`, {
  //   ticketReference,
  // });
  // return response.data;

  // ─── MOCK DATA (DELETE WHEN REAL API IS READY) ──────────────
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ticketReference.length < 3) {
        reject(new Error('Invalid ticket reference'));
      }
      resolve({
        success: true,
        message: `Successfully checked in attendee`,
        attendee: {
          id: Date.now().toString(),
          name: 'Scanned Attendee',
          email: 'scanned@example.com',
          ticketType: 'Regular',
          ticketReference: ticketReference,
          checkedIn: true,
          checkedInAt: new Date().toISOString(),
          eventId,
          eventName: 'Afrobeats Night Market',
          ticketTier: 'Regular',
          isScanned: true,
        },
      });
    }, 300);
  });
};

/**
 * Manually check-in an attendee by ID
 * POST /api/events/:eventId/check-in/manual
 */
export const manualCheckIn = async (
  eventId: string,
  attendeeId: string
): Promise<CheckInResponse> => {
  // ─── UNCOMMENT FOR REAL API ──────────────────────────────────
  // const response = await api.post(`/events/${eventId}/check-in/manual`, {
  //   attendeeId,
  // });
  // return response.data;

  // ─── MOCK DATA (DELETE WHEN REAL API IS READY) ──────────────
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Attendee checked in successfully',
      });
    }, 300);
  });
};