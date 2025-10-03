// src/components/admin/stats/ContactStats.jsx
import React from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ContactStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats?.total || 0,
      icon: Mail,
      color: 'blue',
      change: stats?.todayInquiries || 0,
      description: `${stats?.todayInquiries || 0} today`
    },
    {
      title: 'Pending',
      value: stats?.byStatus?.PENDING || 0,
      icon: Clock,
      color: 'yellow',
      percentage: stats?.total ? Math.round((stats.byStatus?.PENDING / stats.total) * 100) : 0,
      description: 'Awaiting response'
    },
    {
      title: 'Resolved',
      value: stats?.byStatus?.RESOLVED || 0,
      icon: CheckCircle,
      color: 'green',
      percentage: stats?.total ? Math.round((stats.byStatus?.RESOLVED / stats.total) * 100) : 0,
      description: 'Completed inquiries'
    },
    {
      title: 'In Progress',
      value: stats?.byStatus?.IN_PROGRESS || 0,
      icon: AlertCircle,
      color: 'purple',
      percentage: stats?.total ? Math.round((stats.byStatus?.IN_PROGRESS / stats.total) * 100) : 0,
      description: 'Being handled'
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

export default ContactStats;