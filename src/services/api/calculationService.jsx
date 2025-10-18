import apiClient from "../../config/api";

export const calculationService = {
  /**
   * Calculate all totals (shipping, tax, discount, final total)
   */
  async calculateCartTotals(cartItems, shippingAddress = {}, couponCode = '') {
    try {
      const response = await apiClient.post('/order-calculation/calculate-totals', {
        items: cartItems,
        shippingAddress,
        couponCode
      });
      
      return response.data;
    } catch (error) {
      console.error('Calculation API error:', error);
      throw new Error(error.response?.data?.message || 'Failed to calculate totals');
    }
  },

  /**
   * Quick calculation for cart page (minimal data)
   */
  async calculateQuickTotals(cartItems, country) {
    try {
      const response = await apiClient.post('/order-calculation/calculate-totals', {
        items: cartItems,
        shippingAddress: { country },
        couponCode: ''
      });
      
      return response.data;
    } catch (error) {
      console.error('Quick calculation error:', error);
      throw new Error('Failed to calculate quick totals');
    }
  }
};