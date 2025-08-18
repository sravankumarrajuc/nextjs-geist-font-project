import { NextRequest, NextResponse } from 'next/server';
import { signupSchema, validateRequest } from '@/lib/validation';
import { createUser } from '@/lib/auth';
import { initializeDatabaseWithQueries, queries } from '@/lib/db';

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
    const validation = validateRequest(signupSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Create user (this handles the database transaction internally)
    const user = await createUser(email, password, name);
    if (!user) {
      throw new Error('Failed to create user');
    }

    // Create default organization for the user (separate operation)
    let organizationId;
    try {
      const orgResult = queries.createOrganization.run(`${name}'s Organization`, user.id);
      organizationId = orgResult.lastInsertRowid;
    } catch (orgError) {
      console.error('Failed to create organization:', orgError);
      // User was created successfully, but organization creation failed
      // This is not critical for signup, so we'll continue
      organizationId = null;
    }

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_status: user.subscription_status,
        trial_end_date: user.trial_end_date
      },
      organizationId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle specific errors
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
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
