import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const startLoading = (text = 'Loading...') => {
    setLoadingText(text);
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
    setLoadingText('Loading...');
  };

  const setLoadingState = (isLoading, text = 'Loading...') => {
    setLoadingText(text);
    setLoading(isLoading);
  };

  return (
    <LoadingContext.Provider value={{
      loading,
      loadingText,
      startLoading,
      stopLoading,
      setLoadingState
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};