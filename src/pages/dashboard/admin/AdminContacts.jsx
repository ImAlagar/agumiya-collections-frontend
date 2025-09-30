// src/pages/AdminContacts.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Plus, Filter, Download, RefreshCwIcon } from 'lucide-react';
import { useContacts } from '../../../contexts/ContactsContext';
import { useTheme } from '../../../contexts/ThemeContext';
import ContactStats from '../../../components/admin/contact/ContactStats';
import ContactFilters from '../../../components/admin/contact/ContactFilters';
import ContactTable from '../../../components/admin/contact/ContactTable';
import ContactDetails from '../../../components/admin/contact/ContactDetails';

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
  };

  const handleClearFilters = () => {
    updateFilters({
      search: '',
      status: 'all',
      inquiryType: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page) => {
    fetchContacts(page);
  };

  const handleRefresh = () => {
    fetchContacts(pagination.currentPage);
    fetchContactStats();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 
              theme === 'smokey' ? 'bg-blue-800/10' : 'bg-blue-100'
            }`}>
              <Mail className={`w-6 h-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and respond to customer inquiries
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExportContacts}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <p className="text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={clearError}
              className="text-red-800 dark:text-red-300 hover:text-red-900 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Contact Statistics */}
      {stats && <ContactStats stats={stats} />}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
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

      {/* Contact Details Sidebar */}
      <AnimatePresence>
        {showContactDetails && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={handleCloseContactDetails}
            />
            
            {/* Sidebar */}
            <div className="absolute inset-y-0 right-0 max-w-lg w-full">
              <ContactDetails
                contact={selectedContact || currentContact}
                onClose={handleCloseContactDetails}
                onStatusUpdate={handleStatusUpdate}
                isLoading={!selectedContact && !currentContact}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContacts;