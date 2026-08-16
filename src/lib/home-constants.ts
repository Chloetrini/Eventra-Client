import { UI_ASSETS } from "@/lib/assets";
import { type EventItem } from "@/types/types";
import { type VibeCategory } from "@/types/types";


export interface NavLinkItem {
  label: string;
  path: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  state: string;
  avatar: string;
  rating?: string;
  role: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Explore", path: "/explore" },
  { label: "Get Started", path: "/get-started" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export const VIBE_CATEGORIES: VibeCategory[] = [
  {
    id: "concerts",
    slug: "concerts",
    title: "Concerts",
    count: "42 Events",
    image: UI_ASSETS.concert,
  },
  {
    id: "nightlife",
    slug: "nightlife",
    title: "Nightlife",
    count: "31 Events",
    image: UI_ASSETS.party,
  },
  {
    id: "conferences",
    slug: "conferences",
    title: "Conferences",
    count: "18 Events",
    image: UI_ASSETS.conference,
  },
  {
    id: "comedy",
    slug: "comedy",
    title: "Comedy",
    count: "12 Events",
    image: UI_ASSETS.comedy,
  },
  {
    id: "sports",
    slug: "sports",
    title: "Sports",
    count: "9 Events",
    image: UI_ASSETS.sport,
  },
  {
    id: "arts & theatre",
    slug: "arts-and-theatre",
    title: "Arts & Theatre",
    count: "16 Events",
    image: UI_ASSETS.arts,
  },
  {
    id: "food",
    slug: "food",
    title: "Food",
    count: "11 Events",
    image: UI_ASSETS.food,
  },
  {
    id: "tech",
    slug: "tech",
    title: "Tech",
    count: "14 Events",
    image: UI_ASSETS.tech,
  },
];

export const FEATURED_EVENTS: EventItem[] = [
  {
    id: "feat-1",
    title: "Sunset rooftop Party",
    date: "2026-11-28",
    time: "2026-11-28T16:00:00",
    location: "Eko Hotel",
    price: 10000,
    category: "PARTY",
    image: UI_ASSETS.ekoHotel,
  },
  {
    id: "feat-2",
    title: "Lagos Tech Week 2026",
    date: "2026-12-05",
    time: "2026-12-05T09:00:00",
    location: "Landmark Center",
    price: 25000,
    category: "Conference",
    image: UI_ASSETS.tech,
  },
  {
    id: "feat-3",
    title: "Comedy Central Live",
    date: "2026-12-12",
    time: "2026-12-12T18:30:00",
    location: "Terra Kulture",
    price: 8000,
    category: "Concerts",
    image: UI_ASSETS.comedyLive,
  },
  {
    id: "feat-4",
    title: "Amapiano Night Jamz",
    date: "2026-12-19",
    time: "2026-12-19T20:00:00",
    location: "Hard Rock Cafe",
    price: 12000,
    category: "party",
    image: UI_ASSETS.amapiano,
  },
];

export const DEFAULT_QUERY_LIMIT = 10;

export const STATS = [
  { label: "EVENTS HOSTED", value: "20k+", icon: null },
  { label: "ACTIVE USERS", value: "500k+", icon: null },
  { label: "TICKETS SOLD", value: "120k+", icon: null },
  { label: "AVERAGE RATING", value: "4.9", icon: UI_ASSETS.yellowStar },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    quote:
      "I sold out my show and the money hit my account in three days. No stress, no screenshots — I'm never going back to DMs!",
    author: "Femi Adebayo",
    role: "Comedy Promoter",
    state: "Lagos",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "test-2",
    quote:
      "I sold out my entire event in under 48 hours. The analytics dashboard and real-time payout are top tier.",
    author: "Tolu Adeyemi",
    role: "Comedy Promoter",
    state: "Lagos",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "test-3",
    quote:
      "Paid with a transfer, my ticket showed up in the app instantly, and it scanned first try at the gate. Clean experience.",
    author: "Chidi Okafor",
    role: "Attendee",
    state: "Lagos",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

export const FAQ_ITEMS = [
  {
    question: "How do I pay for a ticket?",
    answer:
      "You can pay instantly using Debit card, Bank Transfer, or USSD all through Paystack. You'll see the full total. including any fees, before you confirm.",
  },
  {
    question: "Are my tickets safe from fakes?",
    answer:
      "Yes. Every ticket carries a unique QR code that works only once. After it's scanned in, any second scan is rejected - so screenshots can't be reused.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "It depends on the organizer's refund policy, which is shown clearly on the event page before you buy. If an event is cancelled, you're refunded automatically.",
  },
  {
    question: "How do organizers get paid?",
    answer:
      "Eventra holds the money and pays out to the organizer's verified bank account a few days after the event - this protects both sides.",
  },
  {
    question: "Is it free to create an event?",
    answer:
      "Creating an event is free. Free events costs nothing at all; for paid events, Eventra takes a simple 5% per tickets sold",
  },
];
