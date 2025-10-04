// src/components/common/CustomOrderButton.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const CustomOrderButton = () => {
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showHoverMessage, setShowHoverMessage] = useState(false);

  // Instagram DM handler
  const handleInstagramDM = () => {
    const instagramUsername = 'agumiyacollections_com'; // Change this to your Instagram username
    const instagramUrl = `https://instagram.com/${instagramUsername}`;
    
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    setShowCustomizationModal(true);
    setTimeout(() => setShowCustomizationModal(false), 3000);
  };

  return (
    <>
      {/* Custom Order Instagram DM Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Hover Message */}
        <AnimatePresence>
          {showHoverMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-white p-3 rounded-lg shadow-2xl 
                         border border-gray-200 dark:border-gray-600 
                         max-w-[160px] backdrop-blur-sm mb-2"
            >
              <p className="text-xs font-medium text-center leading-tight">
                Open Instagram... Message us for custom orders and personalized designs!
              </p>
              
              {/* Arrow pointing to button */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-gray-800 
                            border-r border-b border-gray-200 dark:border-gray-600 
                            transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instagram DM Button */}
        <motion.button
          onClick={handleInstagramDM}
          onMouseEnter={() => setShowHoverMessage(true)}
          onMouseLeave={() => setShowHoverMessage(false)}
          className="flex items-center space-x-2 
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     hover:from-purple-700 hover:to-pink-700
                     text-white font-semibold py-3 px-4 
                     rounded-full shadow-2xl 
                     border border-white/20 
                     backdrop-blur-sm
                     transition-all duration-300 
                     group"
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: "0 20px 40px rgba(192, 132, 252, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            delay: 2 
          }}
        >
          {/* Instagram Icon */}
          <motion.div
            className="relative"
            whileHover={{ 
              rotate: [0, -10, 10, -5, 0],
              scale: 1.1
            }}
            transition={{ duration: 0.5 }}
          >
            <Instagram size={20} className="text-white" />
          </motion.div>
          
          {/* Text */}
          <span className="text-sm font-medium whitespace-nowrap">
            Custom Order
          </span>
          
          {/* Message Icon */}
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <MessageCircle size={18} className="text-white" />
          </motion.div>
          
          {/* Pulsing Ring Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      </div>

      {/* Customization Confirmation Modal */}
      <AnimatePresence>
        {showCustomizationModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-6 z-50 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white p-4 rounded-lg shadow-2xl 
                       border border-gray-200 dark:border-gray-600 
                       max-w-xs backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Instagram size={16} className="text-pink-600" />
              <span className="text-sm font-semibold">Instagram DM</span>
            </div>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
              Opening Instagram... Message us for custom orders and personalized designs!
            </p>
            
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 
                          border-r border-b border-gray-200 dark:border-gray-600 
                          transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomOrderButton;