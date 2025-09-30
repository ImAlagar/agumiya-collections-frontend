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
import { ContactsProvider } from './contexts/ContactsContext'; // 👈 ADD THIS
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SearchProvider } from './contexts/SearchContext';
import { CouponProvider } from './contexts/CouponContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SEOProvider>
      <ThemeProvider>
        <AuthProvider>
          <CouponProvider>
          <SearchProvider>
            <LoadingProvider>
              <ProductsProvider>
                <CurrencyProvider>
                  <OrdersProvider>
                    <UsersProvider>
                      <ContactsProvider> {/* 👈 ADD THIS */}
                        <CartProvider>
                          <ProgressLoader />
                          <Loader />
                          <RouterProvider router={router}/>
                        </CartProvider>
                      </ContactsProvider> {/* 👈 ADD THIS */}
                    </UsersProvider>  
                  </OrdersProvider>
                </CurrencyProvider>
              </ProductsProvider>
            </LoadingProvider>
          </SearchProvider>
          </CouponProvider>
        </AuthProvider>
      </ThemeProvider>
    </SEOProvider>
  </StrictMode>,
)