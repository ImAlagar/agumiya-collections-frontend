// src/components/admin/stats/ReviewStats.jsx
import React, { useMemo } from 'react';
import StatCard from '../../shared/StatCard';
import StatsGrid from '../../shared/StatsGrid';
import { Star, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const ReviewStats = ({ reviews = [], stats = null }) => {
  const calculatedStats = useMemo(() => {
    if (stats) return stats;

    // Calculate from reviews data if no stats provided
    const total = reviews.length;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
      : 0;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating]++;
      }
    });

    return {
      total,
      pending: total,
      approved: 0,
      rejected: 0,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  }, [reviews, stats]);

  const statCards = [
    {
      title: 'Total Pending',
      value: calculatedStats.pending?.toString() || '0',
      icon: Clock,
      color: 'blue',
      description: 'Awaiting moderation',
      change: 0,
      trend: 'neutral'
    },
    {
      title: 'Average Rating',
      value: calculatedStats.averageRating?.toString() || '0',
      icon: Star,
      color: 'yellow',
      description: 'Across all reviews',
      change: 0,
      trend: 'up'
    },
    {
      title: 'Approved Today',
      value: calculatedStats.approved?.toString() || '0',
      icon: CheckCircle,
      color: 'green',
      description: 'Recently approved',
      change: 0,
      trend: 'up'
    },
    {
      title: 'Rejected Today',
      value: calculatedStats.rejected?.toString() || '0',
      icon: XCircle,
      color: 'red',
      description: 'Recently rejected',
      change: 0,
      trend: 'down'
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
            showChange={true}
          />
        ))}
      </StatsGrid>
    </div>
  );
};

export default ReviewStats;