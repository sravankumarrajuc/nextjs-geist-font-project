import { validateEnv } from './validation';

// Validate and load environment variables
const env = validateEnv();

// Database configuration
export const database = {
  url: env.DATABASE_URL || 'data/review-pilot.db',
  maxConnections: 10,
  idleTimeout: 30000,
  acquireTimeout: 60000
};

// Authentication configuration
export const auth = {
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  saltRounds: 12,
  sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes in milliseconds
};

// Trial configuration
export const trial = {
  durationDays: 14,
  features: [
    'ai_response',
    'sentiment_analysis',
    'review_sync',
    'csv_import',
    'basic_analytics'
  ],
  limits: {
    ai_response: 50,
    sentiment_analysis: 100,
    review_sync: 10,
    csv_import: 5,
    organizations: 1
  }
};

// Subscription plans configuration
export const subscriptionPlans = {
  starter: {
    name: 'Starter',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'ai_response',
      'sentiment_analysis',
      'review_sync',
      'csv_import',
      'basic_analytics',
      'email_support'
    ],
    limits: {
      ai_response: 500,
      sentiment_analysis: 1000,
      review_sync: 50,
      csv_import: 20,
      organizations: 3,
      users_per_org: 5
    }
  },
  professional: {
    name: 'Professional',
    price: 79,
    currency: 'usd',
    interval: 'month',
    features: [
      'ai_response',
      'sentiment_analysis',
      'review_sync',
      'csv_import',
      'advanced_analytics',
      'custom_templates',
      'api_access',
      'priority_support'
    ],
    limits: {
      ai_response: 2000,
      sentiment_analysis: 5000,
      review_sync: 200,
      csv_import: 100,
      organizations: 10,
      users_per_org: 20
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    currency: 'usd',
    interval: 'month',
    features: [
      'ai_response',
      'sentiment_analysis',
      'review_sync',
      'csv_import',
      'advanced_analytics',
      'custom_templates',
      'api_access',
      'white_label',
      'dedicated_support',
      'custom_integrations'
    ],
    limits: {
      ai_response: 10000,
      sentiment_analysis: 25000,
      review_sync: 1000,
      csv_import: 500,
      organizations: -1, // unlimited
      users_per_org: -1 // unlimited
    }
  }
};

// AI configuration
export const ai = {
  openRouter: {
    apiKey: env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-sonnet-4',
    timeout: 30000,
    maxRetries: 3
  },
  prompts: {
    responseGeneration: {
      system: `You are an AI assistant helping businesses respond to customer reviews professionally and empathetically. 
      Generate appropriate responses that:
      - Acknowledge the customer's feedback
      - Show appreciation for their time
      - Address specific concerns mentioned
      - Maintain the specified tone
      - Keep responses concise but meaningful
      - Include a call to action when appropriate`,
      maxTokens: 300
    },
    sentimentAnalysis: {
      system: `Analyze the sentiment of customer reviews and extract key topics and entities.
      Return a JSON object with:
      - sentiment: "positive", "negative", or "neutral"
      - sentiment_score: number between -1.0 (very negative) and 1.0 (very positive)
      - topics: array of key topics mentioned
      - entities: array of entities (products, services, people, locations)
      - summary: brief summary of the review`,
      maxTokens: 200
    }
  }
};

// Stripe configuration
export const stripe = {
  secretKey: env.STRIPE_SECRET_KEY,
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  apiVersion: '2023-10-16' as const,
  currency: 'usd',
  successUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing/success`,
  cancelUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing/cancel`
};

