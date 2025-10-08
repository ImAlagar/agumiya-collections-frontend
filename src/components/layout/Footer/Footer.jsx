// src/components/layout/Footer.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Heart,
  ArrowUp
} from 'lucide-react';
import { contactInfo, customerService, quickLinks, socialLinks } from '../../../utils/data.jsx';
import { motion } from 'framer-motion';
import { productService } from '../../../services/api/productService';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductFilters();
        
        if (response.success && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories for footer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category click - navigate to shop with category filter
  const handleCategoryClick = (categoryValue) => {
    // Navigate to shop page with category filter
    navigate(`/shop?categories=${encodeURIComponent(categoryValue)}`);
    
    // Optional: Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle shop categories click - navigate to shop page
  const handleShopCategoriesClick = () => {
    navigate('/shop');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Check if theme is dark mode
  const isDarkMode = theme === 'dark';

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={`relative overflow-hidden px-6 pt-16 pb-32 md:pb-24 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs */}
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
        <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
        
        {/* Grid pattern */}
        <div className={`absolute inset-0 opacity-5 ${isDarkMode ? 'bg-grid-white/[0.05]' : 'bg-grid-gray-900/[0.03]'} bg-[size:60px_60px]`}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <motion.h3 
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4"
            >
              Agumiya Collections
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="text-sm mb-6 transition-opacity"
            >
              Premium fashion collections that redefine style and elegance. Discover the latest trends in men's and women's fashion with exceptional quality and service.
            </motion.p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  whileHover={{ 
                    y: -5,
                    scale: 1.1,
                    color: isDarkMode ? '#60a5fa' : '#2563eb'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
                          dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 
                          shadow-lg hover:shadow-xl transition-all duration-300`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-5 h-5">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className={`absolute -bottom-2 left-0 w-10 h-0.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href={link.href} 
                    className={`text-sm transition-colors hover:text-blue-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Dynamic Shop Categories */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Shop Categories
              <span className={`absolute -bottom-2 left-0 w-10 h-0.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
            </h4>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <ul className="space-y-3">
                {/* All Categories Link */}
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={handleShopCategoriesClick}
                    className={`text-sm transition-colors hover:text-blue-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-left w-full`}
                  >
                    All Categories
                  </button>
                </motion.li>
                
                {/* Dynamic Categories */}
                {categories.slice(0, 6).map((category, index) => (
                  <motion.li 
                    key={category.value}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleCategoryClick(category.value)}
                      className={`text-sm transition-colors hover:text-blue-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-left w-full flex justify-between items-center`}
                    >
                      <span>{category.label}</span>
                    </button>
                  </motion.li>
                ))}
                
                {/* Show "View All" if there are more categories */}
                {categories.length > 6 && (
                  <motion.li 
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <button
                      onClick={handleShopCategoriesClick}
                      className={`text-sm font-medium transition-colors hover:text-blue-500 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-left w-full`}
                    >
                      View All Categories →
                    </button>
                  </motion.li>
                )}
              </ul>
            ) : (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No categories available
              </p>
            )}
          </motion.div>

          {/* Customer Service & Contact */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Customer Service
              <span className={`absolute -bottom-2 left-0 w-10 h-0.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
            </h4>
            <ul className="space-y-3 mb-6">
              {customerService.map((service, index) => (
                <motion.li 
                  key={service.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center space-x-2"
                >
                  <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {service.icon}
                  </span>
                  <a 
                    href={service.href} 
                    className={`text-sm transition-colors hover:text-blue-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {service.name}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className={`mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {item.icon}
                  </span>
                  <a 
                    href={item.href} 
                    className={`text-sm transition-colors hover:text-blue-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {item.text}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
 
        {/* Divider */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className={`h-px my-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        ></motion.div>
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          {/* Left side - Branding */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center md:items-center gap-2"
          >
            <div className="flex items-center">
              <span className="text-sm mr-2">Crafted with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <Heart size={16} className="text-red-500 fill-current" />
              </motion.div>
            </div>
            <span className="text-sm">
              by Agumiya Collections © {new Date().getFullYear()}
            </span>
          </motion.div>

          {/* Right side - Policy Links & Scroll to Top */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            {/* Policy Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a 
                href="/privacy"
                whileHover={{ color: isDarkMode ? '#60a5fa' : '#2563eb' }}
                className="transition-colors hover:underline"
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="/terms"
                whileHover={{ color: isDarkMode ? '#60a5fa' : '#2563eb' }}
                className="transition-colors hover:underline"
              >
                Terms of Service
              </motion.a>
              <motion.a 
                href="/shipping"
                whileHover={{ color: isDarkMode ? '#60a5fa' : '#2563eb' }}
                className="transition-colors hover:underline"
              >
                Shipping Policy
              </motion.a>
              <motion.a 
                href="/cancellation-refund"
                whileHover={{ color: isDarkMode ? '#60a5fa' : '#2563eb' }}
                className="transition-colors hover:underline"
              >
                Cancellation & Refund
              </motion.a>
            </div>
            
            {/* Scroll to Top Button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ y: 0, scale: 0.95 }}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-sm transition-colors flex items-center border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;