  // src/components/admin/order/OrderStats.jsx
  import React from 'react';
  import { motion } from 'framer-motion';
  import { ShoppingBag, Clock, CheckCircle, DollarSign } from 'lucide-react';

  const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-blue-500',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-l-yellow-500',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-l-green-500',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-l-emerald-500'
    };

    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm border-l-4 ${colorClasses[color]}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          <div className="p-3 bg-opacity-20 rounded-full">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    );
  };

  // ✅ Use default export here
  const OrderStats = ({ stats }) => {
    const statCards = [
      {
        title: 'Total Orders',
        value: stats?.totalOrders || 0,
        icon: ShoppingBag,
        color: 'blue'
      },
      {
        title: 'Pending',
        value: stats?.pending || 0,
        icon: Clock,
        color: 'yellow'
      },
      {
        title: 'Completed',
        value: stats?.completed || 0,
        icon: CheckCircle,
        color: 'green'
      },
      {
        title: 'Revenue',
        value: `$${(stats?.revenue || 0).toLocaleString()}`,
        icon: DollarSign,
        color: 'emerald'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    );
  };

  // ✅ Make sure this line is at the end
  export default OrderStats;