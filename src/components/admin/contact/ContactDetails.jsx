// src/components/admin/contact/ContactDetails.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Edit3,
  Save
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useContacts } from '../../../contexts/ContactsContext';

const ContactDetails = ({ contact, onClose }) => {
  const { theme } = useTheme();
  const { updateContactStatus } = useContacts();
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState(contact.adminNotes || '');
  const [selectedStatus, setSelectedStatus] = useState(contact.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-300`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getInquiryTypeBadge = (type) => {
    const typeConfig = {
      'GENERAL': { color: 'gray', label: 'General Inquiry' },
      'ORDER_SUPPORT': { color: 'blue', label: 'Order Support' },
      'PRODUCT_QUESTION': { color: 'green', label: 'Product Question' },
      'SHIPPING': { color: 'purple', label: 'Shipping Information' },
      'RETURNS': { color: 'orange', label: 'Returns & Exchanges' },
      'COMPLAINT': { color: 'red', label: 'Complaint' },
      'FEEDBACK': { color: 'teal', label: 'Feedback' },
      'OTHER': { color: 'gray', label: 'Other' }
    };

    const config = typeConfig[type] || { color: 'gray', label: type };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-300`}>
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateContactStatus(contact.id, {
        status: selectedStatus,
        adminNotes: adminNotes
      });
      
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'SPAM', label: 'Spam' }
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30 }}
      className="h-full rounded-l-2xl border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto flex flex-col"
    >
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
      {/* Header Section */}
      <section className="px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Contact Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {contact.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                {getStatusBadge(contact.status)}
                {getInquiryTypeBadge(contact.inquiryType)}
              </div>
            </div>
          </div>
          
          {/* Edit Button */}
          <div className="flex justify-end sm:justify-start">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Edit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

        {/* Contact Information */}
        <section>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-900 dark:text-white">{contact.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Submitted</p>
                <p className="text-gray-900 dark:text-white">{formatDate(contact.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inquiry Type</p>
                <p className="text-gray-900 dark:text-white">{getInquiryTypeBadge(contact.inquiryType)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subject & Message */}
        <section>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Inquiry Details</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subject</p>
              <p className="text-gray-900 dark:text-white font-semibold">{contact.subject}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Message</p>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
        </section>

        {/* Callback Information */}
        {contact.scheduleCallback && (
          <section>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Callback Request</h4>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-300 mb-2">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">Callback Requested</span>
              </div>
              {contact.callbackTime && (
                <p className="text-yellow-700 dark:text-yellow-400">
                  Preferred time: {formatDate(contact.callbackTime)}
                </p>
              )}
              <p className="text-yellow-600 dark:text-yellow-500 text-sm mt-2">
                Please contact the customer at their preferred time.
              </p>
            </div>
          </section>
        )}

        {/* Admin Section */}
        <section>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Management</h4>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="4"
                    placeholder="Add internal notes about this inquiry..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isUpdating && <Loader className="w-4 h-4 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                  
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Status</p>
                  {getStatusBadge(contact.status)}
                </div>
                
                {contact.adminNotes && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Admin Notes</p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{contact.adminNotes}</p>
                  </div>
                )}
                
                {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {formatDate(contact.updatedAt)}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ContactDetails;