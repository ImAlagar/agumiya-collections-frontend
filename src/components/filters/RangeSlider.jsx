// src/components/filters/RangeSlider.jsx
import React from 'react';

export const RangeSlider = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  format = (val) => val,
  className = "",
  showLimits = true 
}) => {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg border border-primary-200 dark:border-primary-800">
            {format(value)}
          </span>
        </div>
      )}
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
      
      {showLimits && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span>{format(min)}</span>
          <span>{format(max)}</span>
        </div>
      )}
    </div>
  );
};

export default RangeSlider;