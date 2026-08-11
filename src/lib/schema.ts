
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


// Checkout collects only contact details — no password or company name,
// so it can't reuse registerSchema (those fields would fail silently).
export const checkoutSchema = z.object({
  firstName: z
    .string({
      message: 'Complete this field to continue',
    })
    .min(2, {
      message: 'First name must be at least 2 characters long',
    }),
  lastName: z
    .string({
      message: 'Complete this field to continue',
    })
    .min(2, {
      message: 'Last name must be at least 2 characters long',
    }),
  email: registerSchema.shape.email,
  phoneNumber: registerSchema.shape.phoneNumber,
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>


export const contactSchema = z.object({
  fullName: z
    .string({
      message: 'Please enter your full name',
    })
    .trim()
    .min(2, {
      message: 'Full name must be at least 2 characters long',
    }),
  email: z
    .string({
      message: 'Please enter your email address',
    })
    .trim()
    .email({
      message: 'Please enter a valid email address',
    }),
  subject: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string({
      message: 'Please enter a message',
    })
    .trim()
    .min(10, {
      message: 'Message must be at least 10 characters long',
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
  role: z.string().optional(),   // relaxed: backend doesn't always send this
  imageUrl: z.string().nullable().optional(),
});

// Ticket tier — frontend-only for now (backend keeps these in a separate collection)
// Matches the backend's real TicketType shape
export const ticketTypeSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  quantitySold: z.number(),
  purchaseLimitPerPerson: z.number(),
  isActive: z.boolean(),
});

export type TicketType = z.infer<typeof ticketTypeSchema>;

// The ticket-tier group for one event — its own backend collection, keyed by slug.
export const eventTicketsSchema = z.object({
  eventSlug: z.string(),
  serviceFeePercent: z.number().default(0),
  tiers: z.array(ticketTypeSchema),
});

export const eventSchema = z.object({
  // --- backend fields ---
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["free", "paid"]),
 category: z.preprocess((val) => {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "name" in val) return (val as { name: string }).name;
  if (val && typeof val === "object" && "_id" in val) return (val as { _id: string })._id;
  return "Uncategorized";
}, z.string()), // relaxed: backend sends a category ID, not the display name enum
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
 capacity: z.number().nullable().optional(),
reservationsCount: z.number().optional().default(0),
ticketsSoldCount: z.number().optional().default(0),
revenueTotal: z.number().optional().default(0),
ticketTypes: z.array(ticketTypeSchema).optional().default([]),
  // --- frontend-only (kept until backend provides them) ---
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
  relatedEventSlugs: z.array(z.string()).optional(),
  location: z.any().optional(),              // Ozcar's nested location, kept until migrated
  organizer: z.any().optional(),             // kept flexible (backend = id, dummy = object)
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  city: z.string().optional(),
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


export const attendeeRegisterSchema = z
  .object({
    fullName: z
      .string({ message: "Complete this field to continue" })
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    phoneNumber: z
      .string({ message: "Phone number is required" })
      .min(11, { message: "Phone number must be at least 11 digits long" })
      .max(11, { message: "Phone number must be at most 11 digits long" })
      .regex(/^\+?[0-9\s\-()]+$/, { message: "Invalid phone number" }),
    password: z
      .string({ message: "Complete this field to continue" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    role: z.enum(["attendee", "organizer"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AttendeeRegisterValues = z.infer<typeof attendeeRegisterSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
 
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});
export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  otp: z.string().min(1, { message: "Verification code is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export const verifyEmailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits long" }),
});
export type RegisterValues = z.infer<typeof registerSchema>;

export type LoginValues = z.infer<typeof loginSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;