// Social login configuration
export const socialLogin = {
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    scope: ['openid', 'email', 'profile']
  },
  facebook: {
    appId: env.FACEBOOK_APP_ID,
    appSecret: env.FACEBOOK_APP_SECRET,
    redirectUri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`,
    scope: ['email', 'public_profile']
  }
};

// Rate limiting configuration
export const rateLimiting = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    skipSuccessfulRequests: true,
    skipFailedRequests: false
  },
  ai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  }
};

// File upload configuration
export const fileUpload = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['text/csv', 'application/csv', 'text/plain'],
  uploadDir: 'uploads',
  tempDir: 'temp'
};

// Email configuration (for future implementation)
export const email = {
  from: 'noreply@reviewpilot.ai',
  replyTo: 'support@reviewpilot.ai',
  templates: {
    welcome: 'welcome',
    passwordReset: 'password-reset',
    trialExpiring: 'trial-expiring',
    subscriptionConfirmation: 'subscription-confirmation'
  }
};

// Platform integration configuration
export const platforms = {
  google: {
    name: 'Google My Business',
    apiUrl: 'https://mybusiness.googleapis.com/v4',
    scopes: ['https://www.googleapis.com/auth/business.manage'],
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 25000
    }
  },
  yelp: {
    name: 'Yelp',
    apiUrl: 'https://api.yelp.com/v3',
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 5000
    }
  },
  facebook: {
    name: 'Facebook',
    apiUrl: 'https://graph.facebook.com/v18.0',
    scopes: ['pages_read_engagement', 'pages_manage_metadata'],
    rateLimit: {
      requestsPerMinute: 200,
      requestsPerDay: 200000
    }
  },
  tripadvisor: {
    name: 'TripAdvisor',
    apiUrl: 'https://api.tripadvisor.com/api/partner/2.0',
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 10000
    }
  },
  trustpilot: {
    name: 'Trustpilot',
    apiUrl: 'https://api.trustpilot.com/v1',
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 10000
    }
  },
  zomato: {
    name: 'Zomato',
    apiUrl: 'https://developers.zomato.com/api/v2.1',
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 1000
    }
  }
};

// Application configuration
export const app = {
  name: 'Review Pilot AI',
  version: '1.0.0',
  url: env.NEXT_PUBLIC_APP_URL,
  environment: env.NODE_ENV,
  port: process.env.PORT || 8000,
  cors: {
    origin: env.NODE_ENV === 'production' 
      ? [env.NEXT_PUBLIC_APP_URL] 
      : ['http://localhost:8000', 'http://localhost:3000'],
    credentials: true
  },
  session: {
    name: 'review-pilot-session',
    secret: env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: auth.sessionTimeout
    }
  }
};

// Logging configuration
export const logging = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: env.NODE_ENV === 'production' ? 'json' : 'combined',
  auditLog: {
    enabled: true,
    retention: 90 // days
  }
};

// Cache configuration
export const cache = {
  redis: {
    enabled: false, // Enable when Redis is available
    url: process.env.REDIS_URL,
    ttl: 3600 // 1 hour default TTL
  },
  memory: {
    enabled: true,
    maxSize: 100, // MB
    ttl: 300 // 5 minutes default TTL
  }
};

// Feature flags
export const features = {
  socialLogin: {
    google: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
    facebook: !!env.FACEBOOK_APP_ID && !!env.FACEBOOK_APP_SECRET
  },
  analytics: {
    advanced: true,
    realTime: false // Future feature
  },
  ai: {
    responseGeneration: true,
    sentimentAnalysis: true,
    topicExtraction: true,
    multiLanguage: false // Future feature
  },
  integrations: {
    platforms: true,
    webhooks: false, // Future feature
    api: false // Future feature
  }
};

// Export all configurations
export default {
  database,
  auth,
  trial,
  subscriptionPlans,
  ai,
  stripe,
  socialLogin,
  rateLimiting,
  fileUpload,
  email,
  platforms,
  app,
  logging,
  cache,
  features
};

// Helper functions
export function getPlanConfig(planType: string) {
  return subscriptionPlans[planType as keyof typeof subscriptionPlans] || null;
}

export function getPlatformConfig(platform: string) {
  return platforms[platform as keyof typeof platforms] || null;
}

export function isFeatureEnabled(feature: string): boolean {
  const featurePath = feature.split('.');
  let current: any = features;
  
  for (const path of featurePath) {
    if (current[path] === undefined) {
      return false;
    }
    current = current[path];
  }
  
  return Boolean(current);
}

export function getTrialLimits() {
  return trial.limits;
}

export function getPlanLimits(planType: string) {
  const plan = getPlanConfig(planType);
  return plan?.limits || null;
}
