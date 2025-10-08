// src/components/user/checkout/EnhancedOrderSummary.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiTag, FiX } from 'react-icons/fi';

const EnhancedOrderSummary = ({ 
  cartItems = [], 
  subtotal, 
  shipping, 
  tax, 
  grandTotal, 
  currentStep, 
  themeStyles,
  formatPrice,
  appliedCoupon,
  onRemoveCoupon,
  discountAmount = 0
}) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  // Calculate totals with coupon discount
  const finalSubtotal = subtotal;
  const finalGrandTotal = Math.max(0, grandTotal - discountAmount);

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

        {/* Applied Coupon Display */}
        <AnimatePresence>
          {appliedCoupon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <FiTag className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {appliedCoupon.discountType === 'PERCENTAGE' 
                        ? `${appliedCoupon.discountValue}% off`
                        : `${formatPrice(appliedCoupon.discountValue).formatted} off`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
                >
                  <FiX className="text-green-600 dark:text-green-400" />
                </button>
              </div>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                Discount: -{formatPrice(discountAmount).formatted}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    
                    {/* Show discounted price if coupon applies to this item */}
                    {appliedCoupon && appliedCoupon.applicableItems?.some(appItem => 
                      appItem.id === item.id
                    ) && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Discount applied
                      </p>
                    )}
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
              {formatPrice(finalSubtotal).formatted}
            </span>
          </div>

          {/* Discount Line */}
          {appliedCoupon && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Discount</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                -{formatPrice(discountAmount).formatted}
              </span>
            </div>
          )}

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
              {formatPrice(finalGrandTotal).formatted}
            </span>
          </div>

          {/* Savings Info */}
          {appliedCoupon && (
            <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium mt-2">
              You saved {formatPrice(discountAmount).formatted}!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedOrderSummary;