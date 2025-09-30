import React from 'react';
import { motion } from 'framer-motion';

const OrderSummary = ({ cartItems, subtotal, shipping, tax, grandTotal, currentStep, steps, themeStyles }) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} p-8 sticky top-8 backdrop-blur-sm`}
    >
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
      >
        Order Summary
      </motion.h3>
      
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg shadow-sm"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4"
      >
        {[
          { label: 'Subtotal', amount: subtotal },
          { label: 'Shipping', amount: shipping },
          { label: 'Tax', amount: tax }
        ].map(({ label, amount }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="text-gray-900 dark:text-white">${amount.toFixed(2)}</span>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3"
        >
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${grandTotal.toFixed(2)}
          </span>
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Step {currentStep} of 3
          </p>
          <span className="text-xs text-blue-600 dark:text-blue-400">
            {Math.round((currentStep / 3) * 100)}%
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          Currently: {steps[currentStep - 1]?.title}
        </p>
      </motion.div>

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center"
      >
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>🔒</span>
          <span>Secure 256-bit SSL Encryption</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;