// src/components/Layout/AppHeader.jsx
import { useLocation } from 'react-router-dom';
import MainHeader from './Header/Header';
import AdminHeader from '../admin/auth/AdminHeader';

const AppHeader = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return isAdminRoute ? <AdminHeader /> : <MainHeader />;
};

export default AppHeader;