// src/components/admin/order/StatusUpdateModal.js
import { MarsIcon } from 'lucide-react';
import React, { useState } from 'react';
const StatusUpdateModal = ({ order, onClose, onConfirm, isLoading }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Order has been placed but not yet confirmed' },
    { value: 'confirmed', label: 'Confirmed', description: 'Order has been confirmed and is ready for processing' },
    { value: 'processing', label: 'Processing', description: 'Order is being processed and prepared for shipment' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped to the customer' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been delivered to the customer' },
    { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Update Order Status</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MarsIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order #{order.orderNumber || order.id}
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Current status: <span className="capitalize font-medium">{order.status}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {statusOptions.find(opt => opt.value === selectedStatus)?.description}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedStatus === order.status}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;