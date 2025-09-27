// src/components/admin/products/SyncProducts.jsx
import React, { useState } from 'react';
import { useProducts } from '../../../contexts/ProductsContext';
import { CheckIcon, WifiSyncIcon } from 'lucide-react';

const SyncProducts = ({ onSyncComplete }) => {
  const { syncProducts, isSyncLoading, syncStatus } = useProducts();
  const [lastSync, setLastSync] = useState(null);

  const handleSync = async () => {
    const result = await syncProducts();
    if (result.success) {
      setLastSync(new Date().toLocaleTimeString());
      onSyncComplete?.();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={isSyncLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isSyncLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        <WifiSyncIcon className={`w-4 h-4 ${isSyncLoading ? 'animate-spin' : ''}`} />
        {isSyncLoading ? 'Syncing...' : 'Sync Products'}
      </button>
      
      {lastSync && !isSyncLoading && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckIcon className="w-4 h-4" />
          Synced at {lastSync}
        </div>
      )}
    </div>
  );
};

export default SyncProducts;