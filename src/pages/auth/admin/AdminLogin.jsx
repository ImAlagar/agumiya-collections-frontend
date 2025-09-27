import React from 'react'
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import logo from '../../../assets/images/logo.png';
import { useAuth } from '../../../contexts/AuthProvider';
import { useTheme } from '../../../contexts/ThemeContext';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const { login, error, clearError, isAuthenticated, isAdmin } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Memoized handleChange to prevent unnecessary re-renders
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (localError) setLocalError('');
        if (error) clearError();
    }, [localError, error, clearError]);

    // Memoized toggle function
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!formData.email || !formData.password) {
            setLocalError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setLocalError('');

        try {
            const result = await login({
                ...formData,
                userType: 'admin'
            });

            if (result.success) {
                // Redirect to intended page or admin dashboard
                const from = location.state?.from?.pathname || '/admin';
                navigate(from, { replace: true });
            } else {
                setLocalError(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setLocalError('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect if already authenticated as admin - FIXED: Added proper dependencies
    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate, location.state?.from?.pathname]);

    // Clear errors on component unmount - FIXED: Remove clearError from dependencies
    useEffect(() => {
        return () => {
            // Only clear if there's an error to avoid unnecessary state updates
            if (error) {
                clearError();
            }
        };
    }, []); // Empty dependency array - runs only on unmount

    // Alternative approach: Clear error when component mounts
    useEffect(() => {
        // Clear any existing errors when component mounts
        if (error) {
            clearError();
        }
    }, []); // Runs only once when component mounts

    // Handle external error changes
    useEffect(() => {
        if (error && !localError) {
            setLocalError(error);
        }
    }, [error]); // Only runs when error prop changes

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
        >
            {/* Your existing background and styling remains the same */}
            <div className="absolute inset-0 overflow-hidden bg-gray-900">
                {/* ... keep all your existing background animations ... */}
            </div>

            <div className="relative max-w-md w-full z-10">
                {/* Header Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <img src={logo} alt='Agumiya collections' className="w-14 h-7 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-white">Admin Console</h1>
                            <p className="text-sm text-gray-300">E-Commerce Platform</p>
                        </div>
                    </div>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Administrator Access</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                            Secure access to dashboard & analytics
                        </p>
                    </div>

                    {/* Error Message */}
                    {(localError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                        >
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{localError}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setFormData(prev => ({ ...prev, [name]: value }));
                                        if (localError) setLocalError('');
                                    }}
                                    className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg 
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                            transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="admin@example.com"
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setFormData(prev => ({ ...prev, [name]: value }));
                                        if (localError) setLocalError('');
                                    }}
                                    className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg 
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                            transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            disabled={isLoading || !formData.email || !formData.password}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg font-semibold 
                                    hover:from-blue-700 hover:to-blue-800 transition-all duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25
                                    flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Secure Sign In
                                </>
                            )}
                        </motion.button>

                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Return to Customer Portal
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminLogin;