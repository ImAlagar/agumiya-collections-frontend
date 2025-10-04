  import apiClient from '../../config/api.js';
  import { API_ENDPOINTS } from '../../config/constants.jsx';

  export const orderService = {
    // Get all orders with pagination and filters
// In your orderService
async getAllOrders(params = {}) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS, { params });
    
    // ✅ FIX: Handle the actual API response structure
    if (response.data && response.data.success) {
      // Your API returns orders in response.data.data
      const apiData = response.data.data || [];
      
      // Transform to match frontend expectations
      return {
        success: true,
        data: {
          orders: apiData, // This is the array of orders
          currentPage: params.page || 1,
          totalPages: Math.ceil(apiData.length / (params.limit || 5)),
          totalCount: apiData.length,
          // Add any other pagination data your API returns
        }
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch orders'
      };
    }
  } catch (error) {
    console.error('❌ Orders API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch orders'
    };
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
      console.log('📦 Sending order data to backend:', orderData);
      
      const response = await apiClient.post(API_ENDPOINTS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      console.error('❌ Order creation API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // ✅ Enhanced error handling with validation details
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || error.response.data?.message;
        const errorMsg = typeof validationErrors === 'string' 
          ? validationErrors 
          : 'Validation failed. Please check your input.';
        throw new Error(errorMsg);
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Bad request. Please check your data.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to create order. Please try again.'
      );
    }
  },

// In your orderService
async getOrderStats() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ORDER_STATS);
    
    // ✅ Ensure consistent response structure
    if (response.data && typeof response.data === 'object') {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: 'Invalid response format from order stats API'
      };
    }
  } catch (error) {
    console.error('❌ Order stats API error:', error);
    
    // ✅ Return consistent error structure
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch order stats'
    };
  }
}

  };