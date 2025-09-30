// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/api/authService';
import { STORAGE_KEYS, USER_TYPES } from '../config/constants';
import { storageManager } from '../services/storage/storageManager';

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

  const checkExistingAuth = useCallback(async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

      const userType = storageManager.getCurrentUserType();

      if (!userType) {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        return;
      }

      const userData = storageManager.getItem(STORAGE_KEYS.USER_DATA, userType);
      const token = storageManager.getItem(STORAGE_KEYS.AUTH_TOKEN, userType);

      if (userData && token) {
        dispatch({
          type: ACTION_TYPES.SET_USER,
          payload: { user: userData, userType }
        });
      } else {
        storageManager.clearAllAuth();
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      }
    } catch (error) {
      storageManager.clearAllAuth();
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, []);

  useEffect(() => {
    checkExistingAuth();
  }, [checkExistingAuth]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Silent fail for logout API
    } finally {
      storageManager.clearAllAuth();
      dispatch({ type: ACTION_TYPES.LOGOUT });
    }
  }, []);

  const login = async (credentials) => {
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

      if (!token || !user) {
        throw new Error('Invalid login response');
      }

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

      return { success: true, user: processedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      const response = await authService.registerUser(userData);

      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);

      if (response.success) {
        const updatedUser = { ...state.user, ...profileData };
        storageManager.setItem(STORAGE_KEYS.USER_DATA, updatedUser, state.userType);

        dispatch({
          type: ACTION_TYPES.SET_USER,
          payload: { user: updatedUser, userType: state.userType }
        });

        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};