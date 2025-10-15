import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { taxService } from '../services/api/taxService';

// Action types
const TAX_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TAX_SETTINGS: 'SET_TAX_SETTINGS',
  SET_COUNTRY_RATES: 'SET_COUNTRY_RATES',
  SET_TAX_CALCULATION: 'SET_TAX_CALCULATION',
  SET_VALIDATION: 'SET_VALIDATION',
  RESET_STATE: 'RESET_STATE'
};

// Initial state
const initialState = {
  // Tax settings
  taxSettings: null,
  countryRates: [],
  
  // Tax calculation
  taxCalculation: null,
  
  // Validation
  validation: null,
  
  // UI state
  loading: false,
  error: null,
  lastUpdated: null
};

// Reducer
const taxReducer = (state, action) => {
  switch (action.type) {
    case TAX_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? state.error : null
      };

    case TAX_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case TAX_ACTIONS.SET_TAX_SETTINGS:
      return {
        ...state,
        taxSettings: action.payload.settings,
        countryRates: action.payload.countryRates || [],
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };

    case TAX_ACTIONS.SET_COUNTRY_RATES:
      return {
        ...state,
        countryRates: action.payload,
        loading: false,
        error: null
      };

    case TAX_ACTIONS.SET_TAX_CALCULATION:
      return {
        ...state,
        taxCalculation: action.payload,
        loading: false,
        error: null
      };

    case TAX_ACTIONS.SET_VALIDATION:
      return {
        ...state,
        validation: action.payload,
        loading: false,
        error: null
      };

    case TAX_ACTIONS.RESET_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

// Create context
const TaxContext = createContext();

// Provider component
export const TaxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialState);

  // Action creators
  const setLoading = (loading) => 
    dispatch({ type: TAX_ACTIONS.SET_LOADING, payload: loading });

  const setError = (error) => 
    dispatch({ type: TAX_ACTIONS.SET_ERROR, payload: error });

  // ==================== PUBLIC ACTIONS ====================

  /**
   * Calculate tax for an order
   */
  const calculateTax = useCallback(async (taxData) => {
    setLoading(true);
    try {
      const result = await taxService.calculateTax(taxData);
      
      if (result.success) {
        dispatch({ 
          type: TAX_ACTIONS.SET_TAX_CALCULATION, 
          payload: result.data 
        });
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to calculate tax';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }, []);

  /**
   * Get all country tax rates
   */
  const fetchCountryRates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await taxService.getCountryTaxRates();
      
      if (result.success) {
        dispatch({ 
          type: TAX_ACTIONS.SET_COUNTRY_RATES, 
          payload: result.data 
        });
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch country rates';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: []
      };
    }
  }, []);

  // ==================== USER ACTIONS ====================

  /**
   * Get tax settings
   */
  const fetchTaxSettings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await taxService.getTaxSettings();
      
      if (result.success && result.data) {
        dispatch({ 
          type: TAX_ACTIONS.SET_TAX_SETTINGS, 
          payload: {
            settings: result.data,
            countryRates: result.data.countryTaxRates || []
          }
        });
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch tax settings';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }, []);

  // ==================== ADMIN ACTIONS ====================

  /**
   * Update tax settings (admin only)
   */
  const updateTaxSettings = useCallback(async (settingsData) => {
    setLoading(true);
    try {
      const result = await taxService.updateTaxSettings(settingsData);
      
      if (result.success && result.data) {
        dispatch({ 
          type: TAX_ACTIONS.SET_TAX_SETTINGS, 
          payload: {
            settings: result.data,
            countryRates: result.data.countryTaxRates || []
          }
        });
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update tax settings';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }, []);

  /**
   * Validate tax configuration (admin only)
   */
  const validateTaxConfiguration = useCallback(async () => {
    setLoading(true);
    try {
      const result = await taxService.validateTaxConfiguration();
      
      if (result.success) {
        dispatch({ 
          type: TAX_ACTIONS.SET_VALIDATION, 
          payload: result.data 
        });
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to validate tax configuration';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }, []);

  /**
   * Get tax statistics (admin only)
   */

  /**
   * Reset tax state
   */
  const resetTaxState = useCallback(() => {
    dispatch({ type: TAX_ACTIONS.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Public actions
    calculateTax,
    fetchCountryRates,
    
    // User actions
    fetchTaxSettings,
    
    // Admin actions
    updateTaxSettings,
    validateTaxConfiguration,

    // Utility actions
    resetTaxState,
    setError
  };

  return (
    <TaxContext.Provider value={value}>
      {children}
    </TaxContext.Provider>
  );
};

// Custom hook to use tax context
export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};