import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className=" mt-5 mb-5 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 sm:p-14 text-center max-w-sm w-full">
        
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Thank You!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Your order has been placed successfully.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-transform transform hover:scale-105"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-transform transform hover:scale-105"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-xl transition-transform transform hover:scale-105"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
