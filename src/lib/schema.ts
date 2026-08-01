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


export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(CATEGORIES),
  subcategory: z.string().optional(),
  venue: z.string(),
  city: z.string(), 
  no:z.string()  ,         
  state: z.enum(STATES),       
  createdAt: z.string(),        
  minPrice: z.number().min(0),    
  coverImage: z.string(),
  promotion: z.boolean().default(false),
  trendingScore: z.number().default(0),
});
