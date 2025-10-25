import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthProvider';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Check, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  
  const { register, error: authError, clearError } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Password requirements configuration
  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /[0-9]/.test(formData.password) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ];

  // Check if passwords match
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Check if all requirements are met
  const allRequirementsMet = passwordRequirements.every(req => req.met) && 
                            formData.name.trim() && 
                            formData.email.trim() && 
                            formData.password && 
                            formData.confirmPassword;

  // Theme-based styles
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
            focus: 'focus:ring-blue-500 focus:border-blue-500',
            error: 'border-red-500 focus:border-red-500'
          },
          button: {
            gradient: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
            disabled: 'opacity-50 cursor-not-allowed'
          },
          error: {
            bg: 'bg-red-900/20',
            border: 'border-red-800',
            text: 'text-red-400'
          },
          success: {
            text: 'text-green-400'
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
            focus: 'focus:ring-blue-400 focus:border-blue-400',
            error: 'border-red-500 focus:border-red-500'
          },
          button: {
            gradient: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
            disabled: 'opacity-50 cursor-not-allowed'
          },
          error: {
            bg: 'bg-red-800/20',
            border: 'border-red-700',
            text: 'text-red-300'
          },
          success: {
            text: 'text-green-300'
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
            focus: 'focus:ring-blue-500 focus:border-blue-500',
            error: 'border-red-500 focus:border-red-500'
          },
          button: {
            gradient: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
            disabled: 'opacity-50 cursor-not-allowed'
          },
          error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-600'
          },
          success: {
            text: 'text-green-600'
          }
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Clear backend errors when form changes
  useEffect(() => {
    if (backendError || authError) {
      setBackendError('');
      clearError();
    }
  }, [formData.name, formData.email, formData.phone, formData.password, formData.confirmPassword]);

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  // Validate individual field
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (value.trim()) {
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length < 10) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone; // Phone is optional
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Format phone number if it's the phone field
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name, processedValue);
    }
  };

  // Handle blur events (mark field as touched)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, value);
  };

  // UserRegister component - ENHANCED handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone?.trim()) {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setBackendError('');
    setErrors({});
    
    try {
      // Prepare the exact data structure backend expects
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone?.replace(/\D/g, '') || '', // Remove formatting for storage
        address: formData.address?.trim() || '' // Make sure to include address
      };
      
      
      const result = await register(registrationData);
      
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: result.message || 'Registration successful! Please check your email for verification.',
            type: 'success'
          }
        });
      } else {
        setBackendError(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setBackendError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${themeStyles.background} p-3 sm:p-4 md:p-6`}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${themeStyles.cardBg} rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden border ${themeStyles.cardBorder}`}>
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-purple-700 p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col justify-center text-white">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Join Our Community</h1>
                <p className="text-blue-100 text-sm lg:text-base">Create your account and start shopping today</p>
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2 lg:space-y-3"
              >
                {[
                  { icon: '🚀', text: 'Fast & Secure Checkout' },
                  { icon: '🎁', text: 'Exclusive Member Deals' },
                  { icon: '📦', text: 'Free Shipping on First Order' },
                  { icon: '⭐', text: 'Early Access to Sales' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-lg lg:text-xl">{item.icon}</span>
                    <span className="text-blue-100 text-xs lg:text-sm">{item.text}</span>
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
                className="absolute top-10 right-10 w-12 lg:w-16 h-12 lg:h-16 bg-white/10 rounded-full blur-xl"
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
                className="absolute bottom-10 left-10 w-10 lg:w-12 h-10 lg:h-12 bg-white/10 rounded-full blur-lg"
              />
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="p-4 sm:p-6 lg:p-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="lg:hidden mb-3">
                  <h1 className={`text-lg sm:text-xl font-bold ${themeStyles.text.primary}`}>Agumiya Collections</h1>
                </div>
                <h2 className={`text-xl sm:text-2xl lg:text-2xl font-bold ${themeStyles.text.primary}`}>Create Account</h2>
                <p className={`${themeStyles.text.secondary} mt-1 text-xs sm:text-sm`}>Join thousands of happy customers</p>
              </div>

              {/* Backend Error */}
              {(backendError || authError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 sm:mb-4 p-2 sm:p-3 ${themeStyles.error.bg} border ${themeStyles.error.border} rounded-lg flex items-center space-x-2`}
                >
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                  <span className={`${themeStyles.error.text} text-xs sm:text-sm`}>{backendError || authError}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {/* Full Name */}
                  <div className="relative">
                    <label htmlFor="name" className={`block text-xs sm:text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 border rounded-lg ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-xs sm:text-sm ${
                          errors.name ? themeStyles.input.error : `${themeStyles.input.border} ${themeStyles.input.focus}`
                        }`}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label htmlFor="email" className={`block text-xs sm:text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 border rounded-lg ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-xs sm:text-sm ${
                          errors.email ? themeStyles.input.error : `${themeStyles.input.border} ${themeStyles.input.focus}`
                        }`}
                        placeholder="your@email.com"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <label htmlFor="phone" className={`block text-xs sm:text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 border rounded-lg ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-xs sm:text-sm ${
                          errors.phone ? themeStyles.input.error : `${themeStyles.input.border} ${themeStyles.input.focus}`
                        }`}
                        placeholder="(123) 456-7890"
                        disabled={isLoading}
                        maxLength={14} // (123) 456-7890
                      />
                    </div>
                    {errors.phone && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.phone}</span>
                      </motion.p>
                    )}
                    <p className={`text-xs ${themeStyles.text.muted} mt-1`}>
                      Optional - for order updates and faster checkout
                    </p>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label htmlFor="password" className={`block text-xs sm:text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-8 sm:pl-9 pr-8 sm:pr-9 py-2 sm:py-2.5 border rounded-lg ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-xs sm:text-sm ${
                          errors.password ? themeStyles.input.error : `${themeStyles.input.border} ${themeStyles.input.focus}`
                        }`}
                        placeholder="Create a password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.password}</span>
                      </motion.p>
                    )}

                    {/* Password Requirements */}
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 space-y-1"
                      >
                        {passwordRequirements.map((requirement, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check 
                              className={`w-3 h-3 ${
                                requirement.met ? 'text-green-500' : 'text-gray-300'
                              }`} 
                            />
                            <span className={`text-xs ${
                              requirement.met ? themeStyles.success.text : themeStyles.text.muted
                            }`}>
                              {requirement.label}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label htmlFor="confirmPassword" className={`block text-xs sm:text-sm font-medium ${themeStyles.text.secondary} mb-1`}>
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-8 sm:pl-9 pr-8 sm:pr-9 py-2 sm:py-2.5 border rounded-lg ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-xs sm:text-sm ${
                          errors.confirmPassword ? themeStyles.input.error : 
                          formData.confirmPassword && !passwordsMatch ? themeStyles.input.error :
                          `${themeStyles.input.border} ${themeStyles.input.focus}`
                        }`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.confirmPassword}</span>
                      </motion.p>
                    )}
                    {formData.confirmPassword && !passwordsMatch && !errors.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>Passwords do not match</span>
                      </motion.p>
                    )}
                    {formData.confirmPassword && passwordsMatch && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-500 text-xs mt-1 flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Passwords match</span>
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Submit Button - Improved positioning */}
                <div className="pt-4 pb-2">
                  <button
                    type="submit"
                    disabled={!allRequirementsMet || !passwordsMatch || isLoading || Object.keys(errors).length > 0}
                    className={`w-full bg-gradient-to-r ${themeStyles.button.gradient} text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:${themeStyles.button.disabled} disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center mt-3 sm:mt-4">
                    <p className={`text-xs sm:text-sm ${themeStyles.text.secondary}`}>
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserRegister;