// src/components/admin/dashboard/QuickActions.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Bell, Package, Users, Settings, Plus } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: DollarSign,
      title: 'Currency Settings',
      description: 'Manage store currency and conversion rates',
      buttonText: 'Configure Currency',
      color: 'bg-blue-600 hover:bg-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      icon: Bell,
      title: 'Notification System',
      description: 'Set up automated customer notifications',
      buttonText: 'Manage Notifications',
      color: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-green-600'
    },
    {
      icon: Package,
      title: 'Product Categories',
      description: 'Add and manage product categories',
      buttonText: 'Manage Categories',
      color: 'bg-purple-600 hover:bg-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'View and manage customer accounts',
      buttonText: 'View Customers',
      color: 'bg-orange-600 hover:bg-orange-700',
      iconColor: 'text-orange-600'
    },
    {
      icon: Settings,
      title: 'Store Settings',
      description: 'Configure general store preferences',
      buttonText: 'Configure Store',
      color: 'bg-red-600 hover:bg-red-700',
      iconColor: 'text-red-600'
    },
    {
      icon: Plus,
      title: 'Add New Product',
      description: 'Create a new product listing',
      buttonText: 'Create Product',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      iconColor: 'text-indigo-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
          <p className="text-gray-600 dark:text-gray-400">Frequently used administrative tasks</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${action.iconColor}`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {action.description}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full ${action.color} text-white py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
              >
                {action.buttonText}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;