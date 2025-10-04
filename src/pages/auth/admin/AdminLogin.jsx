import React from 'react'
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, BarChart3, Settings, Heart } from 'lucide-react';
import logo from '../../../assets/images/logo.png';
import { useAuth } from '../../../contexts/AuthProvider';
import { useTheme } from '../../../contexts/ThemeContext';
import { SEO } from '../../../contexts/SEOContext';
import { useCart } from '../../../contexts/CartContext';

// Unsplash images for background
const adminImages = {
  login: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  analytics: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
};

const AdminLogin = () => {
  const { handleUserLogin } = useCart();
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
    if (error) clearError();
  }, [localError, error, clearError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        handleUserLogin(`admin_${result.user.id}`);
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setLocalError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setLocalError('Invalid credentials. Please check your email and password.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setLocalError(err.response.data.message);
      } else if (err.message) {
        setLocalError(err.message);
      } else {
        setLocalError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location.state?.from?.pathname]);

  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  useEffect(() => {
    if (error && !localError) {
      setLocalError(error);
    }
  }, [error]);

  return (
    <>
      <SEO 
        title="Admin Login - Agumiya Collections"
        description="Secure administrator access to Agumiya Collections dashboard and analytics"
        keywords="admin login, agumiya collections, ecommerce, dashboard, analytics"
      />
      
      <div className="min-h-screen flex">
        {/* Left Side - Background Image with Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${adminImages.login})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full text-white">
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
              className="mb-12 relative"
            >
              <div className="relative w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <img 
                  src={logo} 
                  alt="Agumiya Collections" 
                  className="w-24 h-20 filter brightness-0 invert"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg"
              >
                <Shield className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-8 max-w-md"
            >
              <div>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  KA-CHING SEASON STARTS HERE!
                </h1>
                <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full"></div>
              </div>
              
              <p className="text-gray-200 text-lg leading-relaxed">
                Holiday sales are heating up. Offer gift-ready holiday bestsellers and catch early shoppers before the rush to turn the season into your biggest payday ever!
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center gap-3 text-gray-200">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Real-time Analytics & Insights</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <Lock className="w-5 h-5 text-green-400" />
                  <span>Enterprise-grade Security</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <span>Advanced Management Tools</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
              className="flex items-center mt-10 text-gray-300"
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
                <Heart size={16} className="text-red-400 fill-current" />
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
          className="w-full lg:w-1/2 flex items-center justify-center min-h-screen bg-white relative overflow-hidden"
        >
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
                  <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <img src={logo} alt="Agumiya collections" className="w-14 h-7 filter brightness-0 invert" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                  <p className="text-sm text-gray-600">Agumiya Collections</p>
                </div>
              </div>
            </motion.div>

            {/* Login Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  WELCOME BACK.
                </h2>
                <p className="text-gray-600">
                  Sign in to your admin account
                </p>
              </div>
              {/* Error Message */}
              {localError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm font-medium text-center">
                    {localError}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                              bg-white text-gray-900
                              transition-all duration-200 placeholder-gray-500
                              backdrop-blur-sm"
                      placeholder="purplepicks.shop@gmail.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link 
                      to="/admin/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
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
                      className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-xl 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                              bg-white text-gray-900
                              transition-all duration-200 placeholder-gray-500
                              backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  type="submit"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  disabled={isLoading || !formData.email || !formData.password}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold 
                          transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                          flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
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
                  className="text-center pt-6 border-t border-gray-200"
                >
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
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