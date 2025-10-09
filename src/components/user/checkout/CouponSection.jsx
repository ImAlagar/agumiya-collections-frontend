// src/components/user/checkout/CouponSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoupon } from '../../../contexts/CouponContext';
import { couponService } from '../../../services/api/couponService';
import { FiTag, FiCheck, FiX, FiClock, FiStar, FiInfo } from 'react-icons/fi';

const CouponSection = ({
  userId,
  subtotal,
  cartItems,
  availableCoupons = [],
  couponSuggestions = [],
  couponLoading = false,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  discountAmount,
  formatPrice
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [allAvailableCoupons, setAllAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const { applyCoupon: contextApplyCoupon, loading: contextLoading } = useCoupon();

  console.log('🔍 [CouponSection] Component rendered:', {
    userId,
    subtotal,
    cartItemsCount: cartItems?.length || 0,
    appliedCoupon: appliedCoupon?.code,
    availableCouponsCount: availableCoupons?.length || 0,
    allAvailableCouponsCount: allAvailableCoupons.length
  });

  // Ensure arrays are always arrays
  const safeAvailableCoupons = Array.isArray(availableCoupons) ? availableCoupons : [];
  const safeCouponSuggestions = Array.isArray(couponSuggestions) ? couponSuggestions : [];
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Format price helper
  const formatPriceInternal = (amount) => {
    if (formatPrice) {
      return formatPrice(amount);
    }
    return {
      formatted: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    };
  };

  // Load all available coupons
  useEffect(() => {
    console.log('🔄 [CouponSection useEffect] Checking if should load coupons:', {
      cartItemsCount: safeCartItems.length,
      appliedCoupon: appliedCoupon?.code,
      shouldLoad: safeCartItems.length > 0 && !appliedCoupon
    });

    if (safeCartItems.length > 0 && !appliedCoupon) {
      loadAllAvailableCoupons();
    }
  }, [safeCartItems, appliedCoupon]);

  const loadAllAvailableCoupons = async () => {
    console.log('🚀 [loadAllAvailableCoupons] Starting to load coupons...');
    setCouponsLoading(true);
    try {
      console.log('📡 [loadAllAvailableCoupons] Making API call with:', {
        subtotal,
        cartItemsCount: safeCartItems.length
      });

      const response = await couponService.getPublicCoupons({
        minOrderAmount: subtotal
      });

      console.log('✅ [loadAllAvailableCoupons] API Response:', {
        success: response.success,
        dataCount: response.data?.length,
        data: response.data
      });

      if (response.success && response.data) {
        const couponsWithApplicability = response.data.map(coupon => {
          const isApplicable = isCouponApplicable(coupon);
          const potentialDiscount = calculatePotentialDiscount(coupon);
          
          console.log(`📋 [loadAllAvailableCoupons] Processing coupon ${coupon.code}:`, {
            isApplicable,
            potentialDiscount,
            minOrderAmount: coupon.minOrderAmount,
            isActive: coupon.isActive
          });
          
          return {
            ...coupon,
            isApplicable,
            potentialDiscount
          };
        });

        console.log('💾 [loadAllAvailableCoupons] Setting coupons:', {
          total: couponsWithApplicability.length,
          applicable: couponsWithApplicability.filter(c => c.isApplicable).length
        });

        setAllAvailableCoupons(couponsWithApplicability);
      } else {
        console.warn('⚠️ [loadAllAvailableCoupons] No data in response:', response);
      }
    } catch (error) {
      console.error('❌ [loadAllAvailableCoupons] Failed to load coupons:', error);
      console.error('🔧 Error details:', {
        message: error.message,
        response: error.response?.data
      });
    } finally {
      setCouponsLoading(false);
    }
  };

  // Check if coupon is applicable
  const isCouponApplicable = (coupon) => {
    if (!coupon.isActive) {
      console.log(`❌ [isCouponApplicable] Coupon ${coupon.code} is not active`);
      return false;
    }

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      console.log(`❌ [isCouponApplicable] Coupon ${coupon.code} not yet valid`);
      return false;
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      console.log(`❌ [isCouponApplicable] Coupon ${coupon.code} expired`);
      return false;
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      console.log(`❌ [isCouponApplicable] Coupon ${coupon.code} usage limit reached`);
      return false;
    }
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      console.log(`❌ [isCouponApplicable] Coupon ${coupon.code} min order not met`);
      return false;
    }

    console.log(`✅ [isCouponApplicable] Coupon ${coupon.code} is applicable`);
    return true;
  };

  // Calculate potential discount
  const calculatePotentialDiscount = (coupon) => {
    if (!coupon || !isCouponApplicable(coupon)) {
      return 0;
    }

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

  // Handle manual coupon application
  const handleApplyCoupon = async () => {
    console.log('🎫 [handleApplyCoupon] Applying coupon:', {
      code: couponCode,
      cartItemsCount: safeCartItems.length
    });

    if (!couponCode.trim()) {
      console.log('❌ [handleApplyCoupon] Empty coupon code');
      return;
    }

    setIsApplying(true);
    try {
      if (contextApplyCoupon) {
        console.log('📤 [handleApplyCoupon] Using context applyCoupon');
        await contextApplyCoupon({
          code: couponCode.trim(),
          subtotal,
          cartItems: safeCartItems,
          userId
        });
        setCouponCode('');
      } else if (onApplyCoupon) {
        console.log('📤 [handleApplyCoupon] Using prop onApplyCoupon');
        await onApplyCoupon(couponCode);
        setCouponCode('');
      } else {
        console.warn('⚠️ [handleApplyCoupon] No apply coupon function available');
      }
    } catch (error) {
      console.error('❌ [handleApplyCoupon] Failed to apply coupon:', error);
    } finally {
      setIsApplying(false);
    }
  };

  // Handle coupon application from list
  const handleApplyCouponFromList = async (coupon) => {
    console.log('🎫 [handleApplyCouponFromList] Applying coupon from list:', coupon.code);

    try {
      if (contextApplyCoupon) {
        await contextApplyCoupon({
          code: coupon.code,
          subtotal,
          cartItems: safeCartItems,
          userId
        });
      } else if (onApplyCoupon) {
        await onApplyCoupon(coupon);
      }
      setShowAllCoupons(false);
    } catch (error) {
      console.error('❌ [handleApplyCouponFromList] Failed to apply coupon:', error);
    }
  };

  const handleRemoveCoupon = () => {
    console.log('🗑️ [handleRemoveCoupon] Removing coupon');
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
    // Reload coupons when coupon is removed
    loadAllAvailableCoupons();
  };

  // Get best coupon suggestion
  const getBestCouponSuggestion = () => {
    const applicableCoupons = allAvailableCoupons.filter(coupon => coupon.isApplicable);
    
    console.log('🏆 [getBestCouponSuggestion] Finding best coupon:', {
      totalCoupons: allAvailableCoupons.length,
      applicableCoupons: applicableCoupons.length
    });

    if (applicableCoupons.length === 0) return null;

    const bestCoupon = applicableCoupons.reduce((best, current) => 
      current.potentialDiscount > best.potentialDiscount ? current : best
    );

    console.log('🎯 [getBestCouponSuggestion] Best coupon:', {
      code: bestCoupon.code,
      discount: bestCoupon.potentialDiscount
    });

    return bestCoupon;
  };

  const bestCoupon = getBestCouponSuggestion();

  console.log('🎨 [CouponSection Render] Final state:', {
    allAvailableCouponsCount: allAvailableCoupons.length,
    bestCoupon: bestCoupon?.code,
    showAllCoupons,
    couponsLoading,
    appliedCoupon: appliedCoupon?.code
  });

  return (
    <div className="mb-8">
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-lg">🎉</span>
              <div>
                <div className="font-semibold text-green-800 dark:text-green-200">
                  {appliedCoupon.code} Applied!
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  You saved {formatPriceInternal(discountAmount).formatted}
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </motion.div>
      )}

      {/* Coupon Input Section */}
      {!appliedCoupon && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FiTag className="mr-2" />
              Apply Coupon Code
            </h3>
            
            {/* Show available coupons count */}
            {allAvailableCoupons.length > 0 && (
              <button
                onClick={() => setShowAllCoupons(!showAllCoupons)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                {showAllCoupons ? 'Hide Coupons' : `View All (${allAvailableCoupons.length})`}
              </button>
            )}
          </div>

          {/* Manual Coupon Input */}
          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isApplying || contextLoading || safeCartItems.length === 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
            >
              {isApplying || contextLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-2"></div>
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {/* Loading State */}
          {couponsLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading coupons...</span>
            </div>
          )}

          {/* Best Coupon Suggestion */}
          {bestCoupon && !showAllCoupons && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all mb-4"
              onClick={() => handleApplyCouponFromList(bestCoupon)}
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
                  <button 
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold transition-colors mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyCouponFromList(bestCoupon);
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* All Coupons List */}
          <AnimatePresence>
            {showAllCoupons && allAvailableCoupons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    All Available Coupons ({allAvailableCoupons.length})
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose one coupon to apply to your order
                  </p>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {allAvailableCoupons.map((coupon, index) => (
                    <div
                      key={coupon.id}
                      className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                        coupon.isApplicable 
                          ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' 
                          : 'bg-gray-50 dark:bg-gray-800 opacity-60'
                      }`}
                      onClick={() => coupon.isApplicable && handleApplyCouponFromList(coupon)}
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
                      
                      <div className="text-right">
                        <div className={`font-semibold ${
                          coupon.isApplicable ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          Save {formatPriceInternal(coupon.potentialDiscount).formatted}
                        </div>
                        {coupon.isApplicable ? (
                          <button 
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyCouponFromList(coupon);
                            }}
                          >
                            Apply
                          </button>
                        ) : (
                          <div className="text-xs text-red-500 mt-1">Not applicable</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Info */}
          {!showAllCoupons && allAvailableCoupons.length > 0 && !bestCoupon && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <FiClock className="mr-1" />
                  <strong>{allAvailableCoupons.length} coupons</strong> available
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

          {/* No Coupons Available */}
          {!couponsLoading && allAvailableCoupons.length === 0 && safeCartItems.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No coupons available for your current cart
              </p>
            </div>
          )}

          {/* Original Suggestions (if provided) */}
          <AnimatePresence>
            {safeCouponSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  💡 Suggested coupons for your order:
                </p>
                {safeCouponSuggestions.map((coupon, index) => (
                  <motion.div
                    key={coupon.id || coupon.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleApplyCouponFromList(coupon)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-yellow-500">🎁</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {coupon.code}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {coupon.description || `Get ${coupon.discountValue}${coupon.discountType === 'PERCENTAGE' ? '%' : ''} off`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        Save {formatPriceInternal(calculatePotentialDiscount(coupon)).formatted}
                      </div>
                      {coupon.minOrderAmount && (
                        <div className="text-xs text-gray-500">
                          Min. order: {formatPriceInternal(coupon.minOrderAmount).formatted}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Available Coupons Count */}
      {!appliedCoupon && safeAvailableCoupons.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🎁 {safeAvailableCoupons.length} coupons available for your order
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponSection;