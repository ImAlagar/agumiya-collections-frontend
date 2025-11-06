import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrency } from '../../contexts/CurrencyContext';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPriceSimple } = useCurrency();
  
  const [orderDetails, setOrderDetails] = useState(null);

  // Get order details from location state or initialize
  useEffect(() => {
    if (location.state) {
      setOrderDetails({
        orderId: location.state.orderId,
        paymentId: location.state.paymentId,
        finalTotal: location.state.finalTotal,
        email: location.state.email
      });
    } else {
      // Fallback - redirect to home if no order data
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleViewOrderNow = () => {
    navigate('/profile?tab=orders', {
      state: {
        paymentSuccess: true,
        paymentId: orderDetails?.paymentId,
        orderId: orderDetails?.orderId
      },
      replace: true
    });
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 p-8 md:p-12">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h1>
          
          {/* Message */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Your order has been placed successfully
          </p>
          
          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  #{orderDetails.orderId || 'Processing...'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {orderDetails.paymentId || 'Processing...'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                  {orderDetails.finalTotal ? formatPriceSimple(orderDetails.finalTotal) : 'Processing...'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Status Info */}
          {orderDetails.orderId === 'processing' && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">
                  Your order is being processed. You'll receive a confirmation email shortly.
                </span>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewOrderNow}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View All Orders
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continue Shopping
              </button>
              <button
                onClick={handleGoToHome}
                className="border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Home
              </button>
            </div>
          </div>
          
          {/* Confirmation Email */}
          {orderDetails.email && (
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  A confirmation email has been sent to {orderDetails.email}
                </span>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{' '}
              <button 
                onClick={() => navigate('/contact')}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
              >
                Contact our support team
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;