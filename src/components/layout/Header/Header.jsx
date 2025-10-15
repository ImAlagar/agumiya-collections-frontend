// src/components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '../../../hooks/useInView';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthProvider';
import logo from '../../../assets/images/logo.png'
import { motion, AnimatePresence } from 'framer-motion';
import NavLinks from './NavLinks';
import { Sun, Moon, Cloud, ShoppingCart, Search, Phone, Mail, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import Profile from './Profile';
import { useCart } from '../../../contexts/CartContext';
import { useSearch } from '../../../contexts/SearchContext'; // Add this import
import { useDebounce } from '../../../hooks/useDebounce'; // Add this import

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const cartIconRef = useRef(null);

  // Search context
  const {
    suggestions,
    recentSearches,
    popularSearches,
    isLoading,
    getSearchSuggestions,
    loadRecentSearches,
    loadPopularSearches,
    saveToRecentSearches,
    clearSearch
  } = useSearch();

  const { totalItems } = useCart();
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load search data on mount
  useEffect(() => {
    loadRecentSearches();
    loadPopularSearches();
  }, [loadRecentSearches, loadPopularSearches]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      getSearchSuggestions(debouncedQuery, 'products');
    }
  }, [debouncedQuery, getSearchSuggestions]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      clearSearch();
    }
  };

  const handleSearchSubmit = async (e, searchText = searchQuery) => {
    if (e) e.preventDefault();
    
    const finalQuery = searchText?.trim() || searchQuery.trim();
    if (!finalQuery) return;

    // Save to recent searches
    saveToRecentSearches(finalQuery);

    // Close search
    setIsSearchOpen(false);
    setSearchQuery('');

    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchText = suggestion.text || suggestion;
    setSearchQuery(searchText);
    handleSearchSubmit(null, searchText);
  };

  const clearInput = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  // Get suggestion icon
  const getSuggestionIcon = (type) => {
    const icons = {
      product: ShoppingCart,
      category: '📁',
      user: '👤',
      order: '📦'
    };
    return icons[type] || Search;
  };

  // Announcement bar content
  const announcementContent = [
    "🚚 Free shipping worldwide on orders over $50",
    "🎁 Special 10% off for new customers",
    "⭐ Premium quality products with 100% satisfaction guarantee",
    "✉️   "
  ];

  const themeIcons = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    smokey: <Cloud size={20} />
  };

  // Search Suggestions Dropdown Component
  const SearchSuggestions = () => (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl mt-2 z-50 max-h-96 overflow-y-auto"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            <Clock className="h-4 w-4 mr-2" />
            Recent Searches
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center justify-between group"
            >
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {search}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {!searchQuery && popularSearches.length > 0 && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular Searches
          </div>
          {popularSearches.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(item.text)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center justify-between group"
            >
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.text}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                {item.count} searches
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Search Suggestions */}
      {searchQuery && suggestions.length > 0 && (
        <div className="p-3">
          {suggestions.map((suggestion, index) => {
            const IconComponent = getSuggestionIcon(suggestion.type);
            
            return (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-3 group transition-all duration-200"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {typeof IconComponent === 'string' ? (
                    <span className="text-sm">{IconComponent}</span>
                  ) : (
                    <IconComponent className="h-4 w-4" />
                  )}
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
                <span className="text-xs text-gray-400 dark:text-gray-500 capitalize px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                  {suggestion.type}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {searchQuery && suggestions.length === 0 && searchQuery.length >= 2 && !isLoading && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No results found for "{searchQuery}"</p>
          <p className="text-sm mt-1">Try different keywords or check spelling</p>
        </div>
      )}

      {/* Search Button for Current Query */}
      {searchQuery && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            onClick={() => handleSearchSubmit(null)}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search for "{searchQuery}"</span>
          </button>
        </div>
      )}
    </motion.div>
  );

  // Mobile Search Suggestions Component
  const MobileSearchSuggestions = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="max-h-60 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Recent Searches
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
              >
                {search}
              </button>
            ))}
          </div>
        )}

        {/* Search Suggestions */}
        {searchQuery && suggestions.length > 0 && (
          <div className="p-3">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center space-x-3"
              >
                <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {typeof getSuggestionIcon(suggestion.type) === 'string' ? (
                    <span className="text-xs">{getSuggestionIcon(suggestion.type)}</span>
                  ) : (
                    <Search className="h-3 w-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
                    {suggestion.text}
                  </div>
                  {suggestion.category && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.category}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery && suggestions.length === 0 && searchQuery.length >= 2 && !isLoading && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.header 
        ref={ref}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isInView 
            ? 'bg-white/90 dark:bg-gray-900/90 smokey:bg-gray-800/80 backdrop-blur-md' 
            : 'bg-white/95 dark:bg-gray-900/95 smokey:bg-gray-800/90 shadow-lg backdrop-blur-lg'
        }`}
      >
        {/* Enhanced Professional Announcement Bar */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
        >
          <div className="relative py-2">
            {/* Scrolling Text Container */}
            <div className="overflow-hidden whitespace-nowrap">
              <motion.div
                className="inline-flex items-center space-x-8 text-sm font-medium text-white"
                animate={{ 
                  x: [0, -1200],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {/* Multiple copies for seamless looping */}
                {[...Array(3)].map((_, copyIndex) => (
                  <div key={copyIndex} className="inline-flex items-center space-x-8">
                    {announcementContent.map((text, index) => (
                      <div key={`${copyIndex}-${index}`} className="inline-flex items-center space-x-2">
                        <span className="flex items-center whitespace-nowrap">
                          {text}
                        </span>
                        {index < announcementContent.length - 1 && (
                          <span className="text-white/60">•</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Contact Info Overlay - Right Side */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:flex items-center space-x-4 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="flex items-center space-x-1 text-xs">
                <Mail size={12} />
                <span>support@agumiyacollections.com</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Agumiya Collections" className='lg:w-28 w-24'/>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <NavLinks />  
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Section - UPDATED WITH FUNCTIONALITY */}
              <div className="flex items-center relative">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ opacity: 0, x: 50, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: "300px" }}
                      exit={{ opacity: 0, x: 50, width: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onSubmit={handleSearchSubmit}
                      className="relative mr-2"
                    >
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyPress}
                          placeholder="Search products..."
                          className="w-full pl-4 pr-10 py-2.5 bg-white/80 dark:bg-gray-800/80 
                                   border border-gray-300 dark:border-gray-600 rounded-full 
                                   text-gray-700 dark:text-gray-200 placeholder-gray-500 
                                   backdrop-blur-sm focus:outline-none focus:ring-2 
                                   focus:ring-blue-500 focus:border-transparent 
                                   shadow-lg transition-all duration-300"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                   p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 
                                   dark:hover:text-blue-300 transition-colors"
                        >
                          <FiSearch size={18} />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Search Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSearchToggle}
                  className={`p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                            dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                            shadow-lg hover:shadow-xl transition-all duration-300 ${
                              isSearchOpen ? 'ring-2 ring-blue-500' : ''
                            }`}
                >
                  <motion.div
                    whileHover={{
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      rotate: [0, -10, 10, -5, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <FiSearch size={20} />
                  </motion.div>
                </motion.button>

                {/* Desktop Search Suggestions */}
                <AnimatePresence>
                  {isSearchOpen && searchQuery && (
                    <SearchSuggestions />
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Toggle theme"
              >
                <motion.div
                  whileHover={{
                    rotate: 360,
                    scale: 1.2
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  {themeIcons[theme]}
                </motion.div>
              </motion.button>

              {/* Cart Icon */}
              <motion.button 
                ref={cartIconRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCartClick}
                className="relative p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{
                    y: [0, -4, 0, -2, 0],
                    scale: [1, 1.1, 1.05, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingCart size={22} />
                </motion.div>
                
                {/* Dynamic cart count */}
                {totalItems > 0 && (
                  <motion.span 
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile Component */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Profile />
                  {isAdmin && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <motion.button
                    onClick={handleLoginClick}
                    onHoverStart={() => setHoveredLink('login')}
                    onHoverEnd={() => setHoveredLink(null)}
                    className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 
                             text-white text-sm font-medium rounded-lg transition-all duration-500 
                             shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Login
                    </span>
                    
                    <motion.span
                      initial={false}
                      animate={{ 
                        opacity: hoveredLink === 'login' ? 1 : 0,
                        scale: hoveredLink === 'login' ? 1 : 0.8
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    />
                    
                    {hoveredLink === 'login' && (
                      <motion.span
                        initial={{ x: "-100%", skewX: "-20deg" }}
                        animate={{ x: "200%", skewX: "-20deg" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleRegisterClick}
                    onHoverStart={() => setHoveredLink('register')}
                    onHoverEnd={() => setHoveredLink(null)}
                    className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 
                             text-white text-sm font-medium rounded-lg transition-all duration-500 
                             shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Register
                    </span>
                    
                    <motion.span
                      initial={false}
                      animate={{ 
                        opacity: hoveredLink === 'register' ? 1 : 0,
                        scale: hoveredLink === 'register' ? 1 : 0.8
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Search Icon */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSearchToggle}
                className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    rotate: [0, -10, 10, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <Search size={22} />
                </motion.div>
              </motion.button>
              
              {/* Mobile Cart */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCartClick}
                className="p-2 relative rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{
                    y: [0, -3, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingCart size={22} />
                </motion.div>
                {totalItems > 0 && (
                  <motion.span 
                    whileHover={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Profile */}
              {isAuthenticated && (
                <div className="lg:hidden">
                  <Profile />
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Toggle menu"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-gray-200 dark:border-gray-700"
              >
                <form onSubmit={handleSearchSubmit} className="relative py-3">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Search products..."
                    className="w-full pl-4 pr-12 py-3 bg-white/80 dark:bg-gray-800/80 
                             border border-gray-300 dark:border-gray-600 rounded-full 
                             text-gray-700 dark:text-gray-200 placeholder-gray-500 
                             backdrop-blur-sm focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent 
                             shadow-lg transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 
                             dark:hover:text-blue-300 transition-colors"
                  >
                    <FiSearch size={20} />
                  </button>
                </form>

                {/* Mobile Search Suggestions */}
                <AnimatePresence>
                  {searchQuery && (
                    <MobileSearchSuggestions />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <NavLinks mobile onLinkClick={() => setIsMobileMenuOpen(false)} />
            </nav>

            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-200">Theme</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{
                    rotate: 360,
                    scale: 1.2
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  {themeIcons[theme]}
                </motion.div>
              </motion.button>
            </div>

            {/* Mobile Auth Section */}
            {!isAuthenticated ? (
              <div className="flex space-x-2">  
                <motion.button
                  onClick={handleLoginClick}
                  onHoverStart={() => setHoveredLink('mobile-login')}
                  onHoverEnd={() => setHoveredLink(null)}
                  className="group relative w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                           text-white text-sm font-medium rounded-lg transition-all duration-500 
                           shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Login
                  </span>
                  
                  <motion.span
                    initial={false}
                    animate={{ 
                      opacity: hoveredLink === 'mobile-login' ? 1 : 0,
                      scale: hoveredLink === 'mobile-login' ? 1 : 0.8
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  />
                </motion.button>
                <motion.button
                  onClick={handleRegisterClick}
                  onHoverStart={() => setHoveredLink('mobile-register')}
                  onHoverEnd={() => setHoveredLink(null)}
                  className="group relative w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                           text-white text-sm font-medium rounded-lg transition-all duration-500 
                           shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Register
                  </span>
                  
                  <motion.span
                    initial={false}
                    animate={{ 
                      opacity: hoveredLink === 'mobile-register' ? 1 : 0,
                      scale: hoveredLink === 'mobile-register' ? 1 : 0.8
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  />
                </motion.button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-center py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    Welcome, {user?.name}
                  </span>
                  {isAdmin && (
                    <span className="block mt-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.header>
    </>
  );
};

export default Header;