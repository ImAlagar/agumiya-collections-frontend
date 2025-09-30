import React from 'react'
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, BarChart3, Settings, Heart } from 'lucide-react';
import logo from '../../../assets/images/logo.png';
import { useAuth } from '../../../contexts/AuthProvider';
import { useTheme } from '../../../contexts/ThemeContext';
import { SEO } from '../../../contexts/SEOContext';

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
            // This will handle the case where login returns success: false with an error message
            setLocalError(result.error || 'Login failed. Please check your credentials.');
        }
    } catch (err) {
        // Check if this is an authentication error (401)
        if (err.response && err.response.status === 401) {
            setLocalError('Invalid credentials. Please check your email and password.');
        } else if (err.response && err.response.data && err.response.data.message) {
            // Use the specific error message from backend
            setLocalError(err.response.data.message);
        } else if (err.message) {
            // Use the error message from the error object
            setLocalError(err.message);
        } else {
            setLocalError('An unexpected error occurred. Please try again.');
        }
        console.error('Login error:', err);
    } finally {
        setIsLoading(false);
    }
};

    // Redirect if already authenticated as admin
    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate, location.state?.from?.pathname]);

    // Clear errors on component unmount
    useEffect(() => {
        return () => {
            if (error) {
                clearError();
            }
        };
    }, []);

    // Alternative approach: Clear error when component mounts
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, []);

    // Handle external error changes
    useEffect(() => {
        if (error && !localError) {
            setLocalError(error);
        }
    }, [error]);

    // Theme-based styles
    const getThemeStyles = () => {
        switch (theme) {
            case 'dark':
                return {
                    background: 'from-gray-900 via-gray-800 to-gray-900',
                    cardBg: 'bg-gray-800/90',
                    cardBorder: 'border-gray-700/30',
                    text: 'text-white',
                    textMuted: 'text-gray-300',
                    inputBg: 'bg-gray-700/50',
                    inputBorder: 'border-gray-600',
                    button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    accent: 'blue'
                };
            case 'smokey':
                return {
                    background: 'from-gray-800 via-gray-700 to-gray-800',
                    cardBg: 'bg-gray-700/90',
                    cardBorder: 'border-gray-600/30',
                    text: 'text-white',
                    textMuted: 'text-gray-300',
                    inputBg: 'bg-gray-600/50',
                    inputBorder: 'border-gray-500',
                    button: 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
                    accent: 'gray'
                };
            default: // light
                return {
                    background: 'from-blue-50 via-white to-gray-50',
                    cardBg: 'bg-white/90',
                    cardBorder: 'border-gray-200/30',
                    text: 'text-gray-900',
                    textMuted: 'text-gray-600',
                    inputBg: 'bg-white/50',
                    inputBorder: 'border-gray-300',
                    button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    accent: 'blue'
                };
        }
    };

    const themeStyles = getThemeStyles();

    return (
        <>
            <SEO 
                title="Admin Login - Agumiya Collections"
                description="Secure administrator access to Agumiya Collections dashboard and analytics"
                keywords="admin login, agumiya collections, ecommerce, dashboard, analytics"
            />
            
            <div className="min-h-screen flex">
                {/* Left Side - Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${themeStyles.background} relative overflow-hidden`}
                >
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-grid-white/10"></div>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
                        {/* Professional Logo */}
                        <motion.div
                            initial={{ scale: 0, rotateY: 180 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
                            className="mb-12 relative"
                        >
                            <div className={`relative w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'}`}>
                                <img 
                                    src={logo} 
                                    alt="Agumiya Collections" 
                                    className="w-24 h-20"
                                />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.2, type: "spring" }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                            >
                                <Shield className="w-3 h-3 text-white" />
                            </motion.div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className={`${themeStyles.text} space-y-8 max-w-md`}
                        >
                            <div>
                                <h1 className="text-4xl font-bold leading-tight mb-4">
                                    Admin Portal
                                </h1>
                                <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
                            </div>
                            
                            <p className={`${themeStyles.textMuted} text-lg leading-relaxed`}>
                                Secure access to your e-commerce dashboard, analytics, and management tools. 
                                Monitor performance and drive your business forward.
                            </p>

                            {/* Features List */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="space-y-4 text-left"
                            >
                                <div className={`flex items-center gap-3 ${themeStyles.textMuted}`}>
                                    <BarChart3 className="w-5 h-5 text-blue-400" />
                                    <span>Real-time Analytics & Insights</span>
                                </div>
                                <div className={`flex items-center gap-3 ${themeStyles.textMuted}`}>
                                    <Lock className="w-5 h-5 text-green-400" />
                                    <span>Enterprise-grade Security</span>
                                </div>
                                <div className={`flex items-center gap-3 ${themeStyles.textMuted}`}>
                                    <Settings className="w-5 h-5 text-purple-400" />
                                    <span>Advanced Management Tools</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Footer Text */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            viewport={{ once: true }}
                            className="flex items-center mt-10"
                        >
                            <span className="text-sm mr-2">Crafted with</span>
                            <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                            >
                            <Heart size={16} className="text-red-500 fill-current" />
                            </motion.div>
                            <span className="text-sm ml-2">by Agumiya Collections © {new Date().getFullYear()}</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`w-full lg:w-1/2 flex items-center justify-center min-h-screen ${
                        theme === 'light' ? 'bg-gray-50' : theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'
                    } relative overflow-hidden`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className={`absolute inset-0 ${
                            theme === 'light' ? 'bg-grid-gray-900/10' : 
                            theme === 'dark' ? 'bg-grid-white/10' : 
                            'bg-grid-white/5'
                        }`}></div>
                    </div>

                    <div className="max-w-md w-full px-8 py-12 relative z-10">
                        {/* Mobile Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:hidden text-center mb-8"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-200">
                                        <img src={logo} alt="Agumiya collections" className="w-14 h-7" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <Shield className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Agumiya Collections</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Login Card */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                            className={`${themeStyles.cardBg} backdrop-blur-xl rounded-2xl shadow-xl border ${themeStyles.cardBorder} p-8`}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Administrator Access
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sign in to your admin account
                                </p>
                            </div>

                            {/* Error Message */}
                            {localError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                                >
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">
                                        {localError}
                                    </p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 pl-12 border ${themeStyles.inputBorder} rounded-xl 
                                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                    ${themeStyles.inputBg} text-gray-900 dark:text-white
                                                    transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400
                                                    backdrop-blur-sm`}
                                            placeholder="admin@agumiya.com"
                                            required
                                            disabled={isLoading}
                                            autoComplete="email"
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <Link 
                                            to="/admin/forgot-password"
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 pl-12 pr-12 border ${themeStyles.inputBorder} rounded-xl 
                                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                    ${themeStyles.inputBg} text-gray-900 dark:text-white
                                                    transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400
                                                    backdrop-blur-sm`}
                                            placeholder="••••••••"
                                            required
                                            disabled={isLoading}
                                            autoComplete="current-password"
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    type="submit"
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    disabled={isLoading || !formData.email || !formData.password}
                                    className={`w-full bg-gradient-to-r ${themeStyles.button} text-white py-4 rounded-xl font-semibold 
                                            transition-all duration-200
                                            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                            flex items-center justify-center gap-3 relative overflow-hidden group`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </motion.button>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    className="text-center pt-6 border-t border-gray-200 dark:border-gray-700"
                                >
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                                    >
                                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Return to Customer Portal
                                    </Link>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AdminLogin;