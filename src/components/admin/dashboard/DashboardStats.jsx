// src/components/admin/dashboard/DashboardStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import StatCard from './StatCard';

const DashboardStats = ({ data, timeRange }) => {
  if (!data) return null;

  const stats = [
    {
      title: "Total Sales",
      value: `$${(data.sales?.total || 0).toLocaleString()}`,
      change: data.sales?.growth || 0,
      icon: DollarSign,
      color: "green",
      subtitle: `This ${timeRange}`,
      description: "Total revenue generated",
      alert: data.sales?.growth < 0 ? "Sales trending down" : null
    },
    {
      title: "Orders",
      value: data.orders?.total || 0,
      change: data.orders?.growth || 0,
      icon: ShoppingCart,
      color: "blue",
      subtitle: `${data.orders?.pending || 0} pending`,
      description: "Total orders processed",
      alert: data.orders?.growth < 0 ? "Order volume decreasing" : null
    },
    {
      title: "Products",
      value: data.products?.total || 0,
      change: data.products?.growth || 0,
      icon: Package,
      color: "purple",
      subtitle: "In catalog",
      description: "Total products available",
      alert: data.products?.outOfStock > 5 ? `${data.products.outOfStock} out of stock` : null
    },
    {
      title: "Customers",
      value: data.customers?.total || 0,
      change: data.customers?.growth || 0,
      icon: Users,
      color: "orange",
      subtitle: `${data.customers?.newThisMonth || 0} new this month`,
      description: "Total customers",
      alert: data.customers?.growth < 0 ? "Customer growth negative" : null
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  );
};

export default DashboardStats;