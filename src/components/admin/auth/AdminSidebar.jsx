// components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  X,
  ChevronLeft,
  Contact,
  Settings,
  Ticket,
  UserPlus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import logo from '../../../assets/images/logo.png';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/contacts', label: 'Contacts', icon: Contact },
  ];

  const settingsSubmenu = [
    { path: '/admin/settings/general', label: 'General Settings', icon: Settings },
    { path: '/admin/settings/coupons', label: 'Coupon Management', icon: Ticket },
    { path: '/admin/settings/admins', label: 'Admin Registration', icon: UserPlus },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSettingsActive = () => {
    return settingsSubmenu.some(item => location.pathname === item.path);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const menuItemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const submenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const staggerContainer = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
      >
        {/* Sidebar Header */}
        <motion.div 
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to={'/admin'} className="flex items-center space-x-3">
            <motion.img 
              src={logo} 
              alt="Admin Logo"
              className="h-28 w-52 object-cover"
              whileHover={{ scale: 1.05 }}
            />
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
          >
            <X size={20} />
          </motion.button>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          <motion.ul 
            className="space-y-1 px-3"
            variants={staggerContainer}
            initial="closed"
            animate="open"
          >
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.li key={item.path} variants={menuItemVariants}>
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                      isActive(item.path)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center"
                    >
                      <IconComponent 
                        size={20} 
                        className={`mr-3 ${
                          isActive(item.path) 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                        }`} 
                      />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}

            {/* Settings with Submenu */}
            <motion.li variants={menuItemVariants}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors group ${
                  isSettingsActive()
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Settings 
                    size={20} 
                    className={`mr-3 ${
                      isSettingsActive()
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                    }`} 
                  />
                  <span className="font-medium">Settings</span>
                </div>
                <motion.div
                  animate={{ rotate: settingsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {settingsOpen && (
                  <motion.ul
                    variants={submenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="ml-4 mt-1 space-y-1"
                  >
                    {settingsSubmenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <motion.li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors group ${
                              isActive(subItem.path)
                                ? 'bg-blue-50 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <SubIcon 
                              size={16} 
                              className={`mr-3 ${
                                isActive(subItem.path)
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                              }`} 
                            />
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          </motion.ul>
        </nav>

        {/* Sidebar Footer */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-sm font-bold">A</span>
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;