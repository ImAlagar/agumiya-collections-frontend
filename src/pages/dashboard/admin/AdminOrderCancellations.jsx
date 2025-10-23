// src/pages/dashboard/admin/AdminOrderCancellations.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  RefreshCw, 
  X, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Package,
  MoreVertical,
  Eye,
  RotateCcw,
  Loader,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useOrders } from '../../../contexts/OrdersContext';
import { SEO } from '../../../contexts/SEOContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useTheme } from '../../../contexts/ThemeContext';
import StatCard from '../../../components/shared/StatCard';
import StatsGrid from '../../../components/shared/StatsGrid';

const AdminOrderCancellations = () => {
  const { 
    cancelledOrders, 
    cancellationStats, 
    fetchCancelledOrders, 
    fetchCancellationStats,
    processRefund,
    retryRefund,
    adminCancelOrder,
    pagination
  } = useOrders();
  
  const { formatPriceSimple } = useCurrency();
  const { theme } = useTheme();
  
   const [filters, setFilters] = useState({
    search: '',
    refundStatus: 'all',
    limit: 10 // Make sure this matches what you want
  });

    // Use the actual current page from context
  const currentPage = pagination.currentPage || 1;
  const totalPages = pagination.totalPages || 1;
  const totalCount = pagination.totalCount || 0;
  const limit = pagination.limit || 10;
  const [refreshing, setRefreshing] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);



    useEffect(() => {
    fetchCancelledOrders(currentPage, filters);
    fetchCancellationStats();
  }, [currentPage, filters]); // Add currentPage to dependencies

  const handlePageChange = (newPage) => {
    // This will trigger the useEffect and refetch with new page
    fetchCancelledOrders(newPage, filters);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to page 1 when filters change
    fetchCancelledOrders(1, { ...filters, [key]: value });
  };

  const handleCancelOrder = async (orderId) => {
    setLoadingAction(`cancel-${orderId}`);
    const result = await adminCancelOrder(orderId, cancelReason);
    setLoadingAction(null);
    
    if (result.success) {
      setShowCancelModal(false);
      setCancelReason('');
      fetchCancelledOrders(filters.page, filters);
    }
  };

const handleProcessRefund = async (orderId) => {
  setLoadingAction(`refund-${orderId}`);
  try {
    const result = await processRefund(orderId, refundReason);
    setLoadingAction(null);
    
    if (result.success) {
      setShowRefundModal(false);
      setRefundReason('');
      fetchCancelledOrders(filters.page, filters);
      toast.success('Refund processed successfully!');
    }
  } catch (error) {
    setLoadingAction(null);
    
    // Check if this is the "not paid" scenario and offer to fix it
    if (error.message.includes('not paid') || error.message.includes('No refund required')) {
      const shouldFix = window.confirm(
        `${error.message}\n\nWould you like to automatically fix the order status to reflect that no refund is required?`
      );
      
      if (shouldFix) {
        try {
          await fixOrderRefundStatus(orderId);
          toast.success('Order status fixed successfully!');
          fetchCancelledOrders(filters.page, filters);
        } catch (fixError) {
          toast.error('Failed to fix order status: ' + fixError.message);
        }
      }
    } else {
      toast.error(error.message);
    }
  }
};

  const handleRetryRefund = async (orderId) => {
    setLoadingAction(`retry-${orderId}`);
    const result = await retryRefund(orderId);
    setLoadingAction(null);
    
    if (result.success) {
      fetchCancelledOrders(filters.page, filters);
    }
  };

  const handleRefresh = async () => {
  setRefreshing(true);
  try {
    await Promise.all([
      fetchCancelledOrders(filters.page, filters),
      fetchCancellationStats()
    ]);
  } catch (error) {
    console.error('Refresh failed:', error);
  } finally {
    setRefreshing(false);
  }
  };
  // Theme-aware styling functions
  const getCardClass = () => {
    return theme === 'light' 
      ? 'bg-white border-gray-200' 
      : theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-gray-750 border-gray-600';
  };

  const getTextClass = () => {
    return theme === 'light' ? 'text-gray-900' : 'text-white';
  };

  const getMutedTextClass = () => {
    return theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  };

  const getBorderClass = () => {
    return theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  };

  const getInputClass = () => {
    const baseClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
    if (theme === 'light') {
      return `${baseClass} border-gray-300 bg-white text-gray-900`;
    } else if (theme === 'dark') {
      return `${baseClass} border-gray-600 bg-gray-700 text-white`;
    } else {
      return `${baseClass} border-gray-500 bg-gray-700 text-white`;
    }
  };

  const getHoverClass = () => {
    return theme === 'light' 
      ? 'hover:bg-gray-50' 
      : theme === 'dark'
      ? 'hover:bg-gray-700'
      : 'hover:bg-gray-650';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'yellow', label: 'Pending' },
      PROCESSING: { color: 'blue', label: 'Processing' },
      COMPLETED: { color: 'green', label: 'Completed' },
      FAILED: { color: 'red', label: 'Failed' },
      NOT_REQUIRED: { color: 'gray', label: 'Not Required' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full bg-${config.color}-500`} />
        <span className={`text-sm font-medium text-${config.color}-600`}>
          {config.label}
        </span>
      </div>
    );
  };

  const getCancelledByBadge = (cancelledBy) => {
    const isAdmin = cancelledBy === 'admin';
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`} />
        <span className={`text-sm font-medium ${isAdmin ? 'text-purple-600' : 'text-blue-600'}`}>
          {isAdmin ? 'Admin' : 'Customer'}
        </span>
      </div>
    );
  };

  const OrderCard = ({ order }) => (
    <motion.div
      variants={itemVariants}
      className={`${getCardClass()} rounded-lg border p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`text-lg font-semibold ${getTextClass()}`}>
            Order #{order.id}
          </h3>
          <p className={`text-sm ${getMutedTextClass()}`}>
            {order.items?.length || 0} items • {new Date(order.cancelledAt).toLocaleDateString()}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(mobileMenuOpen === order.id ? null : order.id);
            }}
            className={`p-1 ${getHoverClass()} rounded`}
          >
            <MoreVertical size={16} className={getTextClass()} />
          </button>
          
          <AnimatePresence>
            {mobileMenuOpen === order.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute right-0 top-8 ${getCardClass()} border ${getBorderClass()} rounded-lg shadow-lg z-10 min-w-[140px]`}
              >
                <button
                  onClick={() => {/* Navigate to order details */}}
                  className={`flex items-center w-full px-3 py-2 text-sm ${getTextClass()} ${getHoverClass()}`}
                >
                  <Eye size={14} className="mr-2" />
                  View Details
                </button>
                
                {order.refundStatus === 'PENDING' && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowRefundModal(true);
                      setMobileMenuOpen(null);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm text-green-600 ${getHoverClass()}`}
                  >
                    <DollarSign size={14} className="mr-2" />
                    Process Refund
                  </button>
                )}
                
                {order.refundStatus === 'FAILED' && (
                  <button
                    onClick={() => {
                      handleRetryRefund(order.id);
                      setMobileMenuOpen(null);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm text-yellow-600 ${getHoverClass()}`}
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Retry Refund
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
          <User size={14} className="text-blue-600" />
        </div>
        <div>
          <p className={`text-sm font-medium ${getTextClass()}`}>
            {order.user?.name}
          </p>
          <p className={`text-xs ${getMutedTextClass()}`}>
            {order.user?.email}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className={`text-xs ${getMutedTextClass()}`}>Amount</p>
          <p className={`text-sm font-medium ${getTextClass()}`}>
            {formatPriceSimple(order.totalAmount)}
          </p>
        </div>
        <div>
          <p className={`text-xs ${getMutedTextClass()}`}>Refund Status</p>
          <div className="mt-1">{getStatusBadge(order.refundStatus)}</div>
        </div>
        <div>
          <p className={`text-xs ${getMutedTextClass()}`}>Cancelled By</p>
          <div className="mt-1">{getCancelledByBadge(order.cancelledBy)}</div>
        </div>
        <div>
          <p className={`text-xs ${getMutedTextClass()}`}>Date</p>
          <p className={`text-sm ${getTextClass()}`}>
            {new Date(order.cancelledAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex space-x-2 pt-3 border-t ${getBorderClass()}`}>
        {order.refundStatus === 'PENDING' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(order);
              setShowRefundModal(true);
            }}
            disabled={loadingAction}
            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Process Refund
          </button>
        )}
        
        {order.refundStatus === 'FAILED' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRetryRefund(order.id);
            }}
            disabled={loadingAction === `retry-${order.id}`}
            className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 transition-colors"
          >
            {loadingAction === `retry-${order.id}` ? 'Retrying...' : 'Retry Refund'}
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            {/* Navigate to order details */}
          }}
          className={`flex-1 border ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-300 hover:bg-gray-700'} py-2 px-3 rounded-lg text-sm font-medium transition-colors`}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );

  // Animation variants
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <SEO 
        title="Order Cancellations | Admin Dashboard"
        description="Manage cancelled orders and refunds"
      />

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && selectedOrder && (
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
              className={`${getCardClass()} rounded-xl p-6 max-w-md w-full border`}
            >
              <h3 className={`text-lg font-semibold ${getTextClass()} mb-4`}>
                Cancel Order #{selectedOrder.id}
              </h3>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium ${getTextClass()} mb-2`}>
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  className={getInputClass()}
                  rows="4"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedOrder(null);
                  }}
                  disabled={loadingAction}
                  className={`flex-1 px-4 py-2 border ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-300 hover:bg-gray-700'} rounded-lg disabled:opacity-50 transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  disabled={loadingAction || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingAction === `cancel-${selectedOrder.id}` ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Refund Modal */}
      <AnimatePresence>
        {showRefundModal && selectedOrder && (
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
              className={`${getCardClass()} rounded-xl p-6 max-w-md w-full border`}
            >
              <h3 className={`text-lg font-semibold ${getTextClass()} mb-4`}>
                Process Refund for Order #{selectedOrder.id}
              </h3>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Amount to refund: <strong>{formatPriceSimple(selectedOrder.refundAmount || selectedOrder.totalAmount)}</strong>
                </p>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${getTextClass()} mb-2`}>
                  Refund Reason *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter refund reason..."
                  className={getInputClass()}
                  rows="3"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason('');
                    setSelectedOrder(null);
                  }}
                  disabled={loadingAction}
                  className={`flex-1 px-4 py-2 border ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-300 hover:bg-gray-700'} rounded-lg disabled:opacity-50 transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleProcessRefund(selectedOrder.id)}
                  disabled={loadingAction || !refundReason.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingAction === `refund-${selectedOrder.id}` ? 'Processing...' : 'Process Refund'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${getTextClass()}`}>
              Order Cancellations
            </h1>
            <p className={`${getMutedTextClass()} mt-1`}>
              Manage cancelled orders and refund processing
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center px-4 py-2 border ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-300 hover:bg-gray-700'} rounded-lg transition-colors disabled:opacity-50`}
            >
              <RefreshCw 
                size={16} 
                className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} 
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Statistics Cards - Using StatsGrid and StatCard */}
        {cancellationStats && (
          <StatsGrid>
            <StatCard
              title="Total Cancelled"
              value={cancellationStats.totalCancelled}
              icon={X}
              color="red"
              description="All cancelled orders"
              index={0}
            />
            <StatCard
              title="Pending Refunds"
              value={cancellationStats.pendingRefunds}
              icon={AlertCircle}
              color="yellow"
              description="Awaiting refund processing"
              index={1}
            />
            <StatCard
              title="Completed Refunds"
              value={cancellationStats.completedRefunds}
              icon={CheckCircle}
              color="green"
              description="Successfully refunded"
              index={2}
            />
            <StatCard
              title="Total Refunded"
              value={formatPriceSimple(cancellationStats.totalRefunded)}
              icon={DollarSign}
              color="blue"
              description="Total amount refunded"
              index={3}
            />
          </StatsGrid>
        )}

        {/* Filters */}

            <div className="sm:w-48">
              <label className={`block text-sm font-medium ${getTextClass()} mb-2`}>
                Refund Status
              </label>
              <select
                value={filters.refundStatus}
                onChange={(e) => handleFilterChange('refundStatus', e.target.value)}
                className={getInputClass()}
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>


        {/* Orders List - Mobile Cards & Desktop Table */}
        <div className={`${getCardClass()} rounded-xl border overflow-hidden`}>
          {/* Mobile View - Cards */}
          <div className="block sm:hidden">
            <div className="p-4">
              {cancelledOrders.length > 0 ? (
                <motion.div
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cancelledOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className={`mt-2 text-sm font-medium ${getTextClass()}`}>No cancelled orders</h3>
                  <p className={`mt-1 text-sm ${getMutedTextClass()}`}>
                    Get started by cancelling an order from the orders page.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden sm:block">
            {cancelledOrders.length > 0 ? (
              <motion.div
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="w-full min-w-max">
                  <thead>
                    <tr className={`border-b ${getBorderClass()} ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                      <th className={`text-left p-4 font-semibold ${getMutedTextClass()} min-w-[200px]`}>Order</th>
                      <th className={`text-left p-4 font-semibold ${getMutedTextClass()}`}>Customer</th>
                      <th className={`text-left p-4 font-semibold ${getMutedTextClass()}`}>Amount</th>
                      <th className={`text-left p-4 font-semibold ${getMutedTextClass()}`}>Refund Status</th>
                      <th className={`text-left p-4 font-semibold ${getMutedTextClass()}`}>Cancelled By</th>
                      <th className={`text-left p-4 font-semibold ${getMutedTextClass()}`}>Date</th>
                      <th className={`text-right p-4 font-semibold ${getMutedTextClass()}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelledOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        variants={itemVariants}
                        className={`border-b ${theme === 'light' ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-800 hover:bg-gray-900'} transition-colors cursor-pointer group`}
                        whileHover={{ 
                          scale: 1.002,
                          backgroundColor: theme === 'light' ? 'rgba(249, 250, 251, 1)' : 'rgba(17, 24, 39, 1)'
                        }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className={`font-semibold ${getTextClass()} group-hover:text-blue-600 transition-colors`}>
                                #{order.id}
                              </div>
                              <div className={`text-sm ${getMutedTextClass()}`}>
                                {order.items?.length || 0} items
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-2 ${getTextClass()}`}>
                            <User className="w-4 h-4" />
                            <div>
                              <div className={`font-medium ${getTextClass()}`}>
                                {order.user?.name}
                              </div>
                              <div className={`text-sm ${getMutedTextClass()}`}>
                                {order.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`font-semibold ${getTextClass()}`}>
                            {formatPriceSimple(order.totalAmount)}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(order.refundStatus)}
                        </td>
                        <td className="p-4">
                          {getCancelledByBadge(order.cancelledBy)}
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-2 text-sm ${getMutedTextClass()}`}>
                            <Calendar className="w-4 h-4" />
                            {new Date(order.cancelledAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end space-x-2">
                            {order.refundStatus === 'PENDING' && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowRefundModal(true);
                                }}
                                disabled={loadingAction}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50 transition-colors px-3 py-1 rounded-lg hover:bg-green-50"
                              >
                                Process Refund
                              </button>
                            )}

                            {order.refundStatus === 'FAILED' && (
                              <button
                                onClick={() => handleRetryRefund(order.id)}
                                disabled={loadingAction === `retry-${order.id}`}
                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 transition-colors px-3 py-1 rounded-lg hover:bg-yellow-50"
                              >
                                {loadingAction === `retry-${order.id}` ? 'Retrying...' : 'Retry'}
                              </button>
                            )}


                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className={`mt-2 text-sm font-medium ${getTextClass()}`}>No cancelled orders</h3>
                <p className={`mt-1 text-sm ${getMutedTextClass()}`}>
                  Get started by cancelling an order from the orders page.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {cancelledOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${getBorderClass()} gap-4`}
            >
              <div className={`text-sm ${getMutedTextClass()}`}>
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} orders
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${theme === 'light' ? 'border-gray-300 hover:bg-gray-50' : 'border-gray-600 hover:bg-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium ${getTextClass()}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : `border ${theme === 'light' ? 'border-gray-300 hover:bg-gray-50' : 'border-gray-600 hover:bg-gray-700'} ${getTextClass()}`
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${theme === 'light' ? 'border-gray-300 hover:bg-gray-50' : 'border-gray-600 hover:bg-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium ${getTextClass()}`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrderCancellations;