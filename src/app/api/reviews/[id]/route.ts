import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { initializeDatabaseWithQueries, queries } from '@/lib/db';
import { validateRequest } from '@/lib/validation';
import { z } from 'zod';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

// Initialize database on first request
let dbInitialized = false;

// Validation schema for updating reviews
const updateReviewSchema = z.object({
  response_draft: z.string().optional(),
  status: z.enum(['pending', 'responded', 'ignored', 'flagged']).optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  sentiment_score: z.number().min(-1).max(1).optional(),
  topics: z.string().optional()
});

// GET - Fetch a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    // Get the review
    const review = queries.getReviewById.get(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify user owns this review (through organization)
    const organizations = queries.getOrganizationsByUser.all(user.id);
    const userOrganizationIds = organizations.map((org: any) => org.id);
    
    if (!userOrganizationIds.includes(review.organization_id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ review });

  } catch (error: any) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(updateReviewSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Get the review to verify ownership
    const review = queries.getReviewById.get(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify user owns this review (through organization)
    const organizations = queries.getOrganizationsByUser.all(user.id);
    const userOrganizationIds = organizations.map((org: any) => org.id);
    
    if (!userOrganizationIds.includes(review.organization_id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update response and status if provided
    if (updateData.response_draft !== undefined || updateData.status !== undefined) {
      queries.updateReviewResponse.run(
        updateData.response_draft || review.response_draft,
        updateData.status || review.status,
        reviewId
      );
    }

    // Update sentiment data if provided
    if (updateData.sentiment !== undefined || updateData.sentiment_score !== undefined || updateData.topics !== undefined) {
      queries.updateReviewSentiment.run(
        updateData.sentiment || review.sentiment,
        updateData.sentiment_score !== undefined ? updateData.sentiment_score : review.sentiment_score,
        updateData.topics || review.topics,
        reviewId
      );
    }

    // Get updated review
    const updatedReview = queries.getReviewById.get(reviewId);

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error: any) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    // Get the review to verify ownership
    const review = queries.getReviewById.get(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify user owns this review (through organization)
    const organizations = queries.getOrganizationsByUser.all(user.id);
    const userOrganizationIds = organizations.map((org: any) => org.id);
    
    if (!userOrganizationIds.includes(review.organization_id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete the review
    const database = queries.getReviewById.database;
    const deleteResult = database.prepare('DELETE FROM reviews WHERE id = ?').run(reviewId);

    if (deleteResult.changes === 0) {
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
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
