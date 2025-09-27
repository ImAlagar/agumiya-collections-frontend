import { useState, useEffect } from 'react';
import { apiClient } from '../../config/api';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { method = 'GET', body = null, immediate = true } = options;

  const execute = async (overrides = {}) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        method: overrides.method || method,
        url: overrides.url || url,
        data: overrides.body || body
      };

      const response = await apiClient(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && (method === 'GET' || !method)) {
      execute();
    }
  }, [url, immediate]);

  return { data, loading, error, execute, setData };
};