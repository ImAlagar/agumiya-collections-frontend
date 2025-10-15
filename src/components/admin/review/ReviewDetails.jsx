// src/components/admin/review/ReviewDetails.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Package, 
  Star, 
  Mail, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ShoppingCart,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

const ReviewDetails = ({ review, onClose, onApprove, onReject, actionLoading }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const StarRating = ({ rating, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-1">
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
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCustomerName = () => {
    return review.user?.name || 'Anonymous User';
  };

  const getProductName = () => {
    return review.product?.name || 'Unknown Product';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShoppingCart },
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'product', label: 'Product', icon: Package }
  ];

  const getGridClasses = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2';
  };

  const TabContent = ({ activeTab }) => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Review Content */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-semibold opacity-75 mb-4 flex items-center gap-2">
                <FileText size={16} />
                Review Content
              </label>
              
              <div className="space-y-4">
                <StarRating rating={review.rating} size="lg" />
                
                {review.title && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {review.title}
                    </h4>
                  </div>
                )}
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {review.comment || 'No comment provided.'}
                  </p>
                </div>

                {review.isVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle size={16} />
                    <span>Verified Purchase</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold opacity-75 mb-4">
                  Review Images ({review.images.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className={`grid ${getGridClasses()} gap-4`}>
              <button
                onClick={() => onApprove(review.id)}
                disabled={actionLoading === `approve-${review.id}`}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={20} />
                {actionLoading === `approve-${review.id}` ? 'Approving...' : 'Approve Review'}
              </button>
              <button
                onClick={() => {
                  const reason = window.prompt('Reason for rejection:');
                  if (reason) onReject(review.id, reason);
                }}
                disabled={actionLoading === `reject-${review.id}`}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={20} />
                {actionLoading === `reject-${review.id}` ? 'Rejecting...' : 'Reject Review'}
              </button>
            </div>
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-semibold opacity-75 mb-4 flex items-center gap-2">
                <User size={16} />
                Customer Information
              </label>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  <User size={16} className="text-blue-500" />
                  <div>
                    <div className="font-medium">Name</div>
                    <div className="text-gray-600 dark:text-gray-300">{getCustomerName()}</div>
                  </div>
                </div>
                
                {review.user?.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <Mail size={16} className="text-green-500" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600 dark:text-gray-300">{review.user.email}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  <Calendar size={16} className="text-purple-500" />
                  <div>
                    <div className="font-medium">Review Date</div>
                    <div className="text-gray-600 dark:text-gray-300">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
                
                {review.orderId && (
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <div className="font-medium">Order ID</div>
                    <div className="text-gray-600 dark:text-gray-300 font-mono">{review.orderId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-semibold opacity-75 mb-4 flex items-center gap-2">
                <Package size={16} />
                Product Information
              </label>
              
              <div className="flex items-center gap-4 mb-4">
                {review.product?.images?.[0] && (
                  <img
                    src={review.product.images[0]}
                    alt={getProductName()}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {getProductName()}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Product ID: {review.product?.id || 'N/A'}
                  </p>
                </div>
              </div>

              {review.product?.description && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`
        fixed inset-y-0 right-0 w-full 
        ${isMobile ? 'max-w-full' : isTablet ? 'max-w-2xl' : 'max-w-2xl'}
        bg-white dark:bg-gray-900 
        border-l border-gray-200 dark:border-gray-700 
        shadow-2xl overflow-hidden flex flex-col z-50
      `}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isMobile && (
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex-shrink-0"
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  Review Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {getProductName()} • {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          {!isMobile && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0 ml-4"
            >
              <X size={20} />
            </motion.button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex-1 min-w-0 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md 
                  transition-all flex items-center justify-center gap-1 sm:gap-2
                  ${activeTab === tab.id 
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <IconComponent size={isMobile ? 12 : 14} />
                <span className="truncate">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabContent activeTab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReviewDetails;