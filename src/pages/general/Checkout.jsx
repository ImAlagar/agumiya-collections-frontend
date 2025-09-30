import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';

// Import components
import ShippingStep from '../../components/user/checkout/ShippingStep';
import PaymentStep from '../../components/user/checkout/PaymentStep';
import ReviewStep from '../../components/user/checkout/ReviewStep';
import ConfirmationStep from '../../components/user/checkout/ConfirmationStep';
import OrderSummary from '../../components/user/checkout/OrderSummary';
import NavigationButtons from '../../components/user/checkout/NavigationButtons';
import { SEO } from '../../contexts/SEOContext';
import ProfessionalProgressSteps from '../../components/user/checkout/ProfessionalProgressSteps';

// Enhanced SEO configuration for checkout page
const checkoutStructuredData = (cartItems, grandTotal) => ({
  '@context': 'https://schema.org',
  '@type': 'CheckoutPage',
  'name': 'Checkout | Agumiya Collections',
  'description': 'Complete your purchase securely',
  'url': window.location.href,
  'potentialAction': {
    '@type': 'ViewAction',
    'target': window.location.href
  },
  'mainEntity': {
    '@type': 'Order',
    'orderNumber': 'pending',
    'orderStatus': 'https://schema.org/OrderProcessing',
    'acceptedOffer': cartItems.map(item => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Product',
        'name': item.name,
        'image': item.image,
        'description': item.description || item.name
      },
      'price': item.price,
      'priceCurrency': 'USD',
      'eligibleQuantity': {
        '@type': 'QuantitativeValue',
        'value': item.quantity
      }
    })),
    'priceCurrency': 'USD',
    'totalPrice': grandTotal
  }
});

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { createOrder, isLoading } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    shippingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'credit_card',
    paymentDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    }
  });

  // Page transition animations
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    in: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  // Theme-based styles
  const getThemeStyles = () => {
    const baseStyles = {
      light: {
        background: 'bg-gradient-to-br from-gray-50 to-blue-50',
        card: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-200',
        input: 'bg-white border border-gray-300',
        progress: {
          active: 'bg-blue-600 border-blue-600',
          completed: 'bg-blue-600 border-blue-600',
          pending: 'border-gray-300 text-gray-500'
        }
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 to-blue-900',
        card: 'bg-gray-800',
        text: 'text-white',
        border: 'border-gray-700',
        input: 'bg-gray-700 border-gray-600',
        progress: {
          active: 'bg-blue-400 border-blue-400',
          completed: 'bg-blue-400 border-blue-400',
          pending: 'border-gray-600 text-gray-400'
        }
      },
      smokey: {
        background: 'bg-gradient-to-br from-gray-800 to-purple-900',
        card: 'bg-gray-700/80 backdrop-blur-sm',
        text: 'text-white',
        border: 'border-gray-600',
        input: 'bg-gray-600/50 border-gray-500',
        progress: {
          active: 'bg-purple-500 border-purple-500',
          completed: 'bg-purple-500 border-purple-500',
          pending: 'border-gray-500 text-gray-400'
        }
      }
    };
    return baseStyles[theme] || baseStyles.light;
  };

  const themeStyles = getThemeStyles();

  const steps = [
    { number: 1, title: 'Shipping', description: 'Address Information', icon: '🚚' },
    { number: 2, title: 'Payment', description: 'Payment Details', icon: '💳' },
    { number: 3, title: 'Review', description: 'Order Summary', icon: '📋' },
    { number: 4, title: 'Confirmation', description: 'Order Complete', icon: '✅' }
  ];

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!orderData.shippingAddress.name.trim()) errors.name = 'Full name is required';
      if (!orderData.shippingAddress.street.trim()) errors.street = 'Street address is required';
      if (!orderData.shippingAddress.city.trim()) errors.city = 'City is required';
      if (!orderData.shippingAddress.state.trim()) errors.state = 'State is required';
      if (!orderData.shippingAddress.zipCode.trim()) errors.zipCode = 'ZIP code is required';
      if (!orderData.shippingAddress.country.trim()) errors.country = 'Country is required';
    }
    
    if (step === 2) {
      if (!orderData.paymentDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        errors.cardNumber = 'Valid card number is required';
      }
      if (!orderData.paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        errors.expiryDate = 'Valid expiry date (MM/YY) is required';
      }
      if (!orderData.paymentDetails.cvv.match(/^\d{3,4}$/)) {
        errors.cvv = 'Valid CVV is required';
      }
      if (!orderData.paymentDetails.nameOnCard.trim()) {
        errors.nameOnCard = 'Name on card is required';
      }
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

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Create order
    try {
      const orderPayload = {
        shippingAddress: {
          firstName: orderData.shippingAddress.name.split(' ')[0] || '',
          lastName: orderData.shippingAddress.name.split(' ').slice(1).join(' ') || '',
          email: user?.email || '',
          phone: "+1234567890",
          address1: orderData.shippingAddress.street,
          address2: "",
          city: orderData.shippingAddress.city,
          region: orderData.shippingAddress.state,
          country: orderData.shippingAddress.country,
          zipCode: orderData.shippingAddress.zipCode
        },
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          variantId: item.variantId || "default"
        })),
        orderNotes: "Order from website",
        paymentMethod: orderData.paymentMethod,
        totalAmount: grandTotal,
        subtotal: subtotal,
        shippingCost: shipping,
        taxAmount: tax
      };

      const result = await createOrder(orderPayload);
      
      if (result.success) {
        clearCart();
        setCurrentStep(4);
        setTimeout(() => {
          navigate(`/orders/${result.order.id}`);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Order failed: ${error.message}`);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${themeStyles.background} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Checkout | Agumiya Collections"
        description="Complete your purchase securely with Agumiya Collections. Fast shipping and secure payment processing."
        keywords="checkout, purchase, secure payment, shipping, agumiya collections"
        canonical="/checkout"
        ogType="website"
        structuredData={checkoutStructuredData(cartItems, grandTotal)}
      />

      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`min-h-screen ${themeStyles.background} py-8`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Enhanced Progress Steps */}
               <ProfessionalProgressSteps
              currentStep={currentStep} 
              steps={steps} 
            />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} backdrop-blur-sm`}
              >
                <form onSubmit={handleSubmit}>
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

                    {/* Step 2: Payment */}
                    {currentStep === 2 && (
                      <PaymentStep 
                        orderData={orderData}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        formatCardNumber={formatCardNumber}
                        themeStyles={themeStyles}
                      />
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                      <ReviewStep 
                        orderData={orderData}
                        cartItems={cartItems}
                      />
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                      <ConfirmationStep />
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  {currentStep < 4 && (
                    <NavigationButtons 
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      isLoading={isLoading}
                      steps={steps}
                      handleSubmit={handleSubmit}
                    />
                  )}
                </form>
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
                steps={steps}
                themeStyles={themeStyles}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Checkout;