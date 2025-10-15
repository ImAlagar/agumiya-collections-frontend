// src/pages/admin/AdminReviews.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reviewService } from '../../../services/api/reviewService';
import ReviewFilters from '../../../components/admin/review/ReviewFilters';
import ReviewTable from '../../../components/admin/review/ReviewTable';
import { CheckCircle, AlertCircle, RefreshCw, Star } from 'lucide-react';
import ReviewStats from '../../../components/admin/stats/ReviewStats';
import ReviewDetails from '../../../components/admin/review/ReviewDetails';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'pending', // Default to pending for admin review
    rating: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 5
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5
  });
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load data on component mount
useEffect(() => {
  const loadData = async () => {
    try {
      setInitialLoad(true);
      
      // Load stats first
      const statsResult = await fetchReviewStats();
      if (statsResult && statsResult.success) {
        setStats(statsResult.stats);
      }
      
      // Then load reviews
      await fetchReviews(1);
      
    } catch (error) {
      console.error('💥 [AdminReviews] Error loading data:', error);
    } finally {
      setInitialLoad(false);
    }
  };
  
  loadData();
}, []);

  // Handle filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReviews(1); // Reset to page 1 when filters change
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.status, filters.rating, filters.sortBy, filters.sortOrder]);

  // Enhanced fetchReviews with proper filter handling
  const fetchReviews = async (page = 1) => {
    try {
      setIsLoading(true);
      setError('');

      // Prepare filters for API call - only include relevant filters
      const apiFilters = {
        page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      // Add optional filters only if they have values
      if (filters.search && filters.search.trim() !== '') {
        apiFilters.search = filters.search.trim();
      }

      if (filters.status && filters.status !== 'all') {
        apiFilters.status = filters.status;
      }

      if (filters.rating && filters.rating !== 'all') {
        apiFilters.rating = parseInt(filters.rating);
      }


      // Use appropriate service method based on status filter
      let result;
      if (filters.status === 'pending') {
        result = await reviewService.getPendingReviews(apiFilters);
      } else {
        // Use a general reviews endpoint that accepts status filter
        result = await reviewService.getAdminReviews(apiFilters);
      }
      
      if (result.success) {
        const reviewsData = result.data.reviews || result.data || [];
        setReviews(reviewsData);
        
        // Handle different pagination response structures
        const paginationData = result.data.pagination || result.data;
        setPagination({
          currentPage: paginationData.currentPage || page,
          totalPages: paginationData.totalPages || 1,
          totalCount: paginationData.totalCount || reviewsData.length,
          limit: paginationData.limit || filters.limit,
          hasNextPage: paginationData.hasNextPage || false,
          hasPrevPage: paginationData.hasPrevPage || false
        });

      } else {
        throw new Error(result.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('❌ [AdminReviews] Fetch reviews error:', error);
      setError(error.message || 'Failed to load reviews');
      
      // Fallback to empty state
      setReviews([]);
      setPagination({
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: filters.limit
      });
    } finally {
      setIsLoading(false);
    }
  };

const fetchReviewStats = async () => {
  try {
    // Try to fetch from API first
    const result = await reviewService.getAdminReviewStats();
    
    if (result && result.success) {
      return { success: true, stats: result.data };
    } else {
      // Fallback: Calculate from current data
      const total = pagination.totalCount || 0;
      const allReviews = reviews || [];
      
      const pending = allReviews.filter(r => r.status === 'pending').length;
      const approved = allReviews.filter(r => r.status === 'approved').length;
      const rejected = allReviews.filter(r => r.status === 'rejected').length;
      
      const averageRating = allReviews.length > 0 
        ? (allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / allReviews.length)
        : 0;

      const statsData = {
        total,
        pending,
        approved,
        rejected,
        averageRating: Number(averageRating.toFixed(1)),
        todayApproved: approved, // You might want to track this separately
        todayRejected: rejected  // You might want to track this separately
      };
      
      return { success: true, stats: statsData };
    }
  } catch (error) {
    console.error('❌ [AdminReviews] Fetch stats error:', error);
    
    // Ultimate fallback
    const statsData = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      averageRating: 0,
      todayApproved: 0,
      todayRejected: 0
    };
    
    return { success: false, stats: statsData, error: error.message };
  }
};



// Add a separate useEffect for stats updates


  const handleApprove = async (reviewId) => {
    try {
      setActionLoading(`approve-${reviewId}`);
      setError('');
      
      const result = await reviewService.approveReview(reviewId);
      
      if (result.success) {
        // Remove the approved review from the list
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setPagination(prev => ({
          ...prev,
          totalCount: prev.totalCount - 1
        }));
        setSuccessMessage('Review approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Refresh stats
        const statsResult = await fetchReviewStats();
        if (statsResult && statsResult.success) {
          setStats(statsResult.stats);
        }

        // Close details if open
        if (showDetails && selectedReview?.id === reviewId) {
          setShowDetails(false);
          setSelectedReview(null);
        }
      } else {
        throw new Error(result.message || 'Failed to approve review');
      }
    } catch (error) {
      console.error('Approve review error:', error);
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId, reason) => {
    if (!reason || reason.trim() === '') {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(`reject-${reviewId}`);
      setError('');
      
      const result = await reviewService.rejectReview(reviewId, reason);
      
      if (result.success) {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setPagination(prev => ({
          ...prev,
          totalCount: prev.totalCount - 1
        }));
        setSuccessMessage('Review rejected successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Refresh stats
        const statsResult = await fetchReviewStats();
        if (statsResult && statsResult.success) {
          setStats(statsResult.stats);
        }

        // Close details if open
        if (showDetails && selectedReview?.id === reviewId) {
          setShowDetails(false);
          setSelectedReview(null);
        }
      } else {
        throw new Error(result.message || 'Failed to reject review');
      }
    } catch (error) {
      console.error('Reject review error:', error);
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = async () => {
    await fetchReviews(pagination.currentPage);
    setSuccessMessage('Reviews refreshed successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage);
  };

  const handlePageSizeChange = (newLimit) => {
    setFilters(prev => ({ ...prev, limit: newLimit }));
    // Don't call fetchReviews here - it will be triggered by the useEffect
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowDetails(true);
  };

  const clearError = () => {
    setError('');
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'pending',
      rating: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 5
    };
    setFilters(defaultFilters);
    // fetchReviews will be triggered automatically by useEffect
  };

  // Update stats when reviews change
useEffect(() => {
  if ((!stats || stats.total === 0) && reviews.length > 0) {
    fetchReviewStats().then(result => {
      if (result && result.success) {
        setStats(result.stats);
      }
    });
  }
}, [reviews]);

  // Ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (error && initialLoad) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Review Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Moderate and manage customer reviews
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 font-medium"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Review Statistics Dashboard */}
      <ReviewStats reviews={safeReviews} stats={stats} />

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <ReviewFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Reviews Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ReviewTable
          reviews={safeReviews}
          isLoading={isLoading}
          pagination={pagination}
          onViewReview={handleViewReview}
          onApproveReview={handleApprove}
          onRejectReview={handleReject}
          actionLoading={actionLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading Reviews...</span>
        </motion.div>
      )}

      {/* Review Details Sidebar */}
      {showDetails && selectedReview && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetails(false)} />
          <div className="relative w-full max-w-2xl h-full">
            <ReviewDetails
              review={selectedReview} 
              onClose={() => setShowDetails(false)}
              onApprove={handleApprove}
              onReject={handleReject}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminReviews;