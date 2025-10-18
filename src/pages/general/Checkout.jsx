import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthProvider';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useCoupon } from '../../contexts/CouponContext';
import { orderService } from '../../services/api/orderService';
import { paymentService } from '../../services/api/paymentService';
import { calculationService } from '../../services/api/calculationService';
import { couponService } from '../../services/api/couponService';

const Checkout = () => {
  const { cartItems, total: cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { 
    formatPriceSimple,
    userCurrency, 
    userCountry
  } = useCurrency();
  const { 
    appliedCoupon, 
    discountAmount, 
    loading: couponLoading, 
    applyCoupon, 
    removeCoupon,
    markCouponAsUsed 
  } = useCoupon();
  
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [calculating, setCalculating] = useState(false);
  
  // Payment flow state management
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'failed', 'cancelled'
  const [paymentError, setPaymentError] = useState('');
  
  // Available coupons state
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [hasLoadedCoupons, setHasLoadedCoupons] = useState(false);
  
  // Refs for cleanup and state management
  const calculationsRef = useRef();
  const couponsLoadedRef = useRef(false);
  const paymentInProgressRef = useRef(false);
  const orderIdRef = useRef(null);
  const razorpayInstanceRef = useRef(null);

  // Shipping address form state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    region: '',
    country: userCountry || 'US',
    zipCode: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Update refs when values change
  useEffect(() => {
    calculationsRef.current = calculations;
  }, [calculations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending payment instances
      if (razorpayInstanceRef.current) {
        razorpayInstanceRef.current.close();
      }
      paymentInProgressRef.current = false;
    };
  }, []);



  // Redirect if not authenticated or cart empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart', { replace: true });
      return;
    }
  }, [isAuthenticated, cartItems, navigate]);

  // Load available coupons
  const loadAvailableCoupons = useCallback(async () => {
    if (cartItems.length === 0 || !calculations || couponsLoading || couponsLoadedRef.current) {
      return;
    }

    setCouponsLoading(true);
    try {
      
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
      setHasLoadedCoupons(true);
      
    } catch (error) {
      console.error('❌ Failed to load available coupons:', error);
      
      if (error.response) {
        console.error('📋 Error response data:', error.response.data);
        console.error('📋 Error status:', error.response.status);
      }
      
      setAvailableCoupons([]);
      couponsLoadedRef.current = true;
      setHasLoadedCoupons(true);
    } finally {
      setCouponsLoading(false);
    }
  }, [cartItems, calculations, cartTotal, user, couponsLoading]);

  // Calculate totals when cart items, shipping address, or coupon changes
  useEffect(() => {
    const calculateTotals = async () => {
      if (cartItems.length === 0) return;
      
      setCalculating(true);
      try {
   
        const result = await calculationService.calculateCartTotals(
          cartItems.map(item => ({
            productId: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress,
          appliedCoupon?.code || ''
        );


        if (result && result.success) {
          setCalculations({
            subtotal: result.amounts?.subtotalUSD || cartTotal,
            shipping: result.amounts?.shippingUSD || 0,
            tax: result.amounts?.taxUSD || 0,
            finalTotal: result.amounts?.totalUSD || cartTotal,
            taxRate: result.breakdown?.taxRate || 0,
            discount: discountAmount,
            currency: result.currency || 'USD'
          });
        } else {
          console.error('❌ CHECKOUT - Invalid response structure:', result);
          // Fallback calculation
          setCalculations({
            subtotal: cartTotal,
            shipping: 0,
            tax: 0,
            finalTotal: cartTotal,
            taxRate: 0,
            discount: discountAmount,
            currency: userCurrency
          });
        }
      } catch (error) {
        console.error('❌ CHECKOUT - Calculation error:', error);
        // Fallback calculation
        setCalculations({
          subtotal: cartTotal,
          shipping: 0,
          tax: 0,
          finalTotal: cartTotal,
          taxRate: 0,
          discount: discountAmount,
          currency: userCurrency
        });
      } finally {
        setCalculating(false);
      }
    };

    calculateTotals();
  }, [cartItems, shippingAddress, appliedCoupon, discountAmount, cartTotal, userCurrency]);

  // Load coupons after calculations are ready
  useEffect(() => {
    if (calculations && !couponsLoadedRef.current) {
      loadAvailableCoupons();
    }
  }, [calculations, loadAvailableCoupons]);

  const handleAddressChange = (field, value) => {
    const newAddress = {
      ...shippingAddress,
      [field]: value
    };
    
    setShippingAddress(newAddress);
  };

  const handleApplyCoupon = async (code = couponCode) => {
    if (!code.trim()) return;
    
    await applyCoupon({
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
    
    setCouponCode('');
    setShowAvailableCoupons(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  const handleApplySuggestedCoupon = (coupon) => {
    handleApplyCoupon(coupon.code);
  };

  const handleRefreshCoupons = () => {
    couponsLoadedRef.current = false;
    setHasLoadedCoupons(false);
    loadAvailableCoupons();
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `${formatPriceSimple(coupon.discountValue)} OFF`;
    }
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'country', 'zipCode'];
    const missing = required.filter(field => !shippingAddress[field]);
    
    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(', ')}`);
      return false;
    }
    
    if (!shippingAddress.email.match(/^\S+@\S+\.\S+$/)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    if (!shippingAddress.phone.match(/^\d{10,15}$/)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return false;
    }
    
    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return;
    
    if (paymentInProgressRef.current) {
      alert('A payment is already in progress. Please wait...');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setPaymentError('');
    
    try {
      const orderData = {
        shippingAddress,
        items: cartItems.map(item => {
          
          // Extract productId - ensure it's a number
          let productId = item.productId || item.id;
          if (typeof productId === 'string') {
            if (productId.includes('-')) {
              productId = parseInt(productId.split('-')[0]);
            } else {
              productId = parseInt(productId);
            }
          }
          
          // Handle variantId
          let variantId = item.variant?.id || item.variantId;
          
          // If variantId is "default" or invalid, try to get from product data
          if (!variantId || variantId === 'default') {
            console.warn('⚠️ Invalid variant ID, attempting to find valid variant');
            
            // Try to get the first available variant from the product
            if (item.variants && item.variants.length > 0) {
              variantId = item.variants[0].id;
            } else if (product?.printifyVariants && product.printifyVariants.length > 0) {
              variantId = product.printifyVariants[0].id;
            } else {
              throw new Error(`No valid variants found for product: ${item.name}. Please reselect this item.`);
            }
          }
          
          // Ensure variantId is a number
          if (typeof variantId === 'string') {
            variantId = parseInt(variantId);
          }
          
          // Final validation
          if (isNaN(productId)) {
            throw new Error(`Invalid productId: ${item.productId || item.id}`);
          }
          
          if (isNaN(variantId)) {
            throw new Error(`Invalid variantId: ${item.variantId}. Please select a valid product variant.`);
          }
          
          return {
            productId: productId,
            quantity: item.quantity,
            variantId: variantId,
            price: item.price
          };
        }),
        orderNotes,
        couponCode: appliedCoupon?.code || ''
      };

      
      const orderResult = await orderService.createOrder(orderData);
      
      if (orderResult.success) {
        setCurrentOrder(orderResult.data);
        orderIdRef.current = orderResult.data.id;
        
        // Mark coupon as used if applied
        if (appliedCoupon) {
          await markCouponAsUsed({
            couponId: appliedCoupon.id,
            userId: user.id,
            orderId: orderResult.data.id,
            discountAmount: discountAmount,
            couponCode: appliedCoupon.code
          });
        }
        
        // Proceed to payment
        await initiatePayment(orderResult.data.id);
      } else {
        throw new Error(orderResult.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      setPaymentStatus('failed');
      setPaymentError(error.message);
      alert(`Order failed: ${error.message}`);
      setLoading(false);
    }
  };

  const initiatePayment = async (orderId) => {
    try {
      
      const paymentResult = await paymentService.createPaymentOrder({
        orderId: orderId
      });

      if (paymentResult.success) {
        openRazorpayCheckout(paymentResult.data, orderId);
      } else {
        throw new Error(paymentResult.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('❌ Payment initiation failed:', error);
      setPaymentStatus('failed');
      setPaymentError(error.message);
      alert(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (paymentData, orderId) => {
    // Prevent multiple payment instances
    if (paymentInProgressRef.current) {
      return;
    }

    paymentInProgressRef.current = true;
    
    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "Agumiya Collections",
      description: "Order Payment",
      order_id: paymentData.id,
      handler: async function (response) {
        setPaymentStatus('success');
        
        try {
          // Validate Razorpay response
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            throw new Error('Incomplete payment response from Razorpay');
          }


          // Verify payment on your server - INCLUDE ORDER ID
          const verificationResult = await paymentService.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId.toString()
          });


          if (verificationResult.success) {
            
            // Clear the cart
            clearCart();
            
            // Reset payment state
            paymentInProgressRef.current = false;
            razorpayInstanceRef.current = null;
            
            // Redirect to order details page
            navigate(`/orders/${orderId}`, {
              state: {
                paymentSuccess: true,
                paymentId: response.razorpay_payment_id,
                orderId: orderId
              },
              replace: true
            });
          } else {
            throw new Error(verificationResult.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('❌ Payment verification failed:', error);
          setPaymentStatus('failed');
          paymentInProgressRef.current = false;
          
          let errorMessage = 'Payment verification failed. ';
          
          if (error.message.includes('Missing required verification fields')) {
            errorMessage += 'Technical issue with payment data. Please contact support.';
          } else if (error.message.includes('signature')) {
            errorMessage += 'Security verification failed. Please contact support with your payment ID.';
          } else {
            errorMessage += error.message || 'Please contact support.';
          }
          
          setPaymentError(errorMessage);
          alert(errorMessage);
          
        }
      },
      prefill: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: shippingAddress.email,
        contact: shippingAddress.phone
      },
      theme: {
        color: "#3B82F6"
      },
      modal: {
        ondismiss: function() {
          setPaymentStatus('cancelled');
          paymentInProgressRef.current = false;
          razorpayInstanceRef.current = null;
          
          // Show cancellation message but don't block the user
          setTimeout(() => {
            if (window.confirm('Payment was cancelled. You can try again from your orders page. Would you like to view your orders?')) {
              navigate('/shop');
            }
          }, 500);
        }
      },
      notes: {
        orderId: orderId.toString(),
        customerEmail: shippingAddress.email
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      razorpayInstanceRef.current = rzp;
      
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        setPaymentStatus('failed');
        setPaymentError(response.error.description || 'Payment failed');
        paymentInProgressRef.current = false;
        razorpayInstanceRef.current = null;
        
        alert(`Payment failed: ${response.error.description}. Please try again.`);
      });

      rzp.open();
    } catch (error) {
      console.error('❌ Failed to open Razorpay checkout:', error);
      setPaymentStatus('failed');
      setPaymentError('Failed to initialize payment gateway');
      paymentInProgressRef.current = false;
      razorpayInstanceRef.current = null;
      setLoading(false);
    }
  };

  const getPaymentButtonText = () => {
    if (loading || paymentStatus === 'processing') {
      return 'Processing...';
    }
    if (paymentStatus === 'success') {
      return 'Payment Successful!';
    }
    if (paymentStatus === 'failed') {
      return 'Try Again';
    }
    if (paymentStatus === 'cancelled') {
      return 'Place Order Again';
    }
    return `Place Order - ${formatPriceSimple(finalTotal)}`;
  };

  const getPaymentButtonVariant = () => {
    switch (paymentStatus) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'failed':
        return 'bg-red-600 hover:bg-red-700';
      case 'cancelled':
        return 'bg-orange-600 hover:bg-orange-700';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  const displayCurrency = calculations?.currency || userCurrency;
  const finalTotal = calculations?.finalTotal || cartTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Checkout
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Complete your purchase securely
              </p>
            </div>
          </div>
          
          {/* Payment Status Indicator */}
          {paymentStatus !== 'idle' && (
            <div className={`px-4 py-3 rounded-xl shadow-sm border ${
              paymentStatus === 'processing' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
              paymentStatus === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
              paymentStatus === 'failed' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
              'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
            }`}>
              <div className="flex items-center text-sm">
                {paymentStatus === 'processing' && (
                  <>
                    <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-700 dark:text-blue-300">Processing payment...</span>
                  </>
                )}
                {paymentStatus === 'success' && (
                  <>
                    <svg className="h-4 w-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 dark:text-green-300">Payment successful! Redirecting...</span>
                  </>
                )}
                {paymentStatus === 'failed' && (
                  <>
                    <svg className="h-4 w-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-red-700 dark:text-red-300">Payment failed. Please try again.</span>
                  </>
                )}
                {paymentStatus === 'cancelled' && (
                  <>
                    <svg className="h-4 w-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-orange-700 dark:text-orange-300">Payment cancelled. You can try again.</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Shipping, Coupons & Order Notes */}
          <div className="xl:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.firstName}
                    onChange={(e) => handleAddressChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.lastName}
                    onChange={(e) => handleAddressChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) => handleAddressChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={paymentStatus === 'processing'}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={paymentStatus === 'processing'}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address1}
                  onChange={(e) => handleAddressChange('address1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={paymentStatus === 'processing'}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={shippingAddress.address2}
                  onChange={(e) => handleAddressChange('address2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={paymentStatus === 'processing'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State/Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.region}
                    onChange={(e) => handleAddressChange('region', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  value={shippingAddress.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={paymentStatus === 'processing'}
                >
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
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
                        disabled={couponsLoading || paymentStatus === 'processing'}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                        title="Refresh coupons"
                      >
                        <svg className={`w-4 h-4 ${couponsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                      disabled={paymentStatus === 'processing'}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm disabled:opacity-50"
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
                                <span className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                                  {getDiscountText(coupon)}
                                </span>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {coupon.code}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {coupon.description}
                                </p>
                                {coupon.potentialDiscount > 0 && (
                                  <p className="text-green-600 dark:text-green-400 text-sm mt-1 font-medium">
                                    Save {formatPriceSimple(coupon.potentialDiscount)} ({coupon.potentialSavings}%)
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
                                {coupon.applicableItemsCount > 0 && (
                                  <div>Applies to {coupon.applicableItemsCount} items</div>
                                )}
                              </div>
                              <button
                                onClick={() => handleApplySuggestedCoupon(coupon)}
                                disabled={couponLoading || paymentStatus === 'processing'}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100"
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

            {/* Order Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Notes</h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={paymentStatus === 'processing'}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatPriceSimple(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPriceSimple(calculations?.subtotal || cartTotal)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPriceSimple(calculations?.shipping || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tax {calculations?.taxRate && `(${calculations.taxRate}%)`}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPriceSimple(calculations?.tax || 0)}
                  </span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="font-medium">Discount</span>
                    <span className="font-semibold">-{formatPriceSimple(discountAmount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPriceSimple(finalTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                    All prices in {displayCurrency}
                  </p>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={createOrder}
                disabled={loading || calculating || !calculations || paymentStatus === 'processing'}
                className={`w-full mt-6 ${getPaymentButtonVariant()} disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center`}
              >
                {loading || paymentStatus === 'processing' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {getPaymentButtonText()}
                  </>
                ) : (
                  getPaymentButtonText()
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>

              {/* Back to Cart */}
              <Link 
                to="/cart" 
                className="block text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-4"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;