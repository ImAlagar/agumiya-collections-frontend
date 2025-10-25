// src/components/cart/Cart.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useCart } from '../../contexts/CartContext';
import { useCoupon } from '../../contexts/CouponContext';
import { useAuth } from '../../contexts/AuthProvider';
import { calculationService } from '../../services/api/calculationService';
import { couponService } from '../../services/api/couponService';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, total: cartTotal, totalItems, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { formatPriceSimple, userCurrency, userCountry } = useCurrency();
  const { 
    appliedCoupon, 
    discountAmount, 
    loading: couponLoading, 
    applyCoupon, 
    removeCoupon
  } = useCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [calculations, setCalculations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Refs to track previous values and prevent infinite loops
  const previousCartHashRef = useRef('');
  const calculationsLoadedRef = useRef(false);
  const couponsLoadedRef = useRef(false);

  // ==================== SHIPPING & TAX CALCULATION LOGIC ====================

  /**
   * SHIPPING CALCULATION STRATEGY:
   * 1. Uses calculationService.calculateCartTotals() API call
   * 2. Falls back to $5.99 flat rate if API fails
   * 3. Special handling for India: Caps shipping at $5.99 if calculated too high
   * 4. Free shipping threshold: $50+ orders get free shipping
   */

  /**
   * TAX CALCULATION STRATEGY:
   * 1. Dynamic tax calculation based on user's country/region
   * 2. Uses tax rates from tax service API
   * 3. Falls back to database tax rates if API fails
   * 4. Final fallback to static tax rates per country
   */

  // Generate cart hash for comparison
  const getCartHash = useCallback((items) => {
    return JSON.stringify(items.map(item => ({
      id: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price
    })).sort((a, b) => a.id.localeCompare(b.id)));
  }, []);

  // Check for payment success
useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const paymentSuccess = searchParams.get('payment') === 'success';
  const locationPaymentSuccess = location.state?.paymentSuccess;
  
  if (paymentSuccess || locationPaymentSuccess) {
    setShowSuccessMessage(true);
    
    // 🔥 STEP 4: CLEAR COUPON FIRST, THEN CART
    if (appliedCoupon) {
      removeCoupon(); // ADD THIS LINE
    }
    clearCart();
    
    if (paymentSuccess) {
      navigate(location.pathname, { replace: true });
    }
    
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }
}, [location, navigate, clearCart, appliedCoupon, removeCoupon]); // ADD removeCoupon to dependencies

  // ==================== SHIPPING & TAX CALCULATION LOADER ====================
// In Cart.jsx - Update the loadCalculations function
const loadCalculations = useCallback(async () => {
  if (cartItems.length === 0) {
    setCalculations(null);
    setAvailableCoupons([]);
    calculationsLoadedRef.current = false;
    couponsLoadedRef.current = false;
    return;
  }

  // Prevent multiple simultaneous loads
  if (loading) return;

  setLoading(true);
  try {
    // 🚚 REAL SHIPPING & TAX CALCULATION API CALL
    const result = await calculationService.calculateCartTotals(
      cartItems.map(item => ({
        productId: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      { 
        country: userCountry,
        region: '', // You can add region if available
        city: '',
        zipCode: ''
      },
      appliedCoupon?.code || ''
    );

    if (result && result.success) {
      
      const baseCalculations = {
        subtotal: result.amounts.subtotalUSD,
        shipping: result.amounts.shippingUSD,
        tax: result.amounts.taxUSD,
        taxRate: result.breakdown.taxRate,
        currency: result.currency || 'USD',
        isFreeShipping: result.breakdown.isFreeShipping || false,
        discount: result.breakdown.discount || discountAmount
      };
      
      // 🧮 FINAL TOTAL CALCULATION with real values
      const finalTotal = Math.max(0, 
        baseCalculations.subtotal + 
        baseCalculations.shipping + 
        baseCalculations.tax - 
        baseCalculations.discount
      );
      
      setCalculations({
        ...baseCalculations,
        finalTotal,
        // Include shipping details for progress bar
        shippingDetails: {
          cost: baseCalculations.shipping,
          isFree: baseCalculations.isFreeShipping,
          freeShippingThreshold: 50, // Your backend threshold
          amountNeeded: Math.max(0, 50 - baseCalculations.subtotal),
          progress: Math.min(100, (baseCalculations.subtotal / 50) * 100),
          estimatedDays: result.breakdown.estimatedDelivery
        }
      });
    } else {
      // ❌ FALLBACK CALCULATION - If API fails
      console.warn('Real calculation API failed, using fallback');
      const finalTotal = Math.max(0, cartTotal - discountAmount);
      setCalculations({
        subtotal: cartTotal,
        shipping: 0,
        tax: 0,
        taxRate: 0,
        discount: discountAmount,
        finalTotal,
        currency: userCurrency,
        isFreeShipping: false,
        shippingDetails: {
          cost: 0,
          isFree: false,
          freeShippingThreshold: 50,
          amountNeeded: Math.max(0, 50 - cartTotal),
          progress: Math.min(100, (cartTotal / 50) * 100),
          estimatedDays: '3-7 business days'
        }
      });
    }
    
    calculationsLoadedRef.current = true;
  } catch (error) {
    console.error('❌ CART - Failed to load real shipping/tax calculations:', error);
    // 🆘 EMERGENCY FALLBACK
    const finalTotal = Math.max(0, cartTotal - discountAmount);
    setCalculations({
      subtotal: cartTotal,
      shipping: 0,
      tax: 0,
      taxRate: 0,
      discount: discountAmount,
      finalTotal,
      currency: userCurrency,
      isFreeShipping: false
    });
    calculationsLoadedRef.current = true;
  } finally {
    setLoading(false);
  }
}, [cartItems, userCountry, cartTotal, userCurrency, discountAmount, loading, appliedCoupon]);

  // ==================== COUPON LOADING LOGIC ====================
  const loadAvailableCoupons = useCallback(async () => {
    if (cartItems.length === 0 || !calculations || couponsLoading || couponsLoadedRef.current) {
      return;
    }

    setCouponsLoading(true);
    try {
      // Prepare the request data in the EXACT format that works in Postman
      const requestData = {
        subtotal: calculations.subtotal || cartTotal,
        cartItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          product: {
            id: item.id,
            name: item.name,
            category: item.category || 'general'
          }
        })),
        userId: user?.id || null
      };

      const response = await couponService.getAvailableCoupons(requestData);
      
      if (response && response.data) {
        setAvailableCoupons(response.data.available || []);
      } else {
        setAvailableCoupons([]);
      }
      
      couponsLoadedRef.current = true;
      
    } catch (error) {
      console.error('❌ Failed to load available coupons:', error);
      
      if (error.response) {
        console.error('📋 Error response data:', error.response.data);
        console.error('📋 Error status:', error.response.status);
      } else if (error.request) {
        console.error('📋 No response received:', error.request);
      } else {
        console.error('📋 Error message:', error.message);
      }
      
      setAvailableCoupons([]);
      couponsLoadedRef.current = true;
    } finally {
      setCouponsLoading(false);
    }
  }, [cartItems, calculations, cartTotal, user, couponsLoading]);

  // ==================== EFFECTS FOR CALCULATION TRIGGERS ====================

  // Main effect to control when to load shipping/tax calculations
  useEffect(() => {
    const currentCartHash = getCartHash(cartItems);
    
    // Only load calculations if cart actually changed
    if (currentCartHash !== previousCartHashRef.current) {
      previousCartHashRef.current = currentCartHash;
      calculationsLoadedRef.current = false;
      couponsLoadedRef.current = false;
      loadCalculations();
    }
  }, [cartItems, getCartHash, loadCalculations]);

  // Load coupons after shipping/tax calculations are ready
  useEffect(() => {
    if (calculations && calculationsLoadedRef.current && !couponsLoadedRef.current) {
      loadAvailableCoupons();
    }
  }, [calculations, loadAvailableCoupons]);

  // Update calculations when discount changes (recalculate final total)
  useEffect(() => {
    if (calculations) {
      const newFinalTotal = Math.max(0, calculations.subtotal + calculations.shipping + calculations.tax - discountAmount);
      
      if (Math.abs(newFinalTotal - calculations.finalTotal) > 0.01) {
        setCalculations(prev => ({
          ...prev,
          discount: discountAmount,
          finalTotal: newFinalTotal
        }));
      }
    }
  }, [discountAmount, calculations]);

  // ==================== FREE SHIPPING PROGRESS CALCULATION ====================
  /**
   * FREE SHIPPING LOGIC:
   * - Orders $50+ get free shipping
   * - Progress bar shows how close user is to free shipping
   * - Special messages encourage adding more items
   */
  useEffect(() => {
    if (calculations && cartTotal >= 50) {
      setCouponMessage('🎉 You qualify for FREE shipping! Add $20 more to get $20 OFF with coupon code SAVE20');
    } else if (calculations && cartTotal >= 30) {
      const amountNeeded = 50 - cartTotal;
      setCouponMessage(`Add ${formatPriceSimple(amountNeeded)} more to get FREE shipping and unlock $20 OFF coupon!`);
    } else {
      setCouponMessage('');
    }
  }, [calculations, cartTotal, formatPriceSimple]);

  // Manual refresh of coupons
  const handleRefreshCoupons = () => {
    couponsLoadedRef.current = false;
    loadAvailableCoupons();
  };

  // ==================== COUPON APPLICATION HANDLER ====================
  const handleApplyCoupon = async (code = couponCode) => {
    if (!code.trim()) return;
    
    setCouponMessage(''); // Clear previous messages
    
    const result = await applyCoupon({
      code: code,
      subtotal: calculations?.subtotal || cartTotal,
      cartItems: cartItems.map(item => ({
        productId: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      })),
      userId: user?.id
    });
    
    if (result && result.success) {
      // Show success message for applied coupon
      if (code.toUpperCase() === 'SAVE20' && cartTotal >= 50) {
        setCouponMessage('🎉 Amazing! You got $20 OFF + FREE Shipping!');
      } else if (code.toUpperCase() === 'SAVE20') {
        setCouponMessage('🎉 $20 OFF applied! Add more items to get FREE shipping.');
      } else {
        setCouponMessage('🎉 Coupon applied successfully!');
      }
    }
    
    setCouponCode('');
    setShowAvailableCoupons(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage(''); // Clear message when coupon is removed
  };

  const handleApplySuggestedCoupon = (coupon) => {
    handleApplyCoupon(coupon.code);
  };

  const handleViewOrders = () => {
    navigate('/profile?tab=orders');
  };

  const handleContinueShopping = () => {
    setShowSuccessMessage(false);
    navigate('/shop');
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `${formatPriceSimple(coupon.discountValue)}`;
    }
  };

  // ==================== FREE SHIPPING PROGRESS CALCULATOR ====================
  const getFreeShippingProgress = () => {
    if (cartTotal >= 50) return 100;
    return (cartTotal / 50) * 100;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Order Confirmed!
                </h3>
                <p className="text-green-700 dark:text-green-300 mb-6">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={handleViewOrders}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty Cart State */}
          {!showSuccessMessage && (
            <>
              <div className="w-32 h-32 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Discover amazing products and add them to your cart
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Start Shopping
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const displayCurrency = calculations?.currency || userCurrency;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      {/* Success Message Banner */}
      {showSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-green-900 dark:text-green-100">Payment Successful!</span>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                    Your order has been placed successfully. Thank you for your purchase!
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleViewOrders}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  View Orders
                </button>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="flex-1 sm:flex-none border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {/* 🚚 SHIPPING & TAX DISPLAY INFO */}
              <span>Prices in {displayCurrency} • Shipping to {userCountry}</span>
              {loading && (
                <span className="ml-2 flex items-center">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></span>
                  <span className="ml-1">Calculating shipping & tax...</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 🚚 FREE SHIPPING PROGRESS BAR */}
        {cartTotal < 50 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  Free Shipping Progress
                </span>
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {formatPriceSimple(cartTotal)} / {formatPriceSimple(50)}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getFreeShippingProgress()}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {couponMessage || `Add ${formatPriceSimple(50 - cartTotal)} more to get FREE shipping + $20 OFF coupon!`}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items & Available Coupons */}
          <div className="xl:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cart Items</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Variant: {item.variantName || item.variantId}
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                          {formatPriceSimple(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-xl transition-all duration-200"
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-xl transition-all duration-200"
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.variantId)}
                          className="w-10 h-10 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Item Total</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPriceSimple(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Coupons Section */}
            {availableCoupons.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Available Coupons
                      </h2>
                      <button
                        onClick={handleRefreshCoupons}
                        disabled={couponsLoading}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        title="Refresh coupons"
                      >
                        <svg className={`w-4 h-4 ${couponsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      {showAvailableCoupons ? 'Hide' : 'Show'} ({availableCoupons.length})
                    </button>
                  </div>
                </div>
                
                {showAvailableCoupons && (
                  <div className="p-6">
                    {couponsLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading available coupons...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-4 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 bg-green-50 dark:bg-green-900/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>

                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {coupon.code}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {coupon.description}
                                </p>
                                {/* 🚚 FREE SHIPPING MESSAGE FOR SAVE20 COUPON */}
                                {coupon.code === 'SAVE20' && cartTotal >= 50 && (
                                  <p className="text-green-600 dark:text-green-400 text-sm mt-1 font-medium">
                                    🚚 Includes FREE Shipping!
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {coupon.minOrderAmount && (
                                  <div>Min. order: {formatPriceSimple(coupon.minOrderAmount)}</div>
                                )}
                                {coupon.validUntil && (
                                  <div>Expires: {new Date(coupon.validUntil).toLocaleDateString()}</div>
                                )}
                              </div>
                              <button
                                onClick={() => handleApplySuggestedCoupon(coupon)}
                                disabled={couponLoading}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                              >
                                {couponLoading ? 'Applying...' : 'Apply'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================== ORDER SUMMARY SECTION ==================== */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
              
              {/* 🎉 COUPON MESSAGE DISPLAY */}
              {couponMessage && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                      {couponMessage}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Coupon Section */}
              <div className="mb-6">
                {/* 💳 Coupon Input + Apply Button */}
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />

                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={couponLoading || !couponCode.trim()}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                  >
                    {couponLoading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto block"></span>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>

                {/* 🔍 View Available Coupons */}
                {availableCoupons.length > 0 && !showAvailableCoupons && (
                  <button
                    onClick={() => setShowAvailableCoupons(true)}
                    className="w-full text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium py-2"
                  >
                    View {availableCoupons.length} available coupons
                  </button>
                )}

                {/* 🎉 Applied Coupon Success Box */}
                {appliedCoupon && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm sm:text-base">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                      <div>
                        <span className="text-green-800 dark:text-green-200 font-semibold">
                          {appliedCoupon.code} applied
                        </span>
                        <p className="text-green-700 dark:text-green-300">
                          -{formatPriceSimple(discountAmount)} discount
                        </p>
                        {/* 🚚 FREE SHIPPING MESSAGE FOR SAVE20 */}
                        {appliedCoupon.code === 'SAVE20' && cartTotal >= 50 && (
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                            🚚 FREE Shipping Included!
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              
              {/* ==================== PRICING BREAKDOWN ==================== */}
              <div className="space-y-4 mb-6">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPriceSimple(calculations?.subtotal || cartTotal)}
                  </span>
                </div>
                
                {/* 🚚 SHIPPING COST DISPLAY */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {calculations?.isFreeShipping ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">FREE</span>
                  ) : calculations?.shipping > 0 ? (
                    formatPriceSimple(calculations.shipping)
                  ) : (
                    'Calculating...'
                  )}
                </span>
              </div>
                
                {/* 💰 TAX DISPLAY */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Tax {calculations?.taxRate > 0 && `(${(calculations.taxRate * 100).toFixed(1)}%)`}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPriceSimple(calculations?.tax || 0)}
                </span>
              </div>
                
                {/* 🎉 DISCOUNT DISPLAY */}
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                    <span className="font-medium">Discount</span>
                    <span className="font-semibold">-{formatPriceSimple(discountAmount)}</span>
                  </div>
                )}
                
                {/* 🧮 FINAL TOTAL */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPriceSimple(calculations?.finalTotal || cartTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                    All prices in {displayCurrency}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <Link 
                    to="/checkout" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login to Checkout
                  </Link>
                )}
                
                <Link 
                  to="/shop" 
                  className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;