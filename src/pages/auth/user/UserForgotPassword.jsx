// src/pages/auth/user/UserForgotPassword.js
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { SEO } from '../../../contexts/SEOContext';
import { authService } from '../../../services/api/authService';

const UserForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
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
            const response = await authService.forgotUserPassword(email);
            
            if (response.success) {
                setIsSubmitted(true);
            } else {
                throw new Error(response.message || 'Failed to send reset instructions');
            }
        } catch (err) {
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
                title="Reset Password - Agumiya Collections"
                description="Reset your password for Agumiya Collections customer account"
                keywords="reset password, agumiya collections, customer account"
            />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={` flex items-center justify-center bg-gradient-to-br ${themeStyles.background} p-4`}
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
                                    <Mail className="w-8 h-8" />
                                </motion.div>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold mb-2"
                                >
                                    Reset Password
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-blue-100"
                                >
                                    {isSubmitted 
                                        ? 'Check your email for instructions' 
                                        : 'Enter your email to reset your password'
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
                                            <div>
                                                <label htmlFor="email" className={`block text-sm font-medium ${themeStyles.text.secondary} mb-2`}>
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        className={`w-full pl-9 pr-3 py-2.5 border ${themeStyles.input.border} rounded-lg ${themeStyles.input.focus} ${themeStyles.input.bg} ${themeStyles.text.primary} transition-all text-sm`}
                                                        placeholder="your@email.com"
                                                        required
                                                        disabled={isLoading}
                                                        autoComplete="email"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading || !email}
                                                className={`w-full bg-gradient-to-r ${themeStyles.button.gradient} text-white py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm`}
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Sending...
                                                    </div>
                                                ) : (
                                                    'Send Reset Instructions'
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
                                                Check Your Email
                                            </h3>
                                            <p className={`${themeStyles.text.secondary} text-sm`}>
                                                We've sent password reset instructions to:<br />
                                                <strong className={themeStyles.text.primary}>{email}</strong>
                                            </p>
                                            <p className={`${themeStyles.text.muted} text-xs`}>
                                                If you don't see the email, check your spam folder or try again.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Link
                                                to="/login"
                                                className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                                            >
                                                Back to Login
                                            </Link>
                                            <button
                                                onClick={() => setIsSubmitted(false)}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                            >
                                                Try different email
                                            </button>
                                        </div>
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

export default UserForgotPassword;