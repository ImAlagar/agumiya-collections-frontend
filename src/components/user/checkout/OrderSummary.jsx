// src/components/common/OrderSummary.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiTag, FiCheck, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OrderSummary = ({ 
  // Data props
  cartItems = [], 
  appliedCoupon = null,
  shippingCost = 0,
  taxRate = 0.08, // 8% default tax
  currency = 'USD',
  
  // Function props
  formatPrice,
  getCurrencySymbol,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  
  // Configuration props
  showCouponSection = true,
  showActionButtons = true,
  showTrustBadges = true,
  showCurrencyInfo = true,
  showItemsList = true,
  isSticky = true,
  
  // UI props
  themeStyles = {
    card: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    input: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
  },
  
  // State props (for internal coupon management)
  couponLoading = false,
  isCheckout = false
}) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  // Calculate totals
  const subtotal = safeCartItems.reduce((sum, item) => 
    sum + (item.price || 0) * (item.quantity || 1), 0
  );
  
  const shipping = shippingCost;
  const tax = subtotal * taxRate;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal + shipping + tax - discountAmount);

  // Internal coupon state management
  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [isApplying, setIsApplying] = React.useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (safeCartItems.length === 0) {
      setCouponError('Add items to cart before applying coupon');
      return;
    }

    setIsApplying(true);
    setCouponError('');

    try {
      if (onApplyCoupon) {
        await onApplyCoupon(couponCode);
        setCouponCode('');
      }
    } catch (error) {
      setCouponError(error.message || 'Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponError('');
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
  };

  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout({
        cartItems: safeCartItems,
        appliedCoupon,
        totals: {
          subtotal,
          discount: discountAmount,
          shipping,
          tax,
          grandTotal
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} ${isSticky ? 'sticky top-8' : ''}`}
    >
      <div className="p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="mr-3">📦</span>
          Order Summary
        </h3>

        {/* Coupon Section */}
        {showCouponSection && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiTag className="mr-2" />
              {appliedCoupon ? 'Applied Coupon' : 'Apply Coupon'}
            </h4>

            {!appliedCoupon ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-4 py-3 ${themeStyles.input} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400`}
                    disabled={isApplying || couponLoading}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplying || couponLoading || safeCartItems.length === 0}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center"
                  >
                    {isApplying || couponLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Applying...</span>
                      </>
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>
                
                {couponError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 dark:text-red-400 text-sm flex items-center"
                  >
                    <FiX className="mr-1" />
                    {couponError}
                  </motion.p>
                )}

                {/* Coupon Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-300 text-xs">
                    💡 <strong>Tip:</strong> Try coupon codes like <strong>H7TSR1AP</strong> for discounts
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiCheck className="text-green-600 dark:text-green-400" />
                    <div>
                      <span className="font-semibold text-green-800 dark:text-green-300 block">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-green-600 dark:text-green-400 text-sm block">
                        -{formatPrice(discountAmount, currency).formatted}
                        {appliedCoupon.discountType === 'PERCENTAGE' && (
                          <span className="text-xs ml-1">({appliedCoupon.discountValue}% off)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove coupon"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                {appliedCoupon.applicableSubtotal && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                    Applied to {formatPrice(appliedCoupon.applicableSubtotal, currency).formatted} of items
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Items List */}
        {showItemsList && safeCartItems.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Items ({safeCartItems.length})
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {safeCartItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-600 rounded-md overflow-hidden">
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
                      {formatPrice(item.price || 0, currency).formatted} × {item.quantity || 1}
                    </p>
                    {item.variant?.title && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {item.variant.title}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice((item.price || 0) * (item.quantity || 1), currency).formatted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {formatPrice(subtotal, currency).formatted}
            </span>
          </div>

          {appliedCoupon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-gray-700"
            >
              <span className="text-green-600 dark:text-green-400">Discount</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                -{formatPrice(discountAmount, currency).formatted}
              </span>
            </motion.div>
          )}

          <div className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {shipping === 0 ? 'Free' : formatPrice(shipping, currency).formatted}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {formatPrice(tax, currency).formatted}
            </span>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
            <div className="text-right">
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(grandTotal, currency).formatted}
              </span>
              {currency !== 'USD' && showCurrencyInfo && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ≈ {formatPrice(grandTotal, 'USD').formatted}
                </p>
              )}
            </div>
          </div>

          {/* Savings Display */}
          {appliedCoupon && discountAmount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800"
            >
              <p className="text-green-700 dark:text-green-300 text-sm text-center">
                🎉 You saved {formatPrice(discountAmount, currency).formatted}!
              </p>
            </motion.div>
          )}
        </div>

        {/* Currency Info */}
        {currency !== 'USD' && showCurrencyInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                Prices in {currency}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {getCurrencySymbol ? getCurrencySymbol(currency) : '$'} {currency}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
              Amounts automatically converted from USD
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="space-y-4">
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-bold text-lg text-center block transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group"
            >
              <span>{isCheckout ? 'Complete Order' : 'Proceed to Checkout'}</span>
              <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {!isCheckout && (
              <Link
                to="/shop"
                className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 py-3 px-6 rounded-2xl font-semibold text-center block transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FiShoppingBag size={18} />
                <span>Continue Shopping</span>
              </Link>
            )}
          </div>
        )}

        {/* Trust Badges */}
        {showTrustBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Secure</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🚚</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Fast Shipping</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">↩️</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderSummary;