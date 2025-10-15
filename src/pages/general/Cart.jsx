// src/pages/general/Cart.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthProvider';
import { useCoupon } from '../../contexts/CouponContext';
import { shippingService } from '../../services/api/shippingService';
import { 
  FiShoppingBag,
  FiTrash2, 
  FiPlus,
  FiMinus, 
  FiShoppingCart, 
} from 'react-icons/fi';
import EnhancedOrderSummary from '../../components/user/checkout/EnhancedOrderSummary';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, total, getCartTotal } = useCart();
  const { formatPrice, userCurrency } = useCurrency();
  const { user } = useAuth();
  const { validateCoupon, isLoading: couponLoading } = useCoupon();
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState('US'); // Default fallback

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  
  // Shipping state - same as checkout
  const [shippingData, setShippingData] = useState({
    cost: 0,
    isFree: false,
    loading: false,
    message: '',
    progress: 0,
    estimatedDays: { min: 3, max: 7 },
    hasFallback: false
  });

  // Calculate totals
  const subtotal = getCartTotal?.() || total || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal + shippingData.cost - discountAmount);

  // Get variant ID function - same as checkout
  const getVariantId = useCallback((item) => {
    if (item.variantId && item.variantId !== 'default') {
      return item.variantId.toString();
    }
    if (item.variant?.id) {
      return item.variant.id.toString();
    }
    if (item.selectedVariantId) {
      return item.selectedVariantId.toString();
    }
    
    console.warn('No variant ID found for item:', item);
    return null;
  }, []);

  useEffect(() => {
  // Try to get country from user profile, geolocation, or use default
  const getUserCountry = async () => {
    if (user?.country) {
      setUserCountry(user.country);
    } else {
      // You can add geolocation here or use a service
      // For now, we'll use a default
      setUserCountry('US');
    }
  };
  
  getUserCountry();
}, [user]);

// Update the shipping calculation useEffect to use userCountry
useEffect(() => {
  let timeoutId;

  const calculateShipping = async () => {
    if (cartItems.length === 0) {
      setShippingData({
        cost: 0,
        isFree: false,
        loading: false,
        message: 'Add items to calculate shipping',
        progress: 0,
        estimatedDays: { min: 3, max: 7 },
        hasFallback: false
      });
      return;
    }

    setShippingData(prev => ({ ...prev, loading: true }));
    
    try {
      const apiCartItems = cartItems.map(item => {
        const variantId = getVariantId(item);
        return {
          productId: item.id,
          variantId: variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        };
      }).filter(item => item.variantId !== null);

      // Use userCountry instead of hardcoded 'US'
      const response = await shippingService.getShippingEstimates({
        cartItems: apiCartItems,
        subtotal: subtotal,
        country: userCountry, // ✅ Use actual user country
        region: null
      });

      if (response.success && response.data) {
        setShippingData({
          cost: response.data.totalShipping || 0,
          isFree: response.data.isFree || false,
          loading: false,
          message: response.data.message || '',
          progress: response.data.progress || 0,
          estimatedDays: response.data.estimatedDays || { min: 3, max: 7 },
          hasFallback: response.data.hasFallback || false
        });
      } else {
        throw new Error(response.message || 'Failed to calculate shipping');
      }
    } catch (error) {
      console.error('Shipping API error in cart:', error);
      // Fallback calculation
      const FREE_SHIPPING_THRESHOLD = 50;
      const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
      const fallbackCost = isFree ? 0 : 5.99;
      const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      
      setShippingData({
        cost: fallbackCost,
        isFree: isFree,
        loading: false,
        message: isFree 
          ? '🎉 You got free shipping!' 
          : `Add $${amountNeeded.toFixed(2)} more for free shipping!`,
        progress: Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100),
        estimatedDays: { min: 3, max: 7 },
        hasFallback: true
      });
    }
  };

  timeoutId = setTimeout(calculateShipping, 500);
  return () => clearTimeout(timeoutId);
}, [cartItems, subtotal, getVariantId, userCountry]); // ✅ Add userCountry to depende

  const handleApplyCoupon = async (couponCode) => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (cartItems.length === 0) {
      setCouponError('Add items to cart before applying coupon');
      return;
    }

    setCouponError('');

    try {
      const validationData = {
        code: couponCode.trim().toUpperCase(),
        cartItems: cartItems.map(item => ({
          id: item.id,
          productId: item.productId || item.id,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          name: item.name,
          variant: item.variant
        })),
        subtotal: subtotal,
        userId: user?.id
      };

      const result = await validateCoupon(validationData);
      
      if (result.success && result.data.isValid) {
        setAppliedCoupon(result.data.coupon);
        setCouponError('');
      } else {
        setCouponError(result.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError(error.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleProceedToCheckout = () => {
    const checkoutData = {
      cartItems,
      appliedCoupon,
      totals: {
        subtotal,
        discount: discountAmount,
        shipping: shippingData.cost,
        grandTotal
      }
    };
    
    navigate('/checkout', { state: checkoutData });
  };

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
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  // Update cart totals when coupon changes
  useEffect(() => {
    // This ensures the totals are recalculated when coupon is applied/removed
  }, [appliedCoupon, cartItems]);

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
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FiShoppingCart className="mr-2 sm:mr-3 text-blue-600" size={22} />
                  Cart Items
                </h2>
              </div>

              {/* Cart Items */}
              <AnimatePresence>
                {cartItems.map((item, index) => {
                  const { formatted: itemTotalFormatted } = formatPrice(item.price * item.quantity, userCurrency);
                  const { formatted: singlePriceFormatted } = formatPrice(item.price, userCurrency);

                  return (
                    <motion.div
                      key={`${item.id}-${item.variant?.id || ''}-${index}`}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      {/* Product Image & Info */}
                      <div className="flex items-start sm:items-center w-full sm:w-auto mb-4 sm:mb-0">
                        {/* Image */}
                        <motion.div whileHover={{ scale: 1.05 }} className="relative flex-shrink-0">
                          <img
                            src={item.image || '/api/placeholder/96/96'}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-xl shadow-md"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/96/96';
                            }}
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                            {item.quantity}
                          </div>
                        </motion.div>

                        {/* Mobile Info */}
                        <div className="flex-1 ml-3 sm:ml-6 min-w-0 sm:hidden">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </h3>

                          {item.variant?.title && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium text-xs mt-1">{item.variant.title}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-1 mt-2 text-sm">
                            <p className="font-bold text-gray-900 dark:text-white">{singlePriceFormatted}</p>
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600 dark:text-gray-400">{item.quantity}</span>
                            <span className="text-gray-400">=</span>
                            <p className="font-bold text-blue-600 dark:text-blue-400">{itemTotalFormatted}</p>
                          </div>

                          {userCurrency !== 'USD' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ≈ {formatPrice(item.price * item.quantity, 'USD').formatted}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Desktop Info */}
                      <div className="hidden sm:flex flex-1 ml-6 min-w-0">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg lg:text-xl line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </h3>

                          {item.variant?.title && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-1">{item.variant.title}</p>
                          )}

                          <div className="flex items-center space-x-2 mt-2">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{singlePriceFormatted}</p>
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.quantity}</span>
                            <span className="text-gray-400">=</span>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{itemTotalFormatted}</p>
                          </div>

                          {userCurrency !== 'USD' && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ≈ {formatPrice(item.price * item.quantity, 'USD').formatted}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls + Remove */}
                      <div className="flex flex-col xs:flex-row items-center justify-between w-full sm:w-auto sm:justify-end sm:space-x-4 sm:ml-4 mt-4 sm:mt-0 gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 shadow-sm">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus size={14} />
                          </motion.button>

                          <span className="px-2 sm:px-3 py-2 text-gray-900 dark:text-white font-semibold min-w-[32px] sm:min-w-[40px] text-center border-l border-r border-gray-300 dark:border-gray-600 text-sm sm:text-base">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                          >
                            <FiPlus size={14} />
                          </motion.button>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 sm:p-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group/remove"
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
              className="mt-4 sm:mt-6"
            >
              <Link
                to="/shop"
                className="flex items-center justify-center space-x-2 sm:space-x-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 p-3 sm:p-5 rounded-2xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 group text-sm sm:text-base"
              >
                <FiPlus size={18} className="sm:w-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Continue Shopping</span>
              </Link>
            </motion.div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <EnhancedOrderSummary
              // Data
              cartItems={cartItems}
              appliedCoupon={appliedCoupon}
              shippingCost={shippingData.cost}
              isFreeShipping={shippingData.isFree}
              freeShippingThreshold={50}
              shippingProgress={shippingData.progress}
              shippingMessage={shippingData.message}
              estimatedDays={shippingData.estimatedDays}
              shippingLoading={shippingData.loading}
              currency={userCurrency}
              
              userCountry={userCountry}
              // Functions
              formatPrice={formatPrice}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onProceedToCheckout={handleProceedToCheckout}
              
              // Configuration
              mode="cart"
              showCouponSection={true}
              showActionButtons={true}
              showTrustBadges={true}
              showItemsList={true}
              isSticky={true}
              
              // State
              couponLoading={couponLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;