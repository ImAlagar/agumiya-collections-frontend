// src/components/admin/products/SyncProductsButton.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

const SyncProductsButton = ({ syncStatus, onSync, resetAfter = 2000 }) => {
  const { theme } = useTheme();

  // Optional: Auto reset success state back to default after few seconds
  useEffect(() => {
    let timer;
    if (syncStatus.success) {
      timer = setTimeout(() => {
        if (syncStatus.onReset) {
          syncStatus.onReset();
        }
      }, resetAfter);
    }
    return () => clearTimeout(timer);
  }, [syncStatus.success, resetAfter, syncStatus]);

  return (
    <motion.button
      onClick={onSync}
      disabled={syncStatus.isSyncing}
      whileHover={{ scale: syncStatus.isSyncing ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
        syncStatus.isSyncing
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
      }`}
    >
      {syncStatus.isSyncing ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Syncing...</span>
        </>
      ) : syncStatus.success ? (
        <>
          <svg
            className="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Synced</span>
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M5.5 19.5l3.5-3.5m6 0l3.5 3.5M4.5 8.5l3.5 3.5m6 0l3.5-3.5"
            />
          </svg>
          <span>Sync Products</span>
        </>
      )}
    </motion.button>
  );
};

export default SyncProductsButton;
