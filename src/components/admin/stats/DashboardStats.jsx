// src/components/admin/stats/DashboardStats.jsx
import React from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { useCurrency } from '../../../contexts/CurrencyContext'; // Add this import

const DashboardStats = ({ data, timeRange }) => {
  const { formatPriceSimple } = useCurrency(); // Add this hook

  const stats = [
    {
      title: "Total Sales",
      value: formatPriceSimple(data?.sales?.total || 0), // ✅ CHANGED: Use formatPriceSimple
      change: data?.sales?.growth || 0,
      icon: DollarSign,   
      color: "green",
      description: `This ${timeRange}`,
      alert: data?.sales?.growth < 0 ? "Sales trending down" : null
    },
    {
      title: "Orders",
      value: data?.orders?.total || 0,
      change: data?.orders?.growth || 0,
      icon: ShoppingCart,
      color: "blue",
      description: `${data?.orders?.pending || 0} pending`,
      alert: data?.orders?.growth < 0 ? "Order volume decreasing" : null
    },
    {
      title: "Products",
      value: data?.products?.total || 0,
      change: data?.products?.growth || 0,
      icon: Package,
      color: "purple",
      description: "In catalog",
      alert: data?.products?.outOfStock > 5 ? `${data.products.outOfStock} out of stock` : null
    },
    {
      title: "Customers",
      value: data?.customers?.total || 0,
      change: data?.customers?.growth || 0,
      icon: Users,
      color: "orange",
      description: `${data?.customers?.newThisMonth || 0} new this month`,
      alert: data?.customers?.growth < 0 ? "Customer growth negative" : null
    }
  ];

  return (
    <StatsGrid>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </StatsGrid>
  );
};

export default DashboardStats;