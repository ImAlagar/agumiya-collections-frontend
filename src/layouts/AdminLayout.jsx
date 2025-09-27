import React, { useState } from 'react'
import AdminSidebar from '../components/admin/auth/AdminSidebar'
import AdminHeader from '../components/admin/auth/AdminHeader';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900 smokey:bg-gray-800 transition-colors duration-300'>
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen}/>
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Admin Outlet */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
    </div>
  )
}

export default AdminLayout