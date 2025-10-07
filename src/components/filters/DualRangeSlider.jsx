// src/components/filters/DualRangeSlider.jsx
import React from 'react';

export const DualRangeSlider = ({ 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange, 
  absoluteMin, 
  absoluteMax, 
  step = 1,
  format = (val) => val,
  className = ""
}) => {
  const minPercentage = ((minValue - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  const maxPercentage = ((maxValue - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Values Display */}
      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Min</div>
          <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {format(minValue)}
          </div>
        </div>
        <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Max</div>
          <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {format(maxValue)}
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative h-2">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2"></div>
        
        {/* Active Range */}
        <div 
          className="absolute top-1/2 h-1 bg-primary-500 rounded-full transform -translate-y-1/2"
          style={{ left: `${minPercentage}%`, right: `${100 - maxPercentage}%` }}
        ></div>
        
        {/* Min Thumb */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          step={step}
          value={minValue}
          onChange={(e) => onMinChange(Number(e.target.value))}
          className="absolute top-1/2 left-0 w-full h-2 opacity-0 cursor-pointer z-20 transform -translate-y-1/2"
        />
        
        {/* Max Thumb */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          step={step}
          value={maxValue}
          onChange={(e) => onMaxChange(Number(e.target.value))}
          className="absolute top-1/2 left-0 w-full h-2 opacity-0 cursor-pointer z-20 transform -translate-y-1/2"
        />
        
        {/* Custom Thumbs */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-primary-500 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 z-10 cursor-pointer"
          style={{ left: `${minPercentage}%` }}
        ></div>
        <div
          className="absolute top-1/2 w-4 h-4 bg-primary-500 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 z-10 cursor-pointer"
          style={{ left: `${maxPercentage}%` }}
        ></div>
      </div>

      {/* Limits */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
        <span>{format(absoluteMin)}</span>
        <span>{format(absoluteMax)}</span>
      </div>
    </div>
  );
};

export default DualRangeSlider; 