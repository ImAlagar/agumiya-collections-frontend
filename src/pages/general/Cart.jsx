// src/pages/general/Cart.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthProvider';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { formatPrice, userCurrency, getCurrencySymbol } = useCurrency();
  const { isAuthenticated } = useAuth(); // Add this
  // Calculate totals using the total from cart context
  const subtotal = total || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10; // Fixed shipping cost
  const tax = subtotal * 0.08; // 8% tax
const grandTotal = Math.max(0, subtotal + shipping + tax - discountAmount);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };



  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl mb-6"
            >
              🛒
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Discover amazing products and add them to your cart. Start shopping to find items you'll love!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <FiShoppingBag size={20} />
                <span>Continue Shopping</span>
              </Link>
              <Link
                to="/"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }


    useEffect(() => {
    // This will make the cart re-render when auth state changes
  }, [isAuthenticated]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FiTrash2 size={18} />
                <span>Clear Cart</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FiShoppingCart className="mr-3 text-blue-600" size={24} />
                  Cart Items
                </h2>
              </div>
              
              <AnimatePresence>
                {cartItems.map((item, index) => {
                  const { formatted: itemTotalFormatted } = formatPrice(item.price * item.quantity, userCurrency);
                  const { formatted: singlePriceFormatted } = formatPrice(item.price, userCurrency);
                  
                  return (
                    <motion.div
                      key={`${item.id}-${index}`}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
                      className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      {/* Product Image & Basic Info */}
                      <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                        {/* Product Image */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
                            {item.quantity}
                          </div>
                        </motion.div>
                        
                        {/* Product Info - Mobile Layout */}
                        <div className="flex-1 ml-4 sm:ml-6 min-w-0 sm:hidden">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </h3>
                          
                          {item.variant?.title && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium text-xs mt-1">
                              {item.variant.title}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-1 mt-2">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              {singlePriceFormatted}
                            </p>
                            <span className="text-gray-400 text-sm">×</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                              {item.quantity}
                            </span>
                            <span className="text-gray-400 text-sm">=</span>
                            <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                              {itemTotalFormatted}
                            </p>
                          </div>

                          {/* Original USD Price if different currency */}
                          {userCurrency !== 'USD' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ≈ {formatPrice(item.price * item.quantity, 'USD').formatted}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Product Info - Desktop Layout */}
                      <div className="hidden sm:flex flex-1 ml-6 min-w-0">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg lg:text-xl line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </h3>
                          
                          {item.variant?.title && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-1">
                              {item.variant.title}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {singlePriceFormatted}
                            </p>
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              {item.quantity}
                            </span>
                            <span className="text-gray-400">=</span>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {itemTotalFormatted}
                            </p>
                          </div>

                          {/* Original USD Price if different currency */}
                          {userCurrency !== 'USD' && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ≈ {formatPrice(item.price * item.quantity, 'USD').formatted}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end sm:space-x-4 sm:ml-4 mt-4 sm:mt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 shadow-sm">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="p-2 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus size={14} className="sm:w-4" />
                          </motion.button>
                          
                          <span className="px-2 sm:px-3 py-2 text-gray-900 dark:text-white font-semibold min-w-[30px] sm:min-w-[40px] text-center border-l border-r border-gray-300 dark:border-gray-600 text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                          >
                            <FiPlus size={14} className="sm:w-4" />
                          </motion.button>
                        </div>
                        
                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 sm:p-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group/remove ml-2 sm:ml-0"
                          title="Remove item"
                        >
                          <FiTrash2 size={16} className="sm:w-5 group-hover/remove:scale-110 transition-transform" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Link
                to="/shop"
                className="flex items-center justify-center space-x-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 group text-sm sm:text-base"
              >
                <FiPlus size={20} className="sm:w-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Continue Shopping</span>
              </Link>
            </motion.div>
          </div>
          {/* Coupon Section in Cart */}
          <div className="mb-6">
            <CouponSection
              subtotal={subtotal}
              cartItems={cartItems}
              onCouponApplied={(coupon) => {
                // Update cart totals with discount
                setAppliedCoupon(coupon);
                setDiscountAmount(coupon.discountAmount);
              }}
              onCouponRemoved={() => {
                setAppliedCoupon(null);
                setDiscountAmount(0);
              }}
              themeStyles={themeStyles}
            />
          </div>


          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 sticky top-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-3">📦</span>
                Order Summary
              </h3>
              
              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Subtotal', amount: subtotal },
                  { label: 'Shipping', amount: shipping },
                  { label: 'Tax', amount: tax }
                ].map(({ label, amount }, index) => {
                  const { formatted: amountFormatted } = formatPrice(amount, userCurrency);
                  
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex justify-between items-center py-2"
                    >
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {amountFormatted}
                      </span>
                    </motion.div>
                  );
                })}
                
                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                  <div className="text-right">
                    <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(grandTotal, userCurrency).formatted}
                    </span>
                    {userCurrency !== 'USD' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ≈ {formatPrice(grandTotal, 'USD').formatted}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Currency Info */}
              {userCurrency !== 'USD' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Prices in {userCurrency}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {getCurrencySymbol()} {userCurrency}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
                    Amounts automatically converted from USD
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  to="/checkout"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-bold text-lg text-center block transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 py-3 px-6 rounded-2xl font-semibold text-center block transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FiShoppingBag size={18} />
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;