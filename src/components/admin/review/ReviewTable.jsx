// src/components/admin/review/ReviewTable.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';
import ReviewDetails from './ReviewDetails';
import { Star, User, Package, Calendar, CheckCircle, X, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      label: 'Pending'
    },
    approved: { 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      label: 'Approved'
    },
    rejected: { 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      label: 'Rejected'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

const StarRating = ({ rating, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewTable = ({ 
  reviews, 
  isLoading, 
  pagination, 
  selectedReviews,
  onPageChange,
  onPageSizeChange,
  onViewReview,
  onApproveReview,
  onRejectReview,
  actionLoading
}) => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Safe function to ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerName = (review) => {
    return review.user?.name || 'Anonymous User';
  };

const getProductName = (review) => {
  const name = review.product?.name || 'Unknown Product';
  return name.split(' ').slice(0, 4).join(' ') + (name.split(' ').length > 4 ? '...' : '');
};

  const handleRowClick = (review) => {
    setSelectedReview(review);
    setShowDetails(true);
    if (onViewReview) {
      onViewReview(review);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedReview(null);
  };

  const handleApproveClick = (review, e) => {
    e.stopPropagation();
    onApproveReview(review.id);
  };

  const handleRejectClick = (review, e) => {
    e.stopPropagation();
    setSelectedReview(review);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedReview || !rejectReason.trim()) return;
    
    try {
      await onRejectReview(selectedReview.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedReview(null);
    } catch (error) {
      console.error('Reject review error:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (onPageChange && pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  const getShowingRange = () => {
    if (!pagination || !safeReviews.length) return { start: 0, end: 0, total: 0 };
    
    const start = ((pagination.currentPage - 1) * pagination.limit) + 1;
    const end = Math.min(pagination.currentPage * pagination.limit, pagination.totalCount);
    
    return {
      start,
      end,
      total: pagination.totalCount
    };
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const { currentPage, totalPages } = pagination;
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end for middle pages
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const showingRange = getShowingRange();
  const pageNumbers = getPageNumbers();

  if (isLoading && !safeReviews.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (safeReviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Star className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No reviews found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {Array.isArray(reviews) ? 'Try adjusting your filters or check back later for new reviews.' : 'Unable to load reviews. Please try refreshing the page.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Reject Review Modal */}
      {showRejectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reject Review
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Please provide a reason for rejection
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                rows="4"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedReview(null);
                }}
                disabled={actionLoading === `reject-${selectedReview?.id}`}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={actionLoading === `reject-${selectedReview?.id}` || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading === `reject-${selectedReview?.id}` ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Confirm Reject
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        className="overflow-hidden"
      >
        {/* Page Size Selector */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination ? (
              <>
                Showing {showingRange.start}-{showingRange.end} of {showingRange.total} reviews
              </>
            ) : (
              `Total: ${safeReviews.length} reviews`
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select 
              value={pagination?.limit || 5}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Review</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Product</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Rating</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeReviews.map((review, index) => (
                <motion.tr
                  key={review.id || index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(review)}
                >
                <td className="p-4">
                <div className="flex items-center gap-3">
                    {review.product?.images?.[0] ? (
                    <img 
                        src={review.product.images[0]} 
                        alt="Product" 
                        className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        onError={(e) => {
                        e.target.src = '/api/placeholder/40/40';
                        }}
                    />
                    ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                        <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    )}
                    <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {review.title ? 
                        review.title.split(' ').slice(0, 4).join(' ') + 
                        (review.title.split(' ').length > 4 ? '...' : '') 
                        : 'No Title'
                        }
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {review.comment ? 
                        review.comment.split(' ').slice(0, 4).join(' ') + 
                        (review.comment.split(' ').length > 4 ? '...' : '') 
                        : 'No comment'
                        }
                    </div>
                    </div>
                </div>
                </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getCustomerName(review)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {review.user?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                <td className="p-4">
                <div className="text-gray-900 dark:text-white">
                    {getProductName(review).split(' ').slice(0, 4).join(' ') + 
                    (getProductName(review).split(' ').length > 4 ? '...' : '')}
                </div>
                </td>
                  <td className="p-4">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900 dark:text-white">
                      {formatDate(review.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleApproveClick(review, e)}
                        disabled={actionLoading === `approve-${review.id}`}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {actionLoading === `approve-${review.id}` ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={(e) => handleRejectClick(review, e)}
                        disabled={actionLoading === `reject-${review.id}`}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        {actionLoading === `reject-${review.id}` ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {safeReviews.map((review, index) => (
            <motion.div
              key={review.id || index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-all duration-150"
              onClick={() => handleRowClick(review)}
            >
              {/* Header: Image + Rating + Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {review.product?.images?.[0] ? (
                      <img
                        src={review.product.images[0]}
                        alt="Product"
                        className="w-14 h-14 rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getProductName(review)}
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                </div>
                <StatusBadge status="pending" />
              </div>

              {/* Review Content */}
              <div className="mb-3">
                {review.title && (
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {review.title}
                  </h4>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {review.comment || 'No comment provided'}
                </p>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <User className="w-3 h-3" />
                <span>{getCustomerName(review)}</span>
                <span>•</span>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(review.createdAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleApproveClick(review, e)}
                  disabled={actionLoading === `approve-${review.id}`}
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  {actionLoading === `approve-${review.id}` ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={(e) => handleRejectClick(review, e)}
                  disabled={actionLoading === `reject-${review.id}`}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {actionLoading === `reject-${review.id}` ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="w-full overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4 overflow-x-auto"
            >
              {/* Showing Range Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Showing {showingRange.start}-{showingRange.end} of {showingRange.total} reviews
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-hide px-1">
                
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1 overflow-x-auto max-w-full scrollbar-hide">
                  {pageNumbers.map((page, index) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-500 flex items-center"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[36px] shrink-0 ${
                          pagination.currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium shrink-0"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Review Details Sidebar */}
      {showDetails && selectedReview && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseDetails} />
          <div className="relative w-full max-w-2xl h-full">
            <ReviewDetails 
              review={selectedReview} 
              onClose={handleCloseDetails}
              onApprove={onApproveReview}
              onReject={onRejectReview}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewTable;