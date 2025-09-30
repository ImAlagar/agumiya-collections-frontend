import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { FiCreditCard, FiMapPin, FiPackage, FiShield, FiCheck } from 'react-icons/fi';

const ReviewStep = ({ orderData, cartItems }) => {
  const { formatPrice, userCurrency, getCurrencySymbol } = useCurrency();

  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10; // Fixed shipping cost
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shipping + tax;

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    const methods = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay'
    };
    return methods[method] || method;
  };

  // Format card number for display
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '•••• •••• •••• ••••';
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="p-6 lg:p-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="text-green-600 dark:text-green-400 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Review Your Order
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Please verify all details before placing your order
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FiPackage className="mr-3 text-blue-600" size={24} />
                Order Items ({cartItems.length})
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item, index) => {
                const { formatted: itemTotalFormatted } = formatPrice(item.price * item.quantity, userCurrency);
                const { formatted: singlePriceFormatted } = formatPrice(item.price, userCurrency);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </div>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {singlePriceFormatted} each
                        </p>
                        {item.variant && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {item.variant.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {itemTotalFormatted}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FiCreditCard className="mr-3 text-purple-600" size={24} />
                Payment Method
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">CC</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPaymentMethod(orderData.paymentMethod)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCardNumber(orderData.paymentDetails.cardNumber)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expires: {orderData.paymentDetails.expiryDate}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">👤</span>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Cardholder Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {orderData.paymentDetails.nameOnCard}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column - Shipping & Payment */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FiMapPin className="mr-3 text-green-600" size={24} />
                Shipping Address
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {orderData.shippingAddress.name}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-semibold">🏠</span>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {orderData.shippingAddress.street}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {orderData.shippingAddress.country}
                    </p>
                  </div>
                </motion.div>

                {/* Shipping Method */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPackage className="text-purple-600 dark:text-purple-400" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Standard Shipping
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>



          {/* Security & Guarantees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiShield className="mr-3 text-green-600" size={24} />
              Your Order is Protected
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white text-xs" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Secure SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white text-xs" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Price protection guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white text-xs" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">30-day return policy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white text-xs" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">24/7 customer support</span>
              </div>
            </div>
          </motion.div>

          {/* Currency Information */}
          {userCurrency !== 'USD' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Amount in {userCurrency}
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                  {getCurrencySymbol()} {userCurrency}
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
                Prices automatically converted to your local currency
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Final Confirmation Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
          </div>
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">
              Final Confirmation
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Please review all details carefully. Once you place the order, it will be processed immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewStep;