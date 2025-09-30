// src/contexts/CouponContext.js
import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { couponService } from '../services/api/couponService';
import { useAuth } from '../contexts/AuthProvider';

// Action types
const COUPON_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_COUPONS: 'SET_COUPONS',
  SET_COUPON: 'SET_COUPON',
  SET_STATS: 'SET_STATS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_COUPON: 'ADD_COUPON',
  UPDATE_COUPON: 'UPDATE_COUPON',
  DELETE_COUPON: 'DELETE_COUPON',
  CLEAR_COUPONS: 'CLEAR_COUPONS'
};

// Initial state
const initialState = {
  coupons: [],
  currentCoupon: null,
  stats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Reducer
const couponReducer = (state, action) => {
  switch (action.type) {
    case COUPON_ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case COUPON_ACTION_TYPES.SET_COUPONS:
      return { 
        ...state, 
        coupons: action.payload.coupons,
        pagination: action.payload.pagination || state.pagination,
        isLoading: false,
        error: null
      };
    
    case COUPON_ACTION_TYPES.SET_COUPON:
      return { ...state, currentCoupon: action.payload, isLoading: false, error: null };
    
    case COUPON_ACTION_TYPES.SET_STATS:
      return { ...state, stats: action.payload, isLoading: false, error: null };
    
    case COUPON_ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case COUPON_ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    case COUPON_ACTION_TYPES.ADD_COUPON:
      return { 
        ...state, 
        coupons: [action.payload, ...state.coupons],
        error: null
      };
    
    case COUPON_ACTION_TYPES.UPDATE_COUPON:
      return { 
        ...state, 
        coupons: state.coupons.map(coupon => 
          coupon.id === action.payload.id ? action.payload : coupon
        ),
        currentCoupon: state.currentCoupon?.id === action.payload.id ? action.payload : state.currentCoupon,
        error: null
      };
    
    case COUPON_ACTION_TYPES.DELETE_COUPON:
      return { 
        ...state, 
        coupons: state.coupons.filter(coupon => coupon.id !== action.payload),
        currentCoupon: state.currentCoupon?.id === action.payload ? null : state.currentCoupon,
        error: null
      };
    
    case COUPON_ACTION_TYPES.CLEAR_COUPONS:
      return { ...initialState };
    
    default:
      return state;
  }
};

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [state, dispatch] = useReducer(couponReducer, initialState);
  const { isAdmin } = useAuth();
  
  // Use refs to prevent infinite re-renders
  const isAdminRef = useRef(isAdmin);
  const dispatchRef = useRef(dispatch);

  // Update refs when dependencies change
  React.useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  React.useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  // Stable dispatch functions that don't change
  const setLoading = useCallback((loading) => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.CLEAR_ERROR });
  }, []);

  // Get all coupons
  const getCoupons = useCallback(async (filters = {}) => {
    if (!isAdminRef.current) {
      setError('Access denied. Admin privileges required.');
      return { success: false, error: 'Access denied' };
    }

    try {
      setLoading(true);
      const response = await couponService.getCoupons(filters);
      
      dispatchRef.current({ 
        type: COUPON_ACTION_TYPES.SET_COUPONS, 
        payload: {
          coupons: response.data?.coupons || [],
          pagination: response.data?.pagination
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch coupons';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError]); // Include stable dependencies

  // Get single coupon
  const getCoupon = useCallback(async (id) => {
    if (!isAdminRef.current) {
      setError('Access denied. Admin privileges required.');
      return { success: false, error: 'Access denied' };
    }

    try {
      setLoading(true);
      const response = await couponService.getCouponById(id);
      
      dispatchRef.current({ 
        type: COUPON_ACTION_TYPES.SET_COUPON, 
        payload: response.data 
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch coupon';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError]);

const createCoupon = useCallback(async (couponData) => {
  if (!isAdminRef.current) {
    setError('Access denied. Admin privileges required.');
    return { success: false, error: 'Access denied' };
  }

  try {
    setLoading(true);
    const response = await couponService.createCoupon(couponData);
    
    dispatchRef.current({ 
      type: COUPON_ACTION_TYPES.ADD_COUPON, 
      payload: response.data 
    });

    setLoading(false); // ADD THIS LINE
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.message || 'Failed to create coupon';
    setError(errorMessage);
    setLoading(false); // ADD THIS LINE
    return { success: false, error: errorMessage };
  }
}, [setLoading, setError]);

  // Update coupon
  const updateCoupon = useCallback(async (id, updateData) => {
    if (!isAdminRef.current) {
      setError('Access denied. Admin privileges required.');
      return { success: false, error: 'Access denied' };
    }

    try {
      setLoading(true);
      const response = await couponService.updateCoupon(id, updateData);
      
      dispatchRef.current({ 
        type: COUPON_ACTION_TYPES.UPDATE_COUPON, 
        payload: response.data 
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || 'Failed to update coupon';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError]);

  // Delete coupon
const deleteCoupon = useCallback(async (id) => {
  if (!isAdminRef.current) {
    setError('Access denied. Admin privileges required.');
    return { success: false, error: 'Access denied' };
  }

  try {
    setLoading(true);
    await couponService.deleteCoupon(id);
    
    dispatchRef.current({ 
      type: COUPON_ACTION_TYPES.DELETE_COUPON, 
      payload: id 
    });

    setLoading(false); // ADD THIS LINE
    return { success: true };
  } catch (error) {
    const errorMessage = error.message || 'Failed to delete coupon';
    setError(errorMessage);
    setLoading(false); // ADD THIS LINE
    return { success: false, error: errorMessage };
  }
}, [setLoading, setError]);
  // Get coupon statistics
  const getCouponStats = useCallback(async () => {
    if (!isAdminRef.current) {
      setError('Access denied. Admin privileges required.');
      return { success: false, error: 'Access denied' };
    }

    try {
      setLoading(true);
      const response = await couponService.getCouponStats();
      
      dispatchRef.current({ 
        type: COUPON_ACTION_TYPES.SET_STATS, 
        payload: response.data 
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch coupon statistics';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError]);

  // Validate coupon (for users)
  const validateCoupon = useCallback(async (validationData) => {
    try {
      setLoading(true);
      const response = await couponService.validateCoupon(validationData);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || 'Failed to validate coupon';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Clear all coupons
  const clearCoupons = useCallback(() => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.CLEAR_COUPONS });
  }, []);

  const value = {
    // State
    coupons: state.coupons,
    currentCoupon: state.currentCoupon,
    stats: state.stats,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    
    // Actions
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponStats,
    validateCoupon,
    clearCoupons,
    clearError,
    
    // Helper flags
    hasCoupons: state.coupons.length > 0,
    isAdminAccess: isAdmin
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};