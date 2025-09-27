import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthProvider.jsx';
import { USER_TYPES } from '../../../config/constants.jsx'; // Add this import

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Theme-based background gradients and colors
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          background: 'from-gray-900 via-gray-800 to-gray-900',
          cardBg: 'bg-gray-800',
          cardBorder: 'border-gray-700',
          text: {
            primary: 'text-white',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          },
          input: {
            bg: 'bg-gray-700',
            border: 'border-gray-600',
            focus: 'focus:ring-blue-500'
          },
          button: {
            gradient: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
            social: 'border-gray-600 hover:bg-gray-700'
          },
          error: {
            bg: 'bg-red-900/20',
            border: 'border-red-800',
            text: 'text-red-400'
          }
        };
      case 'smokey':
        return {
          background: 'from-gray-800 via-gray-700 to-gray-800',
          cardBg: 'bg-gray-700',
          cardBorder: 'border-gray-600',
          text: {
            primary: 'text-white',
            secondary: 'text-gray-200',
            muted: 'text-gray-300'
          },
          input: {
            bg: 'bg-gray-600',
            border: 'border-gray-500',
            focus: 'focus:ring-blue-400'
          },
          button: {
            gradient: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
            social: 'border-gray-500 hover:bg-gray-600'
          },
          error: {
            bg: 'bg-red-800/20',
            border: 'border-red-700',
            text: 'text-red-300'
          }
        };
      default: // light theme
        return {
          background: 'from-blue-50 via-white to-purple-50',
          cardBg: 'bg-white',
          cardBorder: 'border-gray-100',
          text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500'
          },
          input: {
            bg: 'bg-white',
            border: 'border-gray-300',
            focus: 'focus:ring-blue-500'
          },
          button: {
            gradient: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
            social: 'border-gray-300 hover:bg-gray-50'
          },
          error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-600'
          }
        };
    }
  };

  const themeStyles = getThemeStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      // Prepare login credentials
      const credentials = {
        email: formData.email,
        password: formData.password,
        userType: USER_TYPES.USER // Explicitly set user type
      };

      const result = await login(credentials);
      
      if (result.success) {
        // Login successful - redirect to home or intended page
        navigate('/', { replace: true });
      } else {
        // Error is already set in the context, just log it
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      // The error should be handled by the AuthProvider
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) clearError();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={` flex items-center justify-center bg-gradient-to-br ${themeStyles.background} p-4`}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${themeStyles.cardBg} rounded-2xl shadow-2xl overflow-hidden border ${themeStyles.cardBorder} max-h-[90vh]`}>
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-purple-700 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col justify-center text-white">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-blue-100">Sign in to continue your shopping journey</p>
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                {[
                  { icon: '🛒', text: 'Track Your Orders' },
                  { icon: '❤️', text: 'Access Your Wishlist' },
                  { icon: '⚡', text: 'Fast & Secure Login' },
                  { icon: '🎯', text: 'Personalized Recommendations' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-blue-100 text-sm">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl"
              />
              <motion.div
                animate={{ 
                  y: [0, 15, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-10 left-10 w-12 h-12 bg-white/10 rounded-full blur-lg"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-6 lg:p-8 overflow-y-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="lg:hidden mb-3">
                  <h1 className={`text-xl font-bold ${themeStyles.text.primary}`}>ShopEase</h1>
                </div>
                <h2 className={`text-2xl font-bold ${themeStyles.text.primary}`}>Welcome Back</h2>
                <p className={`${themeStyles.text.secondary} mt-1 text-sm`}>Sign in to your account</p>
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 ${themeStyles.error.bg} border ${themeStyles.error.border} rounded-lg flex items-center`}
                >
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className={`${themeStyles.error.text} text-sm`}>{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="grid grid-cols-1 gap-3">
                  {/* Email */}
                  <div className="relative">
                    <label htmlFor="email" className={`block text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2.5 border ${themeStyles.input.border} rounded-lg  ${themeStyles.input.focus}  ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-sm`}
                        placeholder="your@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label htmlFor="password" className={`block text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2.5 border ${themeStyles.input.border} rounded-lg  ${themeStyles.input.focus} focus:border-transparent ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-sm`}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600  scale-90" 
                      disabled={isLoading}
                    />
                    <span className={themeStyles.text.secondary}>Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors disabled:opacity-50"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r ${themeStyles.button.gradient} text-white py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Register Link */}
                <div className="text-center pt-2">
                  <p className={`text-xs ${themeStyles.text.secondary}`}>
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-center mt-4 pt-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'}`}
              >
                <div className={`flex items-center justify-center space-x-1 text-xs ${themeStyles.text.muted}`}>
                  <Lock className="w-3 h-3" />
                  <span>Your data is securely encrypted</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserLogin;