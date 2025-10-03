// src/components/admin/order/OrderTable.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';
import OrderDetails from './OrderDetails';
import { itemVariants, staggerVariants } from '../../../contexts/ProductsContext';
import { Package, Calendar, User, CreditCard, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

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
    REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[status] || statusConfig.PENDING}`}>
      <CreditCard className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
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
  onUpdateStatus,
  onRetryPrintify,
  actionLoading
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  if (isLoading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Package className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or check back later for new orders.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden"
      >
        {/* Page Size Selector */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {pagination?.totalCount || 0} orders
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select 
              value={pagination?.limit || 5}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
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
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400 min-w-[250px]">Order</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Payment</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Printify</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
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
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(order.totalAmount || 0)}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.fulfillmentStatus || 'PENDING'} />
                  </td>
                  <td className="p-4">
                    <PaymentStatusBadge status={order.paymentStatus || 'PENDING'} />
                  </td>
                  <td className="p-4">
                    <PrintifyStatusBadge order={order} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id || index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRowClick(order)}
            >
              <div className="flex justify-between items-start mb-3">
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
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getOrderDisplayId(order)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items?.length || 0} item(s)
                    </div>
                  </div>
                </div>
                <StatusBadge status={order.fulfillmentStatus || 'PENDING'} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Customer
                  </div>
                  <div className="font-medium truncate">
                    {getCustomerName(order)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Amount</div>
                  <div className="font-semibold">{formatCurrency(order.totalAmount || 0)}</div>
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
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                  Tap to view details
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                        pagination.currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
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
            />
          </div>
        </div>
      )}
    </>
  );
};

// Icon components
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