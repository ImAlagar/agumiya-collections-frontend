// src/services/api/contactService.js
import apiClient from '../../config/api.js';

export const contactService = {
  // Get all contacts with pagination and filters
  async getAllContacts(params = {}) {
    try {
      const response = await apiClient.get('/contact/admin/inquiries', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch contacts');
    }
  },

  // Get single contact by ID
  async getContactById(id) {
    try {
      const response = await apiClient.get(`/contact/admin/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch contact');
    }
  },

  // Update contact status
  async updateContactStatus(contactId, statusData) {
    try {
      const response = await apiClient.patch(
        `/contact/admin/inquiries/${contactId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update contact status');
    }
  },

  // Get contact stats
  async getContactStats() {
    try {
      const response = await apiClient.get('/contact/admin/inquiries/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch contact stats');
    }
  },

  // Submit new contact inquiry (public)
  async submitContact(contactData) {
    try {
      const response = await apiClient.post('/contact/submit', contactData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit contact form');
    }
  }
};