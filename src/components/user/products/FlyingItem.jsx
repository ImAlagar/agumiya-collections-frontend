// src/components/user/products/FlyingItem.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const FlyingItem = ({ 
  startPosition, 
  endPosition, 
  image, 
  onComplete,
  size = 50 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{
        x: startPosition.x - size / 2,
        y: startPosition.y - size / 2,
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        x: endPosition.x - size / 2,
        y: endPosition.y - size / 2,
        scale: 0.3,
        opacity: 0, // Changed from multiple values to single value
      }}
      transition={{
        type: "spring",
        mass: 1,
        stiffness: 100,
        damping: 15,
        duration: 1.5,
      }}
      className="fixed z-50 pointer-events-none"
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      }}
    >
      {/* Main product image */}
      <motion.img
        src={image}
        alt="Flying item"
        className="w-full h-full object-cover rounded-full border-2 border-white bg-white"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, // Simplified from multiple values
          rotate: 360, // Single rotation value
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
      />
      
      {/* Pulsing glow effect - fixed with tween animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500/30 blur-md"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: 2,
          opacity: 0,
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
      />
      
      {/* Trail effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-200/20"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default FlyingItem;