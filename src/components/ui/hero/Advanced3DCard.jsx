// src/components/ui/hero/Advanced3DCard.jsx
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Advanced3DCard = ({ slide, loadedImages, onImageLoad, activeIndex, index, isMobile, isTablet }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], isMobile ? [3, -3] : isTablet ? [8, -8] : [15, -15]), {
    damping: 25,
    stiffness: 100
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], isMobile ? [-3, 3] : isTablet ? [-8, 8] : [-15, 15]), {
    damping: 25,
    stiffness: 100
  });
  
  const scale = useSpring(1.02, {
    damping: 25,
    stiffness: 100
  });

  const handleMouseMove = (event) => {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPos = (mouseX / width - 0.5) * 200;
    const yPos = (mouseY / height - 0.5) * 200;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    scale.set(1.02);
  };

  // Card size based on device
  const cardSize = isMobile ? 'max-w-xs' : isTablet ? 'max-w-md' : 'max-w-lg';

  return (
    <div className={`relative mb-24 group w-full ${cardSize} perspective-1000 ${isMobile ? 'mt-4' : isTablet ? 'mt-6' : ''}`}>
      {/* Loading Skeleton */}
      {!loadedImages[slide.id] && (
        <div className={`w-full ${
          isMobile ? 'h-56' : 
          isTablet ? 'h-72' : 
          'h-96 xl:h-[500px]'
        } bg-gray-800 rounded-2xl lg:rounded-3xl animate-pulse`} />
      )}
      
      {/* Main 3D Card */}
      <motion.div
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale: isMobile ? 1 : scale,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="relative z-10 cursor-grab active:cursor-grabbing"
      >
        {/* Card with enhanced 3D effects */}
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
          {/* Main Image */}
          <motion.img
            src={slide.image}
            alt={slide.title}
            onLoad={() => onImageLoad(slide.id)}
            className={`w-full rounded-2xl lg:rounded-3xl transition-all duration-500 ${
              loadedImages[slide.id] 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}
            style={{
              transform: isMobile ? 'translateZ(15px)' : isTablet ? 'translateZ(25px)' : 'translateZ(40px)',
            }}
          />
          
          {/* 3D Depth Effect Layers */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            style={{
              transform: isMobile ? 'translateZ(10px)' : isTablet ? 'translateZ(20px)' : 'translateZ(30px)',
            }}
          />
          
          {/* Responsive Floating Badge */}
          <motion.div
            key={`badge-${slide.id}-${activeIndex}`}
            initial={{ scale: 0, rotate: -45, y: 50 }}
            animate={activeIndex === index ? { 
              scale: 1, 
              rotate: isMobile ? 8 : isTablet ? 12 : 15, 
              y: 0 
            } : { scale: 0, rotate: -45, y: 50 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: isMobile ? 0.3 : isTablet ? 0.5 : 0.8 
            }}
            whileHover={{ 
              scale: isMobile ? 1.05 : 1.1,
              rotate: isMobile ? 12 : isTablet ? 18 : 25,
              transition: { type: "spring", stiffness: 300 }
            }}
            className={`absolute -top-3 -right-3 lg:-top-6 lg:-right-6 ${
              isMobile ? 'w-12 h-12' : 
              isTablet ? 'w-16 h-16' : 
              'w-20 h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32'
            } bg-gradient-to-br from-red-500 to-pink-600 rounded-lg lg:rounded-2xl rotate-12 shadow-2xl overflow-hidden`}
            style={{
              transform: isMobile ? 'translateZ(20px)' : isTablet ? 'translateZ(35px)' : 'translateZ(60px)',
            }}
          >
            <div className={`absolute inset-0 flex items-center justify-center text-white font-bold text-center ${
              isMobile ? 'text-xs p-1' : 
              isTablet ? 'text-xs p-2' : 
              'text-xs lg:text-sm p-1 lg:p-2'
            }`}>
              {slide.badge}
            </div>
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              animate={{ x: ['0%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
          
          {/* Responsive Discount Tag */}
          <motion.div
            key={`discount-${slide.id}-${activeIndex}`}
            initial={{ scale: 0, rotate: 45, y: 50 }}
            animate={activeIndex === index ? { 
              scale: 1, 
              rotate: isMobile ? -8 : isTablet ? -12 : -15, 
              y: 0 
            } : { scale: 0, rotate: 45, y: 50 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: isMobile ? 0.4 : isTablet ? 0.6 : 1 
            }}
            whileHover={{ 
              scale: isMobile ? 1.05 : 1.1,
              rotate: isMobile ? -12 : isTablet ? -18 : -25,
              transition: { type: "spring", stiffness: 300 }
            }}
            className={`absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 ${
              isMobile ? 'w-10 h-10' : 
              isTablet ? 'w-14 h-14' : 
              'w-16 h-16 lg:w-20 lg:h-20 xl:w-28 xl:h-28'
            } bg-black/80 border border-white/20 lg:border-2 rounded-lg lg:rounded-2xl -rotate-12 shadow-2xl overflow-hidden`}
            style={{
              transform: isMobile ? 'translateZ(20px)' : isTablet ? 'translateZ(35px)' : 'translateZ(60px)',
            }}
          >
            <div className={`absolute inset-0 flex items-center justify-center p-1 ${
              isMobile ? 'text-xs' : 'text-xs lg:text-sm'
            }`}>
              <span className="text-white font-bold text-center">
                {slide.discount}
              </span>
            </div>
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 border border-yellow-400/50 lg:border-2 rounded-lg lg:rounded-2xl"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Enhanced Reflection Effect - Only on desktop */}
        {!isMobile && !isTablet && (
          <motion.div
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-4/5 h-16 bg-gradient-to-t from-black/60 to-transparent blur-xl opacity-60"
            style={{
              transform: 'translateX(-50%) translateZ(-20px) rotateX(85deg)',
              transformStyle: 'preserve-3d',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Floating Particles around the card - Optimized for mobile */}
      {[...Array(isMobile ? 1 : isTablet ? 2 : 3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'} bg-white/50 rounded-full`}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(i) * (isMobile ? 10 : isTablet ? 15 : 20), 0],
            opacity: [0, 1, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            left: `${15 + i * (isMobile ? 35 : isTablet ? 25 : 25)}%`,
            top: `${5 + i * (isMobile ? 25 : isTablet ? 15 : 15)}%`,
          }}
        />
      ))}
    </div>
  );
};

export default Advanced3DCard;