// src/components/Admin/AdminHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi';
import { Cloud, Moon, Sun, Search, Bell } from 'lucide-react';

const AdminHeader = ({ onMenuClick, sidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleLogout = async () => {
  try {
    // Perform logout with redirect
    await logout({ redirect: true });
    
    // Close profile dropdown
    setIsProfileOpen(false);
    
    // Optional: Show success message
    // toast.success('Admin logged out successfully');
  } catch (error) {
    console.error('Admin logout error:', error);
    // Optional: Show error message
    // toast.error('Logout failed. Please try again.');
  }
};

  const handleHomeClick = () => {
    navigate('/');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A';
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const themeIcons = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    smokey: <Cloud size={20} />
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                        dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                        shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={sidebarOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Desktop Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="hidden lg:flex p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                        dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                        shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Toggle menu"
          >
            <FiMenu size={20} />
          </motion.button>
          
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">



          {/* Home Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="hidden sm:flex p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                        dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                        shadow-lg hover:shadow-xl transition-all duration-300"
            title="Return to Home"
          >
            <FiHome size={18} className="text-gray-600 dark:text-gray-300" />
          </motion.button>

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

          {/* Profile Dropdown - Desktop */}
          <div ref={profileRef} className="relative hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-0"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div className="text-left min-w-0 flex-1 hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  Administrator
                </p>
              </div>
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {getInitials(user?.name)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || 'Administrator'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Administrator
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <FiUser size={16} />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <FiSettings size={16} />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm"
                    >
                      <FiLogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Button - Mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Profile menu"
          >
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {getInitials(user?.name)}
              </span>
            </div>
          </motion.button>
        </div>
      </div>



      {/* Mobile Profile Menu */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setIsProfileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {getInitials(user?.name)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="text-gray-500 truncate">{user?.email}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                >
                  <FiUser size={20} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                >
                  <FiSettings size={20} />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout Section */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-base font-medium"
                >
                  <FiLogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;