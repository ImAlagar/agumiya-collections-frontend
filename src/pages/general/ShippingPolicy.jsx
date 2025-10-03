// src/pages/general/ShippingPolicy.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Package, Globe, CheckCircle, ChevronRight, Shield, MapPin, AlertTriangle } from 'lucide-react';

const ShippingPolicy = () => {
  const [activeSection, setActiveSection] = useState('processing');

  const sidebarItems = [
    { id: 'processing', icon: Clock, label: 'Processing Time' },
    { id: 'methods', icon: Globe, label: 'Shipping Methods' },
    { id: 'tracking', icon: Package, label: 'Order Tracking' },
    { id: 'address', icon: MapPin, label: 'Shipping Address' },
    { id: 'international', icon: Globe, label: 'International' },
    { id: 'issues', icon: AlertTriangle, label: 'Delivery Issues' }
  ];

  const shippingMethods = [
    {
      region: "Domestic (Within India)",
      time: "7-15 business days",
      cost: "Calculated at checkout",
      carrier: "Registered domestic courier",
      icon: "🇮🇳"
    },
    {
      region: "International",
      time: "15-21 business days",
      cost: "Calculated at checkout",
      carrier: "International courier services",
      icon: "🌍"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                  <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                        ? 'bg-green-500 text-white shadow-lg transform scale-105'
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Shipping & Delivery Policy
                </h1>
                <div className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Last updated on October 3, 2025
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {activeSection === 'processing' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Clock className="w-6 h-6 mr-3 text-blue-600" />
                      Processing Time
                    </h2>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 font-semibold text-lg text-center mb-4">
                        ⏰ All orders are processed within 2-3 business days
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-center">
                        Orders placed on weekends or holidays will be processed on the next business day. 
                        You will receive a confirmation email once your order is shipped.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'methods' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Globe className="w-6 h-6 mr-3 text-purple-600" />
                      Shipping Methods & Timeframes
                    </h2>
                    <div className="grid gap-6">
                      {shippingMethods.map((method, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
                        >
                          <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">{method.icon}</span>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{method.region}</h3>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                              <span className="font-medium text-gray-600 dark:text-gray-300">Delivery Time:</span>
                              <p className="text-gray-900 dark:text-white font-semibold">{method.time}</p>
                            </div>
                            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <Package className="w-5 h-5 text-green-500 mx-auto mb-2" />
                              <span className="font-medium text-gray-600 dark:text-gray-300">Shipping Cost:</span>
                              <p className="text-gray-900 dark:text-white font-semibold">{method.cost}</p>
                            </div>
                            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                              <Truck className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                              <span className="font-medium text-gray-600 dark:text-gray-300">Carrier:</span>
                              <p className="text-gray-900 dark:text-white font-semibold">{method.carrier}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'tracking' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Package className="w-6 h-6 mr-3 text-orange-600" />
                      Order Tracking
                    </h2>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                        Once your order is shipped, you will receive:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Shipping confirmation email with tracking number',
                          'Real-time tracking updates via email/SMS',
                          'Estimated delivery date',
                          'Carrier contact information'
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

                {activeSection === 'address' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-6 h-6 mr-3 text-red-600" />
                      Shipping Address
                    </h2>
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-200 text-lg text-center">
                        ⚠️ Please ensure your shipping address is complete and accurate. We are not responsible for 
                        delays or additional charges due to incorrect addresses provided by customers.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'international' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">International Shipping</h2>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">For international orders, please note:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Customs duties and taxes are the responsibility of the recipient',
                          'Delivery times may vary due to customs processing',
                          'Some restrictions may apply based on destination country',
                          'All international shipments include tracking and insurance'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <Globe className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'issues' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-3 text-orange-600" />
                      Delivery Issues
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3 text-lg">🚫 Failed Delivery</h3>
                        <p className="text-red-700 dark:text-red-300">
                          If delivery attempts fail, the package will be returned to our facility. 
                          Additional shipping charges will apply for re-delivery.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 text-lg">📦 Damaged Package</h3>
                        <p className="text-orange-700 dark:text-orange-300">
                          If your package arrives damaged, please contact us within 48 hours with photos 
                          of the damaged package and contents.
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

export default ShippingPolicy;