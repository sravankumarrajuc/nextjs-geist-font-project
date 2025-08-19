'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Review {
  id: number;
  platform: string;
  rating: number;
  text: string;
  author_name: string;
  sentiment: string;
  created_at: string;
  status: string;
  response_draft?: string;
  review_date: string;
}

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function InboxPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    sentiment: ''
  });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [generatingResponse, setGeneratingResponse] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.platform && { platform: filters.platform }),
        ...(filters.status && { status: filters.status }),
        ...(filters.sentiment && { sentiment: filters.sentiment })
      });

      const response = await fetch(`/api/reviews?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data: ReviewsResponse = await response.json();
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const openResponseModal = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response_draft || '');
  };

  const closeResponseModal = () => {
    setSelectedReview(null);
    setResponseText('');
  };

  const generateAIResponse = async () => {
    if (!selectedReview) return;

    try {
      setGeneratingResponse(true);
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch('/api/ai/respond', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId: selectedReview.id,
          reviewText: selectedReview.text,
          rating: selectedReview.rating,
          platform: selectedReview.platform,
          tone: 'professional'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI response');
      }

      const data = await response.json();
      setResponseText(data.response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      alert('Failed to generate AI response. Please try again.');
    } finally {
      setGeneratingResponse(false);
    }
  };

  const saveResponse = async () => {
    if (!selectedReview) return;

    try {
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          response_draft: responseText,
          status: 'responded'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save response');
      }

      // Update the review in the local state
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id 
          ? { ...review, response_draft: responseText, status: 'responded' }
          : review
      ));

      closeResponseModal();
    } catch (error) {
      console.error('Error saving response:', error);
      alert('Failed to save response. Please try again.');
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
      case 'ignored':
        return 'bg-gray-100 text-gray-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Inbox</h1>
          <p className="text-gray-600">Manage and respond to customer reviews</p>
        </div>
        <div className="text-sm text-gray-500">
          {pagination.total} total reviews
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Platforms</option>
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="facebook">Facebook</option>
              <option value="tripadvisor">TripAdvisor</option>
              <option value="trustpilot">Trustpilot</option>
              <option value="zomato">Zomato</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="ignored">Ignored</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sentiment
            </label>
            <select
              value={filters.sentiment}
              onChange={(e) => handleFilterChange('sentiment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      {error ? (
        <Card className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchReviews}>Retry</Button>
        </Card>
      ) : reviews.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">No reviews found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or import some reviews to get started.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPlatformIcon(review.platform)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 capitalize">
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
                    <p className="text-sm text-gray-600">
                      By {review.author_name} • {formatDate(review.review_date)}
                    </p>
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

              <p className="text-gray-700 mb-4">{review.text}</p>

              {review.response_draft && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-blue-800 mb-1">Draft Response:</p>
                  <p className="text-sm text-blue-700">{review.response_draft}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Created {formatDate(review.created_at)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openResponseModal(review)}
                  >
                    {review.response_draft ? 'Edit Response' : 'Respond'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Respond to Review
                </h2>
                <button
                  onClick={closeResponseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Review Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getPlatformIcon(selectedReview.platform)}</span>
                  <span className="font-medium capitalize">{selectedReview.platform}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{selectedReview.text}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By {selectedReview.author_name}
                </p>
              </div>

              {/* Response Textarea */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your response here..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={generateAIResponse}
                  disabled={generatingResponse}
                >
                  {generatingResponse ? 'Generating...' : '🤖 Generate AI Response'}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={closeResponseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveResponse}
                    disabled={!responseText.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Response
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
