// src/contexts/UsersContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { userService } from '../services/api/userService';

const USER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USERS: 'SET_USERS',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_USER: 'UPDATE_USER',
  SET_STATS: 'SET_STATS'
};

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  stats: null,
  filters: {
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 10
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  }
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case USER_ACTIONS.SET_USERS:
      const { users, pagination } = action.payload;
      return {
        ...state,
        users,
        pagination: {
          currentPage: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalCount: pagination.totalCount || 0,
          hasNext: pagination.hasNext || false,
          hasPrev: pagination.hasPrev || false
        },
        isLoading: false,
        error: null
      };

    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
        error: null
      };

    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case USER_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };

    case USER_ACTIONS.UPDATE_USER:
      const updatedUser = action.payload;
      return {
        ...state,
        users: state.users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ),
        currentUser: state.currentUser?.id === updatedUser.id ? updatedUser : state.currentUser
      };

    case USER_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };

    default:
      return state;
  }
};

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  const fetchUsers = useCallback(async (page = state.pagination.currentPage, filters = {}) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      
      const currentFilters = { ...state.filters, ...filters };
      
      const params = {
        page,
        limit: currentFilters.limit,
        search: currentFilters.search,
        status: currentFilters.status === 'all' ? '' : currentFilters.status,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      };

      // Clean up empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await userService.getAllUsers(params);
      
      if (response.success) {
        dispatch({
          type: USER_ACTIONS.SET_USERS,
          payload: {
            users: response.data.users || response.data || [],
            pagination: response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalCount: response.data.length || 0
            }
          }
        });
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      dispatch({ 
        type: USER_ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to load users. Please try again.' 
      });
    }
  }, [state.filters, state.pagination.currentPage]);

  const fetchUserById = useCallback(async (id) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      const response = await userService.getUserById(id);
      
      if (response.success) {
        dispatch({ type: USER_ACTIONS.SET_USER, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch user');
      }
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await userService.getUserStats();
      if (response.success) {
        dispatch({ type: USER_ACTIONS.SET_STATS, payload: response.data });
        return { success: true, stats: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch user stats');
      }
    } catch (error) {
      console.error('Fetch user stats error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateUserStatus = useCallback(async (userId, statusData) => {
    try {
      const response = await userService.updateUserStatus(userId, statusData);
      if (response.success) {
        dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: response.data });
        return { success: true, user: response.data };
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: USER_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const updateFilters = useCallback(async (newFilters) => {
    dispatch({ type: USER_ACTIONS.SET_FILTERS, payload: newFilters });
    setTimeout(() => {
      fetchUsers(1);
    }, 0);
  }, [fetchUsers]);

  const clearError = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    fetchUsers,
    fetchUserById,
    fetchUserStats,
    updateUserStatus,
    setFilters,
    updateFilters,
    clearError
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};