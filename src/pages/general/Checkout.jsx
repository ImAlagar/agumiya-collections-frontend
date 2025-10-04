import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext'; // ✅ Import currency context
import { orderService } from '../../services/api/orderService';
import { paymentService } from '../../services/api/paymentService';

// Import components
import ShippingStep from '../../components/user/checkout/ShippingStep';
import ReviewStep from '../../components/user/checkout/ReviewStep';
import PaymentStep from '../../components/user/checkout/PaymentStep';
import ConfirmationStep from '../../components/user/checkout/ConfirmationStep';
import OrderSummary from '../../components/user/checkout/OrderSummary';
import { useAuth } from '../../contexts/AuthProvider';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency(); // ✅ Use currency context
  const navigate = useNavigate();

  // Order and payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderError, setOrderError] = useState('');

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

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  // ✅ FIXED: Get correct variant ID from cart items
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

  // Step 1: Create Order in Database
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
        orderNotes: typeof orderData.orderNotes === 'string' ? orderData.orderNotes.trim() : ""
      };

      console.log('🔄 Creating order payload:', JSON.stringify(orderPayload, null, 2));

      const result = await orderService.createOrder(orderPayload);
      
      if (result.success && result.data) {
        console.log('✅ Order created:', result.data);
        setCreatedOrder(result.data);
        setCurrentStep(3);
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      setOrderError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Initialize Razorpay Payment
  const initializeRazorpayPayment = async () => {
    try {
      if (!createdOrder) {
        throw new Error('No order found. Please create an order first.');
      }

      setIsProcessing(true);
      setOrderError('');
      
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      console.log('🔄 Creating Razorpay order for:', createdOrder.id);
      const paymentOrder = await paymentService.createPaymentOrder(createdOrder.id);
      
      if (!paymentOrder.success) {
        throw new Error(paymentOrder.message || 'Failed to create payment order');
      }

      console.log('✅ Razorpay order created:', paymentOrder.data);

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: paymentOrder.data.amount,
        currency: paymentOrder.data.currency || 'INR',
        name: "Agumiya Collections",
        description: `Order #${createdOrder.id}`,
        order_id: paymentOrder.data.id,
        handler: async (response) => {
          console.log('🔄 Payment handler called:', response);
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
            console.log('Payment modal dismissed');
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      setOrderError(error.message);
      setIsProcessing(false);
    }
  };

  // Step 3: Handle Payment Verification
  const handlePaymentVerification = async (response) => {
    try {
      setIsProcessing(true);
      setPaymentStatus('verifying');

      console.log('🔄 Verifying payment:', response);
      
      const verifyResult = await paymentService.verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        orderId: createdOrder.id
      });

      if (verifyResult.success) {
        console.log('✅ Payment verified successfully');
        setPaymentStatus('success');
        
        clearCart();
        setCurrentStep(4);
        
        setTimeout(() => {
          navigate(`/orders/${createdOrder.id}`, { 
            state: { 
              paymentSuccess: true,
              orderId: createdOrder.id 
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
        console.log('✅ Razorpay SDK loaded');
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

  // Debug cart items on mount
  useEffect(() => {
    console.log('🛒 Current cart items:', cartItems);
    cartItems.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        name: item.name,
        variantId: item.variantId,
        variant: item.variant,
        selectedVariantId: item.selectedVariantId
      });
    });
  }, [cartItems]);

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

                {/* Step 2: Review */}
                {currentStep === 2 && (
                  <ReviewStep 
                    orderData={orderData}
                    cartItems={cartItems}
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    grandTotal={grandTotal}
                    formatPrice={formatPrice} // ✅ Pass formatPrice
                  />
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <PaymentStep 
                    createdOrder={createdOrder}
                    isProcessing={isProcessing}
                    paymentStatus={paymentStatus}
                    themeStyles={themeStyles}
                    onPaymentInit={initializeRazorpayPayment}
                  />
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <ConfirmationStep 
                    order={createdOrder}
                    paymentStatus={paymentStatus}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1 || isProcessing}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {currentStep === 1 ? 'Continue to Review' : 
                         currentStep === 2 ? 'Place Order' : 
                         'Pay Now'}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              grandTotal={grandTotal}
              currentStep={currentStep}
              themeStyles={themeStyles}
              formatPrice={formatPrice} // ✅ Pass formatPrice
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;