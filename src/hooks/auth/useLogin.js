import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_TYPES } from '../../config/constants';

export const useLogin = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (email, password, userType = USER_TYPES.USER) => {
    clearError();
    setIsSuccess(false);
    
    const result = await login(email, password, userType);
    
    if (result.success) {
      setIsSuccess(true);
    }
    
    return result;
  };

  return {
    login: handleLogin,
    isLoading,
    error,
    isSuccess,
    clearError
  };
};