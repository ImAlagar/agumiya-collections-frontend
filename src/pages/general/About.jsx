import React, { useState, useEffect, useRef } from 'react';
import { SEO } from '../../contexts/SEOContext';
import { useTheme } from '../../contexts/ThemeContext';


// Floating Particles Component (unchanged)
const FloatingParticles = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const getParticleColor = () => {
    switch (theme) {
      case 'dark': return 'rgba(255, 255, 255, 0.1)';
      case 'smokey': return 'rgba(255, 255, 255, 0.15)';
      default: return 'rgba(0, 0, 0, 0.08)';
    }
  };

  return (
    <div className="absolute inset-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: getParticleColor(),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Glass Morphism Card with 3D Effects
const GlassCard = ({ children, className = '', hover3D = false }) => {
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

const AboutHero = () => {
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
        {/* Fashion-related Unsplash videos */}
        <source
          src="https://player.vimeo.com/external/448381091.hd.mp4?s=8c8c9c36c8f104907c3e2d4d7b3a5a5e5c5d5c5d&profile_id=175"
          type="video/mp4"
        />
        <source
          src="https://player.vimeo.com/external/469868400.hd.mp4?s=6e9c89c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8&profile_id=175"
          type="video/mp4"
        />
        <source
          src="https://player.vimeo.com/external/444258381.hd.mp4?s=8c8c9c36c8f104907c3e2d4d7b3a5a5e5c5d5c5d&profile_id=175"
          type="video/mp4"
        />
        {/* Backup local video */}
        <source src="/videos/ecommerce-backup.mp4" type="video/mp4" />
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
            Redefining Fashion Excellence
          </p>
          
          <div className="flex justify-center items-center space-x-4 backdrop-blur-sm py-2 rounded-lg">
            <div className={`w-16 h-0.5 ${
              theme === 'light' ? 'bg-gray-800' : 'bg-white'
            }`} />
            <span className={`text-sm uppercase tracking-widest ${getSubtitleColor()}`}>Since 2024</span>
            <div className={`w-16 h-0.5 ${
              theme === 'light' ? 'bg-gray-800' : 'bg-white'
            }`} />
          </div>
          
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${getSubtitleColor()} backdrop-blur-sm px-6 py-3 rounded-lg`}>
            Where premium craftsmanship meets sustainable innovation in fashion
          </p>
        </div>
      </div>

    </section>
  );
};


// Enhanced Mission Section with 3D Cards and Advanced Animations
const MissionSection = () => {
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
      title: "Sustainable Sourcing",
      description: "Ethically sourced materials with full supply chain transparency",
      color: "from-green-500 to-emerald-500",
      icon: "🌱",
      stats: "100% Traceable"
    },
    {
      title: "Quality Excellence",
      description: "Premium craftsmanship with lifetime quality guarantee",
      color: "from-blue-500 to-cyan-500",
      icon: "⭐",
      stats: "Lifetime Warranty"
    },
    {
      title: "Customer First",
      description: "24/7 dedicated support with hassle-free returns",
      color: "from-purple-500 to-pink-500",
      icon: "💝",
      stats: "24/7 Support"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content - Enhanced with 3D Card */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div>
              <span className={`text-sm uppercase tracking-widest font-semibold ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>Our Vision</span>
              <h2 className={`text-5xl md:text-6xl font-bold mt-4 mb-6 ${getTextColor()}`}>
                Fashion with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Purpose</span>
              </h2>
            </div>
            
            <GlassCard hover3D={true} className="group relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <p className={`text-xl leading-relaxed ${getSecondaryColor()} mb-6 relative z-10`}>
                At <strong className={getTextColor()}>Agumiya Collections</strong>, we're revolutionizing the fashion industry by blending 
                cutting-edge design with sustainable practices that respect both people and planet.
              </p>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { icon: "♻️", text: "Eco-Friendly Materials", subtext: "100% Organic" },
                  { icon: "✨", text: "Premium Craftsmanship", subtext: "Handcrafted" },
                  { icon: "🌍", text: "Global Standards", subtext: "50+ Countries" },
                  { icon: "💫", text: "Innovative Designs", subtext: "Award Winning" }
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

          {/* Right Content - Enhanced 3D Commitment Cards */}
          <div className={`space-y-6 transition-all duration-1000 delay-500 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <GlassCard hover3D={true} className="group relative overflow-hidden">
              {/* Floating background element */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              
              <h3 className={`text-3xl font-bold mb-8 ${getTextColor()} relative z-10`}>
                Our Commitment
              </h3>
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

// Enhanced Stats Section with Interactive 3D Elements
const StatsSection = () => {
  const { theme } = useTheme();
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hoveredStat, setHoveredStat] = useState(null);
  const targetValues = [15000, 500, 50, 99];
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
      description: "Satisfied clients worldwide"
    },
    { 
      number: counters[1], 
      suffix: "+", 
      label: "Premium Products", 
      icon: "👕",
      color: "from-blue-500 to-cyan-500",
      description: "Unique fashion pieces"
    },
    { 
      number: counters[2], 
      suffix: "+", 
      label: "Countries Served", 
      icon: "🌎",
      color: "from-green-500 to-emerald-500",
      description: "Global reach and impact"
    },
    { 
      number: counters[3], 
      suffix: "%", 
      label: "Satisfaction Rate", 
      icon: "⭐",
      color: "from-purple-500 to-pink-500",
      description: "Customer happiness guarantee"
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

// Main About Component (unchanged)
const About = () => {
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Agumiya Collections - Premium Fashion Brand",
    "description": "Discover Agumiya Collections - a luxury fashion brand redefining style with sustainable practices, premium quality, and innovative designs since 2024.",
    "url": "https://agumiya-collections.com/about",
    "publisher": {
      "@type": "Organization",
      "name": "Agumiya Collections",
      "logo": {
        "@type": "ImageObject",
        "url": "https://agumiya-collections.com/logo.png",
        "width": 200,
        "height": 60
      },
      "description": "Premium fashion brand offering sustainable luxury clothing and accessories",
      "url": "https://agumiya-collections.com"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "Agumiya Collections",
      "founder": "Agumiya Fashion Group",
      "foundingDate": "2024",
      "description": "Agumiya Collections is a contemporary fashion brand that blends innovative design with sustainable practices.",
      "slogan": "Redefining Fashion - Premium Quality • Sustainable • Trendsetting"
    }
  };

  return (
    <>
      <SEO
        title="About Agumiya Collections | Premium Sustainable Fashion Brand"
        description="Discover Agumiya Collections - where luxury fashion meets sustainability. Learn about our mission, premium quality standards, and commitment to redefining fashion since 2024."
        keywords="agumiya about, luxury fashion brand, sustainable clothing, premium accessories, fashion mission"
        canonical="https://agumiya-collections.com/about"
        ogImage="https://agumiya-collections.com/og-about-image.jpg"
        ogType="website"
        structuredData={aboutStructuredData}
      />

      <div className="min-h-screen relative overflow-hidden">
        <AboutHero />
        <MissionSection />
        <StatsSection />
      </div>
    </>
  );
};

export default About;