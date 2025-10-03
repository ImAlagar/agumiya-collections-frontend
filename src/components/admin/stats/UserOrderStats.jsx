// src/components/admin/stats/UserOrderStats.jsx
import React from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { ShoppingCart, CheckCircle, DollarSign, AlertCircle } from 'lucide-react';

const UserOrderStats = ({ user }) => {
  const orders = user?.orders || [];
  const totalSpent = orders.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
  const successfulOrders = orders.filter(order => order?.paymentStatus === 'SUCCEEDED').length;
  const totalOrders = orders.length;
  const successRate = totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0;
  const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'blue',
      description: 'All time orders'
    },
    {
      title: 'Successful Orders',
      value: successfulOrders,
      icon: CheckCircle,
      color: 'green',
      description: `${successRate}% success rate`
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: 'purple',
      description: 'Lifetime value'
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrder),
      icon: DollarSign,
      color: 'orange',
      description: 'Average per order'
    }
  ];

  // If no orders, show a placeholder
  if (totalOrders === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No order history available</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          This user hasn't placed any orders yet
        </p>
      </div>
    );
  }

  return (
    <StatsGrid columns={{ base: 2, sm: 2, lg: 4 }} spacing="compact">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
          size="compact"
        />
      ))}
    </StatsGrid>
  );
};

export default UserOrderStats;