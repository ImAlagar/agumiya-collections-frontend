import { useEffect, useRef } from 'react';
import { useLoading } from '../contexts/LoadingContext';

export const useContentLoader = (dependencies = []) => {
  const { stopLoading } = useLoading();
  const contentRef = useRef(null);
  const hasStopped = useRef(false);

  useEffect(() => {
    hasStopped.current = false;
  }, dependencies);

  useEffect(() => {
    if (hasStopped.current) return;

    const checkContentReady = () => {
      // Check if main content is visible and has some height
      const mainContent = document.querySelector('main');
      if (mainContent && mainContent.offsetHeight > 100) {
        stopLoading();
        hasStopped.current = true;
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkContentReady()) return;

    // Try every 100ms for up to 3 seconds
    const interval = setInterval(() => {
      if (checkContentReady()) {
        clearInterval(interval);
      }
    }, 100);

    // Safety net - stop after 3 seconds max
    const timeout = setTimeout(() => {
      clearInterval(interval);
      stopLoading();
      hasStopped.current = true;
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [stopLoading, ...dependencies]);

  return contentRef;
};