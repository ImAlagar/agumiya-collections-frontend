// src/components/common/CustomOrderButtonMobile.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const CustomOrderButtonMobile = () => {
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  const handleInstagramDM = () => {
    const instagramUsername = 'agumiyacollections_com';
    const instagramUrl = `https://instagram.com/${instagramUsername}`;
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    setShowCustomizationModal(true);
    setTimeout(() => setShowCustomizationModal(false), 3000);
  };

  return (
    <>
      {/* Mobile Floating Section */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">

        {/* 🌟 Static Professional Label (compact for mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white
                     px-3 py-1 rounded-full shadow-md border border-gray-200 dark:border-gray-600
                     text-[11px] font-semibold flex items-center space-x-1 
                     backdrop-blur-md"
        >
          <Instagram size={12} className="text-pink-600" />
          <span>Custom Order DMS</span>
        </motion.div>

        {/* Mobile Custom Order Button */}
        <motion.button
          onClick={handleInstagramDM}
          className="relative flex items-center space-x-2 
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     hover:from-purple-700 hover:to-pink-700
                     text-white font-semibold py-2 px-3 
                     rounded-full shadow-2xl 
                     border border-white/20 
                     backdrop-blur-sm
                     transition-all duration-300 
                     group"
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: "0 10px 25px rgba(192, 132, 252, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            delay: 1 
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
            <Instagram size={16} className="text-white" />
          </motion.div>

          {/* Message Icon (bouncing) */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageCircle size={14} className="text-white" />
          </motion.div>

          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.1, 1],
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

      {/* Mobile Customization Confirmation Modal */}
      <AnimatePresence>
        {showCustomizationModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-16 right-4 z-50 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white p-3 rounded-lg shadow-2xl 
                       border border-gray-200 dark:border-gray-600 
                       max-w-[180px] backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Instagram size={14} className="text-pink-600" />
              <span className="text-xs font-semibold">Instagram DM</span>
            </div>
            <p className="text-[10px] mt-1 text-gray-600 dark:text-gray-300 leading-tight">
              Opening Instagram... Message us for custom orders!
            </p>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-gray-800 
                          border-r border-b border-gray-200 dark:border-gray-600 
                          transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomOrderButtonMobile;
