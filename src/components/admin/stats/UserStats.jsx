// src/components/admin/stats/UserStats.jsx
import React from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { Users, UserCheck, UserX, DollarSign } from 'lucide-react';

const UserStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'blue',
      change: stats?.newUsersThisMonth || 0,
      description: `${stats?.newUsersThisMonth || 0} this month`
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: 'green',
      percentage: stats?.activePercentage || 0,
      description: `${stats?.activePercentage || 0}% of total`
    },
    {
      title: 'Inactive Users',
      value: stats?.inactiveUsers || 0,
      icon: UserX,
      color: 'red',
      percentage: stats?.inactivePercentage || 0,
      description: `${stats?.inactivePercentage || 0}% of total`
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: DollarSign,
      color: 'purple',
      change: stats?.ordersThisMonth || 0,
      description: `${stats?.ordersThisMonth || 0} this month`
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

export default UserStats;