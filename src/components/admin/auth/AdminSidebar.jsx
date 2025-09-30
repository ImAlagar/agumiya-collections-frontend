import React from 'react';
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
  Settings
} from 'lucide-react';
import logo from '../../../assets/images/logo.png';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/contacts', label: 'Contacts', icon: Contact },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path;
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
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
      >
        {/* Sidebar Header */}
        <motion.div 
          className="flex items-center justify-between p-4"
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
            className="space-y-2 px-4"
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
          </motion.ul>
        </nav>

        {/* Sidebar Footer */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700"
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