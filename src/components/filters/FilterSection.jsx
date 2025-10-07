// src/components/filters/FilterSection.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FilterSection = ({ 
  title, 
  children, 
  isOpen = true, 
  onToggle,
  className = "",
  badgeCount 
}) => {
  const [open, setOpen] = React.useState(isOpen);

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    onToggle?.(newState);
  };

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
      initial={false}
      animate={{ height: 'auto' }}
    >
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {badgeCount > 0 && (
            <span className="bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-6 flex items-center justify-center">
              {badgeCount}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 flex items-center justify-center text-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterSection;