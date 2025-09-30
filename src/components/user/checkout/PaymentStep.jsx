import React from 'react';
import { motion } from 'framer-motion';

const PaymentStep = ({ orderData, formErrors, handleInputChange, formatCardNumber, themeStyles }) => {
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const mainFields = [
    { 
      label: 'Card Number', 
      field: 'cardNumber', 
      type: 'text', 
      placeholder: '1234 5678 9012 3456',
      transform: formatCardNumber
    },
    { 
      label: 'Name on Card', 
      field: 'nameOnCard', 
      type: 'text', 
      placeholder: 'John Doe' 
    }
  ];

  const secondaryFields = [
    { label: 'Expiry Date', field: 'expiryDate', placeholder: 'MM/YY' },
    { label: 'CVV', field: 'cvv', placeholder: '123' }
  ];

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "tween", stiffness: 100, damping: 20 }}
      className="p-8"
    >
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.h2 
          variants={itemAnimation}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Payment Method
        </motion.h2>
        <motion.p 
          variants={itemAnimation}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          Secure payment with 256-bit encryption
        </motion.p>
        
        <div className="space-y-6">
          {mainFields.map(({ label, field, type, placeholder, transform }) => (
            <motion.div key={field} variants={itemAnimation}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {label}
              </label>
              <input
                type={type}
                required
                value={orderData.paymentDetails[field]}
                onChange={(e) => {
                  const value = transform ? transform(e.target.value) : e.target.value;
                  handleInputChange('paymentDetails', field, value);
                }}
                className={`w-full px-4 py-3 rounded-xl ${themeStyles.input} transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={placeholder}
                maxLength={field === 'cardNumber' ? 19 : undefined}
              />
              {formErrors[field] && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {formErrors[field]}
                </motion.p>
              )}
            </motion.div>
          ))}
          
          <div className="grid grid-cols-2 gap-6">
            {secondaryFields.map(({ label, field, placeholder }) => (
              <motion.div key={field} variants={itemAnimation}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {label}
                </label>
                <input
                  type="text"
                  required
                  value={orderData.paymentDetails[field]}
                  onChange={(e) => handleInputChange('paymentDetails', field, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl ${themeStyles.input} transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={placeholder}
                  maxLength={field === 'expiryDate' ? 5 : field === 'cvv' ? 4 : undefined}
                />
                {formErrors[field] && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {formErrors[field]}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;