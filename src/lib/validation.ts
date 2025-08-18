import { z } from 'zod';

// User validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Organization validation schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(100, 'Organization name must be less than 100 characters')
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(100, 'Organization name must be less than 100 characters').optional(),
  subscription_plan: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  settings: z.record(z.any()).optional()
});

// Review validation schemas
export const createReviewSchema = z.object({
  platform: z.enum(['google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'zomato', 'csv']),
  review_id: z.string().min(1, 'Review ID is required'),
  rating: z.number().int().min(1).max(5),
  text: z.string().optional(),
  author_name: z.string().optional(),
  author_avatar: z.string().url().optional(),
  review_date: z.string().datetime().optional()
});

export const updateReviewSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  sentiment_score: z.number().min(-1).max(1).optional(),
  topics: z.array(z.string()).optional(),
  entities: z.array(z.string()).optional(),
  response_draft: z.string().optional(),
  response_published: z.string().optional(),
  status: z.enum(['pending', 'responded', 'ignored', 'flagged']).optional()
});

// AI API validation schemas
export const aiResponseSchema = z.object({
  reviewText: z.string().min(1, 'Review text is required'),
  rating: z.number().int().min(1).max(5),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
  businessType: z.string().optional(),
  customInstructions: z.string().optional()
});

export const sentimentAnalysisSchema = z.object({
  text: z.string().min(1, 'Text is required for sentiment analysis'),
  language: z.string().default('en')
});

export const batchSentimentSchema = z.object({
  reviews: z.array(z.object({
    id: z.number(),
    text: z.string()
  })).min(1, 'At least one review is required').max(100, 'Maximum 100 reviews per batch')
});

// CSV Import validation schemas
export const csvImportSchema = z.object({
  file: z.any(), // File validation will be handled separately
  mapping: z.object({
    platform: z.string().optional(),
    review_id: z.string(),
    rating: z.string(),
    text: z.string(),
    author_name: z.string().optional(),
    review_date: z.string().optional()
  })
});

// Subscription validation schemas
export const createSubscriptionSchema = z.object({
  plan_type: z.enum(['starter', 'professional', 'enterprise']),
  payment_method_id: z.string().min(1, 'Payment method is required')
});

export const updateSubscriptionSchema = z.object({
  plan_type: z.enum(['starter', 'professional', 'enterprise']).optional(),
  cancel_at_period_end: z.boolean().optional()
});

// API Key validation schemas
export const createApiKeySchema = z.object({
  platform: z.enum(['google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'zomato']),
  key: z.string().min(1, 'API key is required'),
  key_name: z.string().min(1, 'Key name is required').max(50, 'Key name must be less than 50 characters')
});

export const updateApiKeySchema = z.object({
  key: z.string().min(1, 'API key is required').optional(),
  key_name: z.string().min(1, 'Key name is required').max(50, 'Key name must be less than 50 characters').optional(),
  status: z.enum(['active', 'inactive', 'expired']).optional()
});

// Response Template validation schemas
export const createResponseTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Template name must be less than 100 characters'),
  template_text: z.string().min(10, 'Template text must be at least 10 characters').max(1000, 'Template text must be less than 1000 characters'),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
  category: z.string().optional(),
  is_default: z.boolean().default(false)
});

export const updateResponseTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Template name must be less than 100 characters').optional(),
  template_text: z.string().min(10, 'Template text must be at least 10 characters').max(1000, 'Template text must be less than 1000 characters').optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).optional(),
  category: z.string().optional(),
  is_default: z.boolean().optional()
});

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('20')
});

export const reviewFiltersSchema = z.object({
  platform: z.enum(['google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'zomato', 'csv']).optional(),
  rating: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(1).max(5)).optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  status: z.enum(['pending', 'responded', 'ignored', 'flagged']).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  search: z.string().optional()
});

export const analyticsFiltersSchema = z.object({
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  platform: z.enum(['google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'zomato', 'csv']).optional(),
  group_by: z.enum(['day', 'week', 'month']).default('day')
});

// Webhook validation schemas
export const stripeWebhookSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  data: z.object({
    object: z.any()
  }),
  created: z.number(),
  livemode: z.boolean()
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimetype: z.string().refine((type) => {
    const allowedTypes = ['text/csv', 'application/csv', 'text/plain'];
    return allowedTypes.includes(type);
  }, 'Only CSV files are allowed'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB') // 10MB limit
});

// Environment variable validation
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OPENROUTER_API_KEY: z.string().min(1, 'OpenRouter API key is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:8084')
});

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Type exports for TypeScript
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type AIResponseInput = z.infer<typeof aiResponseSchema>;
export type SentimentAnalysisInput = z.infer<typeof sentimentAnalysisSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type ReviewFilters = z.infer<typeof reviewFiltersSchema>;
export type AnalyticsFilters = z.infer<typeof analyticsFiltersSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type EnvConfig = z.infer<typeof envSchema>;

export default {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  createReviewSchema,
  updateReviewSchema,
  aiResponseSchema,
  sentimentAnalysisSchema,
  batchSentimentSchema,
  csvImportSchema,
  createSubscriptionSchema,
  updateSubscriptionSchema,
  createApiKeySchema,
  updateApiKeySchema,
  createResponseTemplateSchema,
  updateResponseTemplateSchema,
  paginationSchema,
  reviewFiltersSchema,
  analyticsFiltersSchema,
  stripeWebhookSchema,
  fileUploadSchema,
  envSchema,
  validateRequest,
  validateEnv
};
