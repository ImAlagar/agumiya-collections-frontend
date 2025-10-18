import React from 'react';
import { motion } from 'framer-motion';

const PaymentStep = ({ 
  createdOrder, 
  isProcessing, 
  onPaymentInit,
  finalAmount,
  discountAmount,
  taxAmount,
  shippingCost,
  subtotal,
  formatPrice,
  appliedCoupon 
}) => {
  
  // ✅ FIXED: Calculate the display amount correctly
  const getDisplayAmount = () => {
    if (!createdOrder) return finalAmount;
    
    // If backend provides totalAmount in paise, convert to rupees for display
    const amountInRupees = createdOrder.totalAmount / 100;
    return amountInRupees;
  };
  
  const displayAmount = getDisplayAmount();
  const displayCurrency = createdOrder?.currency || 'INR';

  // ✅ FIXED: Calculate USD equivalent for display
  const getUSDAmount = () => {
    if (!createdOrder) return subtotal + shippingCost + taxAmount - discountAmount;
    
    // Use originalAmount from backend if available, otherwise calculate
    if (createdOrder.originalAmount) {
      return createdOrder.originalAmount;
    }
    
    // Fallback calculation
    return createdOrder.subtotalAmount + 
           (createdOrder.shipping?.[0]?.shippingCost || 0) + 
           (createdOrder.taxAmount || 0) - 
           (createdOrder.discountAmount || 0);
  };

  const usdAmount = getUSDAmount();

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Secure Payment
      </h2>
      
      {createdOrder && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-green-800 dark:text-green-200 font-medium">
              Order created successfully! Please complete your payment to confirm.
            </span>
          </div>
          
          {/* Order Details */}
          <div className="mt-3 text-sm text-green-700 dark:text-green-300 space-y-1">
            <div><strong>Order #:</strong> {createdOrder.id}</div>
            <div><strong>Amount:</strong> {formatPrice(displayAmount, displayCurrency).formatted}</div>
            <div><strong>Currency:</strong> {displayCurrency}</div>
            <div className="text-xs opacity-75">
              Subtotal: {formatPrice(createdOrder.subtotalAmount || subtotal, 'USD').formatted} • 
              Shipping: {formatPrice(createdOrder.shipping?.[0]?.shippingCost || shippingCost, 'USD').formatted} • 
              Discount: -{formatPrice(createdOrder.discountAmount || discountAmount, 'USD').formatted}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">💳</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Razorpay Secure Payment
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to complete your payment securely via Razorpay.
          </p>

          {/* Payment Amount Display */}
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(displayAmount, displayCurrency).formatted}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total Amount to Pay
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ≈ {formatPrice(usdAmount, 'USD').formatted}
            </div>
          </div>

          <button
            type="button"
            onClick={onPaymentInit}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </span>
            ) : (
              `Pay ${formatPrice(displayAmount, displayCurrency).formatted} Securely`
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            🔒 Your payment is secured with Razorpay. We do not store your card details.
          </p>

        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;