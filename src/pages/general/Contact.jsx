import { useTheme } from "../../contexts/ThemeContext";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { CONTACT_INFO, SOCIAL_LINKS } from "../../utils/constants";
import { 
  Clock, 
  CheckCircle, 
  Send, 
  MessageCircle, 
  Calendar, 
  ExternalLink 
} from "lucide-react";

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSmokey = theme === 'smokey';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleScheduleCall = () => {
    window.open('https://calendly.com/agumiyacollections', '_blank');
  };

  // Theme-based background colors
  const getBackgroundColor = () => {
    switch (theme) {
      case 'dark': return "bg-gray-900";
      case 'smokey': return "bg-gray-800";
      default: return "bg-gray-50";
    }
  };

  const getCardBackground = () => {
    switch (theme) {
      case 'dark': return "bg-gray-800";
      case 'smokey': return "bg-gray-750";
      default: return "bg-white";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case 'dark': return "text-white";
      case 'smokey': return "text-gray-100";
      default: return "text-gray-800";
    }
  };

  const getSecondaryTextColor = () => {
    switch (theme) {
      case 'dark': return "text-gray-300";
      case 'smokey': return "text-gray-400";
      default: return "text-gray-600";
    }
  };

  const getBorderColor = () => {
    switch (theme) {
      case 'dark': return "border-gray-700";
      case 'smokey': return "border-gray-600";
      default: return "border-gray-200";
    }
  };

  const getInputBackground = () => {
    switch (theme) {
      case 'dark': return "bg-gray-700";
      case 'smokey': return "bg-gray-700";
      default: return "bg-gray-50";
    }
  };

  const getInputBorder = () => {
    switch (theme) {
      case 'dark': return "border-gray-600";
      case 'smokey': return "border-gray-600";
      default: return "border-gray-300";
    }
  };

  return (
    <section
      id='contact'
      ref={sectionRef}
      className={`py-6 px-6 relative overflow-hidden ${getBackgroundColor()}`}
    >
      {/* Animated background elements */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Geometric grid pattern */}
        <div className={`absolute inset-0 opacity-10 ${
          isDark || isSmokey ? "bg-grid-white/[0.05]" : "bg-grid-gray-900/[0.03]"
        } bg-[size:60px_60px]`} />
        
        {/* Floating shapes */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut"
          }}
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${
            isDark || isSmokey ? "bg-purple-900/20" : "bg-purple-200/50"
          } blur-3xl rotate-45`}
        />
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7,
            ease: "easeInOut",
            delay: 0.5
          }}
          className={`absolute bottom-1/3 right-1/4 w-48 h-48 ${
            isDark || isSmokey ? "bg-blue-900/20" : "bg-blue-200/50"
          } blur-3xl rounded-full`}
        />
      </motion.div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-4xl md:text-5xl font-bold text-center mb-4 ${getTextColor()}`}
        >
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Touch</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-lg text-center max-w-2xl mx-auto mb-4 ${getSecondaryTextColor()}`}
        >
          We're here to help! Contact our customer support team for any questions about your order, products, or styling advice.
        </motion.p>
        
        {/* Quick response notice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`flex items-center justify-center space-x-2 mb-16 ${
            isDark || isSmokey ? "text-purple-400" : "text-purple-600"
          }`}
        >
          <Clock size={18} />
          <span className="font-medium">Average response time: 2 hours</span>
        </motion.div>

        {/* Unique Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Contact Info (Span 5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Service Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              className={`p-6 relative overflow-hidden rounded-2xl ${
                isDark || isSmokey
                  ? "bg-gradient-to-br from-purple-900/30 to-blue-900/30" 
                  : "bg-gradient-to-br from-purple-50 to-blue-50"
              } shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className={`p-2 rounded-full ${
                    isDark || isSmokey ? "bg-green-900/30" : "bg-green-100"
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 ${isDark || isSmokey ? "text-green-400" : "text-green-600"}`} />
                </motion.div>
                <div>
                  <h3 className={`font-semibold ${getTextColor()}`}>
                    Customer Support Active
                  </h3>
                  <p className={`text-sm ${getSecondaryTextColor()}`}>
                    Our team is available 24/7 to assist you with any inquiries
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-2xl font-semibold mb-2 ${getTextColor()}`}
            >
              Contact Information
            </motion.h3>
            
            {/* Contact info items in a staggered grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONTACT_INFO.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl group cursor-pointer ${
                    isDark || isSmokey
                      ? "bg-gray-800 hover:bg-gray-750" 
                      : "bg-white hover:bg-gray-50"
                  } shadow-md hover:shadow-lg transition-all`}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`p-3 rounded-full relative overflow-hidden ${
                        isDark || isSmokey
                          ? "bg-gray-700 group-hover:bg-purple-900/30" 
                          : "bg-gray-100 group-hover:bg-purple-100"
                      } transition-all`}
                    >
                      <motion.div 
                        className={`absolute inset-0 rounded-full ${
                          isDark || isSmokey ? "bg-purple-500/20" : "bg-purple-400/20"
                        }`}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <item.icon className={`w-5 h-5 relative z-10 ${
                        isDark || isSmokey ? "text-purple-400" : "text-purple-600"
                      }`} />
                    </motion.div>
                    <div>
                      <p className={`font-medium ${getTextColor()}`}>
                        {item.label}
                      </p>
                      <p className={getSecondaryTextColor()}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Social links */}
            <div className="pt-4">
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`text-lg font-medium mb-4 ${getTextColor()}`}
              >
                Follow Our Fashion Journey
              </motion.h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {SOCIAL_LINKS.map((social, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    onHoverStart={() => setHoveredSocial(index)}
                    onHoverEnd={() => setHoveredSocial(null)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <motion.a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl relative overflow-hidden ${
                        isDark || isSmokey
                          ? "bg-gray-800 text-white hover:bg-gray-700" 
                          : "bg-white hover:bg-gray-100"
                      } shadow-md hover:shadow-lg transition-all ${social.color} block`}
                      style={{ transformStyle: 'preserve-3d' }}
                      aria-label={social.name}
                    >
                      <motion.div 
                        className={`absolute inset-0 rounded-xl ${social.bgcolor}`}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <social.icon size={22} className="relative z-10 mb-1" />
                      <span className="relative z-10 text-xs font-medium">
                        {social.name}
                      </span>
                    </motion.a>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className={`mt-8 text-sm flex items-center justify-center text-center ${getSecondaryTextColor()}`}
              >
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mr-1"
                >
                  <ExternalLink size={14} />
                </motion.span>
                Follow us for the latest fashion trends and exclusive offers
              </motion.p>
            </div>
          </motion.div>

          {/* Middle Column - Decorative Element (Span 2 columns) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block lg:col-span-2 relative"
          >
            {/* Vertical connecting line */}
            <div className={`absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 ${
              isDark || isSmokey 
                ? "bg-gradient-to-b from-purple-500/30 via-blue-500/30 to-cyan-500/30" 
                : "bg-gradient-to-b from-purple-400/30 via-blue-400/30 to-cyan-400/30"
            }`} />
            
            {/* Floating orbs along the line */}
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.5 + i * 0.2,
                }}
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                  isDark || isSmokey ? "bg-purple-500/80" : "bg-purple-400/80"
                }`}
                style={{ top: `${25 + i * 15}%` }}
              />
            ))}
          </motion.div>

          {/* Right Column - Contact Form (Span 5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            ref={formRef}
            className={`p-8 rounded-2xl shadow-xl lg:col-span-5 ${getCardBackground()}`}
            style={{
              backgroundImage: isDark || isSmokey
                ? `linear-gradient(to bottom right, rgba(17, 24, 39, 0.8), rgba(55, 65, 81, 0.8)), 
                   radial-gradient(circle at 20% 80%, rgba(76, 29, 149, 0.15), transparent 40%),
                   radial-gradient(circle at 80% 20%, rgba(49, 46, 129, 0.15), transparent 40%)`
                : `linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.9)),
                   radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.1), transparent 40%),
                   radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1), transparent 40%)`
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label 
                  htmlFor="name" 
                  className={`block mb-2 font-medium ${getTextColor()}`}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:border-transparent transition-all ${
                    getInputBackground()} ${getInputBorder()} ${getTextColor()}`}
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label 
                  htmlFor="email" 
                  className={`block mb-2 font-medium ${getTextColor()}`}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:border-transparent transition-all ${
                    getInputBackground()} ${getInputBorder()} ${getTextColor()}`}
                  placeholder="Enter your email address"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <label 
                  htmlFor="subject" 
                  className={`block mb-2 font-medium ${getTextColor()}`}
                >
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:border-transparent transition-all ${
                    getInputBackground()} ${getInputBorder()} ${getTextColor()}`}
                >
                  <option value="">Select inquiry type</option>
                  <option value="order-support">Order Support</option>
                  <option value="product-info">Product Information</option>
                  <option value="shipping">Shipping Inquiry</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label 
                  htmlFor="message" 
                  className={`block mb-2 font-medium ${getTextColor()}`}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:border-transparent transition-all ${
                    getInputBackground()} ${getInputBorder()} ${getTextColor()}`}
                  placeholder="Please describe your inquiry in detail..."
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all disabled:opacity-80"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </motion.button>

              {/* Success message */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 mt-4 rounded-lg ${
                    isDark || isSmokey 
                      ? "bg-green-900/30 border border-green-800" 
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <p className={`flex items-center space-x-2 ${
                    isDark || isSmokey ? "text-green-400" : "text-green-700"
                  }`}>
                    <MessageCircle size={18} />
                    <span>Thank you! Our team will get back to you within 2 hours.</span>
                  </p>
                </motion.div>
              )}

              {/* Quick call CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 }}
                className={`pt-6 mt-6 border-t ${getBorderColor()}`}
              >
                <div className="text-center">
                  <p className={`mb-3 ${getSecondaryTextColor()}`}>
                    <span className="font-medium">Need immediate assistance?</span>
                    <span className="block text-sm mt-1">
                      Schedule a callback with our fashion consultants.
                    </span>
                  </p>
                  <motion.button
                    type="button"
                    onClick={handleScheduleCall}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg font-medium bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
                  >
                    <Calendar size={18} />
                    <span>Schedule a Callback</span>
                  </motion.button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;