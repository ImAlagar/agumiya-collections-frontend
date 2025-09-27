// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api/dashboardService';

export const useDashboardData = (timeRange) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [stats, salesOverview, bestSelling, orderVolume, refunds] = await Promise.all([
          dashboardService.getDashboardStats(timeRange),
          dashboardService.getSalesOverview(timeRange, 'day'),
          dashboardService.getBestSellingProducts(timeRange, 5),
          dashboardService.getOrderVolume(timeRange),
          dashboardService.getRefundsReturns(timeRange)
        ]);

        setDashboardData({
          stats: stats.data,
          salesOverview: salesOverview.data,
          bestSelling: bestSelling.data,
          orderVolume: orderVolume.data,
          refunds: refunds.data
        });
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  return { dashboardData, loading, error };
};