// src/components/Search/SearchBox.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingBag,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBox = ({ variant = 'header', onSearchSubmit }) => {
  const navigate = useNavigate();
  const {
    query,
    suggestions,
    recentSearches,
    popularSearches,
    isLoading,
    isSearchOpen,
    setQuery,
    getSearchSuggestions,
    performGlobalSearch,
    loadRecentSearches,
    loadPopularSearches,
    saveToRecentSearches,
    clearSearch,
    setSearchOpen
  } = useSearch();

  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Load data on mount
  useEffect(() => {
    loadRecentSearches();
    loadPopularSearches();
  }, [loadRecentSearches, loadPopularSearches]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      getSearchSuggestions(debouncedQuery, 'products');
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery, getSearchSuggestions]);

  // Update local query when context query changes
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearchSubmit = useCallback((searchQuery = localQuery, suggestion = null) => {
    const finalQuery = searchQuery.trim();
    if (!finalQuery) return;

    // Save to recent searches
    saveToRecentSearches(finalQuery);

    // Close suggestions
    setShowSuggestions(false);
    setSearchOpen(false);

    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(finalQuery)}`, {
      state: { suggestion }
    });

    // Call external submit handler if provided
    if (onSearchSubmit) {
      onSearchSubmit(finalQuery, suggestion);
    }
  }, [localQuery, navigate, saveToRecentSearches, setSearchOpen, onSearchSubmit]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchText = suggestion.text || suggestion;
    setLocalQuery(searchText);
    setQuery(searchText);
    handleSearchSubmit(searchText, suggestion);
  };

  const clearInput = () => {
    setLocalQuery('');
    setQuery('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type) => {
    const icons = {
      product: Package,
      category: Tag,
      user: Users,
      order: ShoppingBag
    };
    return icons[type] || Search;
  };

  const getSuggestionColor = (type) => {
    const colors = {
      product: 'text-blue-600 bg-blue-100',
      category: 'text-green-600 bg-green-100',
      user: 'text-purple-600 bg-purple-100',
      order: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const loadingVariants = {
    animate: {
      x: [-100, 100],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 1.5,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onFocus={() => {
            setShowSuggestions(true);
            setSearchOpen(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyPress}
          placeholder="Search products, categories, orders..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {localQuery && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl mt-2 z-50 max-h-96 overflow-y-auto"
          >
            {/* Loading State */}
            {isLoading && (
              <motion.div
                variants={loadingVariants}
                animate="animate"
                className="p-4"
              >
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
              </motion.div>
            )}

            {/* Recent Searches */}
            {!localQuery && recentSearches.length > 0 && (
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center justify-between group"
                  >
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {search}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {!localQuery && popularSearches.length > 0 && (
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular Searches
                </div>
                {popularSearches.map((item, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    onClick={() => handleSuggestionClick(item.text)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center justify-between group"
                  >
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.text}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {localQuery && suggestions.length > 0 && (
              <div className="p-3">
                {suggestions.map((suggestion, index) => {
                  const IconComponent = getSuggestionIcon(suggestion.type);
                  const colorClasses = getSuggestionColor(suggestion.type);
                  
                  return (
                    <motion.button
                      key={index}
                      variants={itemVariants}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 group transition-all duration-200"
                    >
                      <div className={`p-2 rounded-lg ${colorClasses}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {suggestion.text}
                        </div>
                        {suggestion.category && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {suggestion.category}
                          </div>
                        )}
                        {suggestion.price && (
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ${suggestion.price}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500 capitalize px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                          {suggestion.type}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {localQuery && suggestions.length === 0 && localQuery.length >= 2 && !isLoading && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No results found for "{localQuery}"</p>
                <p className="text-sm mt-1">Try different keywords or check spelling</p>
              </div>
            )}

            {/* Search Button for Current Query */}
            {localQuery && (
              <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSearchSubmit()}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Search for "{localQuery}"</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;