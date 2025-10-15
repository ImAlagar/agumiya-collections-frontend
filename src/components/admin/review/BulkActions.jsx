// src/components/admin/review/BulkActions.jsx
import React from 'react';
import { CheckCircle, Trash2, X } from 'lucide-react';

const BulkActions = ({ 
  selectedCount, 
  onBulkApprove, 
  onBulkDelete, 
  loading 
}) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {selectedCount} review{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBulkApprove}
            disabled={loading === 'bulk-approve'}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            {loading === 'bulk-approve' ? 'Approving...' : 'Approve Selected'}
          </button>

          <button
            onClick={onBulkDelete}
            disabled={loading === 'bulk-delete'}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {loading === 'bulk-delete' ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;