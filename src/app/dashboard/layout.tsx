'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  subscription_status: string;
  trial_end_date: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
      return;
    }

    // Decode JWT to get user info (simple decode, verification happens on server)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.userId,
        email: payload.email,
        name: payload.name || payload.email,
        role: payload.role,
        subscription_status: 'trial', // This would come from API call
        trial_end_date: null // This would come from API call
      });
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('auth-token');
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      router.push('/');
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Inbox', href: '/dashboard/inbox', icon: '📥' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const isTrialUser = user.subscription_status === 'trial';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">Review Pilot AI</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Trial Banner */}
          {isTrialUser && (
            <div className="mx-4 mt-4">
              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Free Trial
                    </Badge>
                    <p className="text-sm text-blue-700 mt-1">
                      14 days remaining
                    </p>
                  </div>
                  <Link href="/dashboard/billing">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Upgrade
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="w-10"></div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
