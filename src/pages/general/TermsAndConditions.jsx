// src/pages/general/TermsAndConditions.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingBag, CreditCard, Truck, AlertCircle, ChevronRight, Shield, Users, Globe, Lock } from 'lucide-react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const sidebarItems = [
    { id: 'agreement', icon: FileText, label: 'Agreement to Terms' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders & Payments' },
    { id: 'shipping', icon: Truck, label: 'Shipping & Delivery' },
    { id: 'intellectual', icon: AlertCircle, label: 'Intellectual Property' },
    { id: 'products', icon: Users, label: 'Product Information' },
    { id: 'liability', icon: Shield, label: 'Liability' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                        ? 'bg-purple-500 text-white shadow-lg transform scale-105'
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Terms & Conditions
                </h1>
                <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Last updated on October 3, 2025
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {activeSection === 'agreement' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-purple-600" />
                      Agreement to Terms
                    </h2>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                      <p className="text-gray-700 dark:text-gray-300 text-lg">
                        By accessing our website and making purchases, you agree to be bound by these Terms and Conditions. 
                        If you disagree with any part, please refrain from using our services.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'orders' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <ShoppingBag className="w-6 h-6 mr-3 text-green-600" />
                      Orders & Payments
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                      {[
                        { 
                          title: 'Order Acceptance', 
                          desc: 'All orders are subject to availability and confirmation of order price. We reserve the right to refuse any order.',
                          icon: '✅'
                        },
                        { 
                          title: 'Pricing', 
                          desc: 'Prices are subject to change without notice. All prices are in USD unless otherwise specified.',
                          icon: '💰'
                        },
                        { 
                          title: 'Payment Methods', 
                          desc: 'We accept major credit cards, debit cards, and other payment methods as displayed during checkout.',
                          icon: '💳'
                        },
                        { 
                          title: 'Order Modifications', 
                          desc: 'Order modifications can only be made before the order is shipped. Contact customer service for assistance.',
                          icon: '✏️'
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

                {activeSection === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Truck className="w-6 h-6 mr-3 text-blue-600" />
                      Shipping & Delivery
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 text-lg">🇮🇳 Domestic Orders</h3>
                        <p className="text-blue-700 dark:text-blue-300">
                          Shipped within 7-15 business days via registered courier services.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 text-lg">🌍 International Orders</h3>
                        <p className="text-purple-700 dark:text-purple-300">
                          Shipped within 15-21 business days via international courier services.
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
                      <p className="text-orange-800 dark:text-orange-200 text-sm text-center">
                        ⚠️ Delivery times are estimates and not guaranteed. AGUMIYA COLLECTIONS is not liable for delays by courier services.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'intellectual' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <AlertCircle className="w-6 h-6 mr-3 text-red-600" />
                      Intellectual Property
                    </h2>
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                        All content on this website, including but not limited to:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Designs, logos, and trademarks',
                          'Product images and descriptions',
                          'Website layout and graphics',
                          'Text content and branding'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <Lock className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg">
                        are the property of AGUMIYA COLLECTIONS and protected by intellectual property laws. 
                        Unauthorized use is strictly prohibited.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'products' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Users className="w-6 h-6 mr-3 text-green-600" />
                      Product Information
                    </h2>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                        We strive to display product colors and details as accurately as possible. However:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Actual colors may vary due to monitor settings',
                          'Product specifications may change without notice',
                          'Images are for representation purposes',
                          'Sizes may have slight variations'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'liability' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-blue-600" />
                      Limitation of Liability
                    </h2>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="text-gray-700 dark:text-gray-300 text-lg">
                        AGUMIYA COLLECTIONS shall not be liable for any indirect, incidental, or consequential damages 
                        arising from the use or inability to use our products or services.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 text-lg">⚖️ Governing Law</h3>
                        <p className="text-purple-700 dark:text-purple-300">
                          These terms shall be governed by and construed in accordance with the laws of India. 
                          Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 text-lg">📝 Changes to Terms</h3>
                        <p className="text-orange-700 dark:text-orange-300">
                          We reserve the right to modify these terms at any time. Continued use of our services 
                          after changes constitutes acceptance of the modified terms.
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

export default TermsAndConditions;