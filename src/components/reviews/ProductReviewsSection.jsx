import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/api/reviewService';
import { StarRating } from './StarRating';
import { useAuth } from '../../contexts/AuthProvider';
import { CreateReviewModal } from './CreateReviewModal';
import { useTheme } from '../../contexts/ThemeContext';

const ProductReviewsSection = ({ productId }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    rating: '',
    sortBy: 'recent',
    page: 1,
    limit: 5
  });

  useEffect(() => {
    fetchProductReviews();
  }, [productId, filters.rating, filters.sortBy, filters.page]);

  const fetchProductReviews = async () => {
    setLoading(true);
    const result = await reviewService.getProductReviews(productId, filters);
    if (result.success) {
      setReviews(result.data.reviews);
      setSummary(result.data.summary);
    }
    setLoading(false);
  };

  const handleHelpfulVote = async (reviewId, isHelpful) => {
    if (!user) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    const result = await reviewService.markHelpful(reviewId, isHelpful);
    if (result.success) {
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, isHelpful: result.data.helpfulCount }
          : review
      ));
    }
  };

  const handleReportReview = async (reviewId, reason) => {
    if (!user) {
      alert('Please login to report reviews');
      return;
    }

    const result = await reviewService.reportReview(reviewId, reason);
    if (result.success) {
      alert('Review reported successfully');
    } else {
      alert(result.message);
    }
  };

  const ratingDistribution = summary?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const totalReviews = summary?.totalReviews || 0;

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Customer Reviews
        </h3>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Summary */}
      {summary && totalReviews > 0 && (
        <div className={`rounded-lg p-6 mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {summary.averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(summary.averageRating)} />
              <div className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5,4,3,2,1].map(rating => {
                const count = ratingDistribution[rating] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className={`text-sm w-12 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {rating} star
                    </span>
                    <div className={`flex-1 rounded-full h-2 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm w-12 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {totalReviews > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          <select 
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value, page: 1 }))}
            className={`border rounded-lg px-3 py-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Ratings</option>
            {[5,4,3,2,1].map(rating => (
              <option key={rating} value={rating}>
                {rating} Star{rating !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
          
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
            className={`border rounded-lg px-3 py-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className={`text-center py-8 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-6xl mb-4">📝</div>
            <h4 className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No reviews yet
            </h4>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {totalReviews === 0 
                ? "Be the first to review this product!" 
                : "No reviews match your current filters."
              }
            </p>
            {user && totalReviews === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Write First Review
              </button>
            )}
          </div>
        ) : (
          <>
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpfulVote={handleHelpfulVote}
                onReport={handleReportReview}
                currentUserId={user?.id}
              />
            ))}

            {/* Pagination */}
            {summary && summary.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={filters.page === 1}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Previous
                </button>
                
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Page {filters.page} of {summary.totalPages}
                </span>
                
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={filters.page === summary.totalPages}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Review Modal */}
      {showCreateModal && (
        <CreateReviewModal
          productId={productId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchProductReviews();
          }}
        />
      )}
    </div>
  );
};

export default ProductReviewsSection;