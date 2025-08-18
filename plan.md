# Review Pilot AI - Customer Review Intelligence Platform

**Comprehensive plan for implementing the full-stack Review Pilot AI platform with authentication, database, Stripe payments, AI features, and complete user management system.**

---

## 1. Database Schema and Setup

### Database Configuration
- **File**: `src/lib/db.ts`
- **Purpose**: SQLite database connection for development (PostgreSQL for production)
- **Implementation**: Use better-sqlite3 with connection pooling

### Database Tables Schema
- **Users Table**: id, email, password_hash, name, role, subscription_status, trial_end_date, stripe_customer_id, created_at, updated_at
- **Organizations Table**: id, name, owner_id, subscription_plan, billing_status, created_at
- **Reviews Table**: id, organization_id, platform, review_id, rating, text, sentiment, topics, response_draft, status, created_at
- **Subscriptions Table**: id, user_id, stripe_subscription_id, plan_type, status, current_period_end
- **API_Keys Table**: id, organization_id, platform, encrypted_key, status

### Database Migration Files
- **File**: `src/lib/migrations/001_initial.sql`
- **Purpose**: Create initial database schema with all required tables

---

## 2. Authentication System

### Authentication Utilities
- **File**: `src/lib/auth.ts`
- **Implementation**:
  - JWT token generation and validation functions
  - Password hashing using bcrypt
  - Session management utilities
  - Role-based access control (RBAC) functions
  - Trial period validation (14-day free trial)

### Login/Signup API Endpoints
- **File**: `src/app/api/auth/signup/route.ts`
  - Workflow: Email validation, password hashing, user creation with 14-day trial
- **File**: `src/app/api/auth/login/route.ts`
  - Workflow: Credential validation, JWT token generation, session creation
- **File**: `src/app/api/auth/logout/route.ts`
  - Workflow: Session invalidation and cleanup

### Social Login Integration
- **File**: `src/app/api/auth/google/route.ts`
- **File**: `src/app/api/auth/facebook/route.ts`
- **Implementation**: OAuth2 flow for Google and Facebook login with user creation/linking

---

## 3. Landing Page and Marketing

### Main Landing Page
- **File**: `src/app/page.tsx`
- **Implementation**:
  - Hero section with app title "Review Pilot AI" and compelling value proposition
  - Feature highlights: AI-powered responses, sentiment analysis, multi-platform integration
  - Pricing section with 14-day free trial emphasis
  - Login and Sign Up buttons prominently displayed
  - Testimonials section with placeholder content
  - Footer with company information and links

### Authentication Pages
- **File**: `src/app/login/page.tsx`
  - Implementation: Login form with email/password and social login buttons
- **File**: `src/app/signup/page.tsx`
  - Implementation: Registration form with trial period information
- **File**: `src/app/forgot-password/page.tsx`
  - Implementation: Password reset functionality

---

## 4. Dashboard and App Structure

### Protected App Layout
- **File**: `src/app/dashboard/layout.tsx`
- **Purpose**: Authenticated user layout with navigation sidebar
- **Implementation**: Check authentication status, display user info, navigation menu
- **Navigation items**: Dashboard, Inbox, Analytics, Settings, Billing

### Dashboard Pages
- **File**: `src/app/dashboard/page.tsx` - Main dashboard with metrics overview
- **File**: `src/app/dashboard/inbox/page.tsx` - Unified inbox for reviews
- **File**: `src/app/dashboard/analytics/page.tsx` - Analytics and reporting
- **File**: `src/app/dashboard/settings/page.tsx` - Account and organization settings
- **File**: `src/app/dashboard/billing/page.tsx` - Subscription and billing management

---

## 5. Subscription and Billing System

### Stripe Integration
- **File**: `src/lib/stripe.ts`
- **Implementation**: Stripe client configuration, webhook handling, subscription management
- **File**: `src/app/api/stripe/webhook/route.ts`
- **Purpose**: Handle Stripe webhook events (payment success, subscription updates, cancellations)

### Subscription Management API
- **File**: `src/app/api/subscription/create/route.ts`
  - Workflow: Create Stripe customer and subscription after trial period
- **File**: `src/app/api/subscription/cancel/route.ts`
  - Workflow: Handle subscription cancellation
- **File**: `src/app/api/subscription/update/route.ts`
  - Workflow: Upgrade/downgrade subscription plans

### Trial Period Management
- **File**: `src/lib/trial.ts`
- **Implementation**: Functions to check trial status, calculate remaining days, enforce limits
- **Integration**: Middleware to check trial/subscription status on protected routes

---

## 6. AI Integration and Core Features

### AI-Generated Response Draft Endpoint
- **File**: `src/app/api/ai/respond/route.ts`
- **Workflow**:
  - Accept POST requests with review details and user context
  - Validate subscription/trial status
  - Call OpenRouter endpoint with anthropic/claude-sonnet-4 model
  - Store generated responses in database
  - Return AI-generated draft with usage tracking

