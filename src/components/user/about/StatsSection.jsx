import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { GlassCard } from './GlassCard';

export const StatsSection = () => {
  const { theme } = useTheme();
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hoveredStat, setHoveredStat] = useState(null);
  const targetValues = [10000, 500, 45, 98];
  const statsRef = useRef(null);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = targetValues.map((target, index) => {
      let currentStep = 0;
      
      return setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(target * easeOutQuart);
        
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = currentValue;
          return newCounters;
        });

        if (currentStep === steps) {
          clearInterval(intervals[index]);
        }
      }, stepDuration);
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  const getStatColor = () => {
    switch (theme) {
      case 'dark': return 'text-white';
      case 'smokey': return 'text-white';
      default: return 'text-gray-900';
    }
  };

  const stats = [
    { 
      number: counters[0], 
      suffix: "+", 
      label: "Happy Customers", 
      icon: "😊",
      color: "from-red-500 to-pink-500",
      description: "Fans expressing their style"
    },
    { 
      number: counters[1], 
      suffix: "+", 
      label: "Unique Designs", 
      icon: "🎨",
      color: "from-blue-500 to-cyan-500",
      description: "Anime-inspired creations"
    },
    { 
      number: counters[2], 
      suffix: "+", 
      label: "Community Members", 
      icon: "👥",
      color: "from-green-500 to-emerald-500",
      description: "Active fashion community"
    },
    { 
      number: counters[3], 
      suffix: "%", 
      label: "Satisfaction Rate", 
      icon: "⭐",
      color: "from-purple-500 to-pink-500",
      description: "Happy with their style"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <GlassCard hover3D={true} className="relative overflow-hidden">
          {/* Interactive background */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse delay-500" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group p-6 transition-all duration-500 relative"
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  transform: hoveredStat === index ? 
                    'translateY(-10px) scale(1.05)' : 'none',
                  zIndex: hoveredStat === index ? 10 : 1
                }}
              >
                {/* Hover effect background */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Animated border */}
                <div 
                  className={`absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  style={{
                    borderImage: `linear-gradient(45deg, ${stat.color.replace('from-', '').replace('to-', '').replace(' ', ', ')}) 1`,
                    boxShadow: hoveredStat === index ? 
                      '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                />

                <div className="relative z-10">
                  <div className="text-4xl mb-4 opacity-70 group-hover:scale-110 transition-transform duration-500 group-hover:animate-bounce">
                    {stat.icon}
                  </div>
                  
                  <div className={`text-4xl font-bold mb-2 transition-colors duration-500 ${getStatColor()} group-hover:bg-gradient-to-r ${stat.color} group-hover:bg-clip-text group-hover:text-transparent`}>
                    {stat.number}{stat.suffix}
                  </div>
                  
                  <div className={`font-semibold mb-2 transition-colors duration-500 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  } group-hover:text-white`}>
                    {stat.label}
                  </div>
                  
                  <div className={`text-sm transition-all duration-500 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {stat.description}
                  </div>
                </div>

                {/* Floating particles on hover */}
                {hoveredStat === index && (
                  <>
                    <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-full opacity-70 animate-ping" />
                    <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-70 animate-ping delay-300" />
                  </>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};