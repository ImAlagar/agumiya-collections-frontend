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
import AdminProducts from "../pages/dashboard/admin/AdminProducts";
import AdminOrders from "../pages/dashboard/admin/AdminOrders";
import AdminUsers from "../pages/dashboard/admin/AdminUsers";
import ProtectedRoute from "../components/admin/auth/ProtectedRoute";
import Lookbook from "../pages/general/Lookbook";
// Import the new pages
import ProductDetails from "../pages/general/ProductDetails";
import Checkout from "../pages/general/Checkout";
import OrderDetails from "../pages/general/OrderDetails";
import Cart from "../pages/general/Cart"; // You'll need this too
import UserProfile from "../pages/general/UserProfile";
import UserOrders from "../pages/general/UserOrders";
import AdminContacts from "../pages/dashboard/admin/AdminContacts";
import AdminForgotPassword from "../pages/auth/admin/AdminForgotPassword";
import AdminResetPassword from "../pages/auth/admin/AdminResetPassword";
import UserForgotPassword from "../pages/auth/user/UserForgotPassword";
import UserResetPassword from "../pages/auth/user/UserResetPassword";
import AdminSettings from "../pages/dashboard/admin/AdminSettings";

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
                path: 'products/:id', // Product details page
                element: <ProductDetails />,
            },
            {
                path: 'cart', // Shopping cart page
                element: <Cart />,
            },
            {
                path: 'checkout', // Checkout page
                element: <Checkout />,
            },
            {
                path: 'myorders', // Order details page
                element: <UserOrders />,
            },
            {
                path: 'orders/:id', // Order details page
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
                element: <AdminProducts />,
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
                path: 'settings',
                element: <AdminSettings />,
            },
        ],
    }
]);

export default router;