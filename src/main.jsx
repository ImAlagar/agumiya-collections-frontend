// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { SEOProvider } from './contexts/SEOContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Loader from './components/common/Loader';
import ProgressLoader from './components/common/ProgressLoader';
import { ProductsProvider } from './contexts/ProductsContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { AuthProvider } from './contexts/AuthProvider';
import { UsersProvider } from './contexts/UsersContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SEOProvider>
      <ThemeProvider>
        <AuthProvider>
          <LoadingProvider>
            <ProductsProvider>
              <OrdersProvider>
                {/* Global Loaders */}
                <UsersProvider>
                  <ProgressLoader />
                  <Loader />
                  <RouterProvider router={router}/>
                </UsersProvider>  
              </OrdersProvider>
            </ProductsProvider>
          </LoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </SEOProvider>
  </StrictMode>,
)