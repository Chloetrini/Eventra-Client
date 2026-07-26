import type { Event } from "@/lib/schema";

// ---------------------------------------------------------------------
// Dates are generated relative to today, never hardcoded. Two reasons:
//   1. "Today" and "This weekend" filters need something to match.
//   2. The mock data never goes stale — run this in a year, still works.
// ---------------------------------------------------------------------
const DAY_MS = 86_400_000;
const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

/** N days from today at the given hour, as an ISO string. */
function daysFromNow(days: number, hour: number): string {
  const d = new Date(startOfToday.getTime() + days * DAY_MS);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** The coming Saturday at the given hour — for the "This weekend" window. */
function thisWeekend(hour: number): string {
  const daysUntilSat = (6 - startOfToday.getDay() + 7) % 7;
  return daysFromNow(daysUntilSat, hour);
}

export const MOCK_EVENTS: Event[] = [
  // ---- TODAY ----------------------------------------------------------
  {
    id: "evt-001",
    title: "Afrobeats Night Market",
    category: "Concerts",
    subcategory: "Afrobeats",
    venue: "Muri Okunola Park",
    city: "Victoria Island",
    state: "Lagos",
    startsAt: daysFromNow(0, 18),
    price: 15_000,
    imageUrl: "https://picsum.photos/seed/afrobeats/600/450",
    featured: true,
    trendingScore: 98,
  },
  {
    id: "evt-002",
    title: "Amapiano All Night",
    category: "Parties",
    venue: "Hard Rock Cafe",
    city: "Victoria Island",
    state: "Lagos",
    startsAt: daysFromNow(0, 22),
    price: 8_000,
    imageUrl: "https://picsum.photos/seed/amapiano/600/450",
    featured: false,
    trendingScore: 91,
  },
  {
    id: "evt-003",
    title: "Jos Plateau Jazz Evening",
    category: "Concerts",
    subcategory: "Jazz",
    venue: "Hill Station Hotel",
    city: "Jos",
    state: "Plateau",
    startsAt: daysFromNow(0, 19),
    price: 0,
    imageUrl: "https://picsum.photos/seed/jazz/600/450",
    featured: false,
    trendingScore: 61,
  },

  // ---- THIS WEEKEND ---------------------------------------------------
  {
    id: "evt-004",
    title: "Sunset Rooftop Party",
    category: "Parties",
    venue: "Eko Hotel",
    city: "Victoria Island",
    state: "Lagos",
    startsAt: thisWeekend(17),
    price: 12_500,
    imageUrl: "https://picsum.photos/seed/rooftop/600/450",
    featured: false,
    trendingScore: 88,
  },
  {
    id: "evt-005",
    title: "Calabar Carnival Warm-Up",
    category: "Arts & Theatre",
    venue: "Cultural Centre",
    city: "Calabar",
    state: "Cross River",
    startsAt: thisWeekend(16),
    price: 3_000,
    imageUrl: "https://picsum.photos/seed/carnival/600/450",
    featured: false,
    trendingScore: 84,
  },
  {
    id: "evt-006",
    title: "Detty December Boat Party",
    category: "Parties",
    venue: "Five Cowries Terminal",
    city: "Ikoyi",
    state: "Lagos",
    startsAt: thisWeekend(22),
    price: 25_000,
    imageUrl: "https://picsum.photos/seed/boat/600/450",
    featured: false,
    trendingScore: 86,
  },

  // ---- THIS WEEK ------------------------------------------------------
  {
    id: "evt-007",
    title: "Abuja Tech Week",
    category: "Conferences",
    subcategory: "Tech",
    venue: "Transcorp Hilton",
    city: "Maitama",
    state: "FCT - Abuja",
    startsAt: daysFromNow(4, 9),
    price: 45_000,
    imageUrl: "https://picsum.photos/seed/techweek/600/450",
    featured: false,
    trendingScore: 80,
  },
  {
    id: "evt-008",
    title: "Comedy Central Live",
    category: "Comedy",
    venue: "Genesis Centre",
    city: "Port Harcourt",
    state: "Rivers",
    startsAt: daysFromNow(6, 20),
    price: 5_000,
    imageUrl: "https://picsum.photos/seed/comedy/600/450",
    featured: false,
    trendingScore: 76,
  },
  {
    id: "evt-009",
    title: "Kano Startup Mixer",
    category: "Tech",
    venue: "Kano Innovation Hub",
    city: "Kano",
    state: "Kano",
    startsAt: daysFromNow(5, 16),
    price: 0,
    imageUrl: "https://picsum.photos/seed/startup/600/450",
    featured: false,
    trendingScore: 70,
  },

  // ---- THIS MONTH -----------------------------------------------------
  {
    id: "evt-010",
    title: "Lagos Jollof Festival",
    category: "Food & Drink",
    venue: "Landmark Beach",
    city: "Oniru",
    state: "Lagos",
    startsAt: daysFromNow(15, 12),
    price: 0,
    imageUrl: "https://picsum.photos/seed/jollof/600/450",
    featured: false,
    trendingScore: 74,
  },
  {
    id: "evt-011",
    title: "High Life and Chill",
    category: "Parties",
    venue: "Ojez Restaurant",
    city: "Surulere",
    state: "Lagos",
    startsAt: daysFromNow(18, 21),
    price: 3_000,
    imageUrl: "https://picsum.photos/seed/highlife/600/450",
    featured: false,
    trendingScore: 68,
  },
  {
    id: "evt-012",
    title: "Enugu Coal City Marathon",
    category: "Sports",
    subcategory: "Athletics",
    venue: "Nnamdi Azikiwe Stadium",
    city: "Enugu",
    state: "Enugu",
    startsAt: daysFromNow(21, 7),
    price: 2_500,
    imageUrl: "https://picsum.photos/seed/marathon/600/450",
    featured: false,
    trendingScore: 66,
  },
  {
    id: "evt-013",
    title: "Ibadan Book & Arts Fair",
    category: "Arts & Theatre",
    venue: "Cultural Centre Mokola",
    city: "Ibadan",
    state: "Oyo",
    startsAt: daysFromNow(24, 10),
    price: 1_500,
    imageUrl: "https://picsum.photos/seed/bookfair/600/450",
    featured: false,
    trendingScore: 58,
  },

  // ---- BEYOND A MONTH -------------------------------------------------
  // These exist so "This month" and "Any time" return different counts.
  // Without them you can't tell whether the date filter is working at all.
  {
    id: "evt-014",
    title: "Sunday League Final",
    category: "Sports",
    subcategory: "Football",
    venue: "Lekan Salami Stadium",
    city: "Ibadan",
    state: "Oyo",
    startsAt: daysFromNow(45, 16),
    price: 2_000,
    imageUrl: "https://picsum.photos/seed/football/600/450",
    featured: false,
    trendingScore: 64,
  },
  {
    id: "evt-015",
    title: "Kaduna Food Festival",
    category: "Food & Drink",
    venue: "Murtala Square",
    city: "Kaduna",
    state: "Kaduna",
    startsAt: daysFromNow(52, 11),
    price: 0,
    imageUrl: "https://picsum.photos/seed/kadunafood/600/450",
    featured: false,
    trendingScore: 55,
  },
  {
    id: "evt-016",
    title: "Benin Bronze Exhibition",
    category: "Arts & Theatre",
    venue: "National Museum",
    city: "Benin City",
    state: "Edo",
    startsAt: daysFromNow(60, 10),
    price: 18_000,
    imageUrl: "https://picsum.photos/seed/bronze/600/450",
    featured: false,
    trendingScore: 52,
  },
];