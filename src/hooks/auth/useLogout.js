import { useAuth } from '../../contexts/AuthContext';

export const useLogout = () => {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return {
    logout: handleLogout,
    isLoading
  };
};