### Sentiment Analysis & Topic Extraction Endpoint
- **File**: `src/app/api/ai/sentiment/route.ts`
- **Workflow**:
  - Batch process reviews for sentiment analysis
  - Extract topics and entities using AI
  - Update database with analysis results
  - Provide real-time sentiment scoring

### Review Platform Integration
- **File**: `src/app/api/platforms/connect/route.ts`
  - Purpose: Handle OAuth connections to review platforms
- **File**: `src/app/api/platforms/sync/route.ts`
  - Purpose: Sync reviews from connected platforms
  - Mock implementations for Google, Yelp, Facebook, TripAdvisor, Trustpilot, Zomato

### CSV Import Endpoint
- **File**: `src/app/api/import/route.ts`
- **Workflow**: Accept CSV files, validate format, parse and store review data

---

## 7. UI Components and User Experience

### Authentication Components
- **File**: `src/components/auth/LoginForm.tsx`
- **File**: `src/components/auth/SignupForm.tsx`
- **File**: `src/components/auth/SocialLoginButtons.tsx`
- **Implementation**: Clean forms with validation, error handling, and social login integration

### Landing Page Components
- **File**: `src/components/landing/Hero.tsx`
- **File**: `src/components/landing/Features.tsx`
- **File**: `src/components/landing/Pricing.tsx`
- **File**: `src/components/landing/Testimonials.tsx`
- **File**: `src/components/landing/Footer.tsx`

### Dashboard Components
- **File**: `src/components/dashboard/Sidebar.tsx`
- **File**: `src/components/dashboard/MetricsCards.tsx`
- **File**: `src/components/dashboard/TrialBanner.tsx`
- **Implementation**: Responsive navigation, key metrics display, trial status indicator

### Review Management Components
- **File**: `src/components/reviews/UnifiedInbox.tsx`
- **File**: `src/components/reviews/ReviewCard.tsx`
- **File**: `src/components/reviews/ResponseDraftModal.tsx`
- **Implementation**: Review listing, filtering, AI response generation interface

### Billing Components
- **File**: `src/components/billing/PricingCards.tsx`
- **File**: `src/components/billing/SubscriptionStatus.tsx`
- **File**: `src/components/billing/PaymentForm.tsx`
- **Implementation**: Stripe Elements integration, subscription management interface

---

## 8. Security and Middleware

### Authentication Middleware
- **File**: `src/middleware.ts`
- **Implementation**: Route protection, session validation, trial period enforcement
- **Protected routes**: /dashboard/*, /api/ai/*, /api/subscription/*

### Rate Limiting and Usage Tracking
- **File**: `src/lib/rateLimit.ts`
- **Implementation**: API rate limiting based on subscription tier, usage tracking for billing

### Data Validation
- **File**: `src/lib/validation.ts`
- **Implementation**: Zod schemas for API request validation, form validation schemas

---

## 9. Environment Configuration

### Environment Variables
- `OPENROUTER_API_KEY`: AI service integration
- `STRIPE_SECRET_KEY`: Payment processing
- `STRIPE_WEBHOOK_SECRET`: Webhook verification
- `JWT_SECRET`: Token signing
- `DATABASE_URL`: Database connection
- `GOOGLE_CLIENT_ID/SECRET`: Social login
- `FACEBOOK_APP_ID/SECRET`: Social login

### Configuration Files
- **File**: `.env.example`
  - Purpose: Template for required environment variables
- **File**: `src/lib/config.ts`
  - Purpose: Centralized configuration management

---

## 10. Testing and Deployment

### API Testing Strategy
- Test authentication flows with curl commands
- Validate Stripe webhook handling
- Test AI integration endpoints
- Verify trial period enforcement
- Test subscription lifecycle management

### Database Seeding
- **File**: `src/lib/seed.ts`
- **Purpose**: Create sample data for development and testing

---

## 11. Documentation and Setup

### Updated README.md
- Installation instructions
- Environment setup guide
- API documentation
- Deployment guidelines
- Feature overview and roadmap

### API Documentation
- **File**: `docs/api.md`
- **Purpose**: Comprehensive API endpoint documentation
- Include authentication requirements, request/response formats

---

## Implementation Summary

This comprehensive plan includes:
- Complete authentication system with social login and JWT tokens
- Database schema with proper relationships and indexing
- 14-day free trial system with automatic Stripe subscription conversion
- AI-powered features using OpenRouter and anthropic/claude-sonnet-4
- Modern, responsive UI with clean typography and no external icons
- Secure middleware and rate limiting
- Comprehensive billing and subscription management
- Mock integrations for major review platforms
- Production-ready error handling and validation
- Complete testing strategy and documentation

**Next Steps**: Create TODO.md tracker and implement each component systematically.
