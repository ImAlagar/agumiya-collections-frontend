// src/components/user/reviews/ReviewCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Flag, Edit3, Trash2 } from 'lucide-react';
import { useReview } from '../../contexts/ReviewContext';
import { useAuth } from '../../contexts/AuthProvider';

const ReviewCard = ({ review, productId }) => {
  const { toggleHelpfulVote, deleteReview } = useReview();
  const { user } = useAuth();
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const isOwnReview = user && review.userId === user.id;

  const handleHelpfulClick = async () => {
    if (isHelpfulLoading) return;
    
    setIsHelpfulLoading(true);
    try {
      await toggleHelpfulVote(review.id);
    } catch (error) {
      console.error('Failed to toggle helpful vote:', error);
    } finally {
      setIsHelpfulLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    
    try {
      // You'll need to implement reportReview in your service
      // await reportReview(review.id, reportReason);
      setShowReportForm(false);
      setReportReason('');
      // Show success message
    } catch (error) {
      console.error('Failed to report review:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(review.id);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
              {review.userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.userName || 'Anonymous'}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {isOwnReview && (
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
          {review.title}
        </h5>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleHelpfulClick}
          disabled={isHelpfulLoading}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
            review.hasVoted
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${review.hasVoted ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">
            Helpful ({review.helpfulCount || 0})
          </span>
        </button>

        {!isOwnReview && (
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span className="text-sm">Report</span>
          </button>
        )}
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Please explain why you're reporting this review..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowReportForm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReport}
              disabled={!reportReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Report
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewCard;