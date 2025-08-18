'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            AI-Powered Review Management Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Customer Reviews{' '}
            </span>
            Into Business Growth
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Centralize reviews from all platforms, generate AI-powered responses, 
            analyze sentiment, and turn customer feedback into actionable insights 
            that drive your business forward.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-gray-300 text-gray-700 hover:bg-gray-50">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="text-sm text-gray-500 mb-12">
            <p className="mb-2">✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime</p>
            <p>Join 1,000+ businesses already using Review Pilot AI</p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d86c9803-f418-45b3-82f4-61c274f829d7.png" 
                alt="Review Pilot AI Dashboard Interface with modern analytics charts and review management tools"
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
              ⭐ 4.9/5 Rating
            </div>
            <div className="absolute -top-4 -right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
              🚀 AI-Powered
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
              📊 Real-time Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-yellow-200 rounded-full opacity-20"></div>
      </div>
    </section>
  );
}
