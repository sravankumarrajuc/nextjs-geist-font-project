import { NextRequest, NextResponse } from 'next/server';
import { loginSchema, validateRequest } from '@/lib/validation';
import { authenticateUser, createSession } from '@/lib/auth';
import { initializeDatabaseWithQueries } from '@/lib/db';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

// Initialize database on first request
let dbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      initializeDatabaseWithQueries();
      dbInitialized = true;
    }

    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const validation = validateRequest(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Authenticate user
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = createSession(user);

    // Set HTTP-only cookie for additional security (optional)
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_status: user.subscription_status,
        trial_end_date: user.trial_end_date
      },
      token: session.token
    });

    // Set secure cookie
    response.cookies.set('auth-token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
