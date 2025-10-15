// src/hooks/useShipping.js

import { useState, useEffect, useCallback } from 'react';
import { shippingService } from '../services/api/shippingService';

export const useShipping = () => {
  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supportedCountries, setSupportedCountries] = useState([]);

  // Load supported countries
  useEffect(() => {
    loadSupportedCountries();
  }, []);

  const loadSupportedCountries = async () => {
    try {
      const response = await shippingService.getSupportedCountries();
      if (response.success) {
        setSupportedCountries(response.data);
      }
    } catch (err) {
      console.error('Failed to load supported countries:', err);
    }
  };

  // Calculate shipping for cart
  const calculateCartShipping = useCallback(async (cartItems, shippingAddress) => {
    if (!cartItems || cartItems.length === 0) {
      setShippingData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await shippingService.calculatePrintifyShipping({
        cartItems: cartItems.map(item => ({
          productId: item.productId || item.id,
          variantId: item.variantId || item.printifyVariantId,
          quantity: item.quantity || 1
        })),
        shippingAddress
      });

      if (response.success) {
        setShippingData(response.data);
      } else {
        throw new Error(response.message || 'Failed to calculate shipping');
      }
    } catch (err) {
      setError(err.message);
      console.error('Shipping calculation error:', err);
      
      // Fallback to legacy shipping calculation
      try {
        const fallbackResponse = await shippingService.calculateShipping({
          cartItems,
          subtotal: cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
          country: shippingAddress?.country || 'US'
        });
        
        if (fallbackResponse.success) {
          setShippingData(fallbackResponse.data);
        }
      } catch (fallbackErr) {
        console.error('Fallback shipping calculation also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Get shipping for single product
  const getProductShipping = useCallback(async (productId, variantId, country = 'US', region = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await shippingService.getProductShipping({
        productId,
        variantId,
        country,
        region
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get product shipping');
      }
    } catch (err) {
      setError(err.message);
      console.error('Product shipping error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order shipping details
  const getOrderShipping = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await shippingService.getOrderShipping(orderId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get order shipping');
      }
    } catch (err) {
      setError(err.message);
      console.error('Order shipping error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear shipping data
  const clearShippingData = useCallback(() => {
    setShippingData(null);
    setError(null);
  }, []);

  return {
    shippingData,
    loading,
    error,
    supportedCountries,
    calculateCartShipping,
    getProductShipping,
    getOrderShipping,
    clearShippingData
  };
};