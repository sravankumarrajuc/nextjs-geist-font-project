import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queries } from './db';

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  subscription_status: string;
  trial_end_date: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithPassword extends User {
  password_hash: string | null;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// User authentication
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = queries.getUserByEmail.get(email) as UserWithPassword | undefined;
    
    if (!user || !user.password_hash) {
      return null;
    }
    
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return null;
    }
    
    // Remove password hash from returned user object
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// User creation
export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = queries.getUserByEmail.get(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const result = queries.createUser.run(email, hashedPassword, name);
    
    if (result.lastInsertRowid) {
      const newUser = queries.getUserById.get(result.lastInsertRowid) as UserWithPassword;
      const { password_hash, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}

// Trial period utilities
export function isTrialActive(user: User): boolean {
  if (!user.trial_end_date) {
    return false;
  }
  
  const trialEndDate = new Date(user.trial_end_date);
  const now = new Date();
  
  return now < trialEndDate;
}

export function getTrialDaysRemaining(user: User): number {
  if (!user.trial_end_date) {
    return 0;
  }
  
  const trialEndDate = new Date(user.trial_end_date);
  const now = new Date();
  
  if (now >= trialEndDate) {
    return 0;
  }
  
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

export function hasActiveSubscription(user: User): boolean {
  return user.subscription_status === 'active';
}

export function canAccessFeature(user: User, feature: string): boolean {
  // During trial period, allow access to all features
  if (isTrialActive(user)) {
    return true;
  }
  
  // After trial, check subscription status
  if (hasActiveSubscription(user)) {
    return true;
  }
  
  // Free features (always accessible)
  const freeFeatures = ['view_reviews', 'basic_analytics'];
  return freeFeatures.includes(feature);
}

// Role-based access control (RBAC)
export function hasRole(user: User, requiredRole: string): boolean {
  const roleHierarchy = {
    'user': 0,
    'manager': 1,
    'admin': 2
  };
  
  const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] ?? 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 0;
  
  return userRoleLevel >= requiredRoleLevel;
}

export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

export function isManager(user: User): boolean {
  return user.role === 'manager' || user.role === 'admin';
}

// Session utilities
export function createSession(user: User): { token: string; user: User } {
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });
  
  return { token, user };
}

// Extract user from request headers
export function getUserFromToken(authHeader: string | null): User | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  try {
    const user = queries.getUserById.get(payload.userId) as UserWithPassword | undefined;
    if (!user) {
      return null;
    }
    
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return null;
  }
}

// Social login utilities
export function createSocialUser(email: string, name: string, provider: 'google' | 'facebook', providerId: string): Promise<User | null> {
  // This will be implemented when we add social login endpoints
  // For now, create a user without password (social login only)
  return new Promise((resolve) => {
    try {
      // Check if user exists
      const existingUser = queries.getUserByEmail.get(email);
      if (existingUser) {
        resolve(existingUser as User);
        return;
      }
      
      // Create new social user (no password required)
      const result = queries.createUser.run(email, null, name);
      
      if (result.lastInsertRowid) {
        const newUser = queries.getUserById.get(result.lastInsertRowid) as UserWithPassword;
        const { password_hash, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error('Social user creation error:', error);
      resolve(null);
    }
  });
}

// Utility to check if user needs to upgrade
export function needsUpgrade(user: User): boolean {
  return !isTrialActive(user) && !hasActiveSubscription(user);
}

// Rate limiting check
export function checkRateLimit(user: User, feature: string): boolean {
  // Basic rate limiting logic
  // In production, this would check against usage_tracking table
  
  if (isTrialActive(user)) {
    // Trial users have limited usage
    const trialLimits = {
      'ai_response': 50,
      'sentiment_analysis': 100,
      'review_sync': 10
    };
    
    // This would check actual usage from database
    return true; // Simplified for now
  }
  
  if (hasActiveSubscription(user)) {
    // Paid users have higher limits based on plan
    return true;
  }
  
  // Free users have very limited access
  return false;
}

export default {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  authenticateUser,
  createUser,
  isTrialActive,
  getTrialDaysRemaining,
  hasActiveSubscription,
  canAccessFeature,
  hasRole,
  isAdmin,
  isManager,
  createSession,
  getUserFromToken,
  createSocialUser,
  needsUpgrade,
  checkRateLimit
};
