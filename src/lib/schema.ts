import type { Path } from 'react-hook-form';
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
  category: z.union([
    z.string(),
    z.object({ _id: z.string(), name: z.string().optional() }),
    z.null(),
  ]),
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
  subcategory: z.string().optional(),
  no: z.string().optional(),
  trendingScore: z.number().default(0),
  coverImageUrl: z.string().optional(),
  subTags: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  musicType: z.string().nullable().optional(),
  gatesOpenTime: z.string().optional(),
  doorsCloseTime: z.string().optional(),
  goodToKnow: z.array(z.string()).optional(),
  relatedEventSlugs: z.array(z.string()).optional(),
  location: z.any().optional(),
  organizer: z.any().optional(),
}).transform((event) => {
  // Derive BOTH a display name and a real ID from the single raw `category` value.
  let categoryName = "Uncategorized";
  let categoryId: string | null = null;

  if (typeof event.category === "string") {
    categoryName = event.category;
  } else if (event.category && typeof event.category === "object") {
    categoryId = event.category._id;
    categoryName = event.category.name ?? event.category._id;
  }

  return {
    ...event,
    category: categoryName,
    categoryId,
  };
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
    .min(10, "Tell us a little more (at least 10 characters)")
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
] as const satisfies Path<OnboardingValues>[]

export const BANK_FIELDS = ["accountHolderName", "bank", "accountNumber"] as const satisfies Path<OnboardingValues>[]


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

export const eventTypeSchema = z.object({
  eventType: z.enum(["paid", "free"], { message: "Please select an event type" }),
})

export const eventBasicsSchema = z.object({
  title: z.string().min(3, { message: "Event name must be at least 3 characters long" }),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, { message: "Please select a date" }),
  startTime: z.string().min(1, { message: "Please select a start time - click on the clock icon to set time" }),
  endTime: z.string().min(1, { message: "Please select an end time - click on the clock icon to set time" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  coverImage: z.string().min(1, { message: "Please upload a cover image" }),
})

export const locationSchema = z.object({
  locationType: z.enum(["physical", "online"], { message: "Please select a location type" }),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  onlinePlatform: z.string().optional(),
  onlineJoinLink: z.string().optional(),
})

export const freeEventRSVPSchema = z.object({
  hasRsvpLimit: z.boolean(),
  rsvpLimit: z.coerce.number().optional(),
})

export const ticketsSchema = z.object({
  tickets: z.array(
    z.object({
      id: z.string().optional(), // present for existing ticket types loaded on edit; absent for new ones
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.coerce.number().optional(),
      quantity: z.coerce.number().optional(),
      purchaseLimitPerPerson: z.coerce.number().optional(),
    })
  ),
})

export const refundPolicySchema = z.object({
  hasRefundPolicy: z.boolean(),
  refundPolicyType: z.enum(["no-refunds", "refund-until-days-before"]).optional(),
  refundDaysBefore: z.coerce.number().optional(),
})

export const lineupSchema = z.object({
  hasLineup: z.boolean(),
  acts: z.array(
    z.object({
      name: z.string().min(1, { message: "Act/session name is required" }),
      role: z.string().min(1, { message: "Role is required" }),
      imageUrl: z.string().optional(),
    })
  ),
})

// export const gallerySchema = z.object({
//   hasGallery: z.boolean(),
//   photos: z.array(
//     z.object({
//       url: z.string().min(1, { message: "Photo is required" }),
//     })
//   ).min(1, { message: "Add at least one photo" }),
// })

export const agePolicySchema = z.object({
  hasAgePolicy: z.boolean(),
  policyText: z.string().optional(),
})

export const eventFormSchema = eventTypeSchema
  .merge(eventBasicsSchema)
  .merge(locationSchema)
  .merge(freeEventRSVPSchema)
  .merge(ticketsSchema)
  .merge(lineupSchema)
  // .merge(gallerySchema)
  .merge(agePolicySchema)
  .merge(refundPolicySchema)
  .superRefine((data, ctx) => {
    // Location — required fields depend on locationType
    if (data.locationType === "physical") {
      if (!data.venueName || data.venueName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["venueName"],
          message: "Venue name must be at least 3 characters long",
        })
      }
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Address must be at least 5 characters long",
        })
      }
      if (!data.city || data.city.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["city"],
          message: "City is required",
        })
      }
      if (!data.state || data.state.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["state"],
          message: "Please select a state",
        })
      }
    }

    if (data.locationType === "online") {
      if (!data.onlinePlatform || data.onlinePlatform.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["onlinePlatform"],
          message: "Please select a platform",
        })
      }
      if (!data.onlineJoinLink || !z.string().url().safeParse(data.onlineJoinLink).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["onlineJoinLink"],
          message: "Please enter a valid URL",
        })
      }
    }

    // RSVP — only required if the limit switch is on
    if (data.hasRsvpLimit && (data.rsvpLimit === undefined || data.rsvpLimit < 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rsvpLimit"],
        message: "RSVP limit must be at least 1",
      })
    }

    // Tickets — only required when the event is paid
    if (data.eventType === "paid") {
      if (data.tickets.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tickets"],
          message: "Add at least one ticket type",
        })
      }
      data.tickets.forEach((ticket, i) => {
        if (!ticket.name || ticket.name.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["tickets", i, "name"],
            message: "Ticket type is required",
          })
        }
        if (ticket.price === undefined || ticket.price < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["tickets", i, "price"],
            message: "Enter a valid price",
          })
        }
        if (ticket.quantity === undefined || ticket.quantity < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["tickets", i, "quantity"],
            message: "Quantity must be at least 1",
          })
        }
        if (ticket.purchaseLimitPerPerson !== undefined && ticket.purchaseLimitPerPerson < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["tickets", i, "purchaseLimitPerPerson"],
            message: "Limit must be at least 1",
          })
        }
      })
    }

    // Lineup — every act must have a name, but only if lineup is on
    if (data.hasLineup) {
      if (data.acts.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["acts"],
          message: "Add at least one act/session",
        })
      }
      data.acts.forEach((act, i) => {
        if (data.hasLineup && !act.name || act.name.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["acts", i, "name"],
            message: "Act/session name is required",
          })
        }
        if (data.hasLineup && !act.role || act.role.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["acts", i, "role"],
            message: "Role is required",
          })
        }
      })
    }

    // Gallery — at least one photo, only if gallery is on
    // if (data.hasGallery && data.photos.length === 0) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     path: ["photos"],
    //     message: "Upload at least one photo",
    //   })
    // }

    // Policy — text required, only if policy switch is on
    if (data.hasAgePolicy && (!data.policyText || data.policyText.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["policyText"],
        message: "Policy details are required",
      })
    }

