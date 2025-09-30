import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Ticket, UserPlus } from 'lucide-react';


const AdminSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const settingsTabs = [
    { 
      id: 'general', 
      label: 'General Settings', 
      icon: Settings,
      path: '/admin/settings/general',
      description: 'Manage basic store settings and configurations'
    },
    { 
      id: 'coupons', 
      label: 'Coupon Management', 
      icon: Ticket,
      path: '/admin/settings/coupons',
      description: 'Create and manage discount coupons'
    },
    { 
      id: 'admins', 
      label: 'Admin Registration', 
      icon: UserPlus,
      path: '/admin/settings/admins',
      description: 'Register new admin users'
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your store settings and configurations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-2">
                {settingsTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigate(tab.path)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        isActive(tab.path)
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent 
                          size={20} 
                          className={isActive(tab.path) ? 'text-blue-600 dark:text-blue-400' : ''} 
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{tab.label}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings