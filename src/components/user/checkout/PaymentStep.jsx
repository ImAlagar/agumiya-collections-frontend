import React from 'react';
import { motion } from 'framer-motion';

const PaymentStep = ({ createdOrder, isProcessing, onPaymentInit }) => {
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
              Order #{createdOrder.id} created successfully
            </span>
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

          <button
            type="button"
            onClick={onPaymentInit}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </span>
            ) : (
              'Pay Securely with Razorpay'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;