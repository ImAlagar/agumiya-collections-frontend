import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const GlassCard = ({ children, className = '', hover3D = false }) => {
  const { theme } = useTheme();
  const cardRef = useRef(null);
  
  const getGlassStyle = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800/40 backdrop-blur-md border border-gray-700/50';
      case 'smokey':
        return 'bg-gray-700/50 backdrop-blur-md border border-gray-600/50';
      default:
        return 'bg-white/60 backdrop-blur-md border border-white/50';
    }
  };

  useEffect(() => {
    if (!hover3D || !cardRef.current) return;

    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = (x - centerX) / 25;
      const rotateX = (centerY - y) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hover3D]);

  return (
    <div 
      ref={cardRef}
      className={`${getGlassStyle()} rounded-2xl p-8 shadow-2xl transition-all duration-500 ${hover3D ? 'hover:shadow-2xl' : ''} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s ease, box-shadow 0.5s ease'
      }}
    >
      {children}
    </div>
  );
};