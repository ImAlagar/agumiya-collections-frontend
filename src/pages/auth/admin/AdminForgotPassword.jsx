import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import logo from '../../../assets/images/logo.png';
import { useTheme } from '../../../contexts/ThemeContext';
import { SEO } from '../../../contexts/SEOContext';
import { authService } from '../../../services/api/authService';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.forgotAdminPassword(email);
      
      if (response.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(response.message || 'Failed to send reset instructions');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (error) setError('');
  }, [error]);

  return (
    <>
      <SEO 
        title="Reset Password - Admin Portal"
        description="Reset your admin password for Agumiya Collections"
        keywords="admin, reset password, agumiya collections"
      />
      
      <div className="min-h-screen flex">
        {/* Left Side - Background Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          
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
                  SECURE ACCESS
                </h1>
                <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full"></div>
              </div>
              
              <p className="text-gray-200 text-lg leading-relaxed">
                Recover your admin account securely. We'll send you instructions to reset your password and get you back to managing your store.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center gap-3 text-gray-200">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Enterprise-grade Security</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span>Secure Password Recovery</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Forgot Password Form */}
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

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <Link 
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </motion.div>

            {/* Forgot Password Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  {isSubmitted 
                    ? 'Check your email for reset instructions' 
                    : 'Enter your email to receive reset instructions'
                  }
                </p>
              </div>

              {!isSubmitted ? (
                <>
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <p className="text-red-600 text-sm font-medium text-center">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
                          className="w-full px-5 py-4 border border-gray-300 rounded-xl 
                                  focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                  bg-white text-gray-900
                                  transition-all duration-200 placeholder-gray-500"
                          placeholder="admin@agumiya.com"
                          required
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      type="submit"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      disabled={isLoading || !email}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold 
                              transition-all duration-200
                              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                              flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Send Reset Instructions
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Check Your Email
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We've sent password reset instructions to:<br />
                      <strong className="text-gray-900">{email}</strong>
                    </p>
                    <p className="text-gray-500 text-xs">
                      If you don't see the email, check your spam folder or try again.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/admin/login"
                      className="block w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Back to Login
                    </Link>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Try different email
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminForgotPassword;