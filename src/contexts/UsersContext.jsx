import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { userService } from '../services/api/userService';
import logger from '../utils/logger';

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
    limit: 5
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 5
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
        pagination: { ...state.pagination, ...pagination },
        isLoading: false,
        error: null
      };

    case USER_ACTIONS.SET_USER:
      return { ...state, currentUser: action.payload, isLoading: false, error: null };

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
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        currentUser: state.currentUser?.id === updatedUser.id ? updatedUser : state.currentUser
      };

    case USER_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };

    default:
      return state;
  }
};

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // ✅ Fetch all users
  const fetchUsers = useCallback(async (page = 1, filters = {}) => {
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

      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      logger.info(`📦 Fetching users (page: ${page}, limit: ${params.limit}, filters: ${JSON.stringify(currentFilters)})`);

      const response = await userService.getAllUsers(params);

      if (response.success) {
        const apiData = response.data;
        dispatch({
          type: USER_ACTIONS.SET_USERS,
          payload: {
            users: apiData.users || [],
            pagination: {
              currentPage: apiData.currentPage || page,
              totalPages: apiData.totalPages || 1,
              totalCount: apiData.totalCount || 0,
              limit: currentFilters.limit || 5,
              hasPrev: (apiData.currentPage || page) > 1,
              hasNext: (apiData.currentPage || page) < (apiData.totalPages || 1)
            }
          }
        });
        logger.info(`✅ Loaded ${apiData.users?.length || 0} users successfully`);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      logger.error(`❌ Fetch users failed: ${error.message}`);
      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load users. Please try again.'
      });
    }
  }, [state.filters]);

  // ✅ Update page size
  const updatePageSize = useCallback(async (newLimit) => {
    logger.info(`📏 Page size changed to ${newLimit}`);
    dispatch({ type: USER_ACTIONS.SET_FILTERS, payload: { limit: newLimit } });
    setTimeout(() => fetchUsers(1, { limit: newLimit }), 0);
  }, [fetchUsers]);

  // ✅ Fetch single user
  const fetchUserById = useCallback(async (id) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      logger.info(`🔍 Fetching user by ID: ${id}`);

      const response = await userService.getUserById(id);
      if (response.success) {
        dispatch({ type: USER_ACTIONS.SET_USER, payload: response.data });
        logger.info(`👤 Loaded user: ${response.data.email || id}`);
      } else {
        throw new Error(response.message || 'Failed to fetch user');
      }
    } catch (error) {
      logger.error(`❌ Fetch user by ID failed (${id}): ${error.message}`);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // ✅ Fetch stats
  const fetchUserStats = useCallback(async () => {
    try {
      logger.info('📊 Fetching user statistics...');
      const response = await userService.getUserStats();

      if (response.success) {
        dispatch({ type: USER_ACTIONS.SET_STATS, payload: response.data });
        logger.info('✅ User stats loaded successfully');
        return { success: true, stats: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (error) {
      logger.error(`❌ Fetch user stats failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Update user status
  const updateUserStatus = useCallback(async (userId, statusData) => {
    try {
      logger.info(`⚙️ Updating user ${userId} status to ${statusData.status}`);
      const response = await userService.updateUserStatus(userId, statusData);

      if (response.success) {
        dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: response.data });
        logger.info(`✅ User ${userId} updated successfully`);
        return { success: true, user: response.data };
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      logger.error(`❌ Update user ${userId} failed: ${error.message}`);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  // ✅ Update filters
  const updateFilters = useCallback(async (newFilters) => {
    logger.info(`🔍 Filters updated: ${JSON.stringify(newFilters)}`);
    dispatch({ type: USER_ACTIONS.SET_FILTERS, payload: newFilters });
    setTimeout(() => fetchUsers(1), 0);
  }, [fetchUsers]);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: USER_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    fetchUsers,
    fetchUserById,
    fetchUserStats,
    updatePageSize,
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
    logger.error('useUsers called outside UsersProvider');
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
