import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { initializeDatabaseWithQueries, queries } from '@/lib/db';
import { validateRequest } from '@/lib/validation';
import { z } from 'zod';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

// Initialize database on first request
let dbInitialized = false;

// Validation schema for creating reviews
const createReviewSchema = z.object({
  platform: z.enum(['google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'zomato', 'csv']),
  review_id: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  author_name: z.string().optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  topics: z.string().optional(),
  review_date: z.string().optional()
});

// GET - Fetch reviews for user's organization
export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      initializeDatabaseWithQueries();
      dbInitialized = true;
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const sentiment = searchParams.get('sentiment');

    // Get user's organization
    const organizations = queries.getOrganizationsByUser.all(user.id);
    let organizationId = null;

    if (organizations.length === 0) {
      // Create a default organization for the user
      const result = queries.createOrganization.run(`${user.name}'s Organization`, user.id);
      organizationId = result.lastInsertRowid;
    } else {
      organizationId = organizations[0].id;
    }

    // Build query with filters
    let query = `SELECT * FROM reviews WHERE organization_id = ?`;
    const params: any[] = [organizationId];

    if (platform) {
      query += ` AND platform = ?`;
      params.push(platform);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (sentiment) {
      query += ` AND sentiment = ?`;
      params.push(sentiment);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    // Execute query
    const database = queries.getReviewsByOrganization.database;
    const reviews = database.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM reviews WHERE organization_id = ?`;
    const countParams: any[] = [organizationId];

    if (platform) {
      countQuery += ` AND platform = ?`;
      countParams.push(platform);
    }

    if (status) {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    if (sentiment) {
      countQuery += ` AND sentiment = ?`;
      countParams.push(sentiment);
    }

    const totalResult = database.prepare(countQuery).get(...countParams) as { total: number };
    const total = totalResult.total;

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      initializeDatabaseWithQueries();
      dbInitialized = true;
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(createReviewSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const reviewData = validation.data;

    // Get user's organization
    const organizations = queries.getOrganizationsByUser.all(user.id);
    let organizationId = null;

    if (organizations.length === 0) {
      // Create a default organization for the user
      const result = queries.createOrganization.run(`${user.name}'s Organization`, user.id);
      organizationId = result.lastInsertRowid;
    } else {
      organizationId = organizations[0].id;
    }

    // Create the review
    const result = queries.createReview.run(
      organizationId,
      reviewData.platform,
      reviewData.review_id,
      reviewData.rating,
      reviewData.text || '',
      reviewData.author_name || 'Anonymous',
      reviewData.sentiment || 'neutral',
      reviewData.topics || '',
      reviewData.review_date || new Date().toISOString()
    );

    if (result.lastInsertRowid) {
      const newReview = queries.getReviewById.get(result.lastInsertRowid);
      return NextResponse.json({
        success: true,
        message: 'Review created successfully',
        review: newReview
      }, { status: 201 });
    } else {
      throw new Error('Failed to create review');
    }

  } catch (error: any) {
    console.error('Create review error:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Review already exists for this platform and review ID' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
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
