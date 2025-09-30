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
      console.log('Admin Auth Service Error:', error.response?.data);
      
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
        // Save user token & details
        storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_TYPE, USER_TYPES.USER, USER_TYPES.USER);
        storageManager.setItem(STORAGE_KEYS.USER_DATA, data.user, USER_TYPES.USER);
      }

      return data;
    } catch (error) {
      console.log('Auth Service Error:', error.response?.data); // Debug log
      
      // If backend returns proper JSON with message, use it
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
          error: error.response.data.message
        };
      }
      
      // Fallback for when backend returns plain text or no message
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'Invalid email or password'
        };
      }
      
      if (error.response?.status === 500) {
        return {
          success: false,
          message: 'Server error. Please try again later.',
          error: 'Server error. Please try again later.'
        };
      }
      
      // Network errors
      if (!error.response) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.',
          error: 'Network error. Please check your internet connection.'
        };
      }

      // Default fallback
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
      throw new Error(error.response?.data?.message || 'Registration failed');
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

