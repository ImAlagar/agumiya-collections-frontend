// src/components/admin/user/UserTable.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, User, Mail, Calendar, ShoppingCart, Loader, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import UserDetails from './UserDetails';

const UserTable = ({ 
  users, 
  isLoading, 
  pagination, 
  onPageChange,
  onPageSizeChange,
  onViewUser,
}) => {
  const { theme } = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Animation variants
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

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
    if (onViewUser) {
      onViewUser(user);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatUserId = (id) => {
    if (!id) return 'N/A';
    const idString = String(id);
    return idString.length > 8 ? `${idString.slice(0, 8)}...` : idString;
  };

  const getStatusBadge = (isActive) => {
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className={`text-sm font-medium ${
          isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };

  const getEmailVerifiedBadge = (isVerified) => {
    return (
      <div className="flex items-center gap-1.5">
        {isVerified ? (
          <CheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <XCircle className="w-3 h-3 text-yellow-500" />
        )}
        <span className={`text-xs font-medium ${
          isVerified 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-yellow-600 dark:text-yellow-400'
        }`}>
          {isVerified ? 'Verified' : 'Unverified'}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No users found
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
        {/* Page Size Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">

          {/* Total Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {pagination?.totalCount || 0} users
          </div>

          {/* Page Size Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select
              value={pagination?.limit || 5}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="flex-1 sm:flex-none px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">per page</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400 min-w-[250px]">User</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Orders</th>
                <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400">Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  variants={itemVariants}
                  className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleRowClick(user)}
                  whileHover={{ 
                    scale: 1.002,
                    backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)'
                  }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center shadow-sm">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          user.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          ID: {formatUserId(user.id)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {getStatusBadge(user.isActive)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.orders?.length || 0}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">orders</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* ✅ Better Mobile Cards (Responsive below md) */}
      <div className="md:hidden space-y-4 px-3 py-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            variants={itemVariants}
            onClick={() => handleRowClick(user)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${
                      theme === "dark" ? "border-gray-800" : "border-white"
                    } ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>

                {/* Name & Email */}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate break-all max-w-[170px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {getStatusBadge(user.isActive)}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Orders</p>
                <p className="font-medium flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> {user.orders?.length || 0}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">User ID</p>
                <p className="font-medium text-xs text-gray-600 dark:text-gray-300 truncate">
                  {formatUserId(user.id)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Status</p>
                <p
                  className={`font-medium text-xs ${
                    user.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {formatDate(user.createdAt)}
              </div>

              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                <Eye className="w-3 h-3" />
                View details
              </div>
            </div>
          </motion.div>
        ))}
      </div>



        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4"
          >
            {/* Info Text */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
              {pagination.totalCount} users
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center">

              {/* Previous */}
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1 max-w-full overflow-x-auto scrollbar-hide">
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
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
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

              {/* Next */}
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>

      {/* User Details Sidebar */}
      {showDetails && selectedUser && (
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
            <UserDetails 
              user={selectedUser} 
              onClose={handleCloseDetails} 
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default UserTable;