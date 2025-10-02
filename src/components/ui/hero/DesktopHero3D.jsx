// src/components/ui/hero/DesktopHero3D.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCube, Navigation, Pagination } from 'swiper/modules';
import { useRef, useState, useEffect } from 'react';
import { heroSlides } from '../../../utils/hero-data';
import '../../../styles/swiper-custom.css'
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Advanced3DCard from './Advanced3DCard';
import SlideContent from './SlideContent';
import { useNavigate } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

const DesktopHero3D = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTablet, setIsTablet] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showHoverMessage, setShowHoverMessage] = useState(false); // Add this state

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => ({ ...prev, [imageId]: true }));
  };

  // Animation variants for desktop
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
        duration: 0.6
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
        duration: 0.7
      }
    }
  };

  const handleShopClick = () => {
    navigate('/shop');
  };

  const handleLookbookClick = () => {
    navigate('/lookbook');
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
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Custom Order Instagram DM Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Hover Message */}
        <AnimatePresence>
          {showHoverMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-white p-3 rounded-lg shadow-2xl 
                         border border-gray-200 dark:border-gray-600 
                         max-w-[160px] backdrop-blur-sm mb-2"
            >
              <p className="text-xs font-medium text-center leading-tight">
                Open Instagram... Message us for custom orders and personalized designs!
              </p>
              
              {/* Arrow pointing to button */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-gray-800 
                            border-r border-b border-gray-200 dark:border-gray-600 
                            transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instagram DM Button */}
        <motion.button
          onClick={handleInstagramDM}
          onMouseEnter={() => setShowHoverMessage(true)}
          onMouseLeave={() => setShowHoverMessage(false)}
          className="flex items-center space-x-2 
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     hover:from-purple-700 hover:to-pink-700
                     text-white font-semibold py-3 px-4 
                     rounded-full shadow-2xl 
                     border border-white/20 
                     backdrop-blur-sm
                     transition-all duration-300 
                     group"
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: "0 20px 40px rgba(192, 132, 252, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            delay: 2 
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
            <Instagram size={20} className="text-white" />
          </motion.div>
          
          {/* Text */}
          <span className="text-sm font-medium whitespace-nowrap">
            Custom Order
          </span>
          
          {/* Message Icon */}
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <MessageCircle size={18} className="text-white" />
          </motion.div>
          
          {/* Pulsing Ring Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      </div>

      {/* Customization Confirmation Modal */}
      <AnimatePresence>
        {showCustomizationModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-6 z-50 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white p-4 rounded-lg shadow-2xl 
                       border border-gray-200 dark:border-gray-600 
                       max-w-xs backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Instagram size={16} className="text-pink-600" />
              <span className="text-sm font-semibold">Instagram DM</span>
            </div>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
              Opening Instagram... Message us for custom orders and personalized designs!
            </p>
            
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 
                          border-r border-b border-gray-200 dark:border-gray-600 
                          transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
            y: [10, -10, 10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
            animate={{
              y: [0, -60, 0],
              x: [0, Math.sin(i) * 40, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + i * 12}%`,
            }}
          />
        ))}
      </div>

      {/* 3D Cube Effect Swiper */}
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectCube, Navigation, Pagination]}
        effect={"cube"}
        speed={1000}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 30,
          shadowScale: 0.92,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            const isActive = index === activeIndex;
            return `
              <span class="${className} ${
                isActive ? 
                '!w-3 !h-3 !bg-white' : 
                '!w-2 !h-2 !bg-white/40'
              } !mx-1 !rounded-full transition-all duration-300" 
                style="transform: ${isActive ? 'scale(1.2)' : 'scale(1)'}">
              </span>`;
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-screen w-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="relative h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${slide.bgImage})`
              }}
            >
              <div className="relative z-10 px-6 lg:px-8 min-h-screen flex items-center pt-16 lg:pt-0">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 items-center">
                  
                  {/* Left Content */}
                  <div className="text-left">
                    <SlideContent
                      slide={slide}
                      activeIndex={activeIndex}
                      index={index}
                      containerVariants={containerVariants}
                      itemVariants={itemVariants}
                      titleVariants={titleVariants}
                      isMobile={false}
                      isTablet={isTablet}
                      onShopClick={handleShopClick}
                      onLookbookClick={handleLookbookClick}
                    />
                  </div>

                  {/* Right Content - 3D Card */}
                  <motion.div
                    key={`image-${slide.id}-${activeIndex}`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.85, 
                      rotateY: 180 
                    }}
                    animate={{ 
                      opacity: activeIndex === index ? 1 : 0, 
                      scale: activeIndex === index ? 1 : 0.85, 
                      rotateY: activeIndex === index ? 0 : 180
                    }}
                    transition={{ 
                      type: "spring",
                      damping: 20,
                      stiffness: 80,
                      delay: 0.2 
                    }}
                    className="flex justify-center"
                  >
                    <Advanced3DCard
                      slide={slide} 
                      loadedImages={loadedImages}
                      onImageLoad={handleImageLoad}
                      activeIndex={activeIndex}
                      index={index}
                      isMobile={false}
                      isTablet={isTablet}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DesktopHero3D;