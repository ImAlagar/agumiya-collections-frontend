import apiClient from "../../config/api";

export const calculationService = {
  /**
   * Calculate totals WITHOUT shipping and tax
   * Only returns subtotal and final total (same as subtotal)
   */
  async calculateCartTotals(cartItems, shippingAddress = {}, couponCode = '') {
    try {
      console.log('🔄 Calculating totals WITHOUT shipping and tax');
      
      // Calculate only subtotal from cart items
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // 🚫 NO SHIPPING COST
      const shipping = 0;
      
      // 🚫 NO TAX COST
      const tax = 0;
      
      // Final total is same as subtotal (no extra charges)
      const finalTotal = subtotal;
      
      // Return structured response
      return {
        success: true,
        amounts: {
          subtotalUSD: subtotal,
          shippingUSD: shipping, // Always 0
          taxUSD: tax, // Always 0
          totalUSD: finalTotal // Same as subtotal
        },
        breakdown: {
          taxRate: 0, // No tax
          shippingMethod: 'free',
          estimatedDelivery: '3-5 business days'
        },
        currency: 'USD'
      };
      
    } catch (error) {
      console.error('Calculation error:', error);
      
      // Fallback - still no shipping/tax
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        success: true,
        amounts: {
          subtotalUSD: subtotal,
          shippingUSD: 0,
          taxUSD: 0,
          totalUSD: subtotal
        },
        breakdown: {
          taxRate: 0,
          shippingMethod: 'free'
        },
        currency: 'USD'
      };
    }
  },

  /**
   * Quick calculation for cart page - also NO shipping/tax
   */
  async calculateQuickTotals(cartItems, country) {
    try {
      console.log('🔄 Quick calculation WITHOUT shipping and tax');
      
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        success: true,
        amounts: {
          subtotalUSD: subtotal,
          shippingUSD: 0, // No shipping
          taxUSD: 0, // No tax
          totalUSD: subtotal // Same as subtotal
        },
        breakdown: {
          taxRate: 0, // No tax
          shippingMethod: 'free'
        },
        currency: 'USD'
      };
      
    } catch (error) {
      console.error('Quick calculation error:', error);
      
      // Fallback - still no shipping/tax
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        success: true,
        amounts: {
          subtotalUSD: subtotal,
          shippingUSD: 0,
          taxUSD: 0,
          totalUSD: subtotal
        },
        breakdown: {
          taxRate: 0,
          shippingMethod: 'free'
        },
        currency: 'USD'
      };
    }
  }
};