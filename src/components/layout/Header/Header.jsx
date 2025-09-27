// src/components/Header/Header.jsx
import { Link } from 'react-router-dom';
import { useInView } from '../../../hooks/useInView';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthProvider';
import logo from '../../../assets/images/logo.png'
import { motion, AnimatePresence } from 'framer-motion';
import NavLinks from './NavLinks';
import { Sun, Moon, Cloud, ShoppingCart, Search, Phone, Mail, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import Profile from './Profile'; // Import the Profile component

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin } = useAuth(); // Remove logout from here since Profile handles it
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

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
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
    setIsSearchOpen(false);
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  // Announcement bar content
  const announcementContent = [
    "🚚 Free shipping worldwide on orders over $100",
    "🎁 Special 20% off for new customers - Use code: WELCOME20",
    "⭐ Premium quality products with 100% satisfaction guarantee",
    "📞 Contact us: +1 (555) 123-AGUM | ✉️ info@agumiyacollections.com"
  ];

  const themeIcons = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    smokey: <Cloud size={20} />
  };

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
                <Phone size={12} />
                <span>+1 (555) 123-AGUM</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Mail size={12} />
                <span>info@agumiya.com</span>
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
              {/* Search Section */}
              <div className="flex items-center">
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
                          onChange={(e) => setSearchQuery(e.target.value)}
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
                <motion.span 
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
                  3
                </motion.span>
              </motion.button>

              {/* Profile Component (Shown only when authenticated) */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Show Profile dropdown */}
                  <Profile />
                  
                  {/* Optional: Show admin badge next to profile */}
                  {isAdmin && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              ) : (
                // Show login/register buttons when not authenticated
                <div className="flex space-x-2">
                  {/* Login Button */}
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
                    
                    {/* Gradient Shift Effect */}
                    <motion.span
                      initial={false}
                      animate={{ 
                        opacity: hoveredLink === 'login' ? 1 : 0,
                        scale: hoveredLink === 'login' ? 1 : 0.8
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    />
                    
                    {/* Shine Effect */}
                    {hoveredLink === 'login' && (
                      <motion.span
                        initial={{ x: "-100%", skewX: "-20deg" }}
                        animate={{ x: "200%", skewX: "-20deg" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    )}
                  </motion.button>

                  {/* Register Button */}
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
                <motion.span 
                  whileHover={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  3
                </motion.span>
              </motion.button>

              {/* Mobile Profile (Shown only when authenticated) */}
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
                className="lg:hidden py-3 border-t border-gray-200 dark:border-gray-700"
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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