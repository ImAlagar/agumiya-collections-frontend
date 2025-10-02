// src/components/ui/hero/MobileHero.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useState } from 'react';
import { heroSlides } from '../../../utils/hero-data';
import { ArrowRight, ChevronLeft, ChevronRight, Instagram, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const MobileHero = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  const handleShopClick = () => {
    navigate('/shop');
  };

  // Instagram DM handler
  const handleInstagramDM = () => {
    // Replace with your actual Instagram username
    const instagramUsername = 'agumiya_collections'; // Change this to your Instagram username
    const instagramUrl = `https://instagram.com/${instagramUsername}`;
    
    // Open Instagram in new tab
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    
    // Optional: Show confirmation modal
    setShowCustomizationModal(true);
    setTimeout(() => setShowCustomizationModal(false), 3000);
  };

  return (
    <div className="relative bg-black h-screen overflow-hidden">
      {/* Custom Order Instagram DM Button - Fixed Bottom Right */}
      <motion.button
        onClick={handleInstagramDM}
        className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 
                   bg-gradient-to-r from-purple-600 to-pink-600 
                   hover:from-purple-700 hover:to-pink-700
                   text-white font-semibold py-2 px-3 
                   rounded-full shadow-2xl 
                   border border-white/20 
                   backdrop-blur-sm
                   transition-all duration-300 
                   group"
        whileHover={{ 
          scale: 1.05,
          y: -2,
          boxShadow: "0 10px 25px rgba(192, 132, 252, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 1 
        }}
      >
        {/* Instagram Icon */}
        <motion.div
          className="relative"
          whileHover={{ 
            rotate: [0, -10, 10, -5, 0],
            scale: 1.1
          }}
          transition={{ duration: 0.5 }}
        >
          <Instagram size={16} className="text-white" />
        </motion.div>
        
        {/* Message Icon with bounce animation */}
        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <MessageCircle size={14} className="text-white" />
        </motion.div>
        
        {/* Pulsing Ring Effect */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Customization Confirmation Modal */}
      <AnimatePresence>
        {showCustomizationModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-16 right-4 z-50 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white p-3 rounded-lg shadow-2xl 
                       border border-gray-200 dark:border-gray-600 
                       max-w-[180px] backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Instagram size={14} className="text-pink-600" />
              <span className="text-xs font-semibold">Instagram DM</span>
            </div>
            <p className="text-[10px] mt-1 text-gray-600 dark:text-gray-300 leading-tight">
              Opening Instagram... Message us for custom orders!
            </p>
            
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-gray-800 
                          border-r border-b border-gray-200 dark:border-gray-600 
                          transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900/20" />
      
      {/* Mobile-optimized Swiper */}
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={600}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !w-2 !h-2 !bg-white/60 !rounded-full !mx-1"></span>`;
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full flex flex-col">
              {/* Image Section - 60% of screen */}
              <div className="relative h-3/5">
                {/* Main Product Image */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <motion.img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-contain"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1 rounded-md text-xs font-bold"
                >
                  {slide.badge}
                </motion.div>
              </div>

              {/* Content Section - 40% of screen */}
              <div className="flex-1 bg-gradient-to-t from-black via-gray-900 to-black p-6">
                <div className="h-full flex flex-col justify-between">
                  {/* Text Content */}
                  <div className="text-center space-y-3">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`${slide.accentColor} font-semibold text-xs uppercase tracking-wider`}
                    >
                      {slide.subtitle}
                    </motion.span>
                    
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="font-bold text-white text-xl leading-tight"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-gray-300 text-sm leading-relaxed line-clamp-2"
                    >
                      {slide.description}
                    </motion.p>
                  </div>

                  {/* CTA Button */}
                  <motion.button 
                    onClick={handleShopClick}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full ${slide.buttonColor} text-white rounded-lg font-semibold px-6 py-3 mb-5 flex items-center gap-2 justify-center shadow-lg`}
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-white text-xs font-medium">
            {activeIndex + 1}/{heroSlides.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileHero;