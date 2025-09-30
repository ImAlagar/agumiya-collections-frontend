// src/components/Header/Profile.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FiUser, FiSettings, FiLogOut, FiShoppingBag, FiHeart, FiCreditCard, FiMoon, FiSun, FiCloud } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthProvider';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme configuration
  const themeConfig = {
    light: { icon: <FiSun size={16} />, label: 'Light Mode', class: 'light-theme' },
    dark: { icon: <FiMoon size={16} />, label: 'Dark Mode', class: 'dark-theme' },
    smokey: { icon: <FiCloud size={16} />, label: 'Smokey Mode', class: 'smokey-theme' }
  };

  // Early returns for conditional rendering
  if (!isAuthenticated || location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const getUserName = () => {
    if (isAdmin && user) return user.name || user.email || 'Admin';
    if (user) return user.name || user.email;
    return 'User';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  const getUserStatus = () => {
    if (isAdmin) return 'Administrator';
    if (user?.emailVerified) return 'Verified Member';
    return 'Member';
  };

  // Menu items configuration - ADD DEBUG LOGGING
  const menuItems = [
    { icon: FiUser, label: 'My Profile', path: '/profile' },
    { icon: FiShoppingBag, label: 'My Orders', path: '/myorders' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const currentTheme = themeConfig[theme];

  return (
    <div ref={profileRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <FiUser size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={`absolute right-0 top-12 w-64 rounded-2xl shadow-2xl 
                       border z-50 ${
                         theme === 'light'
                           ? 'bg-white border-gray-200'
                           : theme === 'dark'
                           ? 'bg-gray-900 border-gray-700'
                           : 'bg-gray-800 border-gray-600'
                       }`}
          >
            {/* User Info */}
            <div className={`p-4 border-b ${
              theme === 'light' ? 'border-gray-200' : 
              theme === 'dark' ? 'border-gray-700' : 'border-gray-600'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(getUserName())}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold truncate ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {getUserName()}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{getUserEmail()}</p>
                  <p className={`text-xs mt-1 ${
                    theme === 'light' ? 'text-blue-600' : 
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-300'
                  }`}>
                    {getUserStatus()}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg 
                             transition-colors text-sm ${
                               theme === 'light'
                                 ? 'hover:bg-gray-50'
                                 : theme === 'dark'
                                 ? 'hover:bg-gray-800'
                                 : 'hover:bg-gray-700'
                             }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className={`p-2 border-t ${
              theme === 'light' ? 'border-gray-200' : 
              theme === 'dark' ? 'border-gray-700' : 'border-gray-600'
            }`}>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg 
                         transition-colors text-sm ${
                           theme === 'light'
                             ? 'hover:bg-gray-50'
                             : theme === 'dark'
                             ? 'hover:bg-gray-800'
                             : 'hover:bg-gray-700'
                         }`}
              >
                <div className="flex items-center space-x-3">
                  {currentTheme.icon}
                  <span>Theme: {currentTheme.label}</span>
                </div>
                <span className={`text-xs ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Click to change
                </span>
              </button>
            </div>

            {/* Admin Panel Link */}
            {isAdmin && (
              <div className={`p-2 border-t ${
                theme === 'light' ? 'border-gray-200' : 
                theme === 'dark' ? 'border-gray-700' : 'border-gray-600'
              }`}>
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg 
                             transition-colors text-sm ${
                               theme === 'light'
                                 ? 'hover:bg-blue-50 text-blue-600'
                                 : theme === 'dark'
                                 ? 'hover:bg-blue-900/20 text-blue-400'
                                 : 'hover:bg-blue-800/20 text-blue-300'
                             }`}
                >
                  <FiSettings size={16} />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            )}

            {/* Footer */}
            <div className={`p-2 border-t ${
              theme === 'light' ? 'border-gray-200' : 
              theme === 'dark' ? 'border-gray-700' : 'border-gray-600'
            }`}>
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg 
                           transition-colors text-sm ${
                             theme === 'light'
                               ? 'hover:bg-red-50 text-red-600'
                               : theme === 'dark'
                               ? 'hover:bg-red-900/20 text-red-400'
                               : 'hover:bg-red-800/20 text-red-300'
                           }`}
              >
                <FiLogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;