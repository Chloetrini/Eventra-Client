import { z } from 'zod'
import { STATES , CATEGORIES} from '@/types/event-types';

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


export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(CATEGORIES),
  subcategory: z.string().optional(),
  venue: z.string(),
  city: z.string(), 
  no:z.string()  ,         
  state: z.enum(STATES),       
  startsAt: z.string(),        
  price: z.number().min(0),    
  imageUrl: z.string(),
  featured: z.boolean().default(false),
  trendingScore: z.number().default(0),
});

