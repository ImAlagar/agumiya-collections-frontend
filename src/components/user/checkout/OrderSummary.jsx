// src/components/user/checkout/OrderSummary.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../../../contexts/CurrencyContext';

const OrderSummary = ({ cartItems, subtotal, shipping, tax, grandTotal, currentStep, steps, themeStyles }) => {
  const { formatPrice, userCurrency } = useCurrency();
  
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className={`${themeStyles.card} rounded-2xl shadow-xl ${themeStyles.border} p-6 lg:p-8 sticky top-8 backdrop-blur-sm`}
    >
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
      >
        Order Summary
      </motion.h3>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
        {cartItems.map((item, index) => {
          const { formatted: itemFormattedPrice } = formatPrice(item.price * item.quantity, userCurrency);
          const { formatted: singlePriceFormatted } = formatPrice(item.price, userCurrency);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg shadow-sm"
                />
                <div className="max-w-[140px] lg:max-w-[180px]">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {singlePriceFormatted} each
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white min-w-[80px] text-right">
                {itemFormattedPrice}
              </p>
            </motion.div>
          );
        })}
      </div>
      
      {/* Pricing Breakdown */}
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
        ].map(({ label, amount }, index) => {
          const { formatted: amountFormatted } = formatPrice(amount, userCurrency);
          
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600 dark:text-gray-400">{label}</span>
              <span className="text-gray-900 dark:text-white font-medium">{amountFormatted}</span>
            </motion.div>
          );
        })}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3"
        >
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl">
            {formatPrice(grandTotal, userCurrency).formatted}
          </span>
        </motion.div>

        {/* Currency Info */}
        {userCurrency !== 'USD' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-700 dark:text-blue-300">
                Amount in {userCurrency}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                ≈ {formatPrice(grandTotal, 'USD').formatted} USD
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Progress Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Step {currentStep} of {steps.length}
          </p>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2 mb-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400">
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
          <span className="text-green-600">🔒</span>
          <span>Secure 256-bit SSL Encryption</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;