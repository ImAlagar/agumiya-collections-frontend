// src/pages/OrderDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../../contexts/OrdersContext';
import { SEO } from '../../contexts/SEOContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthProvider';
import { CreateReviewModal } from '../../components/reviews/CreateReviewModal';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    currentOrder, 
    currentOrderTracking,
    fetchOrderById, 
    fetchOrderTracking,
    isLoading, 
    error, 
    cancelOrder,
    updateOrderStatus 
  } = useOrders();
  
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('tracking');
  const [localOrder, setLocalOrder] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [alreadyReviewedProducts, setAlreadyReviewedProducts] = useState([]);

  const [couponData, setCouponData] = useState(() => {
    return location.state?.appliedCoupon || null;
  });

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
      fetchOrderTracking(id);
    }
  }, [id, fetchOrderById, fetchOrderTracking]);

  useEffect(() => {
    if (currentOrderTracking) {
      setLocalOrder(currentOrderTracking);
    } else if (currentOrder) {
      setLocalOrder(currentOrder);
    }
  }, [currentOrder, currentOrderTracking]);

  // Safe order data access with proper fallbacks
  const order = localOrder || currentOrder;

// ========== REVIEW FUNCTIONS ==========

const fetchUserReviews = async () => {
  try {
    const result = await reviewService.getUserReviews();
    if (result.success) {
      const reviews = result.data?.reviews || result.reviews || [];
      setUserReviews(reviews);
      
      // Extract product IDs that have been reviewed FROM THIS ORDER
      const reviewedProductIds = reviews
        .filter(review => review.orderId === (order?.id || order?._id))
        .map(review => review.productId || review.product?.id)
        .filter(Boolean);
      
      setAlreadyReviewedProducts(reviewedProductIds);
    }
  } catch (error) {
    console.error('Failed to fetch user reviews:', error);
  }
};

// FIXED: Properly identify the actual product ID from order items
const getProductIdFromItem = (item) => {
  // The actual product ID is in item.product.id, not item.id
  return item.product?.id || item.productId || item._id;
};

const canReviewProduct = (productId) => {
  const status = getOrderStatus().toUpperCase();

  
  if (status !== 'DELIVERED') {
    return false;
  }
  
  // Check if product exists in this order - use the correct product ID
  const productInOrder = order?.items?.find(item => {
    const actualProductId = getProductIdFromItem(item);
    return actualProductId == productId; // Use loose equality for number/string comparison
  });
  
  if (!productInOrder) {
    return false;
  }
  
  // Check if already reviewed this product from this order
  const alreadyReviewed = alreadyReviewedProducts.includes(productId);
  
  if (alreadyReviewed) {
    return false
  }
  
  return !alreadyReviewed;
};

const handleOpenReviewModal = (item) => {
  // FIXED: Use the actual product ID, not the order item ID
  const productId = getProductIdFromItem(item);
  const orderId = order.id || order._id;
  
  if (!productId || !orderId) {
    console.error('Missing productId or orderId:', { productId, orderId, item });
    alert('Cannot open review - missing product or order information');
    return;
  }

  if (!canReviewProduct(productId)) {
    if (alreadyReviewedProducts.includes(productId)) {
      alert('You have already reviewed this product from this order.');
    } else {
      alert('You can only review delivered products from this order.');
    }
    return;
  }

  setSelectedProduct({
    ...item,
    productId: productId // Ensure we have the correct product ID
  });
  setShowReviewModal(true);
};


const handleReviewSuccess = () => {
  setReviewSuccess(true);
  setShowReviewModal(false);
  
  // Add product to already reviewed list
  if (selectedProduct) {
    const productId = selectedProduct.productId || selectedProduct._id || selectedProduct.id;
    setAlreadyReviewedProducts(prev => [...prev, productId]);
  }
  
  setSelectedProduct(null);
  
  // Show success message
  setTimeout(() => {
    alert('Review submitted successfully! It will be visible after admin approval.');
  }, 100);
  
  // Reset success state after a delay
  setTimeout(() => setReviewSuccess(false), 3000);
};

const handleCloseReviewModal = () => {
  setShowReviewModal(false);
  setSelectedProduct(null);
};

