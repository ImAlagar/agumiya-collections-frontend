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
import { ContactsProvider } from './contexts/ContactsContext';
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SearchProvider } from './contexts/SearchContext';
import { CouponProvider } from './contexts/CouponContext';
import logger from './utils/logger.jsx'; // ✅ import your frontend logger
import ErrorBoundary from './components/common/ErrorBoundary.jsx';


// 🧠 Setup Global Error Handlers (production-safe)
window.addEventListener('error', (event) => {
  logger.error(`Global runtime error: ${event.message}`, event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error(`Unhandled Promise rejection: ${event.reason}`, event.reason);
});

// 🪶 Optional: log environment info at startup
logger.info(`App starting in ${import.meta.env.MODE} mode`);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SEOProvider>
        <ThemeProvider>
          <CartProvider>
            <AuthProvider>
              <CouponProvider>
                <SearchProvider>
                  <LoadingProvider>
                    <CurrencyProvider>
                    <ProductsProvider>
                      
                        <OrdersProvider>
                          <UsersProvider>
                            <ContactsProvider>
                              <ProgressLoader />
                              <Loader />
                              <RouterProvider router={router}/>
                            </ContactsProvider>
                          </UsersProvider>  
                        </OrdersProvider>
                    
                    </ProductsProvider>
                      </CurrencyProvider>
                  </LoadingProvider>
                </SearchProvider>
              </CouponProvider>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </SEOProvider>
    </ErrorBoundary>
  </StrictMode>,
);