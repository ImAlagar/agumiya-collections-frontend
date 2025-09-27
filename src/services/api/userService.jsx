// src/services/api/userService.js
import apiClient from '../../config/api.js';
import { API_ENDPOINTS } from '../../config/constants.jsx';

export const userService = {
  // Get all users with pagination and filters
  async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get single user by ID
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Update user status
  async updateUserStatus(userId, statusData) {
    try {
      const response = await apiClient.patch(
        `/admin/users/${userId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  },

  // Get user stats
  async getUserStats() {
    try {
      const response = await apiClient.get('/admin/users/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
};  