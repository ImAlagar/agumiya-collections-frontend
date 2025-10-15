// src/pages/user/UserReviews.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReviews } from '../../contexts/ReviewContext';
import { Star, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react';
import ReviewForm from '../../components/reviews/ReviewForm';

const UserReviews = () => {
  const { userReviews, fetchUserReviews, deleteReview } = useReviews();
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your product reviews and ratings
        </p>
      </div>

      <div className="space-y-6">
        {userReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.status === 'approved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : review.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {review.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {review.title}
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {review.comment}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                  <span>Product: {review.product?.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {review.helpfulCount > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {review.helpfulCount} people found this helpful
              </div>
            )}
          </motion.div>
        ))}

        {userReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't written any reviews yet.
            </p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={editingReview?.productId}
          productName={editingReview?.product?.name}
          onClose={handleCloseForm}
          editReview={editingReview}
        />
      )}
    </div>
  );
};

export default UserReviews;