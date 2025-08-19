import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is not allowed in production' },
        { status: 403 }
      );
    }

    console.log('🌱 Starting database seeding via API...');
    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      testCredentials: {
        user: {
          email: 'john.smith@example.com',
          password: 'Password123!'
        },
        admin: {
          email: 'admin@example.com',
          password: 'AdminPass123!'
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Seeding API error:', error);

    return NextResponse.json(
      { 
        error: 'Database seeding failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to seed database.' },
    { status: 405 }
  );
}
