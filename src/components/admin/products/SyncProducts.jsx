import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCwIcon, CheckIcon, AlertCircleIcon, UploadIcon } from 'lucide-react';

const SyncProducts = ({ onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const result = await onSync();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setSyncResult(result);
      
      // Clear success message after 5 seconds
      if (result.success) {
        setTimeout(() => {
          setSyncResult(null);
          setProgress(0);
        }, 5000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setSyncResult({ 
        success: false, 
        error: error.message || 'Sync failed' 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${isSyncing 
            ? 'bg-blue-500 text-white cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isSyncing ? (
          <>
            <RefreshCwIcon className="w-4 h-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <UploadIcon className="w-4 h-4" />
            Sync Products
          </>
        )}
      </button>

      {/* Progress Bar */}
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-10 min-w-64"
        >
          <div className="flex items-center gap-3 mb-3">
            <RefreshCwIcon className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Syncing with Printify...
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            This may take a few minutes. Please don't close the page.
          </p>
        </motion.div>
      )}

      {/* Success/Error Message */}
      {syncResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            absolute top-full left-0 right-0 mt-2 rounded-lg p-3 z-10 min-w-64 border
            ${syncResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }
          `}
        >
          <div className="flex items-center gap-2">
            {syncResult.success ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  {syncResult.message || 'Sync completed successfully!'}
                </span>
              </>
            ) : (
              <>
                <AlertCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800 dark:text-red-300">
                  {syncResult.error || 'Sync failed'}
                </span>
              </>
            )}
          </div>
          
          {syncResult.count && (
            <div className="mt-2 text-xs text-green-700 dark:text-green-400">
              Processed {syncResult.count} products
              {syncResult.published !== undefined && ` • ${syncResult.published} published`}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SyncProducts;