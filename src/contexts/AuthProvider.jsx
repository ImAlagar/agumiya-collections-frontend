import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/api/authService';
import { STORAGE_KEYS, USER_TYPES } from '../config/constants';
import { storageManager } from '../services/storage/storageManager';
import { useCart } from './CartContext';
import logger from '../utils/logger';

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT'
};

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  userType: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTION_TYPES.LOGOUT:
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { handleUserLogout } = useCart();

  // Restore login state from storage
  const checkExistingAuth = useCallback(async () => {
    logger.info('🔄 Checking existing authentication state...');
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

      const userType = storageManager.getCurrentUserType();
      if (!userType) {
        logger.info('No existing user session found');
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return;
      }

      const userData = storageManager.getItem(STORAGE_KEYS.USER_DATA, userType);
      const token = storageManager.getItem(STORAGE_KEYS.AUTH_TOKEN, userType);

      if (userData && token) {
        logger.info(`✅ Restored ${userType} session for ${userData.email}`);
        dispatch({
          type: ACTION_TYPES.SET_USER,
          payload: { user: userData, userType }
        });
      } else {
        logger.warn('⚠️ Incomplete auth data found — clearing session');
        storageManager.clearAllAuth();
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      }
    } catch (error) {
      logger.error('Auth restoration error:', error);
      storageManager.clearAllAuth();
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, []);

  useEffect(() => {
    checkExistingAuth();
  }, [checkExistingAuth]);

  // Logout
  const handleLogout = useCallback(async () => {
    logger.info('🚪 Logging out user...');
    try {
      await authService.logout();
    } catch (error) {
      logger.warn('Logout API call failed:', error);
    } finally {
      storageManager.clearAllAuth();
      dispatch({ type: ACTION_TYPES.LOGOUT });
      handleUserLogout(); // Also clear user’s cart
      logger.info('✅ User logged out successfully');
    }
  }, [handleUserLogout]);

  // Login
  const login = async (credentials) => {
    logger.info(`🔑 Login attempt for ${credentials.email}`);
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      const { email, password, userType = USER_TYPES.USER } = credentials;

      let response;
      if (userType === USER_TYPES.ADMIN) {
        response = await authService.loginAdmin({ email, password });
      } else {
        response = await authService.loginUser({ email, password });
      }

      if (response.success === false) {
        throw new Error(response.message || 'Login failed');
      }

      const token = response.token || response.data?.token || response.access_token;
      const user = response.user || response.admin || response.data?.user || response.data?.admin;

      if (!token || !user) throw new Error('Invalid login response');

      const processedUser = {
        email: user.email || email,
        name: user.name || user.username || email.split('@')[0],
        role: user.role || userType,
        id: user.id || user._id || Date.now(),
        ...user
      };

      storageManager.clearAllAuth();
      storageManager.setItem(STORAGE_KEYS.AUTH_TOKEN, token, userType);
      storageManager.setItem(STORAGE_KEYS.USER_DATA, processedUser, userType);
      storageManager.setItem(STORAGE_KEYS.USER_TYPE, userType, userType);

      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: { user: processedUser, userType }
      });

      logger.info(`✅ ${userType} login successful: ${email}`);
      return { success: true, user: processedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      logger.error(`❌ Login error for ${credentials.email}: ${errorMessage}`);
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  // Register
  const register = async (userData) => {
    logger.info(`📝 Registration attempt for ${userData.email}`);
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      const response = await authService.registerUser(userData);

      if (response.success) {
        logger.info(`✅ Registration successful: ${userData.email}`);
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      logger.error(`❌ Registration failed for ${userData.email}: ${errorMessage}`);
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    logger.info(`🛠 Updating profile for user: ${state.user?.email}`);
    try {
      const response = await authService.updateProfile(profileData);

      if (response.success) {
        const updatedUser = { ...state.user, ...profileData };
        storageManager.setItem(STORAGE_KEYS.USER_DATA, updatedUser, state.userType);
        dispatch({
          type: ACTION_TYPES.SET_USER,
          payload: { user: updatedUser, userType: state.userType }
        });
        logger.info(`✅ Profile updated successfully for ${updatedUser.email}`);
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      logger.error(`❌ Profile update failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.userType === USER_TYPES.ADMIN,
    userType: state.userType,
    login,
    register,
    logout: handleLogout,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    logger.error('useAuth called outside AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
