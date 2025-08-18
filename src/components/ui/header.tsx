'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 ease-in-out transform hover:scale-105">
            <Image
              src="/rpai_logo.png"
              alt="Review Pilot AI Logo"
              width={40}
              height={40}
              className="w-10 h-10 transition-transform duration-300 hover:rotate-12"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Review Pilot AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105">
              Home
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105">
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 ease-in-out transform hover:scale-105 font-medium"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
