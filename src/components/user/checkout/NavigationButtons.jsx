import React from 'react';
import { motion } from 'framer-motion';

const NavigationButtons = ({ currentStep, setCurrentStep, isLoading, steps, handleSubmit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex justify-between items-center p-4 sm:p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 left-0 right-0"
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
          className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold text-sm sm:text-base"
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
        className="px-6 sm:px-10 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] sm:min-w-[160px]"
        onClick={handleSubmit}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
            <span className="text-xs sm:text-sm">Processing...</span>
          </span>
        ) : currentStep === 3 ? (
          <span className="flex items-center">
            Place Order <span className="ml-1 sm:ml-2">🚀</span>
          </span>
        ) : (
          <span className="flex items-center">
            Continue <span className="hidden xs:inline ml-1">to {steps[currentStep]?.title}</span> <span className="ml-1 sm:ml-2">→</span>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default NavigationButtons;