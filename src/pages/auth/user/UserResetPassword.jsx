// src/pages/auth/user/UserResetPassword.js
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { SEO } from '../../../contexts/SEOContext';
import { authService } from '../../../services/api/authService';

const UserResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const { theme } = useTheme();

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

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password', { 
                replace: true,
                state: { error: 'Invalid or missing reset token' }
            });
        }
    }, [token, navigate]);

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

            const response = await authService.resetUserPassword(resetData);

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                            Invalid Reset Link
                        </h2>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link 
                            to="/forgot-password"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
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
                title="Set New Password - Agumiya Collections"
                description="Set a new password for your Agumiya Collections account"
                keywords="set password, reset password, agumiya collections"
            />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`flex items-center justify-center bg-gradient-to-br ${themeStyles.background} p-4`}
            >
                <div className="w-full max-w-md mx-auto">
                    <div className={`${themeStyles.cardBg} rounded-2xl shadow-2xl overflow-hidden border ${themeStyles.cardBorder}`}>
                        
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10 text-center text-white">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Lock className="w-8 h-8" />
                                </motion.div>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold mb-2"
                                >
                                    Set New Password
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-blue-100"
                                >
                                    {isSubmitted 
                                        ? 'Password reset successful!' 
                                        : 'Create a strong new password'
                                    }
                                </motion.p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {/* Back Button */}
                                <div className="mb-6">
                                    <Link 
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                                    >
                                        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                                        Back to Login
                                    </Link>
                                </div>

                                {!isSubmitted ? (
                                    <>
                                        {/* Error Message */}
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

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* New Password */}
                                            <div>
                                                <label htmlFor="password" className={`block text-sm font-medium ${themeStyles.text.secondary} mb-2`}>
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        value={password}
                                                        onChange={handleInputChange(setPassword)}
                                                        className={`w-full pl-9 pr-9 py-2.5 border ${themeStyles.input.border} rounded-lg ${themeStyles.input.focus} ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-sm`}
                                                        placeholder="Enter new password"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                {/* Password Requirements */}
                                                {password && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                                    >
                                                        <p className={`text-xs font-medium ${themeStyles.text.secondary} mb-1`}>
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
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                                        passwordValidation.requirements[req.key] 
                                                                            ? 'bg-green-500' 
                                                                            : 'bg-gray-300 dark:bg-gray-600'
                                                                    }`} />
                                                                    <span className={`text-xs ${
                                                                        passwordValidation.requirements[req.key]
                                                                            ? 'text-green-600 dark:text-green-400'
                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                    }`}>
                                                                        {req.text}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div>
                                                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${themeStyles.text.secondary} mb-2`}>
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={handleInputChange(setConfirmPassword)}
                                                        className={`w-full pl-9 pr-9 py-2.5 border ${themeStyles.input.border} rounded-lg ${themeStyles.input.focus} ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-sm`}
                                                        placeholder="Confirm new password"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading || !password || !confirmPassword}
                                                className={`w-full bg-gradient-to-r ${themeStyles.button.gradient} text-white py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm`}
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Resetting Password...
                                                    </div>
                                                ) : (
                                                    'Reset Password'
                                                )}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    /* Success State */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center space-y-4"
                                    >
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className={`text-xl font-semibold ${themeStyles.text.primary}`}>
                                                Password Reset Successful!
                                            </h3>
                                            <p className={`${themeStyles.text.secondary} text-sm`}>
                                                Your password has been updated successfully. 
                                                You can now log in with your new password.
                                            </p>
                                        </div>

                                        <Link
                                            to="/login"
                                            className={`block w-full bg-gradient-to-r ${themeStyles.button.gradient} text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm`}
                                        >
                                            Go to Login
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default UserResetPassword;