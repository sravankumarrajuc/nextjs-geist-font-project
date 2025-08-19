# Full-Stack Integration Plan with SQLite Backend

## Current Status Analysis

### ✅ What's Working
1. **Frontend Components**: Landing page, login/signup forms, UI components
2. **Database Schema**: SQLite database with proper tables and relationships
3. **Authentication Structure**: JWT-based auth system with bcrypt password hashing
4. **API Endpoints**: Auth routes (login/signup), dashboard routes, review management
5. **Middleware**: Route protection and authentication middleware
6. **Environment Setup**: Basic environment configuration

### ❌ Current Issues
1. **Environment Variables**: JWT_SECRET validation failing (needs 32+ characters)
2. **Database Initialization**: Missing queries and proper initialization
3. **Password Verification**: Authentication failing due to environment issues
4. **Missing API Endpoints**: Some dashboard and AI features not fully implemented
5. **Error Handling**: Need better error handling and user feedback

## Implementation Plan

### Phase 1: Fix Authentication System
1. **Environment Variables**
   - Update .env.local with proper JWT_SECRET (32+ characters)
   - Ensure all required environment variables are set
   - Fix validation schema to handle development vs production

2. **Database Queries**
   - Add missing database queries (getReviewById, etc.)
   - Ensure proper database initialization
   - Add error handling for database operations

3. **Authentication Flow**
   - Test and fix login/signup functionality
   - Verify password hashing and verification
   - Test JWT token generation and validation

### Phase 2: Complete API Endpoints
1. **Dashboard APIs**
   - `/api/dashboard/stats` - User statistics and metrics
   - `/api/reviews` - CRUD operations for reviews
   - `/api/reviews/[id]` - Individual review management

2. **AI Integration APIs**
   - `/api/ai/respond` - Generate AI responses for reviews
   - `/api/ai/sentiment` - Sentiment analysis for reviews
   - Mock OpenRouter integration for development

3. **User Management APIs**
   - `/api/user/profile` - User profile management
   - `/api/user/settings` - User preferences and settings

### Phase 3: Frontend Integration
1. **Dashboard Pages**
   - Complete dashboard layout and navigation
   - Implement review inbox with real data
   - Add analytics and metrics displays

2. **Authentication Flow**
   - Proper login/logout functionality
   - Protected route handling
   - User session management

3. **Error Handling**
   - User-friendly error messages
   - Loading states and feedback
   - Form validation and submission

### Phase 4: Advanced Features
1. **Review Management**
   - CSV import functionality
   - Review filtering and search
   - AI response generation interface

2. **Analytics Dashboard**
   - Sentiment analysis visualization
   - Review metrics and trends
   - User engagement statistics

3. **Settings and Preferences**
   - User profile management
   - Organization settings
   - API key management

## Technical Implementation Details

### Database Schema (SQLite)
```sql
-- Users table with authentication
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  subscription_status TEXT DEFAULT 'trial',
  trial_end_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Organizations for multi-tenant support
CREATE TABLE organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  owner_id INTEGER NOT NULL,
  subscription_plan TEXT DEFAULT 'free',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Reviews from various platforms
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  platform TEXT NOT NULL,
  review_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  author_name TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  response_draft TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

### API Structure
```
/api/
├── auth/
│   ├── login/route.ts
│   ├── signup/route.ts
│   └── logout/route.ts
├── dashboard/
│   └── stats/route.ts
├── reviews/
│   ├── route.ts
│   └── [id]/route.ts
├── ai/
│   ├── respond/route.ts
│   └── sentiment/route.ts
└── user/
    ├── profile/route.ts
    └── settings/route.ts
```

### Environment Variables Required
```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=./data/review-pilot.db

# AI Integration (Mock for development)
OPENROUTER_API_KEY=mock-key-for-development

# Stripe (Mock for development)
STRIPE_SECRET_KEY=sk_test_mock-key-for-development
STRIPE_WEBHOOK_SECRET=whsec_mock-key-for-development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock-key-for-development

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:8084
NODE_ENV=development
```

## Next Steps

1. **Fix Environment Variables**: Update .env.local with proper values
2. **Complete Database Queries**: Add missing database query functions
3. **Test Authentication**: Verify login/signup flow works correctly
4. **Implement Dashboard**: Complete dashboard pages with real data
5. **Add AI Features**: Implement mock AI response generation
6. **Testing**: Comprehensive testing of all features

## Success Criteria

- ✅ User can successfully sign up and create an account
- ✅ User can log in with correct credentials
- ✅ Dashboard displays user-specific data
- ✅ Review management system works (CRUD operations)
- ✅ AI response generation provides mock responses
- ✅ All API endpoints return proper responses
- ✅ Error handling provides user-friendly feedback
- ✅ Database operations are reliable and fast

This plan provides a complete roadmap for implementing a full-stack application with SQLite backend, authentication system, and all necessary features for the Review Pilot AI platform.