// Check if any product in order can be reviewed
const hasReviewableProducts = () => {
  if (!order?.items || getOrderStatus().toUpperCase() !== 'DELIVERED') return false;
  
  return order.items.some(item => {
    const productId = item.productId || item._id || item.id;
    return !alreadyReviewedProducts.includes(productId);
  });
};

// Get reviewable products count
const getReviewableProductsCount = () => {
  if (!order?.items || getOrderStatus().toUpperCase() !== 'DELIVERED') return 0;
  
  return order.items.filter(item => {
    const productId = item.productId || item._id || item.id;
    return !alreadyReviewedProducts.includes(productId);
  }).length;
};
  // ========== END REVIEW FUNCTIONS ==========


  // ENHANCED COUPON FUNCTIONS WITH FALLBACKS
  const getCouponInfo = () => {
    if (order?.coupon || order?.appliedCoupon) {
      return order.coupon || order.appliedCoupon;
    }
    if (couponData) {
      return couponData;
    }
    return {
      code: order?.couponCode,
      discountType: order?.discountType,
      discountValue: order?.discountValue,
      discountAmount: order?.discountAmount
    };
  };

  const getDiscountAmount = () => {
    return order?.discountAmount || 
           order?.couponDiscount || 
           couponData?.discountAmount || 
           calculateDiscountFromTotals() || 
           0;
  };

  const getCouponCode = () => {
    return getCouponInfo()?.code || order?.couponCode || couponData?.code;
  };

  const getDiscountType = () => {
    return getCouponInfo()?.discountType || order?.discountType || 'FIXED';
  };

  const getDiscountValue = () => {
    return getCouponInfo()?.discountValue || order?.discountValue || 0;
  };

  const hasCouponDiscount = () => {
    const discount = getDiscountAmount();
    const code = getCouponCode();
    return discount > 0 && code;
  };

  const calculateDiscountFromTotals = () => {
    if (order?.items?.length > 0) {
      const itemsTotal = order.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      const currentSubtotal = order.subtotalAmount || order.subtotal || 0;
      
      if (itemsTotal > currentSubtotal) {
        return itemsTotal - currentSubtotal;
      }
    }
    return 0;
  };

  const formatCurrency = (amount) => {
    const { formatted } = formatPrice(Math.abs(amount) || 0);
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const getOriginalSubtotal = () => {
    const discount = getDiscountAmount();
    const currentSubtotal = order?.subtotalAmount || order?.subtotal || 0;
    
    if (discount > 0) {
      return currentSubtotal + discount;
    }
    return currentSubtotal;
  };

  // Safe status access function
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      placed: 'bg-blue-100 text-blue-800 border-blue-200',
      PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      SHIPPED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-blue-100 text-blue-800 border-blue-200',
      REFUNDED: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      PAID: 'bg-green-100 text-green-800',
      succeeded: 'bg-green-100 text-green-800',
      SUCCEEDED: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800',
      REFUNDED: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Safe data access functions
  const getOrderNumber = () => {
    return order?.orderNumber || order?.id || order?._id || 'N/A';
  };

  const getOrderDate = () => {
    return order?.createdAt || order?.orderDate || new Date();
  };

  const getOrderStatus = () => {
    const status = order?.status || order?.fulfillmentStatus || 'unknown';
    return typeof status === 'string' ? status : 'unknown';
  };

  const getPaymentStatus = () => {
    const status = order?.paymentStatus || 'pending';
    return typeof status === 'string' ? status : 'pending';
  };

  const formatStatusText = (status) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Calculate totals safely
  const subtotal = order?.subtotalAmount || order?.subtotal || 0;
  const shippingCost = order?.shippingCost || order?.shippingFee || 0;
  const taxAmount = order?.taxAmount || order?.tax || 0;
  const discountAmount = getDiscountAmount();
  const totalAmount = order?.totalAmount || order?.finalAmount || (subtotal + shippingCost + taxAmount - discountAmount);

  const formatItemPrice = (price, quantity = 1) => {
    const { formatted } = formatPrice((price || 0) * quantity);
    return formatted;
  };

  // CANCELLATION LOGIC
  const canCancelOrder = () => {
    const status = getOrderStatus().toUpperCase();
    const cancellableStatuses = ['PENDING', 'PLACED', 'PROCESSING'];
    return cancellableStatuses.includes(status);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    setCancelError('');

    try {
      const result = await cancelOrder(order.id, cancelReason);

      if (result.success) {
        setShowCancelModal(false);
        setCancelReason('');
        fetchOrderById(id);
        alert('Order cancelled successfully!');
      } else {
        setCancelError(result.error || 'Failed to cancel order. Please try again.');
      }
    } catch (error) {
      setCancelError(error.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  // TRACKING SPECIFIC FUNCTIONS
  const getTrackingInfo = () => {
    return order?.tracking || {};
  };

  const getTimeline = () => {
    return order?.timeline || [];
  };

  const hasTrackingInfo = () => {
    const tracking = getTrackingInfo();
    return tracking?.number || tracking?.url || tracking?.carrier;
  };

  // Check if we should show discount info (even if no explicit coupon data)
  const shouldShowDiscountInfo = () => {
    if (hasCouponDiscount()) return true;
    
    if (order?.items?.length > 0) {
      const itemsTotal = order.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      return itemsTotal > subtotal;
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEO
          title="Loading Order | ShopStyle"
          description="Loading order details"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEO
          title="Order Not Found | ShopStyle"
          description="Order not found"
        />
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <div className="space-y-3">
            <Link
              to="/profile?tab=orders"
              className="block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Orders
            </Link>
            <Link
              to="/profile"
              className="block border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Order #${getOrderNumber()} | ShopStyle`}
        description={`Order details for ${getOrderNumber()}`}
        canonical={`/orders/${order.id || order._id}`}
      />

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
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
                Cancel Order #{getOrderNumber()}
              </h3>
              
              {cancelError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {cancelError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling this order..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  rows="4"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setCancelError('');
                  }}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    {/* Review Modal */}
    <AnimatePresence>
      {showReviewModal && selectedProduct && (
        <CreateReviewModal
          productId={selectedProduct.productId || selectedProduct._id || selectedProduct.id}
          orderId={order.id || order._id}
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <Link
                  to="/profile?tab=orders"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-3 sm:mb-4 text-sm sm:text-base"
                >
                  ← Back to Orders
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Order #{getOrderNumber()}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                  Placed on {new Date(getOrderDate()).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-semibold border ${getStatusColor(getOrderStatus())}`}>
                  {formatStatusText(getOrderStatus())}
                </span>
                <div className="mt-1 sm:mt-2">
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(getPaymentStatus())}`}>
                    Payment: {formatStatusText(getPaymentStatus())}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Review Banner for Delivered Orders */}
          {hasReviewableProducts() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-lg">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base">
                      Share Your Experience!
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm">
                      Review {getReviewableProductsCount()} product{getReviewableProductsCount() > 1 ? 's' : ''} from this order
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('items')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Write Reviews
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex -mb-px overflow-x-auto">
                    {['tracking', 'details', 'items', 'shipping'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === tab
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    {/* TRACKING TAB */}
                    {activeTab === 'tracking' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        {/* Order Status Overview */}
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-4 sm:p-6 border border-primary-200 dark:border-primary-800">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-3 sm:mb-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Order Status
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Current status of your order
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(getOrderStatus())}`}>
                                {formatStatusText(getOrderStatus())}
                              </div>
                            </div>
                          </div>
                        </div>

                        {hasTrackingInfo() && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              📦 Tracking Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {getTrackingInfo().number && (
                                <div>
                                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Tracking Number
                                  </label>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {getTrackingInfo().number}
                                  </p>
                                </div>
                              )}
                              {getTrackingInfo().carrier && (
                                <div>
                                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Carrier
                                  </label>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {getTrackingInfo().carrier}
                                  </p>
                                </div>
                              )}
                              {getTrackingInfo().url && (
                                <div className="md:col-span-2">
                                  <a
                                    href={getTrackingInfo().url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                  >
                                    📍 Track Package
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Order Timeline */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            🗓️ Order Timeline
                          </h3>
                          
                          {getTimeline().length > 0 ? (
                            <div className="space-y-4">
                              {getTimeline().map((step, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                  {/* Timeline dot */}
                                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                                    step.completed 
                                      ? 'bg-green-500' 
                                      : step.current
                                      ? 'bg-primary-500 animate-pulse'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`} />
                                  
                                  {/* Timeline content */}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className={`font-medium ${
                                        step.current 
                                          ? 'text-primary-600 dark:text-primary-400' 
                                          : step.completed
                                          ? 'text-green-600 dark:text-green-400'
                                          : 'text-gray-500 dark:text-gray-400'
                                      }`}>
                                        {step.title}
                                        {step.current && (
                                          <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">
                                            Current
                                          </span>
                                        )}
                                      </h4>
                                      {step.date && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {new Date(step.date).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {step.description}
                                    </p>
                                    {step.trackingUrl && (
                                      <a
                                        href={step.trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm mt-2"
                                      >
                                        Track shipment →
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="text-4xl mb-4">📦</div>
                              <p className="text-gray-500 dark:text-gray-400">
                                No tracking information available yet.
                              </p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Tracking will appear here once your order ships.
                              </p>
                            </div>
                          )}
                        </div>

                      </motion.div>
                    )}


                    {/* DETAILS TAB - UPDATED WITH BETTER COUPON HANDLING */}
                    {activeTab === 'details' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Enhanced Order Summary with Coupon */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Order Summary
                            </h3>
                            <div className="space-y-3">
                              {/* Show original subtotal if we detect a discount */}
                              {shouldShowDiscountInfo() && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400 line-through">
                                    Original Subtotal
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 line-through">
                                    {formatCurrency(getOriginalSubtotal())}
                                  </span>
                                </div>
                              )}

                              {/* Current Subtotal */}
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(subtotal)}
                                </span>
                              </div>

                              {/* Coupon Discount Line - Show if we have any discount info */}
                              {shouldShowDiscountInfo() && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                  <span className="flex items-center">
                                    🎉 Discount 
                                    {getCouponCode() && (
                                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                        {getCouponCode()}
                                      </span>
                                    )}
                                    {!getCouponCode() && (
                                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                        Special Offer
                                      </span>
                                    )}
                                  </span>
                                  <span className="font-medium">
                                    -{formatCurrency(getDiscountAmount())}
                                    {getDiscountType() === 'PERCENTAGE' && (
                                      <span className="text-xs ml-1">
                                        ({getDiscountValue()}% off)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              )}

                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                                </span>
                              </div>


                              {/* Total Savings Display */}
                              {shouldShowDiscountInfo() && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-green-700 dark:text-green-300 font-medium">
                                      You saved:
                                    </span>
                                    <span className="text-green-700 dark:text-green-300 font-bold">
                                      {formatCurrency(getDiscountAmount())}
                                    </span>
                                  </div>
                                  {getCouponCode() ? (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                      Coupon code: <strong>{getCouponCode()}</strong> applied successfully
                                    </p>
                                  ) : (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                      Special discount applied to your order
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Final Total */}
                              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Total Paid
                                </span>
                                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                  {formatCurrency(totalAmount)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Information */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Payment Information
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Method</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {order.paymentMethod || 'Credit Card'}
                                </p>
                              </div>
                              {order.transactionId && (
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {order.transactionId}
                                  </p>
                                </div>
                              )}
                              {/* Add Coupon Information if available */}
                              {shouldShowDiscountInfo() && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                  <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                                    {getCouponCode() ? '🎟️ Coupon Applied' : '🎁 Special Offer'}
                                  </span>
                                  {getCouponCode() ? (
                                    <>
                                      <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                                        Code: <strong>{getCouponCode()}</strong>
                                      </p>
                                      <p className="text-blue-600 dark:text-blue-400 text-xs">
                                        Saved {formatCurrency(getDiscountAmount())}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                                        Special discount applied
                                      </p>
                                      <p className="text-blue-600 dark:text-blue-400 text-xs">
                                        You saved {formatCurrency(getDiscountAmount())}
                                      </p>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {/* ITEMS TAB - UPDATED WITH BETTER REVIEW INTEGRATION */}
                    {activeTab === 'items' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
                            Order Items
                          </h3>
                          
                          {/* Review Stats */}
                          {hasReviewableProducts() && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                              <p className="text-blue-700 dark:text-blue-300 text-sm">
                                {getReviewableProductsCount()} product{getReviewableProductsCount() > 1 ? 's' : ''} available for review
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Coupon Summary Banner */}
                        {shouldShowDiscountInfo() && (
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-800 mb-4 sm:mb-6">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 dark:text-green-400 text-sm sm:text-lg">🎉</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base truncate">
                                  {getCouponCode() ? 'Coupon Applied Successfully!' : 'Special Discount Applied!'}
                                </h4>
                                <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm truncate">
                                  You saved {formatCurrency(getDiscountAmount())} 
                                  {getCouponCode() && ` with code ${getCouponCode()}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-3 sm:space-y-4">
                              {order.items?.length > 0 ? (
                                order.items.map((item, index) => {
                                  // FIXED: Use the actual product ID from the product object
                                  const productId = getProductIdFromItem(item);
                                  const canReview = canReviewProduct(productId);
                                  const alreadyReviewed = alreadyReviewedProducts.includes(productId);
                                  
                                  return (
                                    <div
                                      key={index}
                                      className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                    >
                                      {item.product?.images?.[0] && (
                                        <img
                                          src={item.product.images[0]}
                                          alt={item.name}
                                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0 mx-auto sm:mx-0"
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                          {item.product?.name || item.name || 'Product'}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                          Variant: {item.variant || item.size || 'Standard'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                          Quantity: {item.quantity || 1}
                                        </p>
                                        
                                        {/* Review Status */}
                                        <div className="mt-2">
                                          {canReview && (
                                            <button
                                              onClick={() => {
                                                handleOpenReviewModal(item);
                                              }}
                                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                                            >
                                              ✍️ Write Review
                                            </button>
                                          )}
                                          
                                          {alreadyReviewed && (
                                            <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
                                              ✅ Review Submitted
                                            </span>
                                          )}
                                          
                                          {!canReview && !alreadyReviewed && getOrderStatus().toUpperCase() !== 'DELIVERED' && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              Review available after delivery
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                          {formatCurrency(item.price || 0)}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                          {formatItemPrice(item.price || 0, item.quantity || 1)}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8">
                                  No items found for this order.
                                </p>
                              )}
                        </div>
                      </motion.div>
                    )}

                    {/* SHIPPING TAB */}
                    {activeTab === 'shipping' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Shipping Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Shipping Address
                            </h4>
                            <div className="text-gray-600 dark:text-gray-400 space-y-1">
                              {order.shippingAddress ? (
                                <>
                                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                  <p>{order.shippingAddress.address1}</p>
                                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                  <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.zipCode}
                                  </p>
                                  <p>{order.shippingAddress.country}</p>
                                  <p>📧 {order.shippingAddress.email}</p>
                                  <p>📞 {order.shippingAddress.phone}</p>
                                </>
                              ) : (
                                <p>No shipping address available</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Shipping Method
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {order.shippingMethod || 'Standard Shipping'}
                            </p>
                            {order.trackingNumber && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  Tracking Information
                                </h4>
                                <p className="text-primary-600 dark:text-primary-400 font-medium">
                                  {order.trackingNumber}
                                </p>
                                {order.trackingUrl && (
                                  <a
                                    href={order.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                  >
                                    Track your package →
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Order Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Order Actions
                </h3>
                <div className="space-y-2 sm:space-y-3">

                 
                  <Link to={'/contact'} className="block">
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base">
                      Contact Support
                    </button>
                  </Link>
                  
                  {/* Cancel Order Button */}
                  {canCancelOrder() && (
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* Show message if order is already cancelled */}
                  {getOrderStatus().toUpperCase() === 'CANCELLED' && (
                    <div className="text-center py-2">
                      <span className="text-red-600 dark:text-red-400 font-medium text-sm sm:text-base">
                        Order Cancelled
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Need Help?
                </h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p>Our support team is here to help with your order.</p>
                  <p>Email: support@agumiyacollections.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;