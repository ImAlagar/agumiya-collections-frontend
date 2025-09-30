import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { GlassCard } from './GlassCard';
import { FloatingParticles } from './FloatingParticles';
import video from "../../../assets/videos/hero-background.mp4";

export const AboutHero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTextColor = () => {
    switch (theme) {
      case 'dark': return 'text-white';
      case 'smokey': return 'text-white';
      default: return 'text-gray-900';
    }
  };

  const getSubtitleColor = () => {
    switch (theme) {
      case 'dark': return 'text-gray-300';
      case 'smokey': return 'text-gray-200';
      default: return 'text-gray-600';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src={video} type="video/mp4" />
        <source src="/videos/hero-background.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Enhanced Overlay */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        theme === 'light' 
          ? 'bg-white/40 backdrop-blur-[1px]' 
          : theme === 'smokey'
            ? 'bg-black/60 backdrop-blur-[1px]'
            : 'bg-black/70 backdrop-blur-[1px]'
      }`}></div>

      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <GlassCard className="mb-8 transform hover:scale-105 transition-transform duration-500 backdrop-blur-lg">
          <h1 className={`text-7xl md:text-9xl font-black mb-4 tracking-tight ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-gray-900 via-red-600 to-gray-900' 
              : 'bg-gradient-to-r from-white via-red-400 to-white'
          } bg-clip-text text-transparent bg-size-200 animate-gradient`}>
            AGUMIYA
          </h1>
        </GlassCard>
        
        <div className="space-y-6">
          <p className={`text-3xl md:text-4xl font-light ${getSubtitleColor()} leading-relaxed backdrop-blur-sm px-4 py-2 rounded-lg`}>
            Fashion That Expresses YOU
          </p>
          
          <div className="flex justify-center items-center space-x-4 backdrop-blur-sm py-2 rounded-lg">
            <div className={`w-16 h-0.5 ${
              theme === 'light' ? 'bg-gray-800' : 'bg-white'
            }`} />
            <span className={`text-sm uppercase tracking-widest ${getSubtitleColor()}`}>Anime Inspired</span>
            <div className={`w-16 h-0.5 ${
              theme === 'light' ? 'bg-gray-800' : 'bg-white'
            }`} />
          </div>
          
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${getSubtitleColor()} backdrop-blur-sm px-6 py-3 rounded-lg`}>
            Where anime culture meets the latest fashion trends in unique, expressive designs
          </p>
        </div>
      </div>
    </section>
  );
};