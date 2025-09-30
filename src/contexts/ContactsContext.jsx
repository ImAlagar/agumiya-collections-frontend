// src/contexts/ContactsContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { contactService } from '../services/api/contactService';

const CONTACT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CONTACTS: 'SET_CONTACTS',
  SET_CONTACT: 'SET_CONTACT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  SET_STATS: 'SET_STATS'
};

const initialState = {
  contacts: [],
  currentContact: null,
  isLoading: false,
  error: null,
  stats: null,
  filters: {
    search: '',
    status: 'all',
    inquiryType: 'all',
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

const contactsReducer = (state, action) => {
  switch (action.type) {
    case CONTACT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case CONTACT_ACTIONS.SET_CONTACTS:
      const { contacts, pagination } = action.payload;
      return {
        ...state,
        contacts,
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

    case CONTACT_ACTIONS.SET_CONTACT:
      return {
        ...state,
        currentContact: action.payload,
        isLoading: false,
        error: null
      };

    case CONTACT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case CONTACT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case CONTACT_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };

    case CONTACT_ACTIONS.UPDATE_CONTACT:
      const updatedContact = action.payload;
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === updatedContact.id ? updatedContact : contact
        ),
        currentContact: state.currentContact?.id === updatedContact.id ? updatedContact : state.currentContact
      };

    case CONTACT_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };

    default:
      return state;
  }
};

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  const fetchContacts = useCallback(async (page = state.pagination.currentPage, filters = {}) => {
    try {
      dispatch({ type: CONTACT_ACTIONS.SET_LOADING, payload: true });
      
      const currentFilters = { ...state.filters, ...filters };
      
      const params = {
        page,
        limit: currentFilters.limit,
        search: currentFilters.search,
        status: currentFilters.status === 'all' ? '' : currentFilters.status,
        inquiryType: currentFilters.inquiryType === 'all' ? '' : currentFilters.inquiryType,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      };

      // Clean up empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await contactService.getAllContacts(params);
      
      if (response.success) {
        dispatch({
          type: CONTACT_ACTIONS.SET_CONTACTS,
          payload: {
            contacts: response.data.inquiries || response.data || [],
            pagination: response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalCount: response.data.length || 0
            }
          }
        });
      } else {
        throw new Error(response.message || 'Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Fetch contacts error:', error);
      dispatch({ 
        type: CONTACT_ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to load contacts. Please try again.' 
      });
    }
  }, [state.filters, state.pagination.currentPage]);

  const fetchContactById = useCallback(async (id) => {
    try {
      dispatch({ type: CONTACT_ACTIONS.SET_LOADING, payload: true });
      const response = await contactService.getContactById(id);
      
      if (response.success) {
        dispatch({ type: CONTACT_ACTIONS.SET_CONTACT, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch contact');
      }
    } catch (error) {
      dispatch({ type: CONTACT_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const fetchContactStats = useCallback(async () => {
    try {
      const response = await contactService.getContactStats();
      if (response.success) {
        dispatch({ type: CONTACT_ACTIONS.SET_STATS, payload: response.data });
        return { success: true, stats: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch contact stats');
      }
    } catch (error) {
      console.error('Fetch contact stats error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateContactStatus = useCallback(async (contactId, statusData) => {
    try {
      const response = await contactService.updateContactStatus(contactId, statusData);
      if (response.success) {
        dispatch({ type: CONTACT_ACTIONS.UPDATE_CONTACT, payload: response.data });
        return { success: true, contact: response.data };
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      dispatch({ type: CONTACT_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const submitContact = useCallback(async (contactData) => {
    try {
      const response = await contactService.submitContact(contactData);
      if (response.success) {
        return { success: true, contact: response.data };
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error) {
      dispatch({ type: CONTACT_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: CONTACT_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const updateFilters = useCallback(async (newFilters) => {
    dispatch({ type: CONTACT_ACTIONS.SET_FILTERS, payload: newFilters });
    setTimeout(() => {
      fetchContacts(1);
    }, 0);
  }, [fetchContacts]);

  const clearError = useCallback(() => {
    dispatch({ type: CONTACT_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    fetchContacts,
    fetchContactById,
    fetchContactStats,
    updateContactStatus,
    submitContact,
    setFilters,
    updateFilters,
    clearError
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};