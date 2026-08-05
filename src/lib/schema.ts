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


/**
 * STEP 1 — Organization. Always required.
 */
export const organisationSchema = z.object({
    organizationName: z
        .string()
        .min(2, "Organization name is too short")
        .max(80, "Organization name is too long"),
    category: z.string().min(1, "Please select a category"),
    city: z.string().min(1, "Please select a city"),
    contactPhone: z
        .string()
        .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
    email: z.string().email("Enter a valid email address"),
    shortBio: z
        .string()
        .min(20, "Tell us a little more (at least 20 characters)")
        .max(200, "Keep it under 200 characters"),
})

/**
 * STEP 2 — Bank account. Skippable.
 *
 * These stay plain `z.string()` with no rules attached. Inputs always hand
 * back "" rather than undefined, so an empty field has to be *allowed* by
 * the base schema — the real rules live in the superRefine below, which
 * only runs them once the user has actually started filling the step in.
 *
 * (Using z.preprocess to turn "" into undefined would break the resolver
 * types: preprocess declares its input as `unknown`, so the form's value
 * type stops matching z.infer.)
 */
export const bankSchema = z.object({
    accountHolderName: z.string(),
    bank: z.string(),
    accountNumber: z.string(),
})

/**
 * STEP 3 — Review. The terms checkbox gates the final submit.
 */
export const termsSchema = z.object({
    terms: z.boolean().refine((checked) => checked === true, {
        message: "Please accept the Organizer Terms to continue",
    }),
})

export const onboardingSchema = organisationSchema
    .merge(bankSchema)
    .merge(termsSchema)
    .superRefine((data, ctx) => {
        const { accountHolderName, bank, accountNumber } = data

        // nothing entered at all = the step was skipped, which is allowed
        if (!accountHolderName && !bank && !accountNumber) return

        // once one field is touched, all three have to be valid
        if (accountHolderName.trim().length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["accountHolderName"],
                message: "Enter the account holder name",
            })
        }

        if (!bank) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["bank"],
                message: "Please select a bank",
            })
        }

        if (!/^\d{10}$/.test(accountNumber)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["accountNumber"],
                message: "Account number must be exactly 10 digits",
            })
        }
    })

export type OnboardingValues = z.infer<typeof onboardingSchema>

// field name groups, used by trigger() to validate one step at a time
export const ORGANISATION_FIELDS = [
    "organizationName",
    "category",
    "city",
    "contactPhone",
    "email",
    "shortBio",
] as const

export const BANK_FIELDS = ["accountHolderName", "bank", "accountNumber"] as const