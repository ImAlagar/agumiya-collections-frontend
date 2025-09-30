import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { GlassCard } from './GlassCard';

export const MissionSection = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getTextColor = () => {
    switch (theme) {
      case 'dark': return 'text-white';
      case 'smokey': return 'text-white';
      default: return 'text-gray-900';
    }
  };

  const getSecondaryColor = () => {
    switch (theme) {
      case 'dark': return 'text-gray-300';
      case 'smokey': return 'text-gray-200';
      default: return 'text-gray-600';
    }
  };

  const commitmentItems = [
    {
      title: "Original Designs",
      description: "Unique anime-inspired and trending fashion designs you won't find anywhere else",
      color: "from-red-500 to-pink-500",
      icon: "🎨",
      stats: "100% Unique"
    },
    {
      title: "Premium Quality",
      description: "High-quality fabrics and careful craftsmanship for ultimate comfort and durability",
      icon: "⭐",
      color: "from-blue-500 to-cyan-500",
      stats: "Premium Materials"
    },
    {
      title: "Creative Community",
      description: "A brand built on creativity where your feedback helps shape our collections",
      icon: "👥",
      color: "from-purple-500 to-pink-500",
      stats: "Community Driven"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div>
              <span className={`text-sm uppercase tracking-widest font-semibold ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>Our Story</span>
              <h2 className={`text-5xl md:text-6xl font-bold mt-4 mb-6 ${getTextColor()}`}>
                More Than <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Clothing</span>
              </h2>
            </div>
            
            <GlassCard hover3D={true} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <p className={`text-xl leading-relaxed ${getSecondaryColor()} mb-6 relative z-10`}>
                At <strong className={getTextColor()}>Agumiya Collections</strong>, we believe fashion should be more than just clothing—it's a way to express your personality, stay on trend, and have fun with style.
              </p>
              
              <p className={`text-lg leading-relaxed ${getSecondaryColor()} mb-6 relative z-10`}>
                Born from a love for anime culture and the latest fashion trends, our brand blends unique designs, high-quality fabrics, and modern style that helps you stand out. Every piece in our collection is crafted with care, keeping comfort, originality, and self-expression at its core.
              </p>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { icon: "❤️", text: "Anime Culture", subtext: "Inspired Designs" },
                  { icon: "👕", text: "Trending Fashion", subtext: "Latest Styles" },
                  { icon: "💫", text: "Self-Expression", subtext: "Be Yourself" },
                  { icon: "🎯", text: "Quality Focus", subtext: "Premium Fabrics" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col p-4 rounded-xl transition-all duration-500 hover:scale-105 group/item ${
                      theme === 'light' ? 'bg-white/50' : 'bg-gray-800/30'
                    } hover:bg-gradient-to-br hover:from-red-500/10 hover:to-pink-500/10`}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className={`font-semibold ${getTextColor()}`}>{item.text}</span>
                    </div>
                    <span className={`text-sm ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {item.subtext}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Content */}
          <div className={`space-y-6 transition-all duration-1000 delay-500 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <GlassCard hover3D={true} className="group relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              
              <h3 className={`text-3xl font-bold mb-8 ${getTextColor()} relative z-10`}>
                Our Mission
              </h3>
              
              <p className={`text-lg leading-relaxed ${getSecondaryColor()} mb-8 relative z-10`}>
                To create apparel and accessories that are fashionable, inspiring, and personal—whether you're an anime fan, a trendsetter, or someone who just loves stylish, standout pieces.
              </p>
              
              <div className="space-y-6 relative z-10">
                {commitmentItems.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl transition-all duration-500 group/item ${
                      theme === 'light' ? 'bg-white/50' : 'bg-gray-800/30'
                    } hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 border-2 border-transparent hover:border-white/20`}
                    style={{
                      transform: activeCard === index + 4 ? 'translateY(-8px) scale(1.02)' : 'none',
                      boxShadow: activeCard === index + 4 ? 
                        '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)' : 'none'
                    }}
                    onMouseEnter={() => setActiveCard(index + 4)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-3xl mr-4 group-hover/item:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <h4 className={`text-xl font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.title}
                        </h4>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-200'
                      }`}>
                        {item.stats}
                      </span>
                    </div>
                    <p className={getSecondaryColor()}>{item.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};