// Refund policy — type required if switch is on, daysBefore required only for that specific type
    if (data.hasRefundPolicy) {
      if (!data.refundPolicyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["refundPolicyType"],
          message: "Please select a refund policy type",
        })
      }
      if (data.refundPolicyType === "refund-until-days-before" && (!data.refundDaysBefore || data.refundDaysBefore < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["refundDaysBefore"],
          message: "Enter how many days before the event refunds close",
        })
      }
    }
  })

export type EventFormValues = z.infer<typeof eventFormSchema>

export const TYPE_FIELDS: Path<EventFormValues>[] = ["eventType"]

export const BASICS_FIELDS: Path<EventFormValues>[] = [
  "title",
  "category",
  "date",
  "startTime",
  "endTime",
  "description",
  "coverImage",
]

export const LOCATION_FIELDS: Path<EventFormValues>[] = [
  "locationType",
  "venueName",
  "address",
  "city",
  "state",
  "onlinePlatform",
  "onlineJoinLink",
]

export const RSVP_FIELDS: Path<EventFormValues>[] = [
  "hasRsvpLimit",
  "rsvpLimit",
]

export const TICKETS_FIELDS: Path<EventFormValues>[] = ["tickets"]

export const DETAILS_FIELDS: Path<EventFormValues>[] = [
  "hasLineup",
  "acts",
  // "hasGallery",
  // "photos",
  "hasAgePolicy",
  "policyText",
  "hasRefundPolicy",
  "refundPolicyType",
  "refundDaysBefore",
]
