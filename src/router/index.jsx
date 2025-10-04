// router.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/general/ErrorPage";
import Home from "../pages/general/Home";
import About from "../pages/general/About";
import Shop from "../pages/general/Shop";
import Contact from "../pages/general/Contact";
import UserLogin from "../pages/auth/user/UserLogin";
import UserRegister from "../pages/auth/user/UserRegister";
import AdminLogin from "../pages/auth/admin/AdminLogin";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import AdminOrders from "../pages/dashboard/admin/AdminOrders";
import AdminUsers from "../pages/dashboard/admin/AdminUsers";
import ProtectedRoute from "../components/admin/auth/ProtectedRoute";
import Lookbook from "../pages/general/Lookbook";
import ProductDetails from "../pages/general/ProductDetails";
import Checkout from "../pages/general/Checkout";
import OrderDetails from "../pages/general/OrderDetails";
import Cart from "../pages/general/Cart";
import UserProfile from "../pages/general/UserProfile";
import UserOrders from "../pages/general/UserOrders";
import AdminContacts from "../pages/dashboard/admin/AdminContacts";
import AdminForgotPassword from "../pages/auth/admin/AdminForgotPassword";
import AdminResetPassword from "../pages/auth/admin/AdminResetPassword";
import UserForgotPassword from "../pages/auth/user/UserForgotPassword";
import UserResetPassword from "../pages/auth/user/UserResetPassword";

// Import individual settings pages
import CouponManagement from "../pages/dashboard/settings/CouponManagement";
import AdminRegistration from "../pages/dashboard/settings/AdminRegistration";
import AdminProduct from "../pages/dashboard/admin/AdminProduct";
import PrivacyPolicy from "../pages/general/PrivacyPolicy";
import TermsAndConditions from "../pages/general/TermsAndConditions";
import ShippingPolicy from "../pages/general/ShippingPolicy";
import CancellationRefundPolicy from "../pages/general/CancellationRefundPolicy";
import SearchResults from "../pages/general/SearchResults";
import OrderSuccess from "../pages/user/OrderSuccess";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'shop',
                element: <Shop />,
            },
            {
                path: 'products/:id',
                element: <ProductDetails />,
            },
            {
                path: 'cart',
                element: <Cart />,
            },
            {
                path: 'checkout',
                element: <Checkout />,
            },
            {
                path: 'myorders',
                element: <UserOrders />,
            },
            {
                path: 'orders/:id',
                element: <OrderDetails />,
            },
            {
                path: 'contact',
                element: <Contact />,
            },
            {
                path: 'login',
                element: <UserLogin />,
            },
            {
                path: 'register',
                element: <UserRegister />,
            },
            {
                path: 'forgot-password',
                element: <UserForgotPassword />,
            },
            {
                path: 'reset-password',
                element: <UserResetPassword />,
            },
            {
                path: 'profile',
                element: <UserProfile />,
            },
            {
                path: 'lookbook',
                element: <Lookbook />,
            },
            {
                path: 'privacy',
                element: <PrivacyPolicy />,
            },
            {
                path: 'terms',
                element: <TermsAndConditions />,
            },
            {
                path: 'shipping',
                element: <ShippingPolicy />,
            },
            {
                path: 'cancellation-refund',
                element: <CancellationRefundPolicy />,
            },
             { path: 'search', element: <SearchResults /> },
             { path: 'order-success', element: <OrderSuccess /> }
        ],
    },
    {
        path: '/admin/login',
        element: <AdminLogin />,
    },
    {
        path: '/admin/forgot-password',
        element: <AdminForgotPassword />,
    },
    {
        path: '/admin/reset-password',
        element: <AdminResetPassword />,
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: 'orders',
                element: <AdminOrders />,
            },
            {
                path: 'products',
                element: <AdminProduct />,
            },
            {
                path: 'users',
                element: <AdminUsers />,
            },
            {
                path: 'contacts',
                element: <AdminContacts />,
            },
            {
                path: 'settings/coupons',
                element: <CouponManagement />,
            },
            {
                path: 'settings/admins',
                element: <AdminRegistration />,
            },
        ],
    }
]);

export default router;