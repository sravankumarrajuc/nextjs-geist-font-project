import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/api/ai',
  '/api/subscription',
  '/api/platforms',
  '/api/import'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/api/auth'
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('auth-token')?.value;
  const token = authHeader?.replace('Bearer ', '') || cookieToken;

  // If no token and route is protected, redirect to login
  if (isProtectedRoute && !token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it (but don't fetch user from database here)
  if (token) {
    const payload = verifyToken(token);
    
    if (!payload) {
      // Invalid token
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // Redirect to login for web pages
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      
      // Clear invalid cookie
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
      });
      
      return response;
    }

    // Check admin routes
    if (isAdminRoute && payload.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId.toString());
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-role', payload.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });
    }

    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
