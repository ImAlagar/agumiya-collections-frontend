// src/components/admin/order/OrderDetails.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Package, CreditCard, Truck, Mail, Phone, ChevronRight, Menu } from 'lucide-react';

const OrderDetails = ({ order, onClose, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const mobileContainerVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: '100%',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const tabContentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200
      }
    }
  };

  // Safe function to get order display ID
  const getOrderDisplayId = () => {
    if (order.orderNumber) {
      return `#${order.orderNumber}`;
    }
    const idString = order.id ? order.id.toString() : '';
    return idString ? `#${idString.slice(-8)}` : '#N/A';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  // Get customer name from shipping address
  const getCustomerName = () => {
    if (order.shippingAddress) {
      return `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() || 'N/A';
    }
    return 'N/A';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'shipping', label: 'Shipping', icon: Truck }
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || colors.PENDING;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      PAID: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || colors.PENDING;
  };

  const TabContent = ({ activeTab }) => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-4 md:space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <label className="block text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                  <Package size={16} />
                  Order Information
                </label>
                <div className="space-y-3 text-sm">
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="text-gray-900 dark:text-white mt-1 sm:mt-0">{formatDate(order.createdAt)}</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.fulfillmentStatus)} mt-1 sm:mt-0`}>
                      {order.fulfillmentStatus || 'PENDING'}
                    </span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)} mt-1 sm:mt-0`}>
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="font-semibold text-gray-900 dark:text-white mt-1 sm:mt-0">{formatCurrency(order.totalAmount || 0)}</span>
                  </motion.div>
                  {order.printifyOrderId && (
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Printify ID:</span>
                      <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded mt-1 sm:mt-0">{order.printifyOrderId}</code>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <label className="block text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                  <CreditCard size={16} />
                  Payment Details
                </label>
                <div className="space-y-3 text-sm">
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)} mt-1 sm:mt-0`}>
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-gray-900 dark:text-white mt-1 sm:mt-0">{formatCurrency(order.totalAmount || 0)}</span>
                  </motion.div>
                  {order.paymentMethod && (
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Method:</span>
                      <span className="text-gray-900 dark:text-white mt-1 sm:mt-0">{order.paymentMethod}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'customer':
        return (
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-4 md:space-y-6"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <label className="block text-sm font-semibold opacity-75 mb-4 flex items-center gap-2">
                <User size={16} />
                Customer Information
              </label>
              <div className="space-y-4 text-sm">
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                  </div>
                  <span className="text-gray-900 dark:text-white mt-1 sm:mt-0 sm:text-right">{getCustomerName()}</span>
                </motion.div>
                {order.shippingAddress?.email && (
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-green-500 flex-shrink-0" />
                      <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white mt-1 sm:mt-0 sm:text-right break-all">{order.shippingAddress.email}</span>
                  </motion.div>
                )}
                {order.shippingAddress?.phone && (
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white mt-1 sm:mt-0 sm:text-right">{order.shippingAddress.phone}</span>
                  </motion.div>
                )}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between p-3">
                  <span className="font-medium text-gray-600 dark:text-gray-400">User ID:</span>
                  <span className="text-gray-900 dark:text-white mt-1 sm:mt-0 font-mono text-sm">{order.userId || 'N/A'}</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'items':
        return (
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-4 md:space-y-6"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">Order Items ({order.items?.length || 0})</h4>
            </motion.div>
            {order.items && order.items.length > 0 ? (
              <motion.div 
                variants={itemVariants}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
              >
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4"
                    >
                      <div className="flex gap-3">
                        {item.product?.images?.[0] && (
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                            {item.product?.name || 'Unnamed Product'}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            SKU: {item.sku || 'N/A'}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Qty: {item.quantity || 1}</span>
                            <span className="font-medium">{formatCurrency(item.price || 0)}</span>
                          </div>
                          <div className="text-right text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                            Total: {formatCurrency((item.price || 0) * (item.quantity || 1))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden md:table w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Product</th>
                      <th className="text-left p-4 text-sm font-medium">Quantity</th>
                      <th className="text-left p-4 text-sm font-medium">Price</th>
                      <th className="text-left p-4 text-sm font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.items.map((item, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                          transition: { duration: 0.2 }
                        }}
                        className="group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              <motion.img 
                                whileHover={{ scale: 1.1 }}
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {item.product?.name || 'Unnamed Product'}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                SKU: {item.sku || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium">{item.quantity || 1}</td>
                        <td className="p-4 text-sm">{formatCurrency(item.price || 0)}</td>
                        <td className="p-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                variants={itemVariants}
                className="text-center py-8 md:py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <Package size={32} className="mx-auto mb-3 opacity-50" />
                <p>No items found in this order</p>
              </motion.div>
            )}
          </motion.div>
        );

      case 'shipping':
        return (
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-4 md:space-y-6"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <label className="block text-sm font-semibold opacity-75 mb-4 flex items-center gap-2">
                <MapPin size={16} />
                Shipping Address
              </label>
              {order.shippingAddress ? (
                <div className="text-sm space-y-3">
                  <motion.div variants={itemVariants} className="font-medium text-lg mb-3">{getCustomerName()}</motion.div>
                  <motion.div variants={itemVariants} className="flex items-start gap-2 py-2 border-b border-gray-100 dark:border-gray-700">
                    <ChevronRight size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">{order.shippingAddress.address1}</span>
                  </motion.div>
                  {order.shippingAddress.address2 && (
                    <motion.div variants={itemVariants} className="flex items-start gap-2 py-2 border-b border-gray-100 dark:border-gray-700">
                      <ChevronRight size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white">{order.shippingAddress.address2}</span>
                    </motion.div>
                  )}
                  <motion.div variants={itemVariants} className="flex items-start gap-2 py-2 border-b border-gray-100 dark:border-gray-700">
                    <ChevronRight size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">
                      {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.zipCode}
                    </span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex items-start gap-2 py-2">
                    <ChevronRight size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">{order.shippingAddress.country}</span>
                  </motion.div>
                  {order.shippingAddress.phone && (
                    <motion.div variants={itemVariants} className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                      <Phone size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white">{order.shippingAddress.phone}</span>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div variants={itemVariants} className="text-gray-500 text-center py-4">
                  No shipping address provided
                </motion.div>
              )}
            </motion.div>

            {order.trackingNumber && (
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 md:p-5 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <label className="block text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                  <Truck size={16} className="text-blue-500" />
                  Tracking Information
                </label>
                <div className="text-sm space-y-2">
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Tracking Number:</span>
                    <span className="text-gray-900 dark:text-white font-mono text-sm mt-1 sm:mt-0">{order.trackingNumber}</span>
                  </motion.div>
                  {order.carrier && (
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Carrier:</span>
                      <span className="text-gray-900 dark:text-white mt-1 sm:mt-0">{order.carrier}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Mobile menu for tabs
  const MobileTabMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 p-2 md:hidden"
          >
            <div className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-4 text-sm font-medium rounded-lg transition-all flex items-center gap-3 ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComponent size={18} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Mobile Tab Menu */}
      <MobileTabMenu />

      {/* Desktop Side Panel / Mobile Bottom Sheet */}
      <motion.div
        variants={{
          desktop: containerVariants,
          mobile: mobileContainerVariants
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`
          fixed md:relative md:h-full 
          md:rounded-l-2xl md:border-l border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col
          inset-x-0 bottom-0 top-20 md:top-0 md:inset-x-auto md:right-0 md:left-auto
          md:w-[600px] lg:w-[700px]
        `}
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
        >
          <div className="flex justify-between items-start md:items-center mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">Order Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {getOrderDisplayId()}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:hidden"
              >
                <Menu size={20} />
              </motion.button>
              
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          {/* Desktop Tabs - Hidden on Mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl"
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 relative ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent size={14} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Mobile Current Tab Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 md:hidden pt-2"
          >
            {tabs.find(tab => tab.id === activeTab)?.icon && (
              <>
                {React.createElement(tabs.find(tab => tab.id === activeTab).icon, { size: 16 })}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </span>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TabContent activeTab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default OrderDetails;