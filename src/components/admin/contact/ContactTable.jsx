// src/components/admin/contact/ContactTable.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, User, Mail, Calendar, MessageSquare, Loader, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import ContactDetails from './ContactDetails';

const ContactTable = ({ 
  contacts, 
  isLoading, 
  pagination, 
  onPageChange 
}) => {
  const { theme } = useTheme();
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const handleRowClick = (contact) => {
    setSelectedContact(contact);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedContact(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'yellow', icon: Clock, label: 'Pending' },
      'IN_PROGRESS': { color: 'blue', icon: Loader, label: 'In Progress' },
      'RESOLVED': { color: 'green', icon: CheckCircle, label: 'Resolved' },
      'CLOSED': { color: 'gray', icon: XCircle, label: 'Closed' },
      'SPAM': { color: 'red', icon: XCircle, label: 'Spam' }
    };

    const config = statusConfig[status] || { color: 'gray', icon: Clock, label: status };
    const Icon = config.icon;

    return (
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3 h-3 text-${config.color}-500`} />
        <span className={`text-sm font-medium text-${config.color}-600 dark:text-${config.color}-400`}>
          {config.label}
        </span>
      </div>
    );
  };

  const getInquiryTypeBadge = (type) => {
    const typeConfig = {
      'GENERAL': { color: 'gray', label: 'General' },
      'ORDER_SUPPORT': { color: 'blue', label: 'Order Support' },
      'PRODUCT_QUESTION': { color: 'green', label: 'Product Question' },
      'SHIPPING': { color: 'purple', label: 'Shipping' },
      'RETURNS': { color: 'orange', label: 'Returns' },
      'COMPLAINT': { color: 'red', label: 'Complaint' },
      'FEEDBACK': { color: 'teal', label: 'Feedback' },
      'OTHER': { color: 'gray', label: 'Other' }
    };

    const config = typeConfig[type] || { color: 'gray', label: type };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-300`}>
        {config.label}
      </span>
    );
  };

  const formatId = (id) => {
    if (!id) return 'N/A';
    const idString = String(id);
    return idString.length > 8 ? `${idString.slice(0, 8)}...` : idString;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No contacts found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria or filters
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400 min-w-[200px]">Contact</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Type & Status</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400 min-w-[250px]">Subject</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <motion.tr
                  key={contact.id}
                  variants={itemVariants}
                  className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleRowClick(contact)}
                  whileHover={{ 
                    scale: 1.002,
                    backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)'
                  }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {getInquiryTypeBadge(contact.inquiryType)}
                      {getStatusBadge(contact.status)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {contact.subject}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                      {contact.message.substring(0, 60)}...
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(contact.createdAt)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => handleRowClick(contact)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </div>
                    <div className="text-xs text-gray-500">{contact.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(contact.status)}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                  {contact.subject}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {contact.message}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Type</div>
                  {getInquiryTypeBadge(contact.inquiryType)}
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Callback</div>
                  <div className={`font-medium ${
                    contact.scheduleCallback 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {contact.scheduleCallback ? 'Requested' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Contact ID</div>
                  <div className="font-medium text-xs text-gray-500 truncate">
                    {formatId(contact.id)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Priority</div>
                  <div className={`font-medium text-xs ${
                    contact.inquiryType === 'COMPLAINT' 
                      ? 'text-red-600' 
                      : contact.inquiryType === 'ORDER_SUPPORT'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}>
                    {contact.inquiryType === 'COMPLAINT' ? 'High' : 
                     contact.inquiryType === 'ORDER_SUPPORT' ? 'Medium' : 'Normal'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(contact.createdAt)}
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View details
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} contacts
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pagination.currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Contact Details Sidebar */}
      {showDetails && selectedContact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleCloseDetails}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.div 
            className="relative w-full max-w-2xl h-full"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <ContactDetails 
              contact={selectedContact} 
              onClose={handleCloseDetails} 
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ContactTable;