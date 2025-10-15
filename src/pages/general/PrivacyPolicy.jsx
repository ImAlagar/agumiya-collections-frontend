// src/pages/general/PrivacyPolicy.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Mail, ChevronRight, FileText, Users, Cookie, Database, Target, CheckCircle, Clock } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('information');

  const sidebarItems = [
    { id: 'information', icon: Database, label: 'Information We Collect' },
    { id: 'usage', icon: Target, label: 'How We Use Information' },
    { id: 'security', icon: Lock, label: 'Data Security' },
    { id: 'cookies', icon: Cookie, label: 'Cookies & Tracking' },
    { id: 'rights', icon: Users, label: 'Your Rights' },
    { id: 'contact', icon: Mail, label: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                  Policy Navigation
                </h2>
              </div>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:transform hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium text-left">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Last updated on October 3, 2025
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {activeSection === 'information' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Database className="w-6 h-6 mr-3 text-blue-600" />
                      Information We Collect
                    </h2>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Name and contact information',
                          'Email address and phone number',
                          'Shipping and billing addresses',
                          'Payment information (processed securely)',
                          'Order history and preferences',
                          'Demographic information for improved service'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'usage' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Target className="w-6 h-6 mr-3 text-green-600" />
                      How We Use Your Information
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                      {[
                        { 
                          title: 'Order Processing', 
                          desc: 'To process and deliver your orders efficiently',
                          icon: '📦'
                        },
                        { 
                          title: 'Customer Service', 
                          desc: 'To provide support and handle inquiries',
                          icon: '💬'
                        },
                        { 
                          title: 'Marketing', 
                          desc: 'To send updates about new collections and offers (with your consent)',
                          icon: '🎯'
                        },
                        { 
                          title: 'Improvements', 
                          desc: 'To enhance our website and services',
                          icon: '🚀'
                        }
                      ].map((item, index) => (
                        <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                          <div className="text-2xl mb-3">{item.icon}</div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{item.title}</h3>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Lock className="w-6 h-6 mr-3 text-purple-600" />
                      Data Security
                    </h2>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                        We implement robust security measures to protect your personal information:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'SSL encryption for all data transmissions',
                          'Secure payment processing through certified partners',
                          'Regular security audits and updates',
                          'Limited access to personal data within our organization'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <Shield className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'cookies' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Cookie className="w-6 h-6 mr-3 text-orange-600" />
                      Cookies & Tracking
                    </h2>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                      <p className="text-gray-700 dark:text-gray-300 text-lg">
                        We use cookies to enhance your shopping experience, analyze website traffic, and personalize content. 
                        You can control cookie settings through your browser preferences.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'rights' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Users className="w-6 h-6 mr-3 text-green-600" />
                      Your Rights
                    </h2>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                        You have the right to:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Access your personal information',
                          'Correct inaccurate data',
                          'Request deletion of your data',
                          'Opt-out of marketing communications',
                          'Data portability',
                          'Withdraw consent at any time'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'contact' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Mail className="w-6 h-6 mr-3 text-blue-600" />
                      Contact Us
                    </h2>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                        For any privacy-related questions or to exercise your rights, please contact us at:
                      </p>
                      <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p className="flex items-center text-lg">
                          <Mail className="w-5 h-5 mr-3 text-blue-600" />
                          Email: support@agumiyacollections.com
                        </p>
                        <p className="flex items-center">
                          <Clock className="w-5 h-5 mr-3 text-blue-600" />
                          Response Time: Within 24-48 hours
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;