import Database from 'better-sqlite3';

// Database configuration - avoid using Node.js modules at module level
let db: Database.Database | null = null;
let dbInitialized = false;

// Get database path
function getDatabasePath(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Use a simple relative path for development
  return './data/review-pilot.db';
}

// Get database connection
function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = getDatabasePath();
    
    // Create data directory if it doesn't exist (only in Node.js runtime)
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }
    
    db = new Database(dbPath);
    
    // Enable foreign keys and WAL mode for better performance
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
  }
  
  return db;
}

// Database initialization
export function initializeDatabase() {
  try {
    const database = getDatabase();
    
    // Try to read migration file, fallback to inline SQL
    let migrationSQL = '';
    
    if (typeof require !== 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const migrationPath = path.join(process.cwd(), 'src', 'lib', 'migrations', '001_initial.sql');
        
        if (fs.existsSync(migrationPath)) {
          migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        }
      } catch (error) {
        console.warn('Could not read migration file, using fallback SQL');
      }
    }
    
    // Fallback to inline SQL if migration file couldn't be read
    if (!migrationSQL) {
      migrationSQL = getInlineMigrationSQL();
    }
    
    database.exec(migrationSQL);
    dbInitialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Inline migration SQL as fallback
function getInlineMigrationSQL(): string {
  return `
    -- Users table for authentication and user management
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
      subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
      trial_end_date DATETIME,
      stripe_customer_id TEXT,
      google_id TEXT,
      facebook_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Organizations table for multi-tenant support
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'starter', 'professional', 'enterprise')),
      billing_status TEXT DEFAULT 'active' CHECK (billing_status IN ('active', 'past_due', 'cancelled', 'unpaid')),
      settings TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Reviews table for storing all review data
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      platform TEXT NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'zomato', 'csv')),
      review_id TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      text TEXT,
      author_name TEXT,
      author_avatar TEXT,
      sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
      sentiment_score REAL,
      topics TEXT,
      entities TEXT,
      response_draft TEXT,
      response_published TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'ignored', 'flagged')),
      review_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      UNIQUE(organization_id, platform, review_id)
    );

    -- Subscriptions table for Stripe integration
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      stripe_subscription_id TEXT UNIQUE,
      stripe_customer_id TEXT,
      plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
      current_period_start DATETIME,
      current_period_end DATETIME,
      cancel_at_period_end BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
    CREATE INDEX IF NOT EXISTS idx_users_trial_end ON users(trial_end_date);
    CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_organization ON reviews(organization_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
    CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

    -- Create triggers for updated_at timestamps
    CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

    CREATE TRIGGER IF NOT EXISTS update_organizations_timestamp 
      AFTER UPDATE ON organizations
      BEGIN
        UPDATE organizations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

    CREATE TRIGGER IF NOT EXISTS update_reviews_timestamp 
      AFTER UPDATE ON reviews
      BEGIN
        UPDATE reviews SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

    CREATE TRIGGER IF NOT EXISTS update_subscriptions_timestamp 
      AFTER UPDATE ON subscriptions
      BEGIN
        UPDATE subscriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
  `;
}

// Database query helpers
export const queries = {
  // User queries
  createUser: null as any,
  getUserByEmail: null as any,
  getUserById: null as any,
  updateUser: null as any,
  
  // Organization queries
  createOrganization: null as any,
  getOrganizationsByUser: null as any,
  
  // Review queries
  createReview: null as any,
  getReviewsByOrganization: null as any,
  updateReviewResponse: null as any,
  
  // Subscription queries
  createSubscription: null as any,
  getSubscriptionByUser: null as any,
  updateSubscriptionStatus: null as any
};

// Initialize queries after database is ready
function initializeQueries() {
  const database = getDatabase();
  
  // User queries
  queries.createUser = database.prepare(`
    INSERT INTO users (email, password_hash, name, trial_end_date)
    VALUES (?, ?, ?, datetime('now', '+14 days'))
  `);
  
  queries.getUserByEmail = database.prepare(`
    SELECT * FROM users WHERE email = ?
  `);
  
  queries.getUserById = database.prepare(`
    SELECT * FROM users WHERE id = ?
  `);
  
  queries.updateUser = database.prepare(`
    UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `);
  
  // Organization queries
  queries.createOrganization = database.prepare(`
    INSERT INTO organizations (name, owner_id) VALUES (?, ?)
  `);
  
  queries.getOrganizationsByUser = database.prepare(`
    SELECT * FROM organizations WHERE owner_id = ?
  `);
  
  // Review queries
  queries.createReview = database.prepare(`
    INSERT INTO reviews (organization_id, platform, review_id, rating, text, sentiment, topics)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  queries.getReviewsByOrganization = database.prepare(`
    SELECT * FROM reviews WHERE organization_id = ? ORDER BY created_at DESC
  `);
  
  queries.updateReviewResponse = database.prepare(`
    UPDATE reviews SET response_draft = ?, status = ? WHERE id = ?
  `);
  
  // Subscription queries
  queries.createSubscription = database.prepare(`
    INSERT INTO subscriptions (user_id, stripe_subscription_id, plan_type, current_period_end)
    VALUES (?, ?, ?, ?)
  `);
  
  queries.getSubscriptionByUser = database.prepare(`
    SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'
  `);
  
  queries.updateSubscriptionStatus = database.prepare(`
    UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?
  `);
}

// Enhanced initialization that sets up both database and queries
export function initializeDatabaseWithQueries() {
  if (!dbInitialized) {
    initializeDatabase();
    initializeQueries();
  }
}

// Transaction helper
export function transaction<T>(fn: () => T): T {
  const database = getDatabase();
  const txn = database.transaction(fn);
  return txn();
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    dbInitialized = false;
  }
}

export default getDatabase;
