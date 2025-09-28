// src/components/ui/hero/HeroSlider3D.jsx
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCube, Navigation, Pagination } from 'swiper/modules';
import { useRef, useState, useEffect } from 'react';

// Import hero slides data
import { heroSlides } from '../../../utils/hero-data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Advanced3DCard from './Advanced3DCard';
import SlideContent from './SlideContent';
import { useNavigate } from 'react-router-dom';

const HeroSlider3D = () => {
  const navigate = useNavigate(); // Add this hook
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
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

  // Enhanced animation variants for all devices
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: isMobile ? 0.1 : 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: isMobile ? -20 : -50,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: isMobile ? 25 : 20,
        stiffness: isMobile ? 120 : 100,
        duration: isMobile ? 0.6 : 0.8
      }
    },
    exit: {
      opacity: 0,
      x: isMobile ? 20 : 50,
      filter: "blur(8px)",
      transition: {
        duration: 0.4
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? -20 : -40,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: isMobile ? 25 : 20,
        stiffness: isMobile ? 120 : 100,
        duration: isMobile ? 0.6 : 0.8
      }
    },
    exit: {
      opacity: 0,
      y: isMobile ? 20 : 40,
      filter: "blur(8px)",
      transition: {
        duration: 0.4
      }
    }
  };

  // Add navigation handlers
  const handleShopClick = () => {
    navigate('/shop');
  };

  const handleLookbookClick = () => {
    navigate('/lookbook');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Enhanced Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl sm:blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            x: isMobile ? [-10, 10, -10] : [-20, 20, -20],
          }}
          transition={{
            duration: isMobile ? 6 : 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl sm:blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.2, 0.6],
            y: isMobile ? [10, -10, 10] : [20, -20, 20],
          }}
          transition={{
            duration: isMobile ? 8 : 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Optimized floating particles for mobile */}
        {[...Array(isMobile ? 2 : isTablet ? 4 : 6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1 sm:w-2 sm:h-2'} bg-white/30 rounded-full`}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.sin(i) * (isMobile ? 20 : isTablet ? 40 : 60), 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${15 + i * (isMobile ? 25 : isTablet ? 20 : 15)}%`,
              top: `${20 + i * (isMobile ? 20 : isTablet ? 12 : 10)}%`,
            }}
          />
        ))}
      </div>

      {/* Responsive 3D Cube Effect Swiper */}
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectCube, Navigation, Pagination]}
        effect={isMobile ? "slide" : "cube"}
        speed={isMobile ? 800 : 1200}
        autoplay={{
          delay: isMobile ? 4000 : 5000,
          disableOnInteraction: false,
        }}
        cubeEffect={!isMobile ? {
          shadow: true,
          slideShadows: true,
          shadowOffset: isTablet ? 20 : 40,
          shadowScale: isTablet ? 0.92 : 0.94,
        } : undefined}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            const isActive = index === activeIndex;
            return `
              <span class="${className} ${isActive ? '!w-3 !h-3 !bg-white' : '!w-2 !h-2 !bg-white/50'} 
                !mx-1 !rounded-full transition-all duration-300 hover:!bg-white" 
                style="transform: ${isActive ? 'scale(1.5)' : 'scale(1)'}">
              </span>`;
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-screen w-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {/* Background Image Container */}
            <div 
              className="relative h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${slide.bgImage})`
              }}
            >
              <div className="relative z-10 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-16 lg:pt-0">
                {/* Responsive Grid Layout */}
                <div className={`grid ${
                  isMobile ? 'grid-cols-1 gap-4' : 
                  isTablet ? 'grid-cols-1 lg:grid-cols-2 gap-6' : 
                  'grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12'
                } items-center max-w-7xl mx-auto w-full`}>
                  
                  {/* Left Content - Mobile First Approach */}
                  <SlideContent
                    slide={slide}
                    activeIndex={activeIndex}
                    index={index}
                    containerVariants={containerVariants}
                    itemVariants={itemVariants}
                    titleVariants={titleVariants}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  onShopClick={handleShopClick} // Pass handlers
                  onLookbookClick={handleLookbookClick} // Pass handlers
                  />

                  {/* Right Content - Optimized 3D Card for all devices */}
                  <motion.div
                    key={`image-${slide.id}-${activeIndex}`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      rotateY: isMobile ? 0 : 180 
                    }}
                    animate={{ 
                      opacity: activeIndex === index ? 1 : 0, 
                      scale: activeIndex === index ? 1 : 0.8, 
                      rotateY: activeIndex === index ? 0 : (isMobile ? 0 : 180)
                    }}
                    transition={{ 
                      type: "spring",
                      damping: isMobile ? 25 : 20,
                      stiffness: isMobile ? 100 : 80,
                      delay: isMobile ? 0 : isTablet ? 0.2 : 0.3 
                    }}
                    className={`relative flex justify-center ${
                      isMobile ? 'order-first mb-6' : 
                      isTablet ? 'order-last mt-8' : 
                      'order-last'
                    }`}
                  >
                    <Advanced3DCard
                      slide={slide} 
                      loadedImages={loadedImages}
                      onImageLoad={handleImageLoad}
                      activeIndex={activeIndex}
                      index={index}
                      isMobile={isMobile}
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

export default HeroSlider3D;