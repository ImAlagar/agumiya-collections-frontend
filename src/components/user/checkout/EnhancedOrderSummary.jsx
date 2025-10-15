// src/components/common/EnhancedOrderSummary.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, 
  FiShoppingBag, 
  FiTag, 
  FiCheck, 
  FiX, 
  FiClock,
  FiStar,
  FiInfo,
  FiTruck,
  FiGlobe,
  FiMapPin,
  FiPercent
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { couponService } from '../../../services/api/couponService';

const EnhancedOrderSummary = ({
  // Data props
  cartItems = [],
  appliedCoupon = null,
  shippingCost = 0,
  taxAmount = 0, // ✅ New tax prop
  taxRate = 0, // ✅ New tax rate prop
  isFreeShipping = false,
  freeShippingThreshold = 50,
  shippingProgress = 0,
  shippingMessage = '',
  estimatedDays = { min: 3, max: 7 },
  currency = 'USD',
  userCountry = 'US',
  userRegion = null,
  showFreeShippingProgress = true,
  shippingLoading = false,
  taxLoading = false, // ✅ New tax loading prop

  // Function props
  formatPrice,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  
  // Configuration props
  mode = 'cart',
  showCouponSection = true,
  showActionButtons = true,
  showTrustBadges = true,
  showCurrencyInfo = true,
  showItemsList = true,
  isSticky = true,
  showHeader = true,
  
  // UI props
  themeStyles = {
    card: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    input: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
  },
  
  // External loading states
  couponLoading = false,
  isProcessing = false
}) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  // Professional coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);

  // Calculate totals with tax
  const subtotal = safeCartItems.reduce((sum, item) => 
    sum + (item.price || 0) * (item.quantity || 1), 0
  );
  
  const discountAmount = appliedCoupon?.discountAmount || 0;
  
  // ✅ Updated grand total calculation with tax
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const grandTotal = Math.max(0, subtotal + shippingCost + taxAmount - discountAmount);

  // Format price helper if not provided
  const formatPriceInternal = (amount, curr = currency) => {
    if (formatPrice) {
      return formatPrice(amount, curr);
    }
    return {
      formatted: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr
      }).format(amount)
    };
  };

  // Create shipping estimate object from props for consistent usage
  const shippingEstimate = {
    cost: shippingCost,
    isFree: isFreeShipping,
    freeShippingThreshold: freeShippingThreshold,
    amountNeeded: Math.max(0, freeShippingThreshold - subtotal),
    progress: shippingProgress,
    estimatedDays: estimatedDays,
    message: shippingMessage,
    currency: currency,
    isAvailable: true
  };

  // Load available coupons when cart changes
  useEffect(() => {
    if (safeCartItems.length > 0 && !appliedCoupon) {
      loadAvailableCoupons();
    }
  }, [safeCartItems, appliedCoupon]);


  const loadAvailableCoupons = async () => {
    setCouponsLoading(true);
    try {
      const response = await couponService.getPublicCoupons({
        minOrderAmount: subtotal
      });

      if (response.success && response.data) {
        const couponsWithApplicability = response.data.map(coupon => ({
          ...coupon,
          isApplicable: isCouponApplicable(coupon),
          potentialDiscount: calculatePotentialDiscount(coupon)
        }));
        
        setAvailableCoupons(couponsWithApplicability);
      }
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setCouponsLoading(false);
    }
  };

  // Professional: Check if coupon is applicable
  const isCouponApplicable = (coupon) => {
    if (!coupon.isActive) return false;
    
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) return false;
    if (coupon.validUntil && new Date(coupon.validUntil) < now) return false;
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return false;
    
    return true;
  };

  // Professional: Calculate potential discount
  const calculatePotentialDiscount = (coupon) => {
    if (!coupon || !isCouponApplicable(coupon)) return 0;

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return Math.round(discount * 100) / 100;
  };

  // Professional: Handle coupon application
  const handleApplyCoupon = async (coupon = null) => {
    const codeToApply = coupon ? coupon.code : couponCode;

    if (!codeToApply.trim()) {
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
        await onApplyCoupon(codeToApply);
        setCouponCode('');
        setShowAllCoupons(false);
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
    loadAvailableCoupons();
  };

  // Professional: Get best coupon suggestion
  const getBestCouponSuggestion = () => {
    if (availableCoupons.length === 0) return null;
    
    const applicableCoupons = availableCoupons.filter(coupon => coupon.isApplicable);
    if (applicableCoupons.length === 0) return null;
    
    return applicableCoupons.reduce((best, current) => 
      current.potentialDiscount > best.potentialDiscount ? current : best
    );
  };

  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout({
        cartItems: safeCartItems,
        appliedCoupon,
        totals: {
          subtotal,
          discount: discountAmount,
          shipping: shippingCost,
          tax: taxAmount, // ✅ Include tax in totals
          taxRate: taxRate, // ✅ Include tax rate
          grandTotal,
          shippingEstimate
        }
      });
    } else {
      console.warn('onProceedToCheckout function not provided');
      alert('Proceeding to checkout...');
    }
  };

  const bestCoupon = getBestCouponSuggestion();

  // Get button text based on mode and state
  const getButtonText = () => {
    if (isProcessing) {
      return 'Processing...';
    }
    
    if (mode === 'checkout') {
      return 'Place Order & Pay';
    }
    
    return 'Proceed to Checkout';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} ${isSticky ? 'sticky top-8' : ''}`}
    >
      <div className="p-6 lg:p-8">
        {/* Header */}
        {showHeader && (
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">📦</span>
            Order Summary
          </h3>
        )}

        {/* Location Info */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <FiMapPin className="mr-2" />
              Shipping to: {userCountry}
              {userRegion && `, ${userRegion}`}
            </div>
            {/* ✅ Tax Rate Display */}
            {taxRate > 0 && (
              <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                <FiPercent className="mr-1" size={12} />
                {taxRate}% Tax
              </div>
            )}
          </div>
        </div>

        {/* Shipping Loading State */}
        {shippingLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl"
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Calculating shipping costs...
              </p>
            </div>
          </motion.div>
        )}

        {/* ✅ Tax Loading State */}
        {taxLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl"
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-3"></div>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Calculating tax...
              </p>
            </div>
          </motion.div>
        )}

        {/* Free Shipping Progress Bar */}
        {showFreeShippingProgress && mode === 'cart' && !isFreeShipping && !shippingLoading && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
                <FiTruck className="mr-2" />
                Free Shipping Progress
              </span>
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                {formatPriceInternal(subtotal).formatted} / {formatPriceInternal(freeShippingThreshold).formatted}
              </span>
            </div>
            
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 mb-2">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                initial={{ width: 0 }}
                animate={{ width: `${shippingProgress}%` }}
              />
            </div>
            
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              {shippingMessage}
            </p>
          </div>
        )}

        {/* Professional Coupon Section */}
        {showCouponSection && mode === 'cart' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FiTag className="mr-2" />
                Apply Coupon
              </h4>
              
              {!appliedCoupon && availableCoupons.length > 0 && (
                <button
                  onClick={() => setShowAllCoupons(!showAllCoupons)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  {showAllCoupons ? 'Hide Coupons' : `View All (${availableCoupons.length})`}
                </button>
              )}
            </div>

            {!appliedCoupon ? (
              <div className="space-y-4">
                {/* Manual Coupon Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-4 py-3 ${themeStyles.input} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base`}
                    disabled={isApplying || couponLoading}
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode.trim() || isApplying || couponLoading || safeCartItems.length === 0}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {(isApplying || couponLoading) ? (
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

                {/* Professional: Best Coupon Suggestion */}
                {bestCoupon && !showAllCoupons && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleApplyCoupon(bestCoupon)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                          <FiStar className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                            BEST DEAL: {bestCoupon.code}
                          </div>
                          <div className="text-sm text-yellow-700 dark:text-yellow-300">
                            {bestCoupon.description || `Save ${bestCoupon.discountValue}${bestCoupon.discountType === 'PERCENTAGE' ? '%' : ''} on your order`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-800 dark:text-yellow-200 text-lg">
                          Save {formatPriceInternal(bestCoupon.potentialDiscount).formatted}
                        </div>
                        <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold transition-colors mt-2">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Professional: All Coupons List */}
                <AnimatePresence>
                  {showAllCoupons && availableCoupons.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          All Available Coupons
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Choose one coupon to apply to your order
                        </p>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {availableCoupons.map((coupon, index) => (
                          <div
                            key={coupon.id}
                            className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                              coupon.isApplicable 
                                ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' 
                                : 'bg-gray-50 dark:bg-gray-800 opacity-60'
                            }`}
                            onClick={() => coupon.isApplicable && handleApplyCoupon(coupon)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                coupon.isApplicable ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                {coupon.isApplicable ? (
                                  <FiTag className="text-green-600 dark:text-green-400" />
                                ) : (
                                  <FiX className="text-red-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {coupon.code}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {coupon.description || `${coupon.discountValue}${coupon.discountType === 'PERCENTAGE' ? '%' : ''} off`}
                                </div>
                                {!coupon.isApplicable && coupon.minOrderAmount && (
                                  <div className="text-xs text-red-500 flex items-center mt-1">
                                    <FiInfo size={12} className="mr-1" />
                                    Add {formatPriceInternal(coupon.minOrderAmount - subtotal).formatted} more
                                  </div>
                                )}
                              </div>
                            </div>
                            

                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Info */}
                {!showAllCoupons && availableCoupons.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm flex items-center justify-between">
                      <span className="flex items-center">
                        <FiClock className="mr-1" />
                        <strong>{availableCoupons.length} coupons</strong> available
                      </span>
                      <button 
                        onClick={() => setShowAllCoupons(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View All
                      </button>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Applied Coupon Display
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-green-800 dark:text-green-300 block">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-green-600 dark:text-green-400 text-sm block">
                        -{formatPriceInternal(appliedCoupon.discountAmount).formatted}
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
              </motion.div>
            )}
          </div>
        )}

        {/* Applied Coupon Display (for checkout mode) */}
        {mode === 'checkout' && appliedCoupon && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
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
                      : `${formatPriceInternal(appliedCoupon.discountValue).formatted} off`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
              >
                <FiX className="text-green-600 dark:text-green-400" />
              </button>
            </div>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              Discount: -{formatPriceInternal(discountAmount).formatted}
            </div>
          </motion.div>
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
                      {formatPriceInternal(item.price || 0).formatted} × {item.quantity || 1}
                    </p>
                    {item.variant?.title && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {item.variant.title}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPriceInternal((item.price || 0) * (item.quantity || 1)).formatted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Updated Pricing Breakdown with Tax */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {formatPriceInternal(subtotal).formatted}
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
                -{formatPriceInternal(discountAmount).formatted}
              </span>
            </motion.div>
          )}

          {/* Shipping Cost Display */}
          <div className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              Shipping
              {shippingLoading && (
                <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
              )}
              {userCountry !== 'US' && (
                <FiGlobe className="ml-1 text-blue-500" size={14} />
              )}
              {isFreeShipping && (
                <span className="text-green-600 dark:text-green-400 ml-1">(Free!)</span>
              )}
            </span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {shippingLoading ? 'Calculating...' : 
               isFreeShipping ? 'Free' : formatPriceInternal(shippingCost).formatted}
            </span>
          </div>

          {/* ✅ Tax Display */}
          <div className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              Tax 
              {taxRate > 0 && `(${taxRate}%)`}
              {taxLoading && (
                <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-purple-400"></div>
              )}
              {!taxLoading && taxAmount === 0 && taxRate === 0 && (
                <span className="ml-1 text-xs text-gray-400">(Calculated at checkout)</span>
              )}
            </span>
            <span className="text-gray-900 dark:text-white font-semibold">
              {taxLoading ? 'Calculating...' : 
              taxAmount > 0 ? formatPriceInternal(taxAmount).formatted : '—'}
            </span>
          </div>

          {/* Delivery Estimate */}
          {estimatedDays && !shippingLoading && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Estimated delivery: {estimatedDays.min}-{estimatedDays.max} days
              {userCountry !== 'US' && ' (International)'}
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
            <div className="text-right">
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPriceInternal(grandTotal).formatted}
              </span>
              {currency !== 'USD' && showCurrencyInfo && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ≈ {formatPriceInternal(grandTotal, 'USD').formatted}
                </p>
              )}
            </div>
          </div>


        </div>

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="space-y-4">
            <button
              onClick={handleProceedToCheckout}
              disabled={isProcessing || safeCartItems.length === 0 || shippingLoading || taxLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg text-center block transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center space-x-3 group disabled:cursor-not-allowed"
            >
              {isProcessing || shippingLoading || taxLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>
                    {shippingLoading ? 'Calculating Shipping...' : 
                     taxLoading ? 'Calculating Tax...' : 'Processing...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{getButtonText()}</span>
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {mode === 'cart' && (
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

export default EnhancedOrderSummary;