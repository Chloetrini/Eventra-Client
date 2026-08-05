// 1. Define the Event type directly in this file for now
export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  sold: string;
  status: 'Live' | 'Sold out' | 'Draft' | 'Past';
  imageUrl?: string;
}

export const mockStats = {
  ticketsSold: { value: "1,240", change: 12, subtext: "vs last month" },
  revenue: { value: "12.4M", change: 8, subtext: "vs last month" },
  liveEvents: { value: "6", subtext: "2 selling fast" },
  payoutDue: { value: "2.1m", subtext: "Next payout in 4 days" },
};

export const mockEvents: Event[] = [
  { id: '1', title: 'Afrobeats Night Market', subtitle: 'No 0001 · Concert', date: 'Sat 14 Feb', sold: '312 / 500', status: 'Live', imageUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: '2', title: 'Lagos Frontend Meetup', subtitle: 'No 0455 · Free RSVP', date: 'Thu 26 Feb', sold: '128 / 200', status: 'Live', imageUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: '3', title: 'Detty December Boat Party', subtitle: 'No 0212 · Party', date: 'Sun 15 Feb', sold: '500 / 500', status: 'Sold out', imageUrl: 'https://picsum.photos/seed/3/40/40' },
  { id: '4', title: 'High Life & Chill (Draft)', subtitle: 'Not published', date: '—', sold: '—', status: 'Draft', imageUrl: 'https://picsum.photos/seed/4/40/40' },
  { id: '5', title: 'Amapiano All Night', subtitle: 'No 0001 · Concert', date: 'Sat 14 Feb', sold: '312 / 500', status: 'Live', imageUrl: 'https://picsum.photos/seed/5/40/40' },
  { id: '6', title: 'Comedy Central Live', subtitle: 'No 0104 · Comedy', date: 'Sun 12 Feb', sold: '180 / 180', status: 'Past', imageUrl: 'https://picsum.photos/seed/6/40/40' },
];

// Simulate API call
export const fetchDashboardMock = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); 
  return {
    organization: { name: 'Lagos Live Co.', logo: null },
    accountStatus: 'pending' as const,
    stats: mockStats,
    recentEvents: mockEvents,
  };
};










// import { Event } from '@/types/event'; // Assuming you have a global Event type, or you can define it locally

// export const mockStats = {
//   ticketsSold: { value: "1,240", change: 12, subtext: "vs last month" },
//   revenue: { value: "12.4M", change: 8, subtext: "vs last month" },
//   liveEvents: { value: "6", subtext: "2 selling fast" },
//   payoutDue: { value: "2.1m", subtext: "Next payout in 4 days" },
// };

// export const mockEvents = [
//   { id: '1', title: 'Afrobeats Night Market', subtitle: 'No 0001 · Concert', date: 'Sat 14 Feb', sold: '312 / 500', status: 'Live', imageUrl: 'https://picsum.photos/seed/1/40/40' },
//   { id: '2', title: 'Lagos Frontend Meetup', subtitle: 'No 0455 · Free RSVP', date: 'Thu 26 Feb', sold: '128 / 200', status: 'Live', imageUrl: 'https://picsum.photos/seed/2/40/40' },
//   { id: '3', title: 'Detty December Boat Party', subtitle: 'No 0212 · Party', date: 'Sun 15 Feb', sold: '500 / 500', status: 'Sold out', imageUrl: 'https://picsum.photos/seed/3/40/40' },
//   { id: '4', title: 'High Life & Chill (Draft)', subtitle: 'Not published', date: '—', sold: '—', status: 'Draft', imageUrl: 'https://picsum.photos/seed/4/40/40' },
//   { id: '5', title: 'Amapiano All Night', subtitle: 'No 0001 · Concert', date: 'Sat 14 Feb', sold: '312 / 500', status: 'Live', imageUrl: 'https://picsum.photos/seed/5/40/40' },
//   { id: '6', title: 'Comedy Central Live', subtitle: 'No 0104 · Comedy', date: 'Sun 12 Feb', sold: '180 / 180', status: 'Past', imageUrl: 'https://picsum.photos/seed/6/40/40' },
// ];

// // Simulate API call
// export const fetchDashboardMock = async () => {
//   await new Promise(resolve => setTimeout(resolve, 800)); // Artificial delay
//   return {
//     organization: { name: 'Lagos Live Co.', logo: null },
//     accountStatus: 'pending' as const,
//     stats: mockStats,
//     recentEvents: mockEvents,
//   };
// };