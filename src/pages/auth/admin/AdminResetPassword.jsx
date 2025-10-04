import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import logo from '../../../assets/images/logo.png';
import { useTheme } from '../../../contexts/ThemeContext';
import { SEO } from '../../../contexts/SEOContext';
import { authService } from '../../../services/api/authService';

const AdminResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const resetData = {
        token,
        newPassword: password
      };

      const response = await authService.resetAdminPassword(resetData);

      if (response.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback((setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  }, [error]);

  const passwordValidation = validatePassword(password);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-red-600 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link 
              to="/admin/forgot-password"
              className="text-purple-600 hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` }}
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
                  NEW BEGINNINGS
                </h1>
                <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full"></div>
              </div>
              
              <p className="text-gray-200 text-lg leading-relaxed">
                Create a strong new password for your admin account. 
                Ensure it meets all security requirements for maximum protection.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center gap-3 text-gray-200">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>Strong Password Required</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Enterprise Security Standards</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Reset Password Form */}
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

            {/* Reset Password Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Set New Password
                </h2>
                <p className="text-gray-600">
                  {isSubmitted 
                    ? 'Your password has been reset successfully!' 
                    : 'Create a strong new password for your account'
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
                    {/* New Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={handleInputChange(setPassword)}
                          className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-xl 
                                  focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                  bg-white text-gray-900
                                  transition-all duration-200 placeholder-gray-500"
                          placeholder="Enter new password"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Requirements */}
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Password must contain:
                          </p>
                          <div className="space-y-1">
                            {[
                              { key: 'minLength', text: 'At least 8 characters' },
                              { key: 'hasUpperCase', text: 'One uppercase letter' },
                              { key: 'hasLowerCase', text: 'One lowercase letter' },
                              { key: 'hasNumbers', text: 'One number' },
                              { key: 'hasSpecialChar', text: 'One special character' }
                            ].map(req => (
                              <div key={req.key} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  passwordValidation.requirements[req.key] 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-300'
                                }`} />
                                <span className={`text-xs ${
                                  passwordValidation.requirements[req.key]
                                    ? 'text-green-600'
                                    : 'text-gray-500'
                                }`}>
                                  {req.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={handleInputChange(setConfirmPassword)}
                          className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-xl 
                                  focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                  bg-white text-gray-900
                                  transition-all duration-200 placeholder-gray-500"
                          placeholder="Confirm new password"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      type="submit"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      disabled={isLoading || !password || !confirmPassword}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold 
                              transition-all duration-200
                              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                              flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Reset Password
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
                      Password Reset Successful!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Your admin password has been updated successfully. 
                      You can now log in with your new password.
                    </p>
                  </div>

                  <Link
                    to="/admin/login"
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                  >
                    Go to Login
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminResetPassword;