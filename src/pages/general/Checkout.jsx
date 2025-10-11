// src/pages/general/Checkout.js
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { orderService } from '../../services/api/orderService';
import { paymentService } from '../../services/api/paymentService';
import { useAuth } from '../../contexts/AuthProvider';
import { useCoupon } from '../../contexts/CouponContext';
import { couponService } from '../../services/api/couponService';

// Import components
import ShippingStep from '../../components/user/checkout/ShippingStep';
import ReviewStep from '../../components/user/checkout/ReviewStep';
import PaymentStep from '../../components/user/checkout/PaymentStep';
import ConfirmationStep from '../../components/user/checkout/ConfirmationStep';
import EnhancedOrderSummary from '../../components/user/checkout/EnhancedOrderSummary';
import CouponSection from '../../components/user/checkout/CouponSection';

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const { formatPrice, userCurrency } = useCurrency();
  const { appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCoupon();
  const navigate = useNavigate();

  // Order and payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderError, setOrderError] = useState('');

  // Coupon states - FIXED: Initialize as empty array
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponSuggestions, setCouponSuggestions] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);

  const [orderData, setOrderData] = useState({
    shippingAddress: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address1: '',
      address2: '',
      city: '',
      region: '',
      country: 'IN',
      zipCode: ''
    },
    orderNotes: ''
  });

  // Calculate order totals
  const subtotal = getCartTotal?.() || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  
  // Calculate discount amount properly
  const calculateDiscountAmount = (coupon, currentSubtotal = subtotal) => {
    if (!coupon) return 0;
    
    let discount = 0;
    
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (currentSubtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'FIXED') {
      discount = coupon.discountValue;
    }
    
    // Apply maximum discount limit if set
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    
    // Ensure discount doesn't exceed subtotal
    return Math.min(discount, currentSubtotal);
  };

  // Final total after discount
  const finalTotal = Math.max(0, subtotal + shipping + tax - discountAmount);

  // // Load available coupons for suggestions - FIXED VERSION
  // const loadAvailableCoupons = async () => {
  //   try {
  //     setCouponLoading(true);
      
  //     // // Call the API to get available coupons
  //     // const response = await couponService.getAvailableCoupons({
  //     //   cartItems,
  //     //   subtotal,
  //     //   userId: user?.id
  //     // });
      
      
  //     if (response?.success) {
  //       // Ensure we always set an array, even if data is undefined
  //       const coupons = Array.isArray(response.data) ? response.data : [];
  //       setAvailableCoupons(coupons);
        
  //       // Generate suggestions
  //       const suggestions = generateCouponSuggestions(coupons);
  //       setCouponSuggestions(suggestions);
        

  //     } else {
  //       // If no success, set empty arrays
  //       setAvailableCoupons([]);
  //       setCouponSuggestions([]);
  //     }
  //   } catch (error) {
  //     console.error('❌ Could not load coupon suggestions:', error);
  //     // Set empty arrays on error
  //     setAvailableCoupons([]);
  //     setCouponSuggestions([]);
  //   } finally {
  //     setCouponLoading(false);
  //   }
  // };

  // Generate smart coupon suggestions - FIXED VERSION
  const generateCouponSuggestions = (coupons) => {
    if (!Array.isArray(coupons) || coupons.length === 0) return [];
    
    const suggestions = coupons
      .filter(coupon => {
        if (!coupon) return false;
        
        // Filter coupons that are applicable to current cart
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          return false;
        }
        
        if (coupon.maxOrderValue && subtotal > coupon.maxOrderValue) return false;
        
        // Check category restrictions
        if (coupon.applicableCategories?.length) {
          const cartCategories = cartItems.map(item => item.category).filter(Boolean);
          const hasMatchingCategory = cartCategories.some(category => 
            coupon.applicableCategories.includes(category)
          );
          if (!hasMatchingCategory) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by potential savings
        const discountA = calculateDiscountAmount(a);
        const discountB = calculateDiscountAmount(b);
        return discountB - discountA;
      })
      .slice(0, 3); // Top 3 suggestions
    
    return suggestions;
  };

  // Theme-based styles
  const getThemeStyles = () => {
    const baseStyles = {
      light: {
        background: 'bg-gradient-to-br from-gray-50 to-blue-50',
        card: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-200',
        input: 'bg-white border border-gray-300'
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 to-blue-900',
        card: 'bg-gray-800',
        text: 'text-white',
        border: 'border-gray-700',
        input: 'bg-gray-700 border-gray-600'
      }
    };
    return baseStyles[theme] || baseStyles.light;
  };

  const themeStyles = getThemeStyles();

  const steps = [
    { number: 1, title: 'Shipping', description: 'Address Information', icon: '🚚' },
    { number: 2, title: 'Review', description: 'Order Summary', icon: '📋' },
    { number: 3, title: 'Payment', description: 'Secure Payment', icon: '💳' },
    { number: 4, title: 'Confirmation', description: 'Order Complete', icon: '✅' }
  ];

  // Coupon handlers
  const handleCouponApplied = (couponData) => {
    const calculatedDiscount = calculateDiscountAmount(couponData);
    applyCoupon({
      ...couponData,
      discountAmount: calculatedDiscount
    });
  };

  const handleCouponRemoved = () => {
    removeCoupon();
  };

  // Auto-apply best coupon suggestion
  const applyBestCouponSuggestion = () => {
    if (couponSuggestions.length > 0 && !appliedCoupon) {
      const bestCoupon = couponSuggestions[0];
      handleCouponApplied(bestCoupon);
    }
  };

  // Validate shipping step
  const validateShippingStep = () => {
    const errors = {};
    const { shippingAddress } = orderData;
    
    if (!shippingAddress.firstName?.trim()) errors.firstName = 'First name is required';
    if (!shippingAddress.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!shippingAddress.email?.trim()) errors.email = 'Email is required';
    if (!shippingAddress.phone?.trim()) errors.phone = 'Phone is required';
    if (!shippingAddress.address1?.trim()) errors.address1 = 'Address is required';
    if (!shippingAddress.city?.trim()) errors.city = 'City is required';
    if (!shippingAddress.region?.trim()) errors.region = 'State/Region is required';
    if (!shippingAddress.zipCode?.trim()) errors.zipCode = 'ZIP code is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingAddress.email && !emailRegex.test(shippingAddress.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    if (shippingAddress.phone && !phoneRegex.test(shippingAddress.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Get variant ID
  const getVariantId = (item) => {
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
  };

  const createOrderHandler = async () => {
    try {
      setIsProcessing(true);
      setOrderError('');

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      const orderItems = [];
      for (const item of cartItems) {
        const variantId = getVariantId(item);
        
        if (!variantId) {
          throw new Error(`Please select a valid variant for ${item.name}`);
        }

        orderItems.push({
          productId: parseInt(item.id),
          quantity: parseInt(item.quantity),
          variantId: variantId
        });
      }

      const orderPayload = {
        shippingAddress: {
          firstName: orderData.shippingAddress.firstName?.trim() || '',
          lastName: orderData.shippingAddress.lastName?.trim() || '',
          email: orderData.shippingAddress.email?.trim() || '',
          phone: orderData.shippingAddress.phone?.trim() || '',
          address1: orderData.shippingAddress.address1?.trim() || '',
          address2: orderData.shippingAddress.address2?.trim() || '',
          city: orderData.shippingAddress.city?.trim() || '',
          region: orderData.shippingAddress.region?.trim() || '',
          country: orderData.shippingAddress.country?.trim() || 'IN',
          zipCode: orderData.shippingAddress.zipCode?.trim() || ''
        },
        items: orderItems,
        orderNotes: typeof orderData.orderNotes === 'string' ? orderData.orderNotes.trim() : "",
        couponCode: appliedCoupon?.code || null,
        discountAmount: discountAmount || 0,
        finalAmount: finalTotal
      };


      const result = await orderService.createOrder(orderPayload);
      
      if (result.success && result.data) {
        // Validate the created order has an ID
        if (!result.data.id) {
          throw new Error('Order created but no order ID returned');
        }
        
        setCreatedOrder(result.data);
        setCurrentStep(3);
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      
      // More detailed error messages
      let errorMessage = error.message;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setOrderError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize Razorpay Payment
  const initializeRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      setOrderError('');

      if (!createdOrder) {
        throw new Error('No order found. Please create an order first.');
      }

      if (!createdOrder.id) {
        throw new Error('Invalid order: Missing order ID');
      }

      
      // Load Razorpay script first
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      // Prepare payment data
      const paymentData = {
        orderId: createdOrder.id.toString()
      };


      const paymentOrder = await paymentService.createPaymentOrder(paymentData);
      
      
      if (!paymentOrder.success) {
        console.error('❌ Payment order creation failed:', paymentOrder);
        throw new Error(paymentOrder.message || paymentOrder.error || 'Failed to create payment order');
      }

      // Check the actual response structure
      if (!paymentOrder.data) {
        console.error('❌ No data in response:', paymentOrder);
        throw new Error('No payment data received from server');
      }

      // Extract values from the inner data object
      const razorpayOrderId = paymentOrder.data.id;
      const amount = paymentOrder.data.amount;
      const currency = paymentOrder.data.currency || 'INR';



      if (!razorpayOrderId) {
        console.error('❌ Missing Razorpay order ID in response. Available fields:', Object.keys(paymentOrder.data));
        throw new Error('Payment service did not return a valid order ID');
      }

      // Convert rupees to paise
      const razorpayAmount = amount * 100;
      


      // Razorpay options
      const options = {
        key: paymentOrder.data.key || import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: razorpayAmount,
        currency: currency,
        name: "Agumiya Collections",
        description: `Order #${createdOrder.id}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          await handlePaymentVerification(response);
        },
        prefill: {
          name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
          email: orderData.shippingAddress.email,
          contact: orderData.shippingAddress.phone
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        },
        notes: {
          orderId: createdOrder.id.toString()
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        setOrderError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setIsProcessing(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      
      let errorMessage = error.message;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setOrderError(errorMessage);
      setIsProcessing(false);
    }
  };

  // Handle Payment Verification
  const handlePaymentVerification = async (response) => {
    try {
      setIsProcessing(true);
      setPaymentStatus('verifying');

      
      const verifyResult = await paymentService.verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        orderId: createdOrder.id
      });

      if (verifyResult.success) {
        setPaymentStatus('success');
        
        // Mark coupon as used after successful payment
        if (appliedCoupon && user?.id) {
          try {

            await couponService.markCouponAsUsed({
              couponId: appliedCoupon.id,
              userId: user.id,
              orderId: createdOrder.id,
              discountAmount,
              couponCode: appliedCoupon.code
            });

          } catch (couponError) {
            console.error('❌ Failed to record coupon usage:', couponError);
            // No need to block order; just log
          }
        }

        // Clear cart only after successful payment
        clearCart();
        setCurrentStep(4);
        
        setTimeout(() => {
          navigate(`/orders/${createdOrder.id}`, { 
            state: { 
              paymentSuccess: true,
              orderId: createdOrder.id,
              discountApplied: !!appliedCoupon,
              discountAmount: discountAmount
            } 
          });
        }, 3000);
      } else {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('❌ Payment verification failed:', error);
      setPaymentStatus('failed');
      setOrderError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay SDK');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Navigation handlers
  const handleNextStep = async () => {
    if (currentStep === 1 && !validateShippingStep()) {
      return;
    }

    if (currentStep === 2) {
      try {
        await createOrderHandler();
      } catch (error) {
        return;
      }
    }

    if (currentStep === 3) {
      await initializeRazorpayPayment();
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Redirect if not authenticated or cart empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cartItems, navigate]);

  // // Load coupon suggestions when cart items change
  // useEffect(() => {
  //   if (cartItems.length > 0) {
  //     loadAvailableCoupons();
  //   }
  // }, [cartItems, subtotal]);

  // Auto-apply best coupon when suggestions are loaded
  useEffect(() => {
    if (couponSuggestions.length > 0 && !appliedCoupon && currentStep === 2) {
      // You can enable auto-apply here if desired
      // applyBestCouponSuggestion();
    }
  }, [couponSuggestions, appliedCoupon, currentStep]);



  if (!isAuthenticated || !cartItems || cartItems.length === 0) {
    return (
      <div className={`min-h-screen ${themeStyles.background} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen ${themeStyles.background} py-8`}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500'
                  }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {orderError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <span className="text-red-600">❌</span>
              <span className="text-red-800 dark:text-red-200 font-medium">
                {orderError}
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border}`}
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping */}
                {currentStep === 1 && (
                  <ShippingStep 
                    orderData={orderData}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    themeStyles={themeStyles}
                  />
                )}

                {/* Step 2: Review - Updated with Coupon Section */}
                {currentStep === 2 && cartItems.length > 0 && (
                  <div className="p-6">
                    {/* Coupon Section with Suggestions */}
                    <CouponSection
                      userId={user?.id}
                      subtotal={subtotal}
                      cartItems={cartItems}
                      availableCoupons={availableCoupons} // Pass as prop
                      couponSuggestions={couponSuggestions} // Pass as prop
                      couponLoading={couponLoading} // Pass loading state
                      onApplyCoupon={handleCouponApplied}
                      onRemoveCoupon={handleCouponRemoved}
                      appliedCoupon={appliedCoupon}
                      discountAmount={discountAmount}
                      formatPrice={formatPrice}
                    />
                    
                    <ReviewStep 
                      orderData={orderData}
                      cartItems={cartItems}
                      subtotal={subtotal}
                      shipping={shipping}
                      tax={tax}
                      grandTotal={finalTotal}
                      formatPrice={formatPrice}
                      appliedCoupon={appliedCoupon}
                      discountAmount={discountAmount}
                    />
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <PaymentStep 
                    createdOrder={createdOrder}
                    isProcessing={isProcessing}
                    paymentStatus={paymentStatus}
                    themeStyles={themeStyles}
                    onPaymentInit={initializeRazorpayPayment}
                    finalAmount={finalTotal}
                    discountAmount={discountAmount}
                  />
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <ConfirmationStep 
                    order={createdOrder}
                    paymentStatus={paymentStatus}
                    discountAmount={discountAmount}
                    appliedCoupon={appliedCoupon}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1 || isProcessing}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Back
                  </button>

                  {/* Next / Continue / Pay Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex justify-center items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {currentStep === 1
                          ? 'Continue to Review'
                          : currentStep === 2
                          ? `Place Order ${
                              discountAmount > 0
                                ? `& Save ${formatPrice(discountAmount).formatted}`
                                : ''
                            }`
                          : `Pay ${formatPrice(finalTotal).formatted}`}
                      </span>
                    )}
                  </button>
                </div>
              )}

            </motion.div>
          </div>

          {/* Enhanced Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <EnhancedOrderSummary
              // Data
              cartItems={cartItems}
              appliedCoupon={appliedCoupon}
              shippingCost={shipping}
              taxRate={0.08}
              currency={userCurrency}
              
              // Functions
              formatPrice={formatPrice}
              onRemoveCoupon={handleCouponRemoved}
              onProceedToCheckout={handleNextStep}
              
              // Configuration
              mode="checkout"
              showCouponSection={false}
              showActionButtons={currentStep === 2}
              showTrustBadges={true}
              showItemsList={true}
              isSticky={true}
              showHeader={true}
              
              // State
              isProcessing={isProcessing}
              couponLoading={couponLoading}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;