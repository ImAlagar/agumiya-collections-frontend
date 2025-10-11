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

const contactsReducer = (state, action) => {
  switch (action.type) {
    case CONTACT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case CONTACT_ACTIONS.SET_CONTACTS:
      const { contacts, pagination } = action.payload;
      return {
        ...state,
        contacts,
        pagination: { ...state.pagination, ...pagination },
        isLoading: false,
        error: null
      };
    case CONTACT_ACTIONS.SET_CONTACT:
      return { ...state, currentContact: action.payload, isLoading: false, error: null };
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
        contacts: state.contacts.map(c =>
          c.id === updatedContact.id ? updatedContact : c
        ),
        currentContact: state.currentContact?.id === updatedContact.id ? updatedContact : state.currentContact
      };
    case CONTACT_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  // 🔹 Fetch all contacts
  const fetchContacts = useCallback(async (page = 1, filters = {}) => {
    try {
      dispatch({ type: CONTACT_ACTIONS.SET_LOADING, payload: true });

      const currentFilters = { ...state.filters, ...filters };
      const params = {
        page: page || 1,
        limit: currentFilters.limit || 5,
        search: currentFilters.search,
        status: currentFilters.status === 'all' ? '' : currentFilters.status,
        inquiryType: currentFilters.inquiryType === 'all' ? '' : currentFilters.inquiryType,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
      });

      const response = await contactService.getAllContacts(params);

      if (response.success) {
        const apiData = response.data;
        const apiPagination = apiData.pagination || {};

        const currentPage = apiPagination.currentPage || page;
        const totalPages = apiPagination.totalPages || 1;
        const totalCount = apiPagination.totalItems || apiPagination.totalCount || 0;
        const limit = currentFilters.limit || 5;

        dispatch({
          type: CONTACT_ACTIONS.SET_CONTACTS,
          payload: {
            contacts: apiData.inquiries || apiData.contacts || apiData || [],
            pagination: {
              currentPage,
              totalPages,
              totalCount,
              limit,
              hasPrev: apiPagination.hasPrev ?? currentPage > 1,
              hasNext: apiPagination.hasNext ?? currentPage < totalPages
            }
          }
        });

      } else {
        throw new Error(response.message || 'Failed to fetch contacts');
      }
    } catch (error) {
      dispatch({
        type: CONTACT_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load contacts. Please try again.'
      });
    }
  }, [state.filters]);

  // 🔹 Update page size
  const updatePageSize = useCallback(async (newLimit) => {
    dispatch({
      type: CONTACT_ACTIONS.SET_FILTERS,
      payload: { limit: newLimit }
    });
    fetchContacts(1, { limit: newLimit });
  }, [fetchContacts]);

  // 🔹 Fetch contact by ID
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

  // 🔹 Fetch contact stats
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
      return { success: false, error: error.message };
    }
  }, []);

  // 🔹 Update contact status
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

  // 🔹 Submit contact (user inquiry)
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
    fetchContacts(1);
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
    updatePageSize,
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
