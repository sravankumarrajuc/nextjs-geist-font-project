import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database configuration
const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'review-pilot.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new Database(DB_PATH);

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Database initialization
export function initializeDatabase() {
  try {
    // Read and execute migration file
    const migrationPath = path.join(process.cwd(), 'src', 'lib', 'migrations', '001_initial.sql');
    
    if (fs.existsSync(migrationPath)) {
      const migration = fs.readFileSync(migrationPath, 'utf8');
      db.exec(migration);
      console.log('Database initialized successfully');
    } else {
      console.warn('Migration file not found, creating basic tables');
      createBasicTables();
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Fallback table creation
function createBasicTables() {
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      subscription_status TEXT DEFAULT 'trial',
      trial_end_date DATETIME,
      stripe_customer_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      subscription_plan TEXT DEFAULT 'free',
      billing_status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      review_id TEXT NOT NULL,
      rating INTEGER,
      text TEXT,
      sentiment TEXT,
      topics TEXT,
      response_draft TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      stripe_subscription_id TEXT,
      plan_type TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      current_period_end DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      encrypted_key TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_reviews_organization ON reviews(organization_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
  `;
  
  db.exec(createTables);
}

// Database query helpers
export const queries = {
  // User queries
  createUser: db.prepare(`
    INSERT INTO users (email, password_hash, name, trial_end_date)
    VALUES (?, ?, ?, datetime('now', '+14 days'))
  `),
  
  getUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  
  getUserById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),
  
  updateUser: db.prepare(`
    UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  // Organization queries
  createOrganization: db.prepare(`
    INSERT INTO organizations (name, owner_id) VALUES (?, ?)
  `),
  
  getOrganizationsByUser: db.prepare(`
    SELECT * FROM organizations WHERE owner_id = ?
  `),
  
  // Review queries
  createReview: db.prepare(`
    INSERT INTO reviews (organization_id, platform, review_id, rating, text, sentiment, topics)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  getReviewsByOrganization: db.prepare(`
    SELECT * FROM reviews WHERE organization_id = ? ORDER BY created_at DESC
  `),
  
  updateReviewResponse: db.prepare(`
    UPDATE reviews SET response_draft = ?, status = ? WHERE id = ?
  `),
  
  // Subscription queries
  createSubscription: db.prepare(`
    INSERT INTO subscriptions (user_id, stripe_subscription_id, plan_type, current_period_end)
    VALUES (?, ?, ?, ?)
  `),
  
  getSubscriptionByUser: db.prepare(`
    SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'
  `),
  
  updateSubscriptionStatus: db.prepare(`
    UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?
  `)
};

// Transaction helper
export function transaction<T>(fn: () => T): T {
  const txn = db.transaction(fn);
  return txn();
}

// Close database connection
export function closeDatabase() {
  db.close();
}

export default db;
