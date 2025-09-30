// src/pages/OrderDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../../contexts/OrdersContext';
import { SEO } from '../../contexts/SEOContext';

const OrderDetails = () => {
  const { id } = useParams();
  const { currentOrder, fetchOrderById, updateOrderStatus, isLoading, error } = useOrders();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <Link
            to="/orders"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Order #${currentOrder.orderNumber} | ShopStyle`}
        description={`Order details for ${currentOrder.orderNumber}`}
        canonical={`/orders/${currentOrder.id}`}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to="/orders"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
                >
                  ← Back to Orders
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Order #{currentOrder.orderNumber}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(currentOrder.status)}`}>
                  {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                </span>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(currentOrder.paymentStatus)}`}>
                    Payment: {currentOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex -mb-px">
                    {['details', 'items', 'shipping', 'updates'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
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
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Order Summary
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${currentOrder.subtotal?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${currentOrder.shippingCost?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${currentOrder.taxAmount?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                  ${currentOrder.totalAmount?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Payment Information
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Method</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {currentOrder.paymentMethod || 'Credit Card'}
                                </p>
                              </div>
                              {currentOrder.transactionId && (
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {currentOrder.transactionId}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'items' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Order Items
                        </h3>
                        <div className="space-y-4">
                          {currentOrder.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Variant: {item.variant}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  ${item.price?.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

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
                              <p>{currentOrder.shippingAddress?.name}</p>
                              <p>{currentOrder.shippingAddress?.street}</p>
                              <p>
                                {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} {currentOrder.shippingAddress?.zipCode}
                              </p>
                              <p>{currentOrder.shippingAddress?.country}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Shipping Method
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {currentOrder.shippingMethod || 'Standard Shipping'}
                            </p>
                            {currentOrder.trackingNumber && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  Tracking Information
                                </h4>
                                <p className="text-primary-600 dark:text-primary-400 font-medium">
                                  {currentOrder.trackingNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'updates' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Order Timeline
                        </h3>
                        <div className="space-y-4">
                          {currentOrder.statusHistory?.map((update, index) => (
                            <div key={index} className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(update.timestamp).toLocaleString()}
                                </p>
                                {update.note && (
                                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                    {update.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Download Invoice
                  </button>
                  <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                    Contact Support
                  </button>
                  {currentOrder.status === 'pending' && (
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Our support team is here to help with your order.</p>
                  <p>Email: support@shopstyle.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
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