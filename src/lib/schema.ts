import { CATEGORIES, STATES } from '@/types/event-types';
import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z
    .string({
      message: 'Complete this field to continue',
    })
    .min(3, {
      message: 'Name must be at least 3 characters long',
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
  phoneNumber: z.string({
    message: 'Phone number is required',
  })
  .min(11, {
    message: 'Phone number must be at least 11 digits long',
  })
  .max(11, {
    message: 'Phone number must be at most 11 digits long',
  })
  .regex(/^\+?[0-9\s\-()]+$/, {
    message: 'Invalid phone number',
  }),
})


// Event venue — nested, matching the backend
export const eventVenueSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string().optional(),
  // frontend-only (backend adds later)
  coordinates: z.object({ lat: z.number(), lng: z.number() }).nullable().optional(),
});

// Lineup member — matches backend
export const lineupMemberSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  role: z.string(),
  imageUrl: z.string().nullable().optional(),
});

// Ticket tier — frontend-only for now (backend keeps these in a separate collection)
export const ticketTierSchema = z.object({
  id: z.number(),
  type: z.string(),
  unitPrice: z.number(),
  description: z.string().optional(),
  originalPrice: z.number().nullable().optional(),
  availability: z.enum(["available", "scarce", "sold out"]).optional(),
  quantityLeft: z.number().nullable().optional(),
});


export const eventSchema = z.object({
  // --- backend fields ---
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["free", "paid"]),
  category: z.enum(CATEGORIES),           // backend sends an id/name; string keeps it flexible
  coverImage: z.string().optional(),
  venue: eventVenueSchema,
  startDate: z.string(),
  endDate: z.string().optional(),
  minPrice: z.number().min(0),
  isPromoted: z.boolean().default(false),
  status: z.string().optional(),
  lineup: z.array(lineupMemberSchema).default([]),
  lineupCount: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string().optional(),

  // --- frontend-only (kept until backend provides them) ---
  subcategory: z.string().optional(),
  no: z.string().optional(),
  trendingScore: z.number().default(0),
  coverImageUrl: z.string().optional(),      // legacy alias used by some components
  subTags: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  musicType: z.string().nullable().optional(),
  gatesOpenTime: z.string().optional(),
  doorsCloseTime: z.string().optional(),
  goodToKnow: z.array(z.string()).optional(),
  serviceFeePercent: z.number().optional(),
  ticketTiers: z.array(ticketTierSchema).optional(),
  relatedEventSlugs: z.array(z.string()).optional(),
  location: z.any().optional(),              // Ozcar's nested location, kept until migrated
  organizer: z.any().optional(),             // kept flexible (backend = id, dummy = object)
});
