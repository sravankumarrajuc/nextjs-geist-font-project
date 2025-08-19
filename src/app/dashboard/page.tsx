'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardStats {
  totalReviews: number;
  pendingResponses: number;
  averageRating: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentReviews: Array<{
    id: number;
    platform: string;
    rating: number;
    text: string;
    author_name: string;
    sentiment: string;
    created_at: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set mock data for now since API doesn't exist yet
      setStats({
        totalReviews: 247,
        pendingResponses: 12,
        averageRating: 4.2,
        sentimentBreakdown: {
          positive: 156,
          neutral: 67,
          negative: 24
        },
        recentReviews: [
          {
            id: 1,
            platform: 'google',
            rating: 5,
            text: 'Amazing service! The staff was incredibly helpful and the food was delicious. Will definitely be coming back.',
            author_name: 'Sarah Johnson',
            sentiment: 'positive',
            created_at: '2024-01-15T10:30:00Z',
            status: 'pending'
          },
          {
            id: 2,
            platform: 'yelp',
            rating: 2,
            text: 'The wait time was too long and the food was cold when it arrived. Not impressed with the service.',
            author_name: 'Mike Chen',
            sentiment: 'negative',
            created_at: '2024-01-15T09:15:00Z',
            status: 'pending'
          },
          {
            id: 3,
            platform: 'facebook',
            rating: 4,
            text: 'Good experience overall. The atmosphere was nice and the staff was friendly.',
            author_name: 'Emma Davis',
            sentiment: 'positive',
            created_at: '2024-01-14T16:45:00Z',
            status: 'responded'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      google: '🔍',
      yelp: '🍽️',
      facebook: '📘',
      tripadvisor: '✈️',
      trustpilot: '⭐',
      zomato: '🍕'
    };
    return icons[platform] || '📝';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading dashboard data</p>
        <Button onClick={fetchDashboardStats}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your reviews.</p>
        </div>
        <Link href="/dashboard/inbox">
          <Button className="bg-blue-600 hover:bg-blue-700">
            View All Reviews
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            +12% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Responses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingResponses}</p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Needs attention
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            +0.3 from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Reviews</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((stats.sentimentBreakdown.positive / stats.totalReviews) * 100)}%
              </p>
            </div>
            <div className="text-3xl">😊</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.sentimentBreakdown.positive} out of {stats.totalReviews}
          </p>
        </Card>
      </div>

      {/* Sentiment Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{stats.sentimentBreakdown.positive}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.sentimentBreakdown.positive / stats.totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{stats.sentimentBreakdown.neutral}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-400 h-2 rounded-full" 
                  style={{ width: `${(stats.sentimentBreakdown.neutral / stats.totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Negative</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{stats.sentimentBreakdown.negative}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(stats.sentimentBreakdown.negative / stats.totalReviews) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Reviews */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
          <Link href="/dashboard/inbox">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {stats.recentReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPlatformIcon(review.platform)}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {review.platform}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSentimentColor(review.sentiment)}>
                    {review.sentiment}
                  </Badge>
                  <Badge className={getStatusColor(review.status)}>
                    {review.status}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                {review.text}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>By {review.author_name}</span>
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
