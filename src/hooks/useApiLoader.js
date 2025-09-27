import { useEffect } from 'react';
import { useLoading } from '../contexts/LoadingContext';

export const useApiLoader = (isLoading, loadingText = 'Loading data...') => {
  const { setLoadingState } = useLoading();

  useEffect(() => {
    setLoadingState(isLoading, loadingText);
  }, [isLoading, loadingText, setLoadingState]);
};

// Example usage in components:
/*
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useApiLoader(loading, 'Fetching products...');

  const fetchData = async () => {
    setLoading(true);
    try {
      // API call
      const response = await api.get('/products');
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };
};
*/