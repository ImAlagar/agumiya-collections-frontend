import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useContentLoader } from '../hooks/useContentLoader'
import AppHeader from '../components/layout/AppHeader'

const MainLayout = () => {
  const contentRef = useContentLoader();
  const location = useLocation();

  // Define routes where footer should be hidden
  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldHideFooter = hideFooterRoutes.some(route => 
    location.pathname.includes(route)
  );

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 smokey:bg-gray-800 transition-colors duration-300'>
       <AppHeader />
       <main ref={contentRef} className='flex-1'>
        <Outlet />
       </main>
       {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default MainLayout