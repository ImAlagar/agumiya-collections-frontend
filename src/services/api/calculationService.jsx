// src/services/api/calculationService.js - REPLACE THIS FILE
import apiClient from "../../config/api";

export const calculationService = {
  /**
   * Calculate totals WITH real shipping and tax from your backend API
   */
  async calculateCartTotals(cartItems, shippingAddress = {}, couponCode = '') {
    try {
      console.log('🔄 Calculating totals WITH real shipping and tax');

      // Prepare request data in the format your backend expects
      const requestData = {
        cartItems: cartItems.map(item => ({
          productId: item.productId || item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        shippingAddress: {
          country: shippingAddress.country,
          region: shippingAddress.region,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode
        },
        couponCode: couponCode || ''
      };

      // Call your real backend API
      const response = await apiClient.post('/order-calculation/calculate-totals', requestData);
      
      if (response.data.success) {
        const data = response.data.data;
        
        return {
          success: true,
          amounts: {
            subtotalUSD: data.subtotal,
            shippingUSD: data.shipping,
            taxUSD: data.tax,
            totalUSD: data.finalTotal
          },
          breakdown: {
            taxRate: data.breakdown.taxRate,
            shippingMethod: 'standard',
            estimatedDelivery: data.shippingDetails.estimatedDays ? 
              `${data.shippingDetails.estimatedDays.min}-${data.shippingDetails.estimatedDays.max} business days` : 
              '3-7 business days',
            discount: data.discount,
            couponCode: data.breakdown.couponCode,
            isFreeShipping: data.breakdown.isFreeShipping
          },
          currency: data.breakdown.currency || 'USD',
          rawData: data // Include full response for debugging
        };
      } else {
        throw new Error(response.data.message || 'Calculation failed');
      }
      
    } catch (error) {
      console.error('❌ Real calculation API failed:', error);
      
      // Fallback to simple calculation if API fails
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
          shippingMethod: 'free',
          estimatedDelivery: '3-5 business days'
        },
        currency: 'USD',
        isFallback: true
      };
    }
  },

  /**
   * Quick calculation for cart page - uses real API if possible
   */
  async calculateQuickTotals(cartItems, country, couponCode = '') {
    try {
      const requestData = {
        cartItems: cartItems.map(item => ({
          productId: item.productId || item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: { country },
        couponCode: couponCode
      };

      const response = await apiClient.post('/order-calculation/quick-calculate', requestData);
      
      if (response.data.success) {
        const data = response.data.data;
        return {
          success: true,
          amounts: {
            subtotalUSD: data.subtotal,
            shippingUSD: data.shipping,
            taxUSD: data.tax,
            totalUSD: data.finalTotal
          },
          breakdown: {
            taxRate: data.taxRate || 0,
            shippingMethod: 'standard'
          },
          currency: 'USD'
        };
      } else {
        throw new Error('Quick calculation failed');
      }
      
    } catch (error) {
      console.warn('Quick calculation API failed, using fallback');
      
      // Simple fallback
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