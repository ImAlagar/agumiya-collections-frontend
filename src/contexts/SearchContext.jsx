// src/contexts/SearchContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { searchService } from '../services/api/searchService';

// Action types
const SEARCH_ACTIONS = {
  SET_QUERY: 'SET_QUERY',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_RECENT_SEARCHES: 'SET_RECENT_SEARCHES',
  SET_POPULAR_SEARCHES: 'SET_POPULAR_SEARCHES',
  CLEAR_SUGGESTIONS: 'CLEAR_SUGGESTIONS',
  CLEAR_SEARCH: 'CLEAR_SEARCH'
};

// Initial state
const initialState = {
  query: '',
  suggestions: [],
  searchResults: null,
  recentSearches: [],
  popularSearches: [],
  isLoading: false,
  error: null,
  isSearchOpen: false
};

// Reducer
const searchReducer = (state, action) => {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_QUERY:
      return { ...state, query: action.payload };
    
    case SEARCH_ACTIONS.SET_SUGGESTIONS:
      return { ...state, suggestions: action.payload, isLoading: false };
    
    case SEARCH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case SEARCH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case SEARCH_ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, isLoading: false };
    
    case SEARCH_ACTIONS.SET_RECENT_SEARCHES:
      return { ...state, recentSearches: action.payload };
    
    case SEARCH_ACTIONS.SET_POPULAR_SEARCHES:
      return { ...state, popularSearches: action.payload };
    
    case SEARCH_ACTIONS.CLEAR_SUGGESTIONS:
      return { ...state, suggestions: [] };
    
    case SEARCH_ACTIONS.CLEAR_SEARCH:
      return { 
        ...state, 
        query: '', 
        suggestions: [], 
        searchResults: null,
        isSearchOpen: false 
      };
    
    default:
      return state;
  }
};

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Load recent searches from localStorage
  const loadRecentSearches = useCallback(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    dispatch({ type: SEARCH_ACTIONS.SET_RECENT_SEARCHES, payload: recent });
  }, []);

  // Save to recent searches
  const saveToRecentSearches = useCallback((searchTerm) => {
    const recent = state.recentSearches.filter(item => item !== searchTerm);
    const updated = [searchTerm, ...recent].slice(0, 5);
    dispatch({ type: SEARCH_ACTIONS.SET_RECENT_SEARCHES, payload: updated });
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [state.recentSearches]);

  // Get search suggestions
  const getSearchSuggestions = useCallback(async (query, type = 'products') => {
    if (!query || query.length < 2) {
      dispatch({ type: SEARCH_ACTIONS.CLEAR_SUGGESTIONS });
      return;
    }

    try {
      dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: true });
      const response = await searchService.getSearchSuggestions(query, type);
      
      if (response.success) {
        dispatch({ 
          type: SEARCH_ACTIONS.SET_SUGGESTIONS, 
          payload: response.data.suggestions || [] 
        });
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      dispatch({ type: SEARCH_ACTIONS.CLEAR_SUGGESTIONS });
    }
  }, []);

  // Global search
  const performGlobalSearch = useCallback(async (query, type = 'all', options = {}) => {
    try {
      dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: true });
      const response = await searchService.globalSearch(query, type, options);
      
      if (response.success) {
        dispatch({ 
          type: SEARCH_ACTIONS.SET_SEARCH_RESULTS, 
          payload: response.data 
        });
        saveToRecentSearches(query);
        return response.data;
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error) {
      dispatch({ 
        type: SEARCH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Search failed. Please try again.' 
      });
      throw error;
    }
  }, [saveToRecentSearches]);

  // Load popular searches
  const loadPopularSearches = useCallback(async () => {
    try {
      const response = await searchService.getPopularSearches();
      if (response.success) {
        dispatch({ 
          type: SEARCH_ACTIONS.SET_POPULAR_SEARCHES, 
          payload: response.data.popular || [] 
        });
      }
    } catch (error) {
      console.error('Error loading popular searches:', error);
    }
  }, []);

  // Set search query
  const setQuery = useCallback((query) => {
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query });
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch({ type: SEARCH_ACTIONS.CLEAR_SEARCH });
  }, []);

  // Toggle search open state
  const setSearchOpen = useCallback((isOpen) => {
    dispatch({ type: 'SET_SEARCH_OPEN', payload: isOpen });
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    setQuery,
    getSearchSuggestions,
    performGlobalSearch,
    loadRecentSearches,
    loadPopularSearches,
    saveToRecentSearches,
    clearSearch,
    setSearchOpen
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};