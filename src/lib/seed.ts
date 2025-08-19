import { initializeDatabaseWithQueries, queries, transaction } from './db';
import { hashPassword } from './auth';

// Sample data for seeding
const sampleUsers = [
  {
    email: 'john.smith@example.com',
    password: 'Password123!',
    name: 'John Smith',
    role: 'user'
  },
  {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    name: 'Admin User',
    role: 'admin'
  }
];

const sampleReviews = [
  {
    platform: 'google',
    review_id: 'google_001',
    rating: 5,
    text: 'Excellent service! The staff was very friendly and the food was amazing. Will definitely come back.',
    author_name: 'Sarah Johnson',
    sentiment: 'positive',
    topics: JSON.stringify(['service', 'staff', 'food']),
    review_date: new Date('2024-01-15').toISOString()
  },
  {
    platform: 'yelp',
    review_id: 'yelp_001',
    rating: 2,
    text: 'The wait time was too long and the food was cold when it arrived. Not impressed.',
    author_name: 'Mike Davis',
    sentiment: 'negative',
    topics: JSON.stringify(['wait time', 'food temperature']),
    review_date: new Date('2024-01-10').toISOString()
  },
  {
    platform: 'facebook',
    review_id: 'fb_001',
    rating: 4,
    text: 'Good experience overall. The atmosphere was nice and the service was decent.',
    author_name: 'Emily Chen',
    sentiment: 'positive',
    topics: JSON.stringify(['atmosphere', 'service']),
    review_date: new Date('2024-01-12').toISOString()
  },
  {
    platform: 'tripadvisor',
    review_id: 'ta_001',
    rating: 3,
    text: 'Average experience. Nothing special but not bad either.',
    author_name: 'Robert Wilson',
    sentiment: 'neutral',
    topics: JSON.stringify(['experience']),
    review_date: new Date('2024-01-08').toISOString()
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database and queries
    initializeDatabaseWithQueries();
    
    await transaction(async () => {
      // Seed users
      console.log('👤 Seeding users...');
      for (const userData of sampleUsers) {
        try {
          // Check if user already exists
          const existingUser = queries.getUserByEmail.get(userData.email);
          if (existingUser) {
            console.log(`   ⚠️  User ${userData.email} already exists, skipping...`);
            continue;
          }
          
          // Hash password and create user
          const hashedPassword = await hashPassword(userData.password);
          const result = queries.createUser.run(
            userData.email,
            hashedPassword,
            userData.name
          );
          
          if (result.lastInsertRowid) {
            console.log(`   ✅ Created user: ${userData.email}`);
            
            // Create default organization for each user
            const orgResult = queries.createOrganization.run(
              `${userData.name}'s Organization`,
              result.lastInsertRowid
            );
            
            if (orgResult.lastInsertRowid) {
              console.log(`   🏢 Created organization for ${userData.name}`);
              
              // Add sample reviews for the first user
              if (userData.email === 'john.smith@example.com') {
                console.log('📝 Seeding sample reviews...');
                for (const reviewData of sampleReviews) {
                  try {
                    queries.createReview.run(
                      orgResult.lastInsertRowid,
                      reviewData.platform,
                      reviewData.review_id,
                      reviewData.rating,
                      reviewData.text,
                      reviewData.author_name,
                      reviewData.sentiment,
                      reviewData.topics,
                      reviewData.review_date
                    );
                    console.log(`   ✅ Created ${reviewData.platform} review from ${reviewData.author_name}`);
                  } catch (error) {
                    console.log(`   ⚠️  Review ${reviewData.review_id} already exists, skipping...`);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`   ❌ Error creating user ${userData.email}:`, error);
        }
      }
    });
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: john.smith@example.com');
    console.log('   Password: Password123!');
    console.log('\n   Admin Email: admin@example.com');
    console.log('   Admin Password: AdminPass123!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
