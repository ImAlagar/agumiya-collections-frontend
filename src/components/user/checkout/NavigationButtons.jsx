import React from 'react';
import { motion } from 'framer-motion';

const NavigationButtons = ({ currentStep, setCurrentStep, isLoading, steps, handleSubmit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex justify-between items-center p-8 border-t border-gray-200 dark:border-gray-700"
    >
      {currentStep > 1 ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
        >
          ← Back
        </motion.button>
      ) : (
        <div></div>
      )}
      
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
      >
        {isLoading ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing...
          </span>
        ) : currentStep === 3 ? (
          'Place Order 🚀'
        ) : (
          `Continue to ${steps[currentStep]?.title} →`
        )}
      </motion.button>
    </motion.div>
  );
};

export default NavigationButtons;