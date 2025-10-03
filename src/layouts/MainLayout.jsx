// src/layouts/MainLayout.jsx
import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useContentLoader } from '../hooks/useContentLoader'
import AppHeader from '../components/layout/AppHeader'
import CustomOrderButton from '../components/common/CustomOrderButton'
import CustomOrderButtonMobile from '../components/common/CustomOrderButtonMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'

const MainLayout = () => {
  const contentRef = useContentLoader();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Define routes where footer should be hidden
  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldHideFooter = hideFooterRoutes.some(route => 
    location.pathname.includes(route)
  );

  // Define routes where custom order button should be hidden
  const hideCustomButtonRoutes = ['/admin', '/login', '/register', '/forgot-password', '/reset-password'];
  const shouldHideCustomButton = hideCustomButtonRoutes.some(route => 
    location.pathname.includes(route)
  );

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 smokey:bg-gray-800 transition-colors duration-300'>
       <AppHeader />
       <main ref={contentRef} className='flex-1'>
        <Outlet />
       </main>
       
       {/* Custom Order Button - Show only on user pages */}
       {!shouldHideCustomButton && (
         isMobile ? <CustomOrderButtonMobile /> : <CustomOrderButton />
       )}
       
       {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default MainLayout;