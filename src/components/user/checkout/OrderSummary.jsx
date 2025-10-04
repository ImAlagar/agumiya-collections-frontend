import React from 'react';
import { motion } from 'framer-motion';

const OrderSummary = ({ 
  cartItems = [], 
  subtotal, 
  shipping, 
  tax, 
  grandTotal, 
  currentStep, 
  themeStyles,
  formatPrice 
}) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} sticky top-8`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Order Summary
        </h2>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Items ({safeCartItems.length})
          </h3>
          
          {safeCartItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Your cart is empty
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {safeCartItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-600 rounded-md overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name || 'Unnamed Product'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPrice(item.price || 0).formatted} × {item.quantity || 1}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice((item.price || 0) * (item.quantity || 1)).formatted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(subtotal).formatted}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {shipping === 0 ? 'Free' : formatPrice(shipping).formatted}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(tax).formatted}
            </span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-blue-600 dark:text-blue-400">
              {formatPrice(grandTotal).formatted}
            </span>
          </div>
        </div>

        {/* Security Badge */}
        {currentStep === 3 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">🔒</span>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Secure Checkout
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderSummary;