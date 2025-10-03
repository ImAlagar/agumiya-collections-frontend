// src/components/admin/stats/OrderStats.jsx
import React from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { ShoppingCart, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

const OrderStats = ({ orders }) => {
  const totalSpent = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const successfulOrders = orders?.filter(order => order.paymentStatus === 'SUCCEEDED').length || 0;
  const totalOrders = orders?.length || 0;
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
      percentage: totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0,
      description: `${successfulOrders} completed`
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: 'purple',
      description: 'Total sales amount'
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrder),
      icon: TrendingUp,
      color: 'orange',
      description: 'Average per order'
    }
  ];

  return (
    <StatsGrid>
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
          progressBar={{ percentage: stat.percentage }}
        />
      ))}
    </StatsGrid>
  );
};

export default OrderStats;