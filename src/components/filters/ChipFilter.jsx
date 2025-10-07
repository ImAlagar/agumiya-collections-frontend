// src/components/filters/ChipFilter.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const ChipFilter = ({ 
  label, 
  options, 
  value, 
  onChange, 
  multiSelect = false,
  className = "",
  showCounts = true,
  maxVisible = null 
}) => {
  const [showAll, setShowAll] = React.useState(false);
  
  const displayedOptions = maxVisible && !showAll ? options.slice(0, maxVisible) : options;
  const hiddenCount = maxVisible ? options.length - maxVisible : 0;

  const handleClick = (optionValue) => {
    if (multiSelect) {
      const newValue = Array.isArray(value) 
        ? (value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue])
        : [optionValue];
      onChange(newValue);
    } else {
      onChange(value === optionValue ? '' : optionValue);
    }
  };

  const isActive = (optionValue) => {
    return multiSelect 
      ? Array.isArray(value) && value.includes(optionValue)
      : value === optionValue;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
          {label}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {displayedOptions.map((option) => {
          const active = isActive(option.value);
          
          return (
            <motion.button
              key={option.value}
              onClick={() => handleClick(option.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                active
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                {option.icon && <span className="text-base">{option.icon}</span>}
                {option.label}
                {showCounts && option.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    active 
                      ? 'bg-white/20 text-white/90' 
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {option.count}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
        
        {hiddenCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="px-3 py-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
          >
            +{hiddenCount} more
          </button>
        )}
        
        {showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default ChipFilter;