// src/components/admin/stats/ProductStats.jsx
import React from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const ProductStats = ({ products }) => {

  const stats = {
    total: products?.length || 0,
    published: products?.length || 0,
    outOfStock: products?.filter(p => p.stock <= 0).length || 0,
    totalValue: products?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.total,
      icon: Package,
      color: 'blue',
      description: 'All products in catalog'
    },
    {
      title: 'Published',
      value: stats.published,
      icon: TrendingUp,
      color: 'green',
      percentage: stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0,
      description: 'Visible to customers'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      icon: AlertTriangle,
      color: 'red',
      description: 'Requires restocking',
      alert: stats.outOfStock > 0 ? `${stats.outOfStock} need attention` : null
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple',
      description: 'Total stock value'
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

export default ProductStats;