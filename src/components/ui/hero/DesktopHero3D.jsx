// src/components/ui/hero/DesktopHero3D.jsx
import { motion } from 'framer-motion';
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

const DesktopHero3D = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTablet, setIsTablet] = useState(false);

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

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
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