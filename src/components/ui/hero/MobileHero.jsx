// src/components/ui/hero/MobileHero.jsx
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useState } from 'react';
import { heroSlides } from '../../../utils/hero-data';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const MobileHero = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <div className="relative bg-black h-screen overflow-hidden">
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