import React, { useState } from 'react';
import { reviewService } from '../../services/api/reviewService';
import { StarRating } from './StarRating';

export const EditReviewModal = ({ review, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    rating: review.rating,
    title: review.title || '',
    comment: review.comment,
    images: review.images || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rating) {
      setError('Please select a rating');
      return;
    }

    if (!formData.comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onSave(review.id, {
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        images: formData.images
      });

      if (result.success) {
        onClose();
      } else {
        setError(result.message || 'Failed to update review');
      }
    } catch (error) {
      setError('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // For now, we'll just store file names. In production, you'd upload to cloud storage.
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Check if review can be edited (within 30 days)
  const canEditReview = () => {
    const reviewDate = new Date(review.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  if (!canEditReview()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⏰</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Period Expired
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Reviews can only be edited within 30 days of creation.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Your Review
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center space-x-1">
                <StarRating 
                  rating={formData.rating} 
                  onRate={(rating) => setFormData(prev => ({ ...prev, rating }))}
                  size="lg"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {formData.rating}.0
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                maxLength={100}
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.comment.length}/1000
              </div>
            </div>



            {/* Note about re-approval */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                ⚠️ After editing, your review will need to be re-approved by an admin before it appears publicly.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.rating || !formData.comment.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Updating...' : 'Update Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};