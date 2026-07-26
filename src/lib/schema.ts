import { z } from 'zod'

export const registerSchema = z.object({
  fullname: z
    .string({
      message: 'Complete this field to continue',
    })
    .min(3, {
      message: 'Full name must be at least 3 characters long',
    }),
  email: z.email({ message: 'Complete this field to continue' }),
  password: z
    .string({
      message: 'Complete this field to continue',
    })
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain at least one special character',
    })
    .regex(/\d/, {
      message: 'Password must contain at least one number',
    }),
  companyName: z.string({
    message: 'Company name is required',
  }),
})


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
  SortTrending: "Trending",
  date: "Date",
  price: "Price: low to high",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;


export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(CATEGORIES),
  subcategory: z.string().optional(),
  venue: z.string(),
  city: z.string(),            
  state: z.enum(STATES),       
  startsAt: z.string(),        
  price: z.number().min(0),    
  imageUrl: z.string(),
  featured: z.boolean().default(false),
  trendingScore: z.number().default(0),
});

export type Event = z.infer<typeof eventSchema>;


export type EventFilters = {
  q: string;
  state: State | "";
  categories: Category[];
  when: DateWindow;
  price: PriceTier;
  access: Access;
  sort: SortOption;
  page: number;
};

export const DEFAULT_FILTERS: EventFilters = {
  q: "",
  state: "",
  categories: [],
  when: "any",
  price: "any",
  access: "all",
  sort: "SortTrending",
  page: 1,
};