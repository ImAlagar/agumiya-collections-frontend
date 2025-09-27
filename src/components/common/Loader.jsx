import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';

const Loader = () => {
  const { loading, loadingText } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="text-center">
        {/* Animated Loader */}
        <div className="loader mx-auto mb-4"></div>
        
        {/* Loading Text */}
        <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
          {loadingText}
        </p>
        
        {/* Optional: Loading Dots Animation */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;