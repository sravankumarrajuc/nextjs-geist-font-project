import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { initializeDatabaseWithQueries, queries } from '@/lib/db';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

// Initialize database on first request
let dbInitialized = false;

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

    // Get user's organization (for now, assume user has one organization)
    const organizations = queries.getOrganizationsByUser.all(user.id);
    let organizationId = null;

    if (organizations.length === 0) {
      // Create a default organization for the user
      const result = queries.createOrganization.run(`${user.name}'s Organization`, user.id);
      organizationId = result.lastInsertRowid;
    } else {
      organizationId = organizations[0].id;
    }

    // Get review statistics
    const stats = queries.getReviewStats.get(organizationId) || {
      total_reviews: 0,
      average_rating: 0,
      pending_responses: 0,
      positive_count: 0,
      neutral_count: 0,
      negative_count: 0
    };

    // Get recent reviews
    const recentReviews = queries.getRecentReviews.all(organizationId, 5);

    // Format the response
    const dashboardStats = {
      totalReviews: stats.total_reviews || 0,
      pendingResponses: stats.pending_responses || 0,
      averageRating: parseFloat((stats.average_rating || 0).toFixed(1)),
      sentimentBreakdown: {
        positive: stats.positive_count || 0,
        neutral: stats.neutral_count || 0,
        negative: stats.negative_count || 0
      },
      recentReviews: recentReviews.map((review: any) => ({
        id: review.id,
        platform: review.platform,
        rating: review.rating,
        text: review.text,
        author_name: review.author_name,
        sentiment: review.sentiment || 'neutral',
        created_at: review.created_at,
        status: review.status
      }))
    };

    return NextResponse.json(dashboardStats);

  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
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
