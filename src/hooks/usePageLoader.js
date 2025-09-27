import { useEffect } from 'react';
import { useLoading } from '../contexts/LoadingContext';

export const usePageLoader = (dependencies = [], loadingText = 'Loading page...') => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading(loadingText);
    
    const timer = setTimeout(() => {
      stopLoading();
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopLoading();
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

// Example usage:
/*
const ProductPage = () => {
  usePageLoader([], 'Loading product details...');
  
  return <div>Product Page Content</div>;
};
*/