import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer/Footer'
import { Outlet } from 'react-router-dom'
import { useContentLoader } from '../hooks/useContentLoader'
import AppHeader from '../components/layout/AppHeader'

const MainLayout = () => {
  const contentRef = useContentLoader();

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 smokey:bg-gray-800 transition-colors duration-300'>
       <AppHeader />
       <main ref={contentRef} className='flex-1'>
        <Outlet />
       </main>
       <Footer />
    </div>
  )
}

export default MainLayout