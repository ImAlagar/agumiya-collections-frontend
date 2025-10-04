// src/components/admin/stats/OrderStats.jsx
import React, { useMemo } from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { ShoppingCart, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext';

const OrderStats = ({ orders = [], previousPeriodOrders = [] }) => {
  const { formatPrice } = useCurrency();

  const calculateStats = (orderList) => {
    const totalSpent = orderList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const successfulOrders = orderList.filter(order => order.paymentStatus === 'SUCCEEDED').length;
    const totalOrders = orderList.length;
    const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const successRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

    return { totalSpent, successfulOrders, totalOrders, avgOrder, successRate };
  };

  const currentStats = useMemo(() => calculateStats(orders), [orders]);
  const previousStats = useMemo(() => calculateStats(previousPeriodOrders), [previousPeriodOrders]);

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: currentStats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'blue',
      description: 'All orders',
      change: calculateChange(currentStats.totalOrders, previousStats.totalOrders),
      trend: currentStats.totalOrders >= previousStats.totalOrders ? 'up' : 'down'
    },
    {
      title: 'Successful Orders',
      value: currentStats.successfulOrders.toLocaleString(),
      icon: CheckCircle,
      color: 'green',
      percentage: Math.round(currentStats.successRate),
      description: 'Completed payments',
      change: calculateChange(currentStats.successfulOrders, previousStats.successfulOrders),
      trend: currentStats.successfulOrders >= previousStats.successfulOrders ? 'up' : 'down'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(currentStats.totalSpent).formatted,
      icon: DollarSign,
      color: 'purple',
      description: 'Gross sales',
      change: calculateChange(currentStats.totalSpent, previousStats.totalSpent),
      trend: currentStats.totalSpent >= previousStats.totalSpent ? 'up' : 'down'
    },
    {
      title: 'Avg. Order Value',
      value: formatPrice(currentStats.avgOrder).formatted,
      icon: TrendingUp,
      color: 'orange',
      description: 'Per order value',
      change: calculateChange(currentStats.avgOrder, previousStats.avgOrder),
      trend: currentStats.avgOrder >= previousStats.avgOrder ? 'up' : 'down'
    }
  ];

  return (
    <div className="mb-6">
      <StatsGrid>
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
            progressBar={stat.percentage ? { percentage: stat.percentage } : undefined}
            showChange={true}
          />
        ))}
      </StatsGrid>
    </div>
  );
};

export default OrderStats;