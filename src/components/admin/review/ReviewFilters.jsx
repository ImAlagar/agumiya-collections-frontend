// src/components/admin/review/ReviewFilters.jsx
import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const ReviewFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ rating: e.target.value });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('_');
    onFilterChange({ sortBy, sortOrder });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.rating !== 'all';

  const handleClearAll = () => {
    onClearFilters();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews by title, comment, customer name, or product..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <select
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="w-full sm:w-48">
          <select
            value={filters.rating || 'all'}
            onChange={handleRatingChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="w-full sm:w-48">
          <select
            value={`${filters.sortBy || 'createdAt'}_${filters.sortOrder || 'desc'}`}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="rating_desc">Highest Rating</option>
            <option value="rating_asc">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Filter className="w-4 h-4" />
            <span>Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.status && filters.status !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                  Status: {filters.status}
                </span>
              )}
              {filters.rating && filters.rating !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                  Rating: {filters.rating} stars
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;