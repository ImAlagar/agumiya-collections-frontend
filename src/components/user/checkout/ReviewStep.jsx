import React from 'react';
import { motion } from 'framer-motion';

const ReviewStep = ({ orderData, cartItems }) => {
  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="p-8"
    >
      <motion.h2 
        className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Order Review
      </motion.h2>
      <motion.p 
        className="text-gray-600 dark:text-gray-400 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Please review your order before placing
      </motion.p>
      
      <div className="space-y-8">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">🛒</span>
            Order Items
          </h3>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">📍</span>
            Shipping Address
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="font-semibold text-gray-900 dark:text-white">{orderData.shippingAddress.name}</p>
            <p className="text-gray-600 dark:text-gray-400">{orderData.shippingAddress.street}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{orderData.shippingAddress.country}</p>
          </div>
        </motion.div>
        
        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">💳</span>
            Payment Method
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="font-semibold text-gray-900 dark:text-white">
              Credit Card ending in {orderData.paymentDetails.cardNumber.slice(-4)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Name: {orderData.paymentDetails.nameOnCard}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReviewStep;