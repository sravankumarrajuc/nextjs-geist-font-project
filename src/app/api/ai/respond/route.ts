import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { initializeDatabaseWithQueries, queries } from '@/lib/db';
import { validateRequest } from '@/lib/validation';
import { z } from 'zod';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

// Initialize database on first request
let dbInitialized = false;

// Validation schema for AI response generation
const aiResponseSchema = z.object({
  reviewId: z.number().optional(),
  reviewText: z.string(),
  rating: z.number().min(1).max(5),
  platform: z.string(),
  tone: z.enum(['professional', 'friendly', 'formal', 'casual']).default('professional'),
  businessName: z.string().optional(),
  customInstructions: z.string().optional()
});

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
    const validation = validateRequest(aiResponseSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { reviewText, rating, platform, tone, businessName, customInstructions } = validation.data;

    // Check if user has access to AI features (trial or subscription)
    // This would normally check usage limits and subscription status
    // For now, we'll allow it for all users

    // Generate AI response using OpenRouter (mock implementation for now)
    const aiResponse = await generateAIResponse({
      reviewText,
      rating,
      platform,
      tone: tone || 'professional',
      businessName: businessName || `${user.name}'s Business`,
      customInstructions
    });

    // If reviewId is provided, update the review with the generated response
    if (validation.data.reviewId) {
      try {
        queries.updateReviewResponse.run(
          aiResponse,
          'pending', // Keep as pending until user saves it
          validation.data.reviewId
        );
      } catch (error) {
        console.error('Error updating review with AI response:', error);
        // Continue anyway, just return the response
      }
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      usage: {
        tokensUsed: aiResponse.length, // Simplified usage tracking
        remainingCredits: 100 // Mock remaining credits
      }
    });

  } catch (error: any) {
    console.error('AI response generation error:', error);
    
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'AI usage quota exceeded. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

// Mock AI response generation function
// In production, this would call OpenRouter API with Claude
async function generateAIResponse({
  reviewText,
  rating,
  platform,
  tone,
  businessName,
  customInstructions
}: {
  reviewText: string;
  rating: number;
  platform: string;
  tone: string;
  businessName: string;
  customInstructions?: string;
}): Promise<string> {
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Determine sentiment and response approach
  const isPositive = rating >= 4;
  const isNeutral = rating === 3;
  const isNegative = rating <= 2;

  let response = '';

  if (isPositive) {
    // Positive review response
    const positiveResponses = [
      `Thank you so much for your wonderful review! We're thrilled to hear that you had such a positive experience with ${businessName}. Your feedback means the world to us and motivates our team to continue providing excellent service. We look forward to serving you again soon!`,
      
      `We're absolutely delighted by your ${rating}-star review! It's fantastic to know that we exceeded your expectations. At ${businessName}, we're committed to delivering exceptional experiences, and your kind words confirm we're on the right track. Thank you for choosing us!`,
      
      `Your glowing review has made our day! We're so pleased that you enjoyed your experience with ${businessName}. Our team works hard to provide outstanding service, and it's incredibly rewarding to see that reflected in your feedback. We can't wait to welcome you back!`
    ];
    
    response = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
  } else if (isNeutral) {
    // Neutral review response
    const neutralResponses = [
      `Thank you for taking the time to share your feedback about ${businessName}. We appreciate your honest review and are always looking for ways to improve our service. We'd love the opportunity to exceed your expectations on your next visit. Please don't hesitate to reach out if there's anything specific we can do better.`,
      
      `We appreciate your review and are glad you chose ${businessName}. While we're pleased you had a decent experience, we're always striving to do better. Your feedback helps us identify areas for improvement. We hope to have the chance to provide you with an even better experience next time!`,
      
      `Thank you for your feedback about your experience with ${businessName}. We value all reviews as they help us grow and improve. We'd welcome the opportunity to discuss your visit further and show you the improvements we've been making. Please feel free to contact us directly.`
    ];
    
    response = neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  } else {
    // Negative review response
    const negativeResponses = [
      `Thank you for bringing your concerns to our attention. We sincerely apologize that your experience with ${businessName} didn't meet your expectations. Your feedback is invaluable in helping us improve our service. We'd appreciate the opportunity to discuss this further and make things right. Please contact us directly so we can address your concerns properly.`,
      
      `We're truly sorry to hear about your disappointing experience at ${businessName}. This is not the level of service we strive to provide, and we take your feedback very seriously. We'd like to learn more about what went wrong and work to resolve this issue. Please reach out to us directly so we can make this right.`,
      
      `We apologize for falling short of your expectations during your visit to ${businessName}. Your feedback is crucial for our improvement, and we're committed to addressing the issues you've raised. We'd value the opportunity to speak with you directly to understand how we can do better and regain your trust.`
    ];
    
    response = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
  }

  // Adjust tone if specified
  if (tone === 'formal') {
    response = response.replace(/We're/g, 'We are').replace(/can't/g, 'cannot').replace(/don't/g, 'do not');
  } else if (tone === 'casual') {
    response = response.replace(/We are/g, "We're").replace(/cannot/g, "can't").replace(/do not/g, "don't");
    response += ' 😊';
  } else if (tone === 'friendly') {
    response += ' Have a wonderful day!';
  }

  // Add custom instructions if provided
  if (customInstructions) {
    response += `\n\n${customInstructions}`;
  }

  return response;
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
