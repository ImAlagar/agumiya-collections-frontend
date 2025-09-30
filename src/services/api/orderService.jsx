  import apiClient from '../../config/api.js';
  import { API_ENDPOINTS } from '../../config/constants.jsx';

  export const orderService = {
    // Get all orders with pagination and filters
    async getAllOrders(params = {}) {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS, { params });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch orders');
      }
    },

    // Get single order by ID
    async getOrderById(id) {
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch order');
      }
    },

    // Update order status
    async updateOrderStatus(orderId, statusData) {
      try {
        const response = await apiClient.patch(
          `${API_ENDPOINTS.ORDERS}/${orderId}/status`,
          statusData
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update order status');
      }
    },

    // Retry Printify forwarding
    async retryPrintifyOrder(orderId) {
      try {
        const response = await apiClient.post(
          `${API_ENDPOINTS.ORDERS}/${orderId}/retry-printify`
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to retry Printify forwarding');
      }
    },

    // Create order (for user)
  async createOrder(orderData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  async getOrderStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_STATS);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order stats');
    }
  }


    
  };