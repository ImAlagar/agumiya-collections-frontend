// src/components/admin/order/OrderDetails.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  MapPin, 
  Package, 
  CreditCard, 
  Truck, 
  Mail, 
  Phone, 
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileText,
  ShoppingCart,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext'; // ✅ ADD THIS IMPORT
import { formatOrderAmount } from '../../../utils/currencyFormatter';

const OrderDetails = ({ order, onClose, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { formatPriceSimple } = useCurrency(); // ✅ ADD THIS HOOK

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

  // Safe function to get order display ID
  const getOrderDisplayId = () => {
    if (order.orderNumber) {
      return `#${order.orderNumber}`;
    }
    const idString = order.id ? order.id.toString() : '';
    return idString ? `#${idString.slice(-8)}` : '#N/A';
  };

  // ✅ CHANGED: Use formatPriceSimple instead of local formatCurrency
const formatCurrency = (amount) => {
  // Assuming most order amounts are > $10 (1000 cents)
  // If amount seems too large for dollars, treat as cents
  if (amount > 1000) {
    return formatPriceSimple(amount / 100);
  }
  return formatPriceSimple(amount);
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShoppingCart },
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'shipping', label: 'Shipping', icon: Truck }
  ];

  // Responsive grid classes
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
            {/* Order Summary */}
            <div className={`grid ${getGridClasses()} gap-3 sm:gap-4`}>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                  <ShoppingCart size={isMobile ? 14 : 16} />
                  Order Summary
                </label>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono">{getOrderDisplayId()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.fulfillmentStatus)}`}>
                      {order.fulfillmentStatus || 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold text-green-600">{formatOrderAmount(order?.totalAmount || 0, order?.currency)}</span> {/* ✅ Updated */}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                  <CreditCard size={isMobile ? 14 : 16} />
                  Payment Details
                </label>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="font-semibold">{formatOrderAmount(order?.totalAmount || 0, order?.currency)}</span> {/* ✅ Updated */}
                  </div>
                  {order.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="font-medium">Method:</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className={`grid ${getGridClasses()} gap-3 sm:gap-4`}>
              {order.printifyOrderId && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2">
                    Printify Information
                  </label>
                  <div className="text-xs sm:text-sm">
                    <div className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded break-all">
                      {order.printifyOrderId}
                    </div>
                  </div>
                </div>
              )}

              {order.orderNotes && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-2 flex items-center gap-2">
                    <FileText size={isMobile ? 14 : 16} />
                    Order Notes
                  </label>
                  <p className="text-xs sm:text-sm opacity-90 whitespace-pre-wrap">
                    {order.orderNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl text-center border border-gray-200 dark:border-gray-700">
                <div className="text-lg sm:text-xl font-bold text-blue-600">{order.items?.length || 0}</div>
                <div className="text-xs sm:text-sm opacity-75">Items</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl text-center border border-gray-200 dark:border-gray-700">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  {formatOrderAmount(order?.totalAmount || 0, order?.currency)}
                </div>
                <div className="text-xs sm:text-sm opacity-75">Total</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl text-center border border-gray-200 dark:border-gray-700">
                <div className="text-xs sm:text-sm font-bold text-purple-600">
                  {formatDate(order.createdAt)}
                </div>
                <div className="text-xs sm:text-sm opacity-75">Order Date</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl text-center border border-gray-200 dark:border-gray-700">
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.fulfillmentStatus)}`}>
                  {order.fulfillmentStatus || 'PENDING'}
                </div>
                <div className="text-xs sm:text-sm opacity-75 mt-1">Status</div>
              </div>
            </div>
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                <User size={isMobile ? 14 : 16} />
                Customer Information
              </label>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  <User size={14} className="text-blue-500" />
                  <div>
                    <div className="font-medium">Name</div>
                    <div>{getCustomerName()}</div>
                  </div>
                </div>
                
                {order.shippingAddress?.email && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <Mail size={14} className="text-green-500" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div>{order.shippingAddress.email}</div>
                    </div>
                  </div>
                )}
                
                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <Phone size={14} className="text-purple-500" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div>{order.shippingAddress.phone}</div>
                    </div>
                  </div>
                )}
                
                <div className="p-2">
                  <div className="font-medium">User ID</div>
                  <div className="font-mono text-xs opacity-75">{order.userId || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'items':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h4 className="font-semibold text-sm sm:text-base">
                Order Items ({order.items?.length || 0})
              </h4>
              <div className="text-xs sm:text-sm opacity-75">
                Total: {formatOrderAmount(order?.totalAmount || 0, order?.currency)}
              </div>
            </div>

            {order.items && order.items.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <tr>
                      <th className="text-left p-3 text-xs sm:text-sm font-medium">Product</th>
                      <th className="text-left p-3 text-xs sm:text-sm font-medium">Qty</th>
                      <th className="text-left p-3 text-xs sm:text-sm font-medium">Price</th>
                      <th className="text-left p-3 text-xs sm:text-sm font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.items.map((item, index) => (
                      <tr 
                        key={index}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {item.product?.images?.[0] && (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.product?.name || 'Unnamed Product'}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                SKU: {item.sku || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-xs sm:text-sm font-medium">{item.quantity || 1}</td>
                        <td className="p-3 text-xs sm:text-sm">{formatCurrency(item.price || 0)}</td> {/* ✅ Updated */}
                        <td className="p-3 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))} {/* ✅ Updated */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Package size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No items found in this order</p>
              </div>
            )}
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                <MapPin size={isMobile ? 14 : 16} />
                Shipping Address
              </label>
              {order.shippingAddress ? (
                <div className="text-xs sm:text-sm space-y-2">
                  <div className="font-semibold text-sm">{getCustomerName()}</div>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={12} className="text-gray-400" />
                    {order.shippingAddress.address1}
                  </div>
                  {order.shippingAddress.address2 && (
                    <div className="flex items-center gap-2">
                      <ChevronRight size={12} className="text-gray-400" />
                      {order.shippingAddress.address2}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <ChevronRight size={12} className="text-gray-400" />
                    {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.zipCode}
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={12} className="text-gray-400" />
                    {order.shippingAddress.country}
                  </div>
                  {order.shippingAddress.phone && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {order.shippingAddress.phone}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4 text-sm">
                  No shipping address provided
                </div>
              )}
            </div>

            {order.trackingNumber && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <label className="block text-xs sm:text-sm font-semibold opacity-75 mb-3 flex items-center gap-2">
                  <Truck size={isMobile ? 14 : 16} className="text-blue-500" />
                  Tracking Information
                </label>
                <div className="text-xs sm:text-sm space-y-2">
                  <div><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</div>
                  {order.carrier && <div><span className="font-medium">Carrier:</span> {order.carrier}</div>}
                </div>
              </div>
            )}
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
                  Order Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {getOrderDisplayId()} • {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            
            {/* Device indicator for debugging - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center gap-2 text-xs opacity-50 mt-1 text-gray-500">
                {isMobile ? <Smartphone size={12} /> : isTablet ? <Tablet size={12} /> : <Monitor size={12} />}
                <span>{isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</span>
              </div>
            )}
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

        {/* Tabs - Responsive */}
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

      {/* Footer Actions */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-3 sm:px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
            onClick={() => window.print()}
          >
            <FileText size={isMobile ? 14 : 16} />
            {isMobile ? 'Print' : 'Print Order'}
          </motion.button>
          
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 px-4 rounded-lg transition-all flex items-center justify-center text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onClose}
            >
              Done
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;