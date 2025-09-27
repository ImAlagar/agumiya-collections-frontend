// src/components/admin/order/OrderDetailsModal.js
import { MarsStrokeIcon } from 'lucide-react';
import React from 'react';


const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Order Details - #{order.orderNumber || order.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <MarsStrokeIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-600">Date:</span> {formatDate(order.createdAt)}</div>
                <div><span className="text-gray-600">Status:</span> <span className="capitalize">{order.status}</span></div>
                <div><span className="text-gray-600">Payment:</span> <span className="capitalize">{order.paymentStatus}</span></div>
                <div><span className="text-gray-600">Total:</span> {formatCurrency(order.totalAmount)}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-600">Name:</span> {order.customer?.name || order.shippingAddress?.name || 'N/A'}</div>
                <div><span className="text-gray-600">Email:</span> {order.customer?.email || order.user?.email || 'N/A'}</div>
                <div><span className="text-gray-600">Phone:</span> {order.shippingAddress?.phone || 'N/A'}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
              <div className="space-y-1 text-sm">
                {order.shippingAddress ? (
                  <>
                    <div>{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.address1}</div>
                    {order.shippingAddress.address2 && <div>{order.shippingAddress.address2}</div>}
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
                    <div>{order.shippingAddress.country}</div>
                  </>
                ) : (
                  <div className="text-gray-500">No shipping address provided</div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">Size: {item.size}, Color: {item.color}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={onStatusUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;