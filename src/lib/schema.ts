import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().trim().min(2, "Fullname must be at least 2 characters"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().min(7, "Invalid phone number"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});;

export const verifyEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        ticketTypeId: z.string().trim().min(1, "ticketTypeId is required"),
        quantity: z
          .number()
          .int()
          .positive("quantity must be a positive integer"),
      }),
    )
    .min(1, "At least one ticket item is required"),
});

export const organizerProfileSchema = z.object({
  businessName: z.string().trim().min(2).optional(),
  bankName: z.string().trim().min(2).optional(),
  bankCode: z.string().trim().min(2).optional(),
  accountNumber: z.string().trim().min(10).max(10).optional(),
  accountName: z.string().trim().min(2).optional(),
});

const venueSchema = z.object({
  name: z.string().trim().min(2),
  address: z.string().trim().min(3),
  city: z.string().trim().min(2),
  state: z.string().trim().optional(),
});

export const createEventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  category: z.string().trim().min(1, "category is required"),
  type: z.enum(["free", "paid"]),
  coverImage: z.string().trim().url().optional(),
  venue: venueSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  capacity: z.number().int().positive().optional(),
  refundPolicy: z
    .object({
      type: z.enum(["no-refunds", "refund-until-days-before"]),
      daysBefore: z.number().int().min(0).optional(),
    })
    .optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const createTicketTypeSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  price: z.number().min(0),
  quantity: z.number().int().positive(),
  purchaseLimitPerPerson: z.number().int().positive().optional(),
});

export const updateTicketTypeSchema = createTicketTypeSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "name is required"),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).optional(),
  isActive: z.boolean().optional(),
});

export const rejectEventSchema = z.object({
  reason: z.string().trim().min(3, "A rejection reason is required"),
});

export const updateProfileSchema = z
  .object({
    fullname: z.string().trim().min(2).optional(),
    phone: z.string().trim().min(7).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
  })
  .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: "currentPassword is required to set a new password",
    path: ["currentPassword"],
  });

export const refundRequestSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const checkInSchema = z.object({
  code: z.string().trim().min(1, "code is required"),
});

export const requestPromotionSchema = z.object({
  packageId: z.string().trim().min(1, "packageId is required"),
});

export const postponeEventSchema = z.object({
  newStartDate: z.coerce.date(),
});
