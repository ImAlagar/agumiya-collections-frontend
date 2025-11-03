// src/components/admin/order/OrderTable.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';
import OrderDetails from './OrderDetails';
import { itemVariants, staggerVariants } from '../../../contexts/ProductsContext';
import { Package, Calendar, User, CreditCard, Truck, ChevronLeft, ChevronRight, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext'; // ✅ Already added
import { formatOrderAmount } from '../../../utils/currencyFormatter';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      icon: ClockIcon 
    },
    CONFIRMED: { 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: CheckCircleIcon 
    },
    PROCESSING: { 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      icon: ArrowUpAZIcon 
    },
    SHIPPED: { 
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      icon: TruckIcon 
    },
    DELIVERED: { 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: CheckCircleIcon 
    },
    CANCELLED: { 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      icon: XCircleIcon 
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    REFUND_PENDING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[status] || statusConfig.PENDING}`}>
      <CreditCard className="w-3 h-3 mr-1" />
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
    </span>
  );
};

const PrintifyStatusBadge = ({ order }) => {
  if (order.printifyOrderId) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Sent
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <ClockIcon className="w-3 h-3 mr-1" />
      Pending
    </span>
  );
};

const OrderTable = ({ 
  orders, 
  isLoading, 
  pagination, 
  onPageChange,
  onPageSizeChange,
  onViewOrder,
  onStatusUpdate,
  onCancelOrder,
  actionLoading
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { formatPriceSimple, getCurrencySymbol } = useCurrency(); // ✅ Already added
  
  // Safe function to ensure orders is always an array
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  // Rest of your component code remains the same...
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ CHANGED: Remove local formatCurrency and use formatPriceSimple directly
const formatCurrency = (amount) => {
  // Assuming most order amounts are > $10 (1000 cents)
  // If amount seems too large for dollars, treat as cents
  if (amount > 1000) {
    return formatPriceSimple(amount / 100);
  }
  return formatPriceSimple(amount);
};

  // Safe function to get order display ID
  const getOrderDisplayId = (order) => {
    if (order.orderNumber) {
      return `#${order.orderNumber}`;
    }
    const idString = order.id ? order.id.toString() : '';
    return idString ? `#${idString.slice(-8)}` : '#N/A';
  };

  // Get customer name from shipping address
  const getCustomerName = (order) => {
    if (order.shippingAddress) {
      return `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() || 'N/A';
    }
    return 'N/A';
  };

  
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
    if (onViewOrder) {
      onViewOrder(order);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdateClick = (order, e) => {
    e?.stopPropagation(); // Prevent row click
    if (onStatusUpdate) {
      onStatusUpdate(order, e);
    } else {
      // Fallback if prop not provided
      setSelectedOrder(order);
      setShowStatusModal(true);
    }
  };
  // Add cancel order handler
  const handleCancelClick = (order, e) => {
    e.stopPropagation(); // Prevent row click
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedOrder || !cancelReason.trim()) return;
    
    try {
      await onCancelOrder(selectedOrder.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Cancel order error:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (onPageChange && pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      onPageChange(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Calculate showing range
  const getShowingRange = () => {
    if (!pagination || !safeOrders.length) return { start: 0, end: 0, total: 0 };
    
    const start = ((pagination.currentPage - 1) * pagination.limit) + 1;
    const end = Math.min(pagination.currentPage * pagination.limit, pagination.totalCount);
    
    return {
      start,
      end,
      total: pagination.totalCount
    };
  };

  // Generate page numbers for pagination
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

  if (isLoading && !safeOrders.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (safeOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Package className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {Array.isArray(orders) ? 'Try adjusting your filters or check back later for new orders.' : 'Unable to load orders. Please try refreshing the page.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Cancel Order Modal */}
      {showCancelModal && (
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
                  Cancel Order #{selectedOrder?.orderNumber || selectedOrder?.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for cancellation *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
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
                disabled={actionLoading === `cancel-${selectedOrder?.id}`}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={actionLoading === `cancel-${selectedOrder?.id}` || !cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading === `cancel-${selectedOrder?.id}` ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden"
      >
        {/* Page Size Selector */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination ? (
              <>
                Showing {showingRange.start}-{showingRange.end} of {showingRange.total} orders
              </>
            ) : (
              `Total: ${safeOrders.length} orders`
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
              <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Order</th>
              <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
              <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
              <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
              <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeOrders.map((order, index) => (
              <motion.tr
                key={order.id || index}
                variants={itemVariants}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group"
                onClick={() => handleRowClick(order)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {order.items?.[0]?.product?.images?.[0] ? (
                        <img 
                          src={order.items[0].product.images[0]} 
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
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {getOrderDisplayId(order)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {order.items?.length || 0} item(s)
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getCustomerName(order)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.shippingAddress?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-900 dark:text-white">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatOrderAmount(order?.totalAmount || 0, order?.currency)}
                  </div>
                </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  {/* Status Update Button */}
                  <button
                    onClick={(e) => handleStatusUpdateClick(order, e)}
                    disabled={actionLoading === `status-${order.id}`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading === `status-${order.id}` ? 'Updating...' : 'Update Status'}
                  </button>

                  {/* Cancel Button */}
                  {order.fulfillmentStatus !== 'CANCELLED' && (
                    <button
                      onClick={(e) => handleCancelClick(order, e)}
                      disabled={actionLoading === `cancel-${order.id}`}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading === `cancel-${order.id}` ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
{/* MObile card */}
    <div className="md:hidden space-y-4 px-3 pb-6 w-full overflow-y-auto max-h-[calc(100vh-220px)]">
      {safeOrders.map((order, index) => (
        <motion.div
          key={order.id || index}
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-all duration-150"
          onClick={() => handleRowClick(order)}
        >
          {/* Header: Image + ID + Status */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {order.items?.[0]?.product?.images?.[0] ? (
                  <img
                    src={order.items[0].product.images[0]}
                    alt="Product"
                    className="w-14 h-14 rounded-lg object-cover shadow-sm"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/40/40';
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
                  {getOrderDisplayId(order)}
                </div>
                <div className="text-xs text-gray-500">
                  {order.items?.length || 0} item(s)
                </div>
              </div>
            </div>
            <StatusBadge status={order.fulfillmentStatus || 'PENDING'} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                Customer
              </div>
              <div className="font-medium truncate text-gray-900 dark:text-gray-200">
                {getCustomerName(order)}
              </div>
            </div>

            <div>
              <div className="text-gray-600 dark:text-gray-400">Amount</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(order.totalAmount || 0)}
              </div>
            </div>

            <div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Payment
              </div>
              <div className="font-medium">
                <PaymentStatusBadge status={order.paymentStatus || 'PENDING'} />
              </div>
            </div>

            <div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Printify
              </div>
              <div className="font-medium">
                <PrintifyStatusBadge order={order} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 mb-3 w-full">
            {/* Status Update Button */}
            <button
              onClick={(e) => handleStatusUpdateClick(order, e)}
              disabled={actionLoading === `status-${order.id}`}
              className="flex-1 px-3 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {actionLoading === `status-${order.id}` ? 'Updating...' : 'Update Status'}
            </button>

            {/* Cancel Button */}
            {order.fulfillmentStatus !== 'CANCELLED' && (
              <button
                onClick={(e) => handleCancelClick(order, e)}
                disabled={actionLoading === `cancel-${order.id}`}
                className="flex-1 px-3 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
              >
                {actionLoading === `cancel-${order.id}` ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-200 dark:border-gray-700 mt-3 gap-2 sm:gap-0">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
            </div>
            <div className="text-blue-600 dark:text-blue-400 text-xs font-medium text-right">
              Tap to view details →
            </div>
          </div>
        </motion.div>
      ))}
    </div>



      {pagination && pagination.totalPages > 1 && (
        <div className="w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-4"
          >
            {/* Showing Range Info */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap text-center sm:text-left">
              Showing {showingRange.start}-{showingRange.end} of {showingRange.total} orders
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide px-1 max-w-full sm:max-w-none">
              
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-xs sm:text-sm font-medium shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
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
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-w-[30px] sm:min-w-[36px] shrink-0 ${
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
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-xs sm:text-sm font-medium shrink-0"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      </motion.div>

      {/* Order Details Sidebar */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseDetails} />
          <div className="relative w-full max-w-2xl h-full">
            <OrderDetails 
              order={selectedOrder} 
              onClose={handleCloseDetails}
              onCancelOrder={onCancelOrder}
            />
          </div>
        </div>
      )}
    </>
  );
};

// Icon components (remain the same)
const ClockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TruckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowUpAZIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

export default OrderTable;