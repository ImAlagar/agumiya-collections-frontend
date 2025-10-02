// src/components/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Download, RefreshCwIcon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useUsers } from '../../../contexts/UsersContext';
import UserFilters from '../../../components/admin/user/UserFilters';
import UserTable from '../../../components/admin/user/UserTable';
import UserDetails from '../../../components/admin/user/UserDetails';
import UserStats from '../../../components/admin/user/UserStats';

const AdminUsers = () => {
  const { theme } = useTheme();
  const {
    users,
    currentUser,
    isLoading,
    error,
    stats,
    filters,
    pagination,
    fetchUsers,
    fetchUserById,
    fetchUserStats,
    updateUserStatus,
    updatePageSize,
    updateFilters,
    clearError
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await fetchUsers(1);
      await fetchUserStats();
      // Removed the undefined function call
    };

    initializeData();
  }, [fetchUsers, fetchUserStats]);

  const handlePageSizeChange = (newSize) => {
    updatePageSize(newSize);
  };

  const handleExportUsers = () => {
    if (users && users.length > 0) {
      const csvContent = convertToCSV(users);
      downloadCSV(csvContent, 'users_export.csv');
    }
  };

  const convertToCSV = (usersData) => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Orders', 'Total Spent', 'Registered Date'];
    const rows = usersData.map(user => [
      user.name || '',
      user.email || '',
      user.phone || '',
      user.isActive ? 'Active' : 'Inactive',
      user.orders?.length || 0,
      user.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0,
      new Date(user.createdAt).toLocaleDateString()
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

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    
    if (!user.orders) {
      try {
        await fetchUserById(user.id);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const handleStatusUpdate = async (user) => {
    setActionLoading(`status-${user.id}`);
    
    try {
      const result = await updateUserStatus(user.id, { 
        isActive: !user.isActive 
      });
      
      if (result.success && selectedUser && selectedUser.id === user.id) {
        setSelectedUser(result.user);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
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
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handleRefresh = () => {
    fetchUsers(pagination.currentPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 
              theme === 'smokey' ? 'bg-blue-800/10' : 'bg-blue-100'
            }`}>
              <Users className={`w-6 h-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and monitor platform users
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExportUsers}
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

      {/* User Statistics */}
      {stats && <UserStats stats={stats} />}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <UserTable
          users={users}
          isLoading={isLoading}
          pagination={pagination}
          onViewUser={handleViewUser}
          onUpdateStatus={handleStatusUpdate}
          actionLoading={actionLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </motion.div>

    </div>
  );
};

export default AdminUsers;