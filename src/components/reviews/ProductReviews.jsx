// src/components/reviews/ProductReviews.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReviews } from '../../contexts/ReviewContext';
import { Star, ThumbsUp, MessageCircle, Calendar, User, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductReviews = ({ productId }) => {
  const { 
    productReviews, 
    productStats, 
    loading, 
    error,
    fetchProductReviews,
    toggleHelpfulVote 
  } = useReviews();

  const [filters, setFilters] = useState({
    sortBy: 'helpful',
    rating: 'all',
    page: 1,
    limit: 5
  });

  const reviews = productReviews[productId] || [];
  const stats = productStats[productId] || {};

  useEffect(() => {
    const loadReviews = async () => {
      try {
        await fetchProductReviews(productId, filters);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId, filters.sortBy, filters.rating, filters.page, filters.limit]);

  // Safe data extraction with fallbacks
  const ratingDistribution = stats.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const averageRating = stats.averageRating || 0;
  const totalReviews = stats.totalReviews || 0;

  const getRatingDistribution = () => {
    return [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: ratingDistribution[rating] || 0,
      percentage: totalReviews ? ((ratingDistribution[rating] || 0) / totalReviews) * 100 : 0
    }));
  };

const handleHelpfulClick = async (reviewId, e) => {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    
    const response = await toggleHelpfulVote(reviewId);
    
    if (response && !response.success) {
      console.warn('⚠️ Helpful vote API returned success: false', response.message);
      // You can show a user-friendly message here
      // toast.error(response.message || 'Failed to update helpful vote');
    }
  } catch (error) {
    console.error('💥 Helpful vote action failed:', error);
    // You can show a user-friendly message here
    // toast.error('Failed to update helpful vote. Please try again.');
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating, size = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Error handling
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Failed to Load Reviews
          </h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-4">
          {error.includes('422') 
            ? 'There was a validation error loading reviews. Please try again.'
            : error
          }
        </p>
        <button
          onClick={() => fetchProductReviews(productId, filters)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating), 'md')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Rating Distribution</h4>
          <div className="space-y-2">
            {getRatingDistribution().map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-4">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      {(reviews.length > 0 || loading) && (
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="helpful">Most Helpful</option>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value, page: 1 }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading && reviews.length === 0 ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-32"></div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.user?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          {renderStars(review.rating)}
                          <span>•</span>
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                    onClick={(e) => handleHelpfulClick(review.id, e)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                        review.hasVoted 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    >
                    <ThumbsUp className={`w-4 h-4 ${review.hasVoted ? 'fill-current' : ''}`} />
                    <span>
                        {review.hasVoted ? 'Helpful' : 'Helpful'} ({review.helpfulCount || 0})
                    </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {reviews.length === 0 && !loading && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Be the first to review this product!
                </p>
                <Link to={'/shop'} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Write a Review
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;