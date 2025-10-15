// src/services/api/paymentService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const paymentService = {
  // Create Razorpay order
  async createPaymentOrder(paymentData) {
    try {
      
      if (!paymentData.orderId) {
        throw new Error('Order ID is required');
      }

      const requestData = {
        orderId: paymentData.orderId.toString()
      };


      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_CREATE_ORDER, requestData);
      
      
      // Your backend returns: { success: true, data: { id: "order_xxx", ... } }
      // So we need to return response.data.data (the inner data object)
      const paymentDataResponse = response.data.data;
      
      
      if (!paymentDataResponse) {
        throw new Error('No payment data found in response');
      }
      
      return {
        success: true,
        data: paymentDataResponse, // This should be the inner data object
        rawResponse: response.data // Keep the full response for reference
      };
      
    } catch (error) {
      console.error('❌ Payment order creation failed:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                        'Failed to create payment order';
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
        status: error.response?.status
      };
    }
  },

  // Verify payment (client-side verification)
  async verifyPayment(verificationData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_VERIFY, verificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  // Get payment status
  async getPaymentStatus(orderId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS_STATUS}/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }
};