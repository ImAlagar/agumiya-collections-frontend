// src/components/shared/DataTable.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Loader } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DataTable = ({
  // Data & State
  data,
  isLoading = false,
  pagination,
  
  // Configuration
  config,
  
  // Event Handlers
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onAction,
  
  // Customization
  emptyState,
  className = ''
}) => {
  const { theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);
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

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  const handleAction = (action, item) => {
    if (onAction) {
      onAction(action, item);
    }
  };

  // Theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-gray-900 border-gray-700',
          header: 'bg-gray-800 border-gray-700 text-gray-300',
          row: {
            default: 'border-gray-800 hover:bg-gray-800',
            hover: 'bg-gray-800'
          },
          card: 'bg-gray-800 border-gray-700 hover:bg-gray-750',
          text: {
            primary: 'text-white',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          }
        };
      case 'smokey':
        return {
          container: 'bg-gray-800 border-gray-600',
          header: 'bg-gray-700 border-gray-600 text-gray-300',
          row: {
            default: 'border-gray-700 hover:bg-gray-700',
            hover: 'bg-gray-700'
          },
          card: 'bg-gray-700 border-gray-600 hover:bg-gray-650',
          text: {
            primary: 'text-gray-100',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          }
        };
      default:
        return {
          container: 'bg-white border-gray-200',
          header: 'bg-gray-50 border-gray-200 text-gray-600',
          row: {
            default: 'border-gray-100 hover:bg-gray-50',
            hover: 'bg-gray-50'
          },
          card: 'bg-white border-gray-100 hover:bg-gray-50',
          text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500'
          }
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Render cell content
  const renderCellContent = (item, column) => {
    const { key, type, render, format } = column;
    const value = getNestedValue(item, key);

    if (render) {
      return render(item);
    }

    switch (type) {
      case 'text':
        return format ? format(value) : value;

      case 'badge':
        const badgeConfig = column.options?.find(opt => opt.value === value) || {};
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeConfig.className}`}>
            {badgeConfig.icon && <badgeConfig.icon className="w-3 h-3 mr-1" />}
            {badgeConfig.label || value}
          </span>
        );

      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value || 0);

      case 'date':
        return value ? new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A';

      case 'image':
        return (
          <img
            src={value || '/api/placeholder/40/40'}
            alt=""
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/40/40';
            }}
          />
        );

      case 'status':
        const statusConfig = column.options?.find(opt => opt.value === value) || {};
        return (
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusConfig.color || 'bg-gray-400'}`} />
            <span className={`text-sm font-medium ${statusConfig.textColor || 'text-gray-600'}`}>
              {statusConfig.label || value}
            </span>
          </div>
        );

      case 'action':
        return (
          <div className="flex gap-1">
            {column.actions?.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(action.type, item);
                }}
                className={`p-1 rounded transition-colors ${action.className}`}
                title={action.label}
              >
                <action.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        );

      default:
        return format ? format(value) : value;
    }
  };

  // Helper to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  if (isLoading && !data.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        {emptyState?.icon && <emptyState.icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {emptyState?.title || 'No data found'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {emptyState?.description || 'Try adjusting your filters or search criteria'}
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
        className={`overflow-hidden ${className}`}
      >
        {/* Page Size Selector */}
        {pagination && (
          <div className={`flex justify-between items-center p-4 border-b ${themeClasses.header}`}>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {pagination.totalCount || 0} {config.entityName || 'items'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select 
                value={pagination.limit || 10}
                onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full min-w-max">
            <thead>
              <tr className={`border-b ${themeClasses.header}`}>
                {config.columns.map((column) => (
                  <th 
                    key={column.key} 
                    className="text-left p-4 font-semibold text-gray-600 dark:text-gray-400"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <motion.tr
                  key={item.id || index}
                  variants={itemVariants}
                  className={`border-b ${themeClasses.row.default} transition-colors cursor-pointer group`}
                  onClick={() => handleRowClick(item)}
                  whileHover={{ 
                    scale: 1.002,
                    backgroundColor: themeClasses.row.hover
                  }}
                >
                  {config.columns.map((column) => (
                    <td key={column.key} className="p-4">
                      <div className={column.className}>
                        {renderCellContent(item, column)}
                      </div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {data.map((item, index) => (
            <motion.div
              key={item.id || index}
              variants={itemVariants}
              className={`rounded-lg p-4 shadow-sm border ${themeClasses.card} cursor-pointer transition-all duration-200`}
              onClick={() => handleRowClick(item)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Primary Row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {config.mobile?.avatar && (
                    <div className="flex-shrink-0">
                      {renderCellContent(item, config.mobile.avatar)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {renderCellContent(item, config.mobile.title)}
                    </div>
                    {config.mobile.subtitle && (
                      <div className="text-sm text-gray-500 truncate">
                        {renderCellContent(item, config.mobile.subtitle)}
                      </div>
                    )}
                  </div>
                </div>
                {config.mobile.status && (
                  <div className="flex-shrink-0">
                    {renderCellContent(item, config.mobile.status)}
                  </div>
                )}
              </div>

              {/* Details Grid */}
              {config.mobile?.details && (
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  {config.mobile.details.map((detail, idx) => (
                    <div key={idx}>
                      <div className="text-gray-600 dark:text-gray-400">
                        {detail.label}
                      </div>
                      <div className="font-medium">
                        {renderCellContent(item, detail)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {config.mobile?.footer?.left && renderCellContent(item, config.mobile.footer.left)}
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
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${themeClasses.header} gap-4`}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
              {pagination.totalCount} {config.entityName || 'items'}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex gap-1">
                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  const currentPage = pagination.currentPage;
                  
                  // Always show first page
                  if (totalPages > 0) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => onPageChange(1)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                          currentPage === 1
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        1
                      </button>
                    );
                  }

                  // Show ellipsis if needed after first page
                  if (currentPage > 3) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  // Show pages around current page
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (i !== 1 && i !== totalPages) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => onPageChange(i)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                            currentPage === i
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                  }

                  // Show ellipsis if needed before last page
                  if (currentPage < totalPages - 2) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  // Always show last page if there is more than one page
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => onPageChange(totalPages)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
                          currentPage === totalPages
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Details Sidebar */}
      {showDetails && selectedItem && config.detailsComponent && (
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
            <config.detailsComponent 
              data={selectedItem} 
              onClose={handleCloseDetails} 
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DataTable;