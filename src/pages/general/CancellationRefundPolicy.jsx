// src/pages/general/CancellationRefundPolicy.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Undo2, DollarSign, Clock, Ban, CheckCircle, XCircle, ChevronRight, FileText, Shield, Truck, Mail } from 'lucide-react';

const CancellationRefundPolicy = () => {
  const [activeSection, setActiveSection] = useState('cancellation');

  const sidebarItems = [
    { id: 'cancellation', icon: Clock, label: 'Order Cancellation' },
    { id: 'refund', icon: DollarSign, label: 'Refund Policy' },
    { id: 'process', icon: Ban, label: 'Refund Process' },
    { id: 'request', icon: Undo2, label: 'How to Request' },
    { id: 'shipping', icon: Truck, label: 'Return Shipping' },
    { id: 'contact', icon: Mail, label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                  <Undo2 className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                        ? 'bg-red-500 text-white shadow-lg transform scale-105'
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Cancellation & Refund Policy
                </h1>
                <div className="inline-flex items-center bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-full text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Last updated on October 3, 2025
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {activeSection === 'cancellation' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Clock className="w-6 h-6 mr-3 text-blue-600" />
                      Order Cancellation
                    </h2>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center mb-4">
                          <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancellation Allowed</h3>
                        </div>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                          {['Within 3 days of order placement', 'Before order is shipped'].map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                        <div className="flex items-center mb-4">
                          <XCircle className="w-6 h-6 text-red-500 mr-3" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancellation Not Allowed</h3>
                        </div>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                          {['After order is shipped', 'Customized/personalized items'].map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'refund' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <DollarSign className="w-6 h-6 mr-3 text-green-600" />
                      Refund Policy
                    </h2>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">✅ Eligible for Refund</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { title: 'Damaged Items', desc: 'Report within 3 days of delivery' },
                            { title: 'Wrong Items', desc: 'Received incorrect product' },
                            { title: 'Quality Issues', desc: 'Established quality problems' },
                            { title: 'Cancelled Orders', desc: 'Successfully cancelled orders' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white">{item.title}</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">❌ Not Eligible for Refund</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { title: 'Change of Mind', desc: 'After 3 days of delivery' },
                            { title: 'Custom Items', desc: 'Made-to-order products' },
                            { title: 'Sale Items', desc: 'Clearance/discounted products' },
                            { title: 'Used Items', desc: 'Products that show wear' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white">{item.title}</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'process' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Ban className="w-6 h-6 mr-3 text-orange-600" />
                      Refund Process
                    </h2>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-semibold text-purple-800 dark:text-purple-200 text-lg">⏱️ Refund Timeline: 3-5 business days</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { step: '1', title: 'Refund request approved', desc: 'Within 24 hours of approval' },
                          { step: '2', title: 'Refund processed', desc: 'Amount credited to payment method' },
                          { step: '3', title: 'Confirmation sent', desc: 'Email confirmation with details' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {item.step}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'request' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Undo2 className="w-6 h-6 mr-3 text-blue-600" />
                      How to Request Cancellation/Refund
                    </h2>
                    <div className="space-y-4">
                      {[
                        { 
                          step: 'Step 1: Contact Customer Service', 
                          desc: 'Email: returns@agumiyacollections.com with your order number and reason' 
                        },
                        { 
                          step: 'Step 2: Provide Details', 
                          desc: 'Include photos/videos for damaged or incorrect items' 
                        },
                        { 
                          step: 'Step 3: Follow Instructions', 
                          desc: 'Our team will guide you through the return process if applicable' 
                        }
                      ].map((item, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{item.step}</h3>
                          <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Return Shipping</h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 text-lg">🚚 We Cover Return Shipping</h3>
                        <p className="text-green-700 dark:text-green-300">
                          For damaged, defective, or wrong items received
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 text-lg">📦 Customer Covers Return Shipping</h3>
                        <p className="text-orange-700 dark:text-orange-300">
                          For change of mind or size exchange requests
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'contact' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                      <p className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">📞 For cancellation and refund requests:</p>
                      <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p className="flex items-center">
                          <Mail className="w-5 h-5 mr-3 text-purple-600" />
                          Email: contact@agumiyacollections.com
                        </p>
                        <p className="flex items-center">
                          <Clock className="w-5 h-5 mr-3 text-purple-600" />
                          Response Time: Within 24 hours
                        </p>
                        <p className="flex items-center">
                          <FileText className="w-5 h-5 mr-3 text-purple-600" />
                          Business Hours: Monday-Friday, 9 AM - 6 PM IST
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

export default CancellationRefundPolicy;