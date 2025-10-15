// src/services/api/authService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS, USER_TYPES, STORAGE_KEYS } from '../../config/constants.jsx';
import { storageManager } from '../storage/storageManager';

export const authService = {
  // ------------------ ADMIN METHODS ------------------
 async loginAdmin(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_LOGIN, credentials);
      const data = response.data;

      if (data?.success && data?.token) {
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.ADMIN);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.ADMIN, USER_TYPES.ADMIN);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.admin, USER_TYPES.ADMIN);
      }

      return data;
    } catch (error) {
      
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
          error: error.response.data.message
        };
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Invalid admin credentials',
          error: 'Invalid admin credentials'
        };
      }
      
      return {
        success: false,
        message: 'Admin login failed. Please try again.',
        error: 'Admin login failed. Please try again.'
      };
    }
  },

  async registerAdmin(adminData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_REGISTER, adminData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Admin registration failed'
      };
    }
  },

  async getAdminProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_PROFILE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get admin profile');
    }
  },

  async forgotAdminPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  },

  async resetAdminPassword(resetData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_RESET_PASSWORD, resetData);
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password reset failed' 
      };
    }
  },

  // ------------------ USER METHODS ------------------
  async loginUser(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_LOGIN, credentials);
      const data = response.data;

      if (data?.success && data?.token) {
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.USER, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.user, USER_TYPES.USER);
      }

      return data;
    } catch (error) {
      // Return clean error object - NO console.log here
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
          error: error.response.data.message
        };
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'Invalid email or password'
        };
      }
      
      return {
        success: false,
        message: 'Login failed. Please try again.',
        error: 'Login failed. Please try again.'
      };
    }
  },

  async registerUser(userData) {
    try {  
      const response = await apiClient.post(API_ENDPOINTS.USER_REGISTER, userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.message;
        return {
          success: false,
          message: validationErrors || 'Please check your input fields',
          error: validationErrors || 'Validation failed'
        };
      }
      
      const backendMessage = error.response?.data?.message;
      
      if (backendMessage) {
        return {
          success: false,
          message: backendMessage,
          error: backendMessage
        };
      }
      
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        error: 'Registration failed'
      };
    }
  },
  async forgotUserPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  },

async resetUserPassword(resetData) {
  try {

    const response = await apiClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, resetData);
    
    return response.data;
    
  } catch (error) {
    console.error('Reset password error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Password reset failed' 
    };
  }
},

  async getUserProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER_UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  async getUserOrders() {
  try {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user orders');
  }
},

  async getReviewableProducts() {
    try {
      // This endpoint should return products from delivered orders that haven't been reviewed yet
      const response = await apiClient.get('/api/v1/reviews/reviewable-products');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reviewable products',
        data: { products: [] }
      };
    }
  },

  // Alternative: If you don't have a dedicated endpoint, use this method
  async getReviewableProductsFromOrders() {
    try {
      // Get user orders first
      const ordersResponse = await apiClient.get(API_ENDPOINTS.USER_ORDERS);
      
      if (!ordersResponse.data.success) {
        return { success: false, data: { products: [] } };
      }

      const orders = ordersResponse.data.orders || ordersResponse.data.data || [];
      
      // Filter delivered orders and extract products
      const deliveredOrders = orders.filter(order => 
        order.status === 'DELIVERED' || order.fulfillmentStatus === 'DELIVERED'
      );

      const reviewableProducts = [];
      
      deliveredOrders.forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            // Check if product hasn't been reviewed (you might need to add this check)
            if (item.product && !item.reviewed) {
              reviewableProducts.push({
                ...item.product,
                orderId: order.id || order._id,
                orderDate: order.createdAt,
                purchasedDate: order.createdAt
              });
            }
          });
        }
      });

      return {
        success: true,
        data: { products: reviewableProducts }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reviewable products',
        data: { products: [] }
      };
    }
  },
  

  // ------------------ COMMON METHODS ------------------
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    // Clear all tokens (user & admin)
    storageManager.clearAllAuth();
    return { success: true };
  }
};

