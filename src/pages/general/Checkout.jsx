import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { shippingService } from '../../services/api/shippingService';
import { useTax } from '../../contexts/TaxContext';

// Import components
import ShippingStep from '../../components/user/checkout/ShippingStep';
import ReviewStep from '../../components/user/checkout/ReviewStep';
import PaymentStep from '../../components/user/checkout/PaymentStep';
import ConfirmationStep from '../../components/user/checkout/ConfirmationStep';
import EnhancedOrderSummary from '../../components/user/checkout/EnhancedOrderSummary';
import CouponSection from '../../components/user/checkout/CouponSection';

// Constants
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_CALCULATION_DEBOUNCE = 500;

const Checkout = () => {
  // Hooks and Context
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const { formatPrice, userCurrency } = useCurrency();
  const { appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCoupon();
  const { calculateTax, taxCalculation, loading: taxLoading } = useTax();
  const navigate = useNavigate();

  // State management
  const [shippingData, setShippingData] = useState({
    cost: 0,
    isFree: false,
    loading: false,
    message: '',
    progress: 0,
    estimatedDays: { min: 3, max: 7 },
    hasFallback: false
  });

  const [taxData, setTaxData] = useState({
    amount: 0,
    rate: 0,
    country: '',
    region: '',
    loading: false,
    error: null
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderError, setOrderError] = useState('');
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
      country: 'US',
      zipCode: ''
    },
    orderNotes: ''
  });

  // Get variant ID function
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

  // Memoized calculations
  const subtotal = useMemo(() => 
    getCartTotal?.() || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [cartItems, getCartTotal]
  );

  const calculateDiscountAmount = useCallback((coupon, currentSubtotal = subtotal) => {
    if (!coupon) return 0;
    
    let discount = 0;
    
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (currentSubtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'FIXED') {
      discount = coupon.discountValue;
    }
    
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    
    return Math.min(discount, currentSubtotal);
  }, [subtotal]);

  // Updated final calculations with tax
  const taxableAmount = useMemo(() => 
    Math.max(0, subtotal - discountAmount), 
    [subtotal, discountAmount]
  );

  const finalTotal = useMemo(() => 
    Math.max(0, subtotal + shippingData.cost + taxData.amount - discountAmount), 
    [subtotal, shippingData.cost, taxData.amount, discountAmount]
  );

  // ✅ Fixed Tax Calculation Effect
  useEffect(() => {
    const calculateTaxForOrder = async () => {
      const shippingAddress = orderData.shippingAddress;
      
      // Check if we have all required fields for tax calculation
      const hasRequiredAddress = 
        shippingAddress.country && 
        shippingAddress.region && 
        shippingAddress.city && 
        shippingAddress.zipCode;
      
      if (cartItems.length === 0 || !hasRequiredAddress) {
        console.log('🛑 Tax calculation skipped - incomplete address:', {
          country: shippingAddress.country,
          region: shippingAddress.region,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode
        });
        
        setTaxData({
          amount: 0,
          rate: 0,
          country: '',
          region: '',
          loading: false,
          error: 'Complete shipping address required for tax calculation'
        });
        return;
      }

      setTaxData(prev => ({ ...prev, loading: true, error: null }));

      try {
        // ✅ Fixed payload structure to match backend expectations
        const taxPayload = {
          items: cartItems.map(item => ({
            productId: parseInt(item.id),
            name: item.name || 'Product',
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity)
          })),
          shippingAddress: {
            country: shippingAddress.country,
            region: shippingAddress.region,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode
          },
          subtotal: parseFloat(subtotal),
          shippingCost: parseFloat(shippingData.cost)
        };

        console.log('🧾 Calculating tax with backend-compatible payload:', taxPayload);
        
        const result = await calculateTax(taxPayload);
        console.log('📊 Tax calculation result:', result);
        
        if (result.success && result.data) {
          setTaxData({
            amount: result.data.taxAmount || 0,
            rate: result.data.taxRate || 0,
            country: result.data.country || shippingAddress.country,
            region: result.data.region || shippingAddress.region,
            loading: false,
            error: null
          });
        } else {
          throw new Error(result.message || 'Failed to calculate tax');
        }
      } catch (error) {
        console.error('Tax calculation error:', error);
        setTaxData({
          amount: 0,
          rate: 0,
          country: orderData.shippingAddress.country,
          region: orderData.shippingAddress.region,
          loading: false,
          error: error.message
        });
      }
    };

    // Only calculate tax if we have items and address is complete
    const shippingAddress = orderData.shippingAddress;
    const hasRequiredAddress = 
      shippingAddress.country && 
      shippingAddress.region && 
      shippingAddress.city && 
      shippingAddress.zipCode;

    if (cartItems.length > 0 && hasRequiredAddress) {
      const timeoutId = setTimeout(calculateTaxForOrder, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [
    cartItems, 
    subtotal, 
    shippingData.cost, 
    orderData.shippingAddress.country,
    orderData.shippingAddress.region,
    orderData.shippingAddress.city,
    orderData.shippingAddress.zipCode,
    calculateTax
  ]);

  // Shipping calculation
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

        const response = await shippingService.getShippingEstimates({
          cartItems: apiCartItems,
          subtotal: subtotal,
          country: orderData.shippingAddress.country || 'US',
          region: orderData.shippingAddress.region || null
        });

        if (response.success && response.data) {
          setShippingData({
            cost: response.data.totalShipping,
            isFree: response.data.isFree,
            loading: false,
            message: response.data.message,
            progress: response.data.progress,
            estimatedDays: response.data.estimatedDays || { min: 3, max: 7 },
            hasFallback: response.data.hasFallback || false
          });
        } else {
          throw new Error(response.message || 'Failed to calculate shipping');
        }
      } catch (error) {
        console.error('Shipping API error:', error);
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
          estimatedDays: orderData.shippingAddress.country === 'US' 
            ? { min: 3, max: 7 } 
            : { min: 10, max: 21 },
          hasFallback: true
        });
      }
    };

    timeoutId = setTimeout(calculateShipping, SHIPPING_CALCULATION_DEBOUNCE);
    return () => clearTimeout(timeoutId);
  }, [cartItems, subtotal, orderData.shippingAddress.country, orderData.shippingAddress.region, getVariantId]);

  // Coupon suggestions
  const generateCouponSuggestions = useCallback((coupons) => {
    if (!Array.isArray(coupons) || coupons.length === 0) return [];
    
    return coupons
      .filter(coupon => {
        if (!coupon || !coupon.isActive) return false;
        
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          return false;
        }
        
        if (coupon.maxOrderValue && subtotal > coupon.maxOrderValue) return false;
        
        const now = new Date();
        if (coupon.validFrom && new Date(coupon.validFrom) > now) return false;
        if (coupon.validUntil && new Date(coupon.validUntil) < now) return false;
        
        if (coupon.applicableCategories?.length > 0) {
          const cartCategories = cartItems.map(item => item.category).filter(Boolean);
          const hasMatchingCategory = cartCategories.some(category => 
            coupon.applicableCategories.includes(category)
          );
          if (!hasMatchingCategory) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        const discountA = calculateDiscountAmount(a);
        const discountB = calculateDiscountAmount(b);
        return discountB - discountA;
      })
      .slice(0, 3);
  }, [cartItems, subtotal, calculateDiscountAmount]);

  // Theme styles
  const themeStyles = useMemo(() => {
    const baseStyles = {
      light: {
        background: 'bg-gradient-to-br from-gray-50 to-blue-50',
        card: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-200',
        input: 'bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        button: {
          primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          secondary: 'border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        }
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 to-blue-900',
        card: 'bg-gray-800',
        text: 'text-white',
        border: 'border-gray-700',
        input: 'bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        button: {
          primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          secondary: 'border border-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        }
      }
    };
    return baseStyles[theme] || baseStyles.light;
  }, [theme]);

  // Steps configuration
  const steps = useMemo(() => [
    { number: 1, title: 'Shipping', description: 'Address Information', icon: '🚚' },
    { number: 2, title: 'Review', description: 'Order Summary', icon: '📋' },
    { number: 3, title: 'Payment', description: 'Secure Payment', icon: '💳' },
    { number: 4, title: 'Confirmation', description: 'Order Complete', icon: '✅' }
  ], []);

  // Event handlers
  const handleCouponApplied = useCallback((couponData) => {
    const calculatedDiscount = calculateDiscountAmount(couponData);
    applyCoupon({
      ...couponData,
      discountAmount: calculatedDiscount
    });
  }, [calculateDiscountAmount, applyCoupon]);

  const handleCouponRemoved = useCallback(() => {
    removeCoupon();
  }, [removeCoupon]);

  const validateShippingStep = useCallback(() => {
    const errors = {};
    const { shippingAddress } = orderData;
    
    const requiredFields = {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
      phone: 'Phone is required',
      address1: 'Address is required',
      city: 'City is required',
      region: 'State/Region is required',
      country: 'Country is required',
      zipCode: 'ZIP code is required'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!shippingAddress[field]?.trim()) {
        errors[field] = message;
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingAddress.email && !emailRegex.test(shippingAddress.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    if (shippingAddress.phone && !phoneRegex.test(shippingAddress.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [orderData.shippingAddress]);

  const handleInputChange = useCallback((section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [formErrors]);

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
          variantId: variantId,
          price: item.price,
          productName: item.name,
          isTaxable: item.isTaxable !== false
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
        shippingCost: shippingData.cost || 0,
        taxAmount: taxData.amount || 0,
        taxRate: taxData.rate || 0,
        taxCountry: taxData.country || '',
        taxRegion: taxData.region || '',
        subtotal: subtotal,
        taxableAmount: taxableAmount,
        finalAmount: finalTotal
      };

      console.log('📦 Order payload with tax:', orderPayload);

      const result = await orderService.createOrder(orderPayload);
      
      if (result.success && result.data) {
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
      
      let errorMessage = error.message;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('variant')) {
        errorMessage = 'Please make sure all product options are selected.';
      }
      
      setOrderError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay SDK');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  const initializeRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      setOrderError('');

      if (!createdOrder?.id) {
        throw new Error('No valid order found. Please create an order first.');
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      const paymentData = { orderId: createdOrder.id.toString() };
      const paymentOrder = await paymentService.createPaymentOrder(paymentData);
      
      if (!paymentOrder.success || !paymentOrder.data?.id) {
        throw new Error(paymentOrder.message || 'Failed to create payment order');
      }

      const { id: razorpayOrderId, amount, currency = 'INR' } = paymentOrder.data;

      const options = {
        key: paymentOrder.data.key || import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
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
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => setIsProcessing(false)
        },
        notes: {
          orderId: createdOrder.id.toString()
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', (response) => {
        console.error('❌ Payment failed:', response.error);
        setOrderError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setIsProcessing(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      setOrderError(error.message);
      setIsProcessing(false);
    }
  };

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
        
        // Record coupon usage
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
          }
        }

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

  const handleNextStep = async () => {
    try {
      if (currentStep === 1 && !validateShippingStep()) {
        return;
      }

      if (currentStep === 2) {
        await createOrderHandler();
        return;
      }

      if (currentStep === 3) {
        await initializeRazorpayPayment();
        return;
      }

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      // Error handling is done in individual functions
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Effects
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

  // Loading state
  if (!isAuthenticated || !cartItems || cartItems.length === 0) {
    return (
      <div className={`min-h-screen ${themeStyles.background} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading checkout...</p>
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium transition-colors ${
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
                  <div className={`h-0.5 w-8 transition-colors ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {orderError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm">!</span>
                  </div>
                  <span className="text-red-800 dark:text-red-200 font-medium">
                    {orderError}
                  </span>
                </div>
                <button
                  onClick={() => setOrderError('')}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} overflow-hidden`}
            >
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <ShippingStep 
                    orderData={orderData}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    themeStyles={themeStyles}
                  />
                )}

                {currentStep === 2 && cartItems.length > 0 && (
                  <div className="p-6">
                    <CouponSection
                      userId={user?.id}
                      subtotal={subtotal}
                      cartItems={cartItems}
                      availableCoupons={availableCoupons}
                      couponSuggestions={couponSuggestions}
                      couponLoading={couponLoading}
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
                      shipping={shippingData.cost}
                      tax={taxData.amount}
                      taxRate={taxData.rate}
                      grandTotal={finalTotal}
                      formatPrice={formatPrice}
                      appliedCoupon={appliedCoupon}
                      discountAmount={discountAmount}
                      shippingEstimate={shippingData}
                      taxLoading={taxData.loading}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <PaymentStep 
                    createdOrder={createdOrder}
                    isProcessing={isProcessing}
                    paymentStatus={paymentStatus}
                    themeStyles={themeStyles}
                    onPaymentInit={initializeRazorpayPayment}
                    finalAmount={finalTotal}
                    discountAmount={discountAmount}
                    taxAmount={taxData.amount}
                    formatPrice={formatPrice}
                  />
                )}

                {currentStep === 4 && (
                  <ConfirmationStep 
                    order={createdOrder}
                    paymentStatus={paymentStatus}
                    discountAmount={discountAmount}
                    appliedCoupon={appliedCoupon}
                    taxAmount={taxData.amount}
                    formatPrice={formatPrice}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1 || isProcessing}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1 || isProcessing
                        ? 'opacity-50 cursor-not-allowed border border-gray-300 dark:border-gray-600 text-gray-400'
                        : `${themeStyles.button.secondary} text-gray-700 dark:text-gray-300`
                    }`}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex justify-center items-center space-x-2 ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : `${themeStyles.button.primary} shadow-lg hover:shadow-xl transform hover:scale-105`
                    }`}
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
                          ? `Place Order ${discountAmount > 0 ? `& Save ${formatPrice(discountAmount).formatted}` : ''}`
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
              cartItems={cartItems}
              appliedCoupon={appliedCoupon}
              shippingCost={shippingData.cost}
              taxAmount={taxData.amount || 0}
              taxRate={taxData.rate || 0}
              taxLoading={taxData.loading || false}
              isFreeShipping={shippingData.isFree}
              freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
              shippingProgress={shippingData.progress}
              shippingMessage={shippingData.message}
              estimatedDays={shippingData.estimatedDays}
              shippingLoading={shippingData.loading}
              currency={userCurrency}
              userCountry={orderData.shippingAddress.country || 'US'}
              userRegion={orderData.shippingAddress.region || null}
              showFreeShippingProgress={true}
              formatPrice={formatPrice}
              onRemoveCoupon={handleCouponRemoved}
              onProceedToCheckout={handleNextStep}
              mode="checkout"
              showCouponSection={false}
              showActionButtons={currentStep === 2}
              showTrustBadges={true}
              showItemsList={true}
              isSticky={true}
              showHeader={true}
              isProcessing={isProcessing || shippingData.loading || taxData.loading}
              couponLoading={couponLoading}
              themeStyles={themeStyles}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;