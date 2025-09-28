// src/components/ui/hero/SlideContent.jsx
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Shield, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

const SlideContent = ({ 
  slide, 
  activeIndex, 
  index, 
  containerVariants, 
  itemVariants, 
  titleVariants, 
  isMobile, 
  isTablet,
  onShopClick,
  onLookbookClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeIndex === index) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, index]);

  if (!isVisible && activeIndex !== index) return null;

  // Button variants for different devices
  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 20 : 30,
      scale: isMobile ? 0.95 : 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: isMobile ? 20 : 15,
        stiffness: isMobile ? 120 : 100,
        duration: isMobile ? 0.6 : 0.8
      }
    },
    exit: {
      opacity: 0,
      y: isMobile ? 20 : 30,
      scale: isMobile ? 0.95 : 0.9,
      transition: {
        duration: 0.4
      }
    }
  };

  const featuresVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 15 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: isMobile ? 20 : 15,
        stiffness: isMobile ? 120 : 100,
        duration: isMobile ? 0.6 : 0.8
      }
    },
    exit: {
      opacity: 0,
      y: isMobile ? 15 : 20,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      key={`content-${slide.id}-${activeIndex}`}
      variants={containerVariants}
      initial="hidden"
      animate={activeIndex === index ? "visible" : "exit"}
      className={`space-y-4 lg:space-y-6 ${
        isMobile ? 'text-center mb-4' : 
        isTablet ? 'text-center lg:text-left lg:mb-32' : 
        'text-center lg:text-left lg:mb-52'
      }`}
    >
      {/* Subtitle */}
      <motion.div variants={itemVariants} className="space-y-3 lg:space-y-4">
        <motion.span
          variants={itemVariants}
          className={`${slide.accentColor} font-semibold tracking-widest ${
            isMobile ? 'text-xs' : 'text-xs lg:text-sm'
          } uppercase inline-flex items-center gap-2 ${
            isMobile || isTablet ? 'justify-center' : 'justify-center lg:justify-start'
          }`}
        >
          <motion.div 
            className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-current rounded-full`}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {slide.subtitle}
        </motion.span>
        
        {/* Responsive Title */}
        <motion.h1
          variants={titleVariants}
          className={`font-bold text-white leading-tight ${
            isMobile ? 'text-2xl sm:text-3xl' : 
            isTablet ? 'text-4xl lg:text-5xl' : 
            'text-4xl lg:text-5xl xl:text-6xl'
          }`}
        >
          {slide.title.split(' ').map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              className="inline-block mr-2 last:mr-0"
              variants={titleVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>

      {/* Responsive Description */}
      <motion.p
        variants={itemVariants}
        className={`text-gray-200 leading-relaxed ${
          isMobile ? 'text-sm max-w-xs mx-auto' : 
          isTablet ? 'text-base max-w-md mx-auto lg:mx-0' : 
          'text-base lg:text-lg max-w-lg mx-auto lg:mx-0'
        }`}
      >
        {slide.description}
      </motion.p>

      {/* Responsive Buttons */}
      <motion.div
        variants={buttonVariants}
        className={`flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4 lg:pt-6 ${
          isMobile || isTablet ? 'justify-center' : 'justify-center lg:justify-start'
        }`}
      >
        <motion.button 
        onClick={onShopClick}
          whileHover={{ 
            scale: isMobile ? 1.02 : 1.05,
            backgroundColor: "#f8fafc",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
          className={`bg-white text-black rounded-full font-bold transition-all duration-300 flex items-center gap-2 lg:gap-3 group shadow-2xl relative overflow-hidden ${
            isMobile ? 'px-5 py-2.5 text-sm' : 'px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base'
          }`}
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%]"
            whileHover={{ translateX: "200%" }}
            transition={{ duration: 0.8 }}
          />
          Shop Collection
          <ArrowRight className={`${
            isMobile ? 'w-3 h-3' : 'w-4 h-4 lg:w-5 lg:h-5'
          } group-hover:translate-x-1 transition-transform`} />
        </motion.button>
        
        <motion.button 
        onClick={onLookbookClick}
          whileHover={{ 
            scale: isMobile ? 1.02 : 1.05,
            backgroundColor: "rgba(255,255,255,0.1)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
          className={`border border-white text-white rounded-full font-bold transition-all duration-300 flex items-center gap-2 lg:gap-3 group ${
            isMobile ? 'px-5 py-2.5 text-sm' : 'px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base'
          }`}
        >
          <Play className={isMobile ? 'w-3 h-3' : 'w-4 h-4 lg:w-5 lg:h-5'} />
          View Lookbook
        </motion.button>
      </motion.div>

      {/* Responsive Features */}
      <motion.div
        variants={featuresVariants}
        className={`grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8 ${
          isMobile ? 'max-w-xs' : 'max-w-md'
        } mx-auto lg:mx-0`}
      >
        {[
          { icon: Truck, text: "Free Shipping" },
          { icon: Shield, text: "2 Year Warranty" },
          { icon: Star, text: "Premium Quality" }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            className="flex items-center gap-2 lg:gap-3 justify-center lg:justify-start"
            whileHover={{ scale: isMobile ? 1.02 : 1.05, x: isMobile ? 3 : 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <item.icon className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4 lg:w-5 lg:h-5 text-white"} />
            </motion.div>
            <span className={`text-white font-medium ${
              isMobile ? 'text-xs' : 'text-xs lg:text-sm'
            }`}>{item.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SlideContent;