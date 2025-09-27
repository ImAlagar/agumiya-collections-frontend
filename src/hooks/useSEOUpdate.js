import { useEffect } from 'react';
import { useSEO } from '../contexts/SEOContext';

export const useSEOUpdate = (seoConfig) => {
  const { updateSEO } = useSEO();

  useEffect(() => {
    if (seoConfig) {
      updateSEO(seoConfig);
    }
  }, [seoConfig, updateSEO]);
};