import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';

const RouteLoader = () => {
  const location = useLocation();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    let mounted = true;
    
    const startRouteLoading = () => {
      if (!mounted) return;
      startLoading('Loading page...');
    };

    const stopRouteLoading = () => {
      if (!mounted) return;
      stopLoading();
    };

    startRouteLoading();

    // Listen for route transition completion
    const handleRouteLoaded = () => {
      stopRouteLoading();
    };

    // Simulate different load times based on route complexity
    const getLoadTime = () => {
      const path = location.pathname;
      if (path === '/') return 800; // Home page - faster
      if (path.includes('/admin')) return 1200; // Admin pages - slower
      if (path.includes('/shop')) return 1000; // Shop with products
      return 800; // Default
    };

    const loadTime = getLoadTime();
    const timer = setTimeout(handleRouteLoaded, loadTime);

    // Safety net - never load more than 4 seconds
    const safetyTimer = setTimeout(handleRouteLoaded, 4000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [location.pathname, startLoading, stopLoading]);

  return null;
};

export default RouteLoader;