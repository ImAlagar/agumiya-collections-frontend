// src/pages/AdminContacts.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Plus, Filter, Download, RefreshCwIcon, Menu, X } from 'lucide-react';
import { useContacts } from '../../../contexts/ContactsContext';
import { useTheme } from '../../../contexts/ThemeContext';
import ContactFilters from '../../../components/admin/contact/ContactFilters';
import ContactTable from '../../../components/admin/contact/ContactTable';
import ContactStats from '../../../components/admin/stats/ContactStats';

const AdminContacts = () => {
  const { theme } = useTheme();
  const {
    contacts,
    currentContact,
    isLoading,
    error,
    stats,
    filters,
    pagination,
    fetchContacts,
    fetchContactById,
    fetchContactStats,
    updateContactStatus,
    updateFilters,
    clearError
  } = useContacts();

  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await fetchContacts(1);
      await fetchContactStats();
    };

    initializeData();
  }, [fetchContacts, fetchContactStats]);

  const handleExportContacts = () => {
    if (contacts && contacts.length > 0) {
      const csvContent = convertToCSV(contacts);
      downloadCSV(csvContent, 'contacts_export.csv');
    }
  };

  const convertToCSV = (contactsData) => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Inquiry Type', 'Status', 'Callback Requested', 'Submitted Date'];
    const rows = contactsData.map(contact => [
      contact.name || '',
      contact.email || '',
      contact.phone || '',
      contact.subject || '',
      contact.inquiryType || '',
      contact.status || '',
      contact.scheduleCallback ? 'Yes' : 'No',
      new Date(contact.createdAt).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setShowContactDetails(true);
    
    if (!contact.adminNotes) {
      try {
        await fetchContactById(contact.id);
      } catch (error) {
        console.error('Error fetching contact details:', error);
      }
    }
  };

  const handleCloseContactDetails = () => {
    setShowContactDetails(false);
    setSelectedContact(null);
  };

  const handleStatusUpdate = async (contact, statusData) => {
    setActionLoading(`status-${contact.id}`);
    
    try {
      const result = await updateContactStatus(contact.id, statusData);
      
      if (result.success) {
        if (selectedContact && selectedContact.id === contact.id) {
          setSelectedContact(result.contact);
        }
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    updateFilters({
      search: '',
      status: 'all',
      inquiryType: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setShowMobileFilters(false);
  };

  const handlePageChange = (page) => {
    fetchContacts(page);
  };

  const handleRefresh = () => {
    fetchContacts(pagination.currentPage);
    fetchContactStats();
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900  sm:px-4 ">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 
              theme === 'smokey' ? 'bg-blue-800/10' : 'bg-blue-100'
            }`}>
              <Mail className={`w-6 h-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Contact Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage and respond to customer inquiries
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2 sm:space-x-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={toggleMobileFilters}
              className="sm:hidden flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {showMobileFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              <span>Filters</span>
            </button>

            <button
              onClick={handleExportContacts}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={clearError}
              className="text-red-800 dark:text-red-300 hover:text-red-900 dark:hover:text-red-200 text-lg"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Contact Statistics */}
      {stats && <ContactStats stats={stats} />}

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white dark:bg-gray-800 shadow-xl z-50 sm:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <ContactFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isMobile={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 py-4 hidden sm:block"
      >
        <ContactFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </motion.div>

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white mt-4 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <ContactTable
          contacts={contacts}
          isLoading={isLoading}
          pagination={pagination}
          onViewContact={handleViewContact}
          onUpdateStatus={handleStatusUpdate}
          actionLoading={actionLoading}
          onPageChange={handlePageChange}
        />
      </motion.div>
    </div>
  );
};

export default AdminContacts;