// src/contexts/CouponContext.js
import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { couponService } from '../services/api/couponService';
import { useAuth } from '../contexts/AuthProvider';
import logger from '../utils/logger'; // ✅ Import professional logger

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
      return { ...state, coupons: [action.payload, ...state.coupons], error: null };
    case COUPON_ACTION_TYPES.UPDATE_COUPON:
      return {
        ...state,
        coupons: state.coupons.map(c => (c.id === action.payload.id ? action.payload : c)),
        currentCoupon:
          state.currentCoupon?.id === action.payload.id ? action.payload : state.currentCoupon,
        error: null
      };
    case COUPON_ACTION_TYPES.DELETE_COUPON:
      return {
        ...state,
        coupons: state.coupons.filter(c => c.id !== action.payload),
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
  const isAdminRef = useRef(isAdmin);
  const dispatchRef = useRef(dispatch);

  React.useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  React.useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  const setLoading = useCallback(loading => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback(error => {
    logger.error(`❌ Coupon error: ${error}`);
    dispatchRef.current({ type: COUPON_ACTION_TYPES.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.CLEAR_ERROR });
  }, []);

  const requireAdmin = () => {
    if (!isAdminRef.current) {
      const msg = 'Access denied: Admin privileges required';
      logger.warn(msg);
      setError(msg);
      return false;
    }
    return true;
  };

  // 🔹 Get all coupons
  const getCoupons = useCallback(async filters => {
    if (!requireAdmin()) return { success: false, error: 'Access denied' };
    try {
      setLoading(true);
      logger.info('📦 Fetching coupons...');
      const response = await couponService.getCoupons(filters);
      dispatchRef.current({
        type: COUPON_ACTION_TYPES.SET_COUPONS,
        payload: { coupons: response.data?.coupons || [], pagination: response.data?.pagination }
      });
      logger.info(`✅ Loaded ${response.data?.coupons?.length || 0} coupons`);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message || 'Failed to fetch coupons');
      return { success: false, error: error.message };
    }
  }, []);

  // 🔹 Get single coupon
  const getCoupon = useCallback(async id => {
    if (!requireAdmin()) return { success: false, error: 'Access denied' };
    try {
      setLoading(true);
      logger.info(`🔍 Fetching coupon ID: ${id}`);
      const response = await couponService.getCouponById(id);
      dispatchRef.current({
        type: COUPON_ACTION_TYPES.SET_COUPON,
        payload: response.data
      });
      logger.info(`✅ Coupon loaded: ${response.data?.code || id}`);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message || 'Failed to fetch coupon');
      return { success: false, error: error.message };
    }
  }, []);

  // 🔹 Create coupon
  const createCoupon = useCallback(async couponData => {
    if (!requireAdmin()) return { success: false, error: 'Access denied' };
    try {
      setLoading(true);
      logger.info(`➕ Creating new coupon: ${couponData.code || 'N/A'}`);
      const response = await couponService.createCoupon(couponData);
      dispatchRef.current({
        type: COUPON_ACTION_TYPES.ADD_COUPON,
        payload: response.data
      });
      logger.info('✅ Coupon created successfully');
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message || 'Failed to create coupon');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Update coupon
  const updateCoupon = useCallback(async (id, updateData) => {
    if (!requireAdmin()) return { success: false, error: 'Access denied' };
    try {
      setLoading(true);
      logger.info(`✏️ Updating coupon ID: ${id}`);
      const response = await couponService.updateCoupon(id, updateData);
      dispatchRef.current({
        type: COUPON_ACTION_TYPES.UPDATE_COUPON,
        payload: response.data
      });
      logger.info(`✅ Coupon updated: ${response.data?.code || id}`);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message || 'Failed to update coupon');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Delete coupon
  const deleteCoupon = useCallback(async id => {
    if (!requireAdmin()) return { success: false, error: 'Access denied' };
    try {
      setLoading(true);
      logger.info(`🗑️ Deleting coupon ID: ${id}`);
      await couponService.deleteCoupon(id);
      dispatchRef.current({
        type: COUPON_ACTION_TYPES.DELETE_COUPON,
        payload: id
      });
      logger.info(`✅ Coupon deleted: ${id}`);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to delete coupon');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Stats
  const getCouponStats = useCallback(async () => {
    if (!requireAdmin()) return { success: false, error: 'Access denied' };
    try {
      setLoading(true);
      logger.info('📊 Fetching coupon statistics...');
      const response = await couponService.getCouponStats();
      dispatchRef.current({
        type: COUPON_ACTION_TYPES.SET_STATS,
        payload: response.data
      });
      logger.info('✅ Coupon statistics updated');
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message || 'Failed to fetch coupon statistics');
      return { success: false, error: error.message };
    }
  }, []);

  // 🔹 Validate coupon (for users)
  const validateCoupon = useCallback(async data => {
    try {
      setLoading(true);
      logger.info(`🎟️ Validating coupon: ${data.code}`);
      const response = await couponService.validateCoupon(data);
      logger.info(`✅ Coupon valid: ${data.code}`);
      return { success: true, data: response.data };
    } catch (error) {
      logger.warn(`❌ Invalid coupon: ${data.code}`, error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCoupons = useCallback(() => {
    dispatchRef.current({ type: COUPON_ACTION_TYPES.CLEAR_COUPONS });
    logger.info('🧹 Cleared all coupon data from context');
  }, []);

  const value = {
    ...state,
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponStats,
    validateCoupon,
    clearCoupons,
    clearError,
    hasCoupons: state.coupons.length > 0,
    isAdminAccess: isAdmin
  };

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    logger.error('❌ useCoupon called outside of CouponProvider');
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};
