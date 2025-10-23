// src/services/api/paymentService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const paymentService = {
  // Create Razorpay order
  async createPaymentOrder(orderData) {
    try {
      // Validate order data
      if (!orderData || !orderData.items || !orderData.shippingAddress) {
        throw new Error('Order data is required');
      }

      
      // Send complete order data to payment API
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_CREATE_ORDER, orderData);
      

      const paymentDataResponse = response.data.data;
      
      if (!paymentDataResponse) {
        throw new Error('No payment data found in response');
      }
      
      return {
        success: true,
        data: paymentDataResponse,
        rawResponse: response.data
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
      
      // Validate required fields - NO ORDER ID NEEDED
      const requiredFields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'];
      const missingFields = requiredFields.filter(field => !verificationData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required verification fields: ${missingFields.join(', ')}`);
      }

      // Send only payment verification data
      const verificationPayload = {
        razorpay_payment_id: verificationData.razorpay_payment_id,
        razorpay_order_id: verificationData.razorpay_order_id,
        razorpay_signature: verificationData.razorpay_signature
      };


      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS_VERIFY, verificationPayload);
      
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Payment verification failed';
      
      throw new Error(errorMessage);
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