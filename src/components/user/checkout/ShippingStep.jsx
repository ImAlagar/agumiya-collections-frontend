import React from 'react';
import { motion } from 'framer-motion';

const ShippingStep = ({ orderData, formErrors, handleInputChange, themeStyles }) => {
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

  const fields = [
    { label: 'Full Name', field: 'name', type: 'text', placeholder: 'John Doe', colSpan: 2 },
    { label: 'Street Address', field: 'street', type: 'text', placeholder: '123 Main Street', colSpan: 2 },
    { label: 'City', field: 'city', type: 'text', placeholder: 'New York' },
    { label: 'State', field: 'state', type: 'text', placeholder: 'NY' },
    { label: 'ZIP Code', field: 'zipCode', type: 'text', placeholder: '10001' },
    { label: 'Country', field: 'country', type: 'text', placeholder: 'United States' }
  ];

  return (
    <motion.div
      key="shipping"
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
          Shipping Address
        </motion.h2>
        <motion.p 
          variants={itemAnimation}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          Where should we deliver your order?
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(({ label, field, type, placeholder, colSpan }) => (
            <motion.div
              key={field}
              variants={itemAnimation}
              className={colSpan === 2 ? 'md:col-span-2' : ''}
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {label}
              </label>
              <input
                type={type}
                required
                value={orderData.shippingAddress[field]}
                onChange={(e) => handleInputChange('shippingAddress', field, e.target.value)}
                className={`w-full px-4 py-3 rounded-xl ${themeStyles.input} transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={placeholder}
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
      </motion.div>
    </motion.div>
  );
};

export default ShippingStep;