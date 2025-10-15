// src/components/reviews/ReviewForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewContext';

const ReviewForm = ({ productId, productName, onClose, editReview = null }) => {
  const { createReview, updateReview } = useReviews();
  const [formData, setFormData] = useState({
    rating: editReview?.rating || 0,
    title: editReview?.title || '',
    comment: editReview?.comment || '',
    productId: productId
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.title.trim() || !formData.comment.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editReview) {
        await updateReview(editReview.id, formData);
      } else {
        await createReview(formData);
      }
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= (hoverRating || formData.rating);
      return (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingClick(star)}
          onMouseEnter={() => handleRatingHover(star)}
          onMouseLeave={handleRatingLeave}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              isFilled
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editReview ? 'Edit Review' : 'Write a Review'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {productName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {renderStars()}
              <span className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                {formData.rating > 0 && `${formData.rating}.0`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Review Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Your Review *
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts about the product..."
              maxLength={1000}
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.comment.length}/1000
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? 'Submitting...' : editReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;