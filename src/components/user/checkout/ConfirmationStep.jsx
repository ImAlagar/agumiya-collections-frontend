import React from 'react';
import { motion } from 'framer-motion';

const ConfirmationStep = ({ order, paymentStatus }) => {
  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-12 text-center"
    >
      {paymentStatus === 'success' ? (
        <>
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-green-600 dark:text-green-400 text-4xl">✓</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your purchase. Order #{order?.id} has been confirmed.
          </p>
        </>
      ) : (
        <>
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Processing Payment...
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Please wait while we confirm your payment.
          </p>
        </>
      )}
    </motion.div>
  );
};

export default ConfirmationStep;