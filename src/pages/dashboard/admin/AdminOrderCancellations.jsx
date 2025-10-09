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
  RotateCcw
} from 'lucide-react';
import { useOrders } from '../../../contexts/OrdersContext';
import { SEO } from '../../../contexts/SEOContext';
import { useCurrency } from '../../../contexts/CurrencyContext';

const AdminOrderCancellations = () => {
  const { 
    cancelledOrders, 
    cancellationStats, 
    refundLoading,
    fetchCancelledOrders, 
    fetchCancellationStats,
    processRefund,
    retryRefund,
    adminCancelOrder
  } = useOrders();
  
  const { formatPriceSimple } = useCurrency();
  
  const [filters, setFilters] = useState({
    search: '',
    refundStatus: 'all',
    page: 1,
    limit: 10
  });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  useEffect(() => {
    fetchCancelledOrders(filters.page, filters);
    fetchCancellationStats();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
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
    const result = await processRefund(orderId, refundReason);
    setLoadingAction(null);
    
    if (result.success) {
      setShowRefundModal(false);
      setRefundReason('');
      fetchCancelledOrders(filters.page, filters);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', label: 'Pending' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'Processing' },
      COMPLETED: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', label: 'Completed' },
      FAILED: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Failed' },
      NOT_REQUIRED: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', label: 'Not Required' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCancelledByBadge = (cancelledBy) => {
    const isAdmin = cancelledBy === 'admin';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAdmin ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      }`}>
        {isAdmin ? 'Admin' : 'Customer'}
      </span>
    );
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {order.items?.length || 0} items • {new Date(order.cancelledAt).toLocaleDateString()}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMobileMenuOpen(mobileMenuOpen === order.id ? null : order.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <MoreVertical size={16} />
          </button>
          
          <AnimatePresence>
            {mobileMenuOpen === order.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[140px]"
              >
                <button
                  onClick={() => {/* Navigate to order details */}}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                    className="flex items-center w-full px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                    className="flex items-center w-full px-3 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
        <User size={16} className="text-gray-400 mr-2" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {order.user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {order.user?.email}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatPriceSimple(order.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Refund Status</p>
          <div className="mt-1">{getStatusBadge(order.refundStatus)}</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled By</p>
          <div className="mt-1">{getCancelledByBadge(order.cancelledBy)}</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {new Date(order.cancelledAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        {order.refundStatus === 'PENDING' && (
          <button
            onClick={() => {
              setSelectedOrder(order);
              setShowRefundModal(true);
            }}
            disabled={loadingAction}
            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Process Refund
          </button>
        )}
        
        {order.refundStatus === 'FAILED' && (
          <button
            onClick={() => handleRetryRefund(order.id)}
            disabled={loadingAction === `retry-${order.id}`}
            className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
          >
            {loadingAction === `retry-${order.id}` ? 'Retrying...' : 'Retry Refund'}
          </button>
        )}
        
        <button
          onClick={() => {/* Navigate to order details */}}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          View Details
        </button>
      </div>
    </div>
  );

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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cancel Order #{selectedOrder.id}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
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
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  disabled={loadingAction || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Process Refund for Order #{selectedOrder.id}
              </h3>
              
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Amount to refund: <strong>{formatPriceSimple(selectedOrder.refundAmount || selectedOrder.totalAmount)}</strong>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refund Reason *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter refund reason..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
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
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleProcessRefund(selectedOrder.id)}
                  disabled={loadingAction || !refundReason.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Cancellations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage cancelled orders and refund processing
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => {
                fetchCancelledOrders(filters.page, filters);
                fetchCancellationStats();
              }}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards - Responsive Grid */}
        {cancellationStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <X className="text-red-600 dark:text-red-400" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Cancelled
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {cancellationStats.totalCancelled}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Refunds
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {cancellationStats.pendingRefunds}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed Refunds
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {cancellationStats.completedRefunds}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Refunded
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPriceSimple(cancellationStats.totalRefunded)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Simplified Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by ID, customer name or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refund Status
              </label>
              <select
                value={filters.refundStatus}
                onChange={(e) => handleFilterChange('refundStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List - Mobile Cards & Desktop Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Mobile View - Cards */}
          <div className="block sm:hidden">
            <div className="p-4">
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No cancelled orders</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by cancelling an order from the orders page.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Refund Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cancelled By
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cancelledOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.user?.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPriceSimple(order.totalAmount)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.refundStatus)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      {getCancelledByBadge(order.cancelledBy)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.cancelledAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {order.refundStatus === 'PENDING' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowRefundModal(true);
                            }}
                            disabled={loadingAction}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          >
                            Process Refund
                          </button>
                        )}

                        {order.refundStatus === 'FAILED' && (
                          <button
                            onClick={() => handleRetryRefund(order.id)}
                            disabled={loadingAction === `retry-${order.id}`}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 disabled:opacity-50"
                          >
                            {loadingAction === `retry-${order.id}` ? 'Retrying...' : 'Retry'}
                          </button>
                        )}

                        <button
                          onClick={() => {/* Navigate to order details */}}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State for Desktop */}
          {cancelledOrders.length === 0 && (
            <div className="hidden sm:block text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No cancelled orders</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by cancelling an order from the orders page.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrderCancellations;