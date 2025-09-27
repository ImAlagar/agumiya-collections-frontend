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
        ],
    },
    {
        path: '/admin/login',
        element: <AdminLogin />,
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
                element:  
                     <AdminUsers />
            },
        ],
    }
]);

export default router;