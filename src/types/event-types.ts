import { eventSchema, eventVenueSchema, lineupMemberSchema } from "@/services/schema";
import z from "zod";

export const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type State = (typeof STATES)[number];

export const CATEGORIES = [
  "Concerts",
  "Parties",
  "Conferences",
  "Comedy",
  "Sports",
  "Arts & Theatre",
  "Food & Drink",
  "Tech",
] as const;

export type Category = (typeof CATEGORIES)[number];


export const PRICE_TIERS = {
  any: { label: "Any price", test: () => true },
  free: { label: "Free", test: (p: number) => p === 0 },
  under15k: { label: "Under ₦15,000", test: (p: number) => p > 0 && p < 15_000 },
  over15k: { label: "₦15,000 +", test: (p: number) => p >= 15_000 },
} as const;

export type PriceTier = keyof typeof PRICE_TIERS;


const DAY_MS = 86_400_000;

export const DATE_WINDOWS = {
  any: {
    label: "Any time",
    test: () => true,
  },
  today: {
    label: "Today",
    test: (date: Date, today: Date) =>
      date >= today && date < new Date(today.getTime() + DAY_MS),
  },
  weekend: {
    label: "This weekend",
    test: (date: Date, today: Date) => {
      const daysUntilSat = (6 - today.getDay() + 7) % 7;
      const sat = new Date(today.getTime() + daysUntilSat * DAY_MS);
      const mon = new Date(sat.getTime() + 2 * DAY_MS);
      return date >= sat && date < mon;
    },
  },
  week: {
    label: "This week",
    test: (date: Date, today: Date) =>
      date >= today && date < new Date(today.getTime() + 7 * DAY_MS),
  },
  month: {
    label: "This month",
    test: (date: Date, today: Date) =>
      date >= today && date < new Date(today.getTime() + 30 * DAY_MS),
  },
} as const;

export type DateWindow = keyof typeof DATE_WINDOWS;


export const ACCESS_OPTIONS = ["all", "free", "paid"] as const;
export type Access = (typeof ACCESS_OPTIONS)[number];

export const SORT_OPTIONS = {
  trending: "Trending",
  date: "Date",
  price: "Price: low to high",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export type Event = z.infer<typeof eventSchema>;


export type EventFilters = {
  search: string;
  state: State | "";
  categories: string[];
  when: DateWindow;
  price: PriceTier;
  access: Access;
  sort: SortOption;
  page: number;
};

export const DEFAULT_FILTERS: EventFilters = {
  search: "",
  state: "",
  categories: [],
  when: "any",
  price: "any",
  access: "all",
  sort: "trending",
  page: 1,
};

export type EventVenue = z.infer<typeof eventVenueSchema>;
export type LineupMember = z.infer<typeof lineupMemberSchema>;

