import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { GlassCard } from './GlassCard';
import { Link } from 'react-router-dom';

export const WhyChooseUs = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getTextColor = () => {
    switch (theme) {
      case 'dark': return 'text-white';
      case 'smokey': return 'text-white';
      default: return 'text-gray-900';
    }
  };

  const features = [
    {
      icon: "🎨",
      title: "Original Anime-Inspired Designs",
      description: "Unique trending designs that blend anime culture with modern fashion",
      color: "from-red-500 to-pink-500",
      stats: "Exclusive"
    },
    {
      icon: "⭐",
      title: "Premium Quality & Comfort",
      description: "High-quality fabrics crafted with care for ultimate comfort and durability",
      color: "from-blue-500 to-cyan-500",
      stats: "Premium"
    },
    {
      icon: "💫",
      title: "Creative Community",
      description: "A brand built on creativity where your feedback shapes our collections",
      color: "from-purple-500 to-pink-500",
      stats: "Community"
    },
    {
      icon: "👂",
      title: "Your Voice Matters",
      description: "We value our fans' opinions—your feedback helps shape our future designs",
      color: "from-green-500 to-emerald-500",
      stats: "Feedback"
    },
    {
      icon: "🎯",
      title: "Be Unapologetically YOU",
      description: "Fashion that lets you express your true personality and stand out",
      color: "from-orange-500 to-red-500",
      stats: "Express"
    },
    {
      icon: "❤️",
      title: "Join Our Family",
      description: "Become part of the Agumiya family where style meets passion",
      color: "from-pink-500 to-rose-500",
      stats: "Family"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${getTextColor()}`}>
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Agumiya</span>?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Discover what makes Agumiya Collections the perfect choice for anime fans and fashion lovers alike
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <GlassCard 
                hover3D={true}
                className="group/card relative overflow-hidden h-full text-center transform transition-all duration-500"
                style={{
                  transform: activeCard === index ? 
                    'translateY(-12px) scale(1.03) rotateX(5deg) rotateY(2deg)' : 'none',
                  boxShadow: activeCard === index ? 
                    '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 30px rgba(239, 68, 68, 0.2)' : 'none'
                }}
              >
                {/* Animated background gradient on hover */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover/card:opacity-5 transition-opacity duration-500 rounded-2xl`}
                />
                
                {/* Floating particles on hover */}
                {activeCard === index && (
                  <>
                    <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full opacity-70 animate-ping" />
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-70 animate-ping delay-300" />
                    <div className="absolute top-4 right-4 w-1 h-1 bg-green-400 rounded-full opacity-70 animate-ping delay-700" />
                  </>
                )}

                {/* Animated border */}
                <div 
                  className={`absolute inset-0 rounded-2xl border-2 opacity-0 group-hover/card:opacity-100 transition-all duration-500`}
                  style={{
                    borderImage: `linear-gradient(45deg, ${feature.color.replace('from-', '').replace('to-', '').replace(' ', ', ')}) 1`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon with enhanced animation */}
                  <div 
                    className="text-5xl mb-4 transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-12"
                    style={{
                      filter: activeCard === index ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))' : 'none'
                    }}
                  >
                    {feature.icon}
                  </div>
                  
                  {/* Stats badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-200'
                    } group-hover/card:bg-gradient-to-r ${feature.color} group-hover/card:text-white transition-all duration-300`}>
                      {feature.stats}
                    </span>
                  </div>

                  {/* Title with gradient effect */}
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-500 ${getTextColor()} group-hover/card:bg-gradient-to-r ${feature.color} group-hover/card:bg-clip-text group-hover/card:text-transparent`}>
                    {feature.title}
                  </h3>

                  {/* Description with slide-up animation */}
                  <p className={`transition-all duration-500 transform ${
                    activeCard === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
                  } ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {feature.description}
                  </p>

                  {/* Hidden decorative elements that appear on hover */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-200" />
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 overflow-hidden">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/card:animate-shine" />
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section with 3D Effects */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <GlassCard 
            hover3D={true} 
            className="relative overflow-hidden group/cta max-w-4xl mx-auto"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse delay-500" />
            
            {/* Floating particles */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full opacity-60 animate-ping" />
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping delay-300" />

            <div className="relative z-10">
              <h3 className={`text-4xl font-bold mb-6 ${getTextColor()} group-hover/cta:bg-gradient-to-r group-hover/cta:from-red-500 group-hover/cta:to-pink-500 group-hover/cta:bg-clip-text group-hover/cta:text-transparent transition-all duration-500`}>
                Join the Agumiya Family Today
              </h3>
              <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              } dark:group-hover/cta:text-white light:group-hover/cta:text-black transition-colors duration-500`}>
                Explore a world where style meets passion. Because at Agumiya Collections, you don't just wear fashion—you live it.
              </p>
              <Link to={'/shop'}
                className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
                  theme === 'light' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700'
                } hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95 group/btn relative overflow-hidden`}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 overflow-hidden">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-shine" />
                </div>
                <span className="relative z-10">Shop Now</span>
              </Link>
            </div>

            {/* Background gradient animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </GlassCard>
        </div>
      </div>
    </section>
  );
};