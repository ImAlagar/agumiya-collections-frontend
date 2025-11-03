import { storageManager } from '../../services/storage/storageManager';
import { STORAGE_KEYS, USER_TYPES } from '../../config/constants.jsx';
import { SEO } from '../../contexts/SEOContext.jsx';
import { useAuth } from '../../contexts/AuthProvider.jsx';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';
import { CreateReviewModal } from '../../components/reviews/CreateReviewModal';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { authService } from '../../services/api/authService.jsx';
import { reviewService } from '../../services/api/reviewService.jsx';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { EditReviewModal } from '../../components/reviews/EditReviewModal.jsx';


const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user: authUser, isAdmin, userType } = useAuth();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const currentUserType = userType || storageManager.getCurrentUserType();
      
      if (!currentUserType) {
        setError('No user type found');
        setLoading(false);
        return;
      }

      const cachedUserData = storageManager.getItem(STORAGE_KEYS.USER_DATA, currentUserType);
      
      if (cachedUserData) {
        setUserData(cachedUserData);
      }

      let response;
      if (currentUserType === USER_TYPES.ADMIN) {
        response = await authService.getAdminProfile();
      } else {
        response = await authService.getUserProfile();
      }

      if (response && response.success) {
        const freshUserData = response.admin || response.user || response.data;
        setUserData(freshUserData);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, freshUserData, currentUserType);
      } else {
        if (!cachedUserData) {
          setError(response?.message || 'Failed to load profile data');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updateData) => {
    try {
      const currentUserType = userType || storageManager.getCurrentUserType();
      let response;
      
      if (currentUserType === USER_TYPES.ADMIN) {
        response = await authService.updateProfile(updateData);
      } else {
        response = await authService.updateProfile(updateData);
      }

      if (response.success) {
        const updatedUser = response.admin || response.user;
        setUserData(updatedUser);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, updatedUser, currentUserType);
        return { success: true, message: 'Profile updated successfully' };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // FIXED: Review functions - accept productId and orderId directly
  const handleOpenReviewModal = (productId, orderId) => {
    
    if (!productId || !orderId) {
      console.error('Missing productId or orderId:', { productId, orderId });
      alert('Cannot open review - missing product or order information');
      return;
    }

    setSelectedProductId(parseInt(productId));
    setSelectedOrderId(parseInt(orderId));
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setReviewSuccess(true);
    setShowReviewModal(false);
    setSelectedProductId(null);
    setSelectedOrderId(null);
    
    setTimeout(() => {
      alert('Review submitted successfully! It will be visible after admin approval.');
    }, 100);
    
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProductId(null);
    setSelectedOrderId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPageTitle = () => {
    if (isAdmin) {
      return `${userData?.name || 'Admin'} Dashboard - Agumiya Collections`;
    }
    return `${userData?.name || 'User'} Profile - Agumiya Collections`;
  };

  const getPageDescription = () => {
    if (isAdmin) {
      return 'Admin dashboard for managing Agumiya Collections. Monitor orders, products, and system analytics.';
    }
    return 'Manage your Agumiya Collections account. View and update your , order history, and preferences.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEO
          title="Loading Profile - Agumiya Collections"
          description="Loading profile information"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEO 
          title="Error - Agumiya Collections"
          description="Error loading profile"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadUserProfile}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={isAdmin ? "admin dashboard, management, analytics, Agumiya Collections" : "user profile, account settings, order history, Agumiya Collections"}
        canonical={`https://agumiya-collections.com/${isAdmin ? 'admin' : 'profile'}`}
        ogType="profile"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": getPageTitle(),
          "description": getPageDescription(),
          "publisher": {
            "@type": "Organization",
            "name": "Agumiya Collections"
          }
        }}
      />

      {/* Review Modal - FIXED: Pass productId and orderId directly */}
      <AnimatePresence>
        {showReviewModal && (
          <CreateReviewModal
            productId={selectedProductId}
            orderId={selectedOrderId}
            onClose={handleCloseReviewModal}
            onSuccess={handleReviewSuccess}
            isOpen={showReviewModal}
          />
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {reviewSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            ✅ Review submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isAdmin ? 'Admin Dashboard' : 'My Account'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {isAdmin ? 'Manage your store and monitor analytics' : 'Manage your profile and preferences'}
                </p>
              </div>
              {isAdmin && (
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-lg">
                  <span className="font-semibold">Admin Mode</span>
                </div>
              )}
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isAdmin 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    <span className="text-white font-semibold text-lg">
                      {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userData?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userData?.email || 'No email provided'}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full">
                        Administrator
                      </span>
                    )}
                  </div>
                </div>

                <nav className="space-y-2">
                  {getNavigationItems(isAdmin).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? isAdmin
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <ProfileOverview 
                    userData={userData} 
                    isAdmin={isAdmin}
                    formatDate={formatDate}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}
                {activeTab === 'orders' && (
                  <OrderHistory userData={userData} isAdmin={isAdmin} />
                )}
                  {activeTab === 'reviews' && !isAdmin && (
                    <UserReviewsSection 
                      userData={userData}
                      onOpenReviewModal={handleOpenReviewModal}
                    />
                  )}
                {activeTab === 'security' && (
                  <SecuritySettings userData={userData} isAdmin={isAdmin} />
                )}
                {isAdmin && activeTab === 'analytics' && (
                  <AdminAnalytics userData={userData} />
                )}
                {isAdmin && activeTab === 'management' && (
                  <AdminManagement userData={userData} />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get navigation items based on user type
const getNavigationItems = (isAdmin) => {
  const baseItems = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  if (isAdmin) {
    return [
      ...baseItems,
      { id: 'analytics', label: 'Analytics', icon: '📊' },
      { id: 'management', label: 'Management', icon: '🏪' }
    ];
  }

  return baseItems;
};

// User Reviews Component (Fixed)
const UserReviewsSection = ({ userData, onOpenReviewModal }) => {
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { theme } = useTheme();

  // Calculate displayed reviews
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);
  const hasMoreReviews = reviews.length > 4;

  useEffect(() => {
    loadUserReviews();
    loadUserOrders();
  }, []);

  const loadUserReviews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await reviewService.getUserReviews();
      
      let reviewsData = [];
      if (response?.data?.reviews && Array.isArray(response.data.reviews)) {
        reviewsData = response.data.reviews;
      } else if (response?.reviews && Array.isArray(response.reviews)) {
        reviewsData = response.reviews;
      } else if (response?.data && Array.isArray(response.data)) {
        reviewsData = response.data;
      }

      setReviews(reviewsData);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserOrders = async () => {
    try {
      const response = await authService.getUserOrders();
      if (response && response.success) {
        setOrders(response.orders || response.data || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const getDeliveredOrders = () => {
    return orders.filter(order => 
      order.fulfillmentStatus === 'DELIVERED' ||
      order.status === 'DELIVERED' || 
      order.delivery_status === 'DELIVERED'
    );
  };

  const handleRefresh = () => {
    loadUserReviews(true);
    loadUserOrders();
  };

    // Edit Review Functions
  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleCloseEditModal = () => {
    setEditingReview(null);
  };

  const handleSaveReview = async (reviewId, updateData) => {
    try {
      const response = await reviewService.updateReview(reviewId, updateData);
      
      if (response.success) {
        // Update the review in local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, ...updateData, updatedAt: new Date().toISOString() }
            : review
        ));
        setEditingReview(null);
        return { success: true, message: 'Review updated successfully!' };
      } else {
        return { success: false, message: response.message || 'Failed to update review' };
      }
    } catch (error) {
      console.error('Error updating review:', error);
      return { success: false, message: 'Failed to update review' };
    }
  };

  // Delete Review Functions
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await reviewService.deleteReview(reviewId);
      
      if (response.success) {
        // Remove the review from local state
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setDeleteConfirm(null);
        alert('Review deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const confirmDelete = (review) => {
    setDeleteConfirm(review);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleWriteReview = () => {
    const deliveredOrders = getDeliveredOrders();
    
    if (deliveredOrders.length > 0) {
      const firstOrder = deliveredOrders[0];
      const firstItem = firstOrder.items?.[0];
      
      if (firstItem && firstItem.product) {
        const productId = firstItem.product.id;
        const orderId = firstOrder.id;
        
        
        if (productId && orderId) {
          onOpenReviewModal(productId, orderId);
        } else {
          alert('Unable to find product information for review');
        }
      } else {
        alert('No products found in delivered orders');
      }
    } else {
      alert('No delivered orders available for review');
    }
  };

  const deliveredOrders = getDeliveredOrders();
  const canWriteReview = deliveredOrders.length > 0;
  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <EditReviewModal
            review={editingReview}
            onClose={handleCloseEditModal}
            onSave={handleSaveReview}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Review
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your review for "{deleteConfirm.product?.name || 'this product'}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReview(deleteConfirm.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        {/* Updated Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Reviews ({reviews.length})
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Refresh
                </>
              )}
            </button>
          </div>
          <button
            onClick={handleWriteReview}
            disabled={!canWriteReview}
            className={`px-4 sm:px-6 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base ${
              canWriteReview
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {canWriteReview ? 'Write a Review' : 'No Products to Review'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 px-4">
              {canWriteReview 
                ? "Share your experience by reviewing products from your delivered orders"
                : "You'll be able to write reviews once you receive your orders"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
                <div key={review.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                  {/* Review Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                        {review.product?.name || 'Product'}
                      </h4>
                      {review.title && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1">
                          {review.title}
                        </p>
                      )}
                    </div>
                    
                    {/* Rating Section */}
                    <div className="flex items-center space-x-1 text-lg sm:text-xl">
                      {'⭐'.repeat(review.rating || 0)}
                      {'☆'.repeat(5 - (review.rating || 0))}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-3">
                    {review.comment}
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                      ))}
                    </div>
                  )}

                  {/* Review Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                          <span className="ml-1 text-xs">(edited)</span>
                        )}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        review.isApproved 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(review)}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded text-xs sm:text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMoreReviews && (
              <div className="flex justify-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
                >
                  {showAllReviews ? (
                    <span className="flex items-center gap-2">
                      <span>👆</span>
                      Show Less
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>👇</span>
                      Show More ({reviews.length - 4} more)
                    </span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
// Profile Overview Component
const ProfileOverview = ({ userData, isAdmin, formatDate, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || ''
  });

  const handleSave = async () => {
    const result = await onUpdateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isAdmin ? 'Admin Information' : 'Profile Information'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <p className="text-gray-900 dark:text-white">{userData?.name || 'Not provided'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <p className="text-gray-900 dark:text-white">{userData?.email || 'Not provided'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <p className="text-gray-900 dark:text-white">{userData?.phone || 'Not provided'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            User Since
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.createdAt ? formatDate(userData.createdAt) : 'Unknown'}
          </p>
        </div>

        {isAdmin && userData?.role && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <p className="text-gray-900 dark:text-white capitalize">{userData.role}</p>
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
};


const OrderHistory = ({ userData, isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false); // 👈 NEW STATE
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!isAdmin) {
      loadUserOrders();
    }
  }, [isAdmin]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.getUserOrders();
      if (response && response.success) {
        setOrders(response.orders || response.data || []);
      } else {
        setError(response?.message || "Failed to load orders");
      }
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      CONFIRMED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const formatCurrency = (amount) => {
    const { formatted } = formatPrice(amount || 0);
    return formatted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderDisplayId = (order) => {
    const id = order.orderNumber || order.id || order._id;
    if (!id) return "N/A";
    const str = id.toString();
    return str.length > 8 ? str.slice(-8) : str;
  };

  const getOrderId = (order) => order.id || order._id || "unknown";

  // ⚙️ Show only first 3 orders if showAll = false
  const displayedOrders = showAll ? orders : orders.slice(0, 3);

  if (isAdmin) {
    return (
      <motion.div
        key="orders"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Store Orders
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders in store
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Orders from customers will appear here
          </p>
          <Link
            to="/admin/products"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Manage Products
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Order History
        </h2>
        <button
          onClick={loadUserOrders}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading orders...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 dark:text-red-400 mb-4">
            Error loading orders: {error}
          </div>
          <button
            onClick={loadUserOrders}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start shopping to see your order history here
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedOrders.map((order, index) => (
              <motion.div
                key={getOrderId(order) || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{getOrderDisplayId(order)}
                        </h3>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Placed:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {formatDate(order.createdAt || order.orderDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Items:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {order.items?.length || 0} items
                          </span>
                        </div>

                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                      <Link
                        to={`/orders/${getOrderId(order)}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 👇 Show More / Show Less Button */}
          {orders.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};


// Admin-specific Components
const AdminAnalytics = ({ userData }) => (
  <motion.div
    key="analytics"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Store Analytics
    </h2>
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Analytics Dashboard
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Store performance metrics and analytics will be displayed here.
      </p>
    </div>
  </motion.div>
);

const AdminManagement = ({ userData }) => (
  <motion.div
    key="management"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Store Management
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        to="/admin/products"
        className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="text-2xl mb-2">🛍️</div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Product Management</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your product catalog
        </p>
      </Link>
      
      <Link
        to="/admin/orders"
        className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="text-2xl mb-2">📦</div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Order Management</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Process and manage orders
        </p>
      </Link>
    </div>
  </motion.div>
);


// Security Settings Component
const SecuritySettings = ({ userData, isAdmin }) => (
  <motion.div
    key="security"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Security Settings
    </h2>

      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your password regularly</p>
        </div>
        <Link
          to="/forgot-password"
          className={`font-medium ${
            isAdmin ? 'text-purple-600 hover:text-purple-700' : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          Change
        </Link>
      </div>

  </motion.div>
);

export default UserProfile;