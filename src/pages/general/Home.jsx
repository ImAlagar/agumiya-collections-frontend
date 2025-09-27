// src/pages/Home.jsx
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Truck, Shield, Headphones, ShoppingBag, ArrowRight, Play, Pause, Eye, Clock, Zap, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SEO } from '../../contexts/SEOContext';
import { useInView } from '../../hooks/useInView';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const [ref1, inView1] = useInView({ threshold: 0.3 });
  const [ref2, inView2] = useInView({ threshold: 0.3 });
  const [ref3, inView3] = useInView({ threshold: 0.3 });
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

  // Enhanced Hero Slider Data with cinematic visuals
  const heroSlides = [
    {
      id: 1,
      title: "Elevate Your Essence",
      subtitle: "Where timeless elegance meets contemporary design. Discover pieces that tell your story.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
      cta: "Explore Collection",
      bgGradient: "from-purple-900/60 via-blue-900/40 to-indigo-900/60",
      accentColor: "purple",
      badge: "New Season",
      discount: "30% OFF PREMIUM"
    },
    {
      id: 2,
      title: "Artisan Craftsmanship",
      subtitle: "Each piece meticulously crafted by master artisans. Experience luxury redefined.",
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=1920&h=1080&fit=crop",
      cta: "Meet Our Artisans",
      bgGradient: "from-amber-900/60 via-orange-900/40 to-red-900/60",
      accentColor: "amber",
      badge: "Limited Edition",
      discount: "EXCLUSIVE ACCESS"
    },
    {
      id: 3,
      title: "Sustainable Luxury",
      subtitle: "Ethically sourced materials meeting unparalleled design. Luxury with conscience.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
      cta: "Discover Sustainability",
      bgGradient: "from-emerald-900/60 via-teal-900/40 to-cyan-900/60",
      accentColor: "emerald",
      badge: "Eco-Conscious",
      discount: "CARBON NEUTRAL"
    }
  ];

  // Premium featured products with enhanced data
  const featuredProducts = [
    {
      id: 1,
      name: "Signature Cashmere Blazer",
      price: "$489.99",
      originalPrice: "$699.99",
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1591047139953-54302a0db13c?w=600&h=800&fit=crop",
      category: "Premium Blazers",
      tags: ["Handmade", "Limited Stock", "Sustainable"],
      details: ["Italian Cashmere", "Mother-of-Pearl Buttons", "Lifetime Warranty"]
    },
    {
      id: 2,
      name: "Designer Silk Evening Gown",
      price: "$899.99",
      originalPrice: "$1299.99",
      rating: 5.0,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
      category: "Evening Wear",
      tags: ["Exclusive", "Hand-Embroidered"],
      details: ["French Silk", "Crystal Embellishments", "Custom Tailoring Available"]
    },
    {
      id: 3,
      name: "Artisanal Leather Jacket",
      price: "$649.99",
      originalPrice: "$899.99",
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1551508761-c7f075e1b481?w=600&h=800&fit=crop",
      category: "Outerwear",
      tags: ["Vegetable-Tanned", "Handcrafted"],
      details: ["Full-Grain Leather", "Italian Craftsmanship", "Ages Beautifully"]
    },
    {
      id: 4,
      name: "Tailored Linen Suit",
      price: "$759.99",
      originalPrice: "$999.99",
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop",
      category: "Bespoke Suits",
      tags: ["Custom Fit", "Eco-Friendly"],
      details: ["Organic Linen", "Bespoke Tailoring", "Breathable Fabric"]
    }
  ];

  const premiumFeatures = [
    {
      icon: Shield,
      title: "Authenticity Guarantee",
      description: "Every item comes with a certificate of authenticity and lifetime warranty",
      stats: "100% Authentic"
    },
    {
      icon: Truck,
      title: "White Glove Delivery",
      description: "Free global express shipping with personalized unpacking service",
      stats: "2-3 Days"
    },
    {
      icon: Headphones,
      title: "Personal Concierge",
      description: "24/7 access to dedicated style consultants and personal shoppers",
      stats: "24/7 Support"
    },
    {
      icon: Zap,
      title: "Exclusive Access",
      description: "Early access to new collections and private client events",
      stats: "VIP Only"
    }
  ];

  // Advanced animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
      rotateY: direction > 0 ? 15 : -15,
      filter: "blur(10px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
        duration: 1.2
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? -15 : 15,
      filter: "blur(10px)",
      transition: {
        duration: 0.8
      }
    })
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return heroSlides.length - 1;
      if (nextIndex >= heroSlides.length) return 0;
      return nextIndex;
    });
  }, [heroSlides.length]);

  // Enhanced auto-play with pause on hover
  useEffect(() => {
    if (!isPlaying) return;

    autoPlayRef.current = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, paginate]);

  const handleMouseMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      <SEO
        title="Agumiya - Redefining Luxury Fashion | Premium Designer Collections"
        description="Experience unparalleled luxury with Agumiya's exclusive designer collections. Sustainable, authentic, and crafted for the discerning individual."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LuxuryGoodsStore",
          "name": "Agumiya Collections",
          "url": "https://agumiya-collections.com",
          "description": "Premium luxury fashion and exclusive designer collections",
          "priceRange": "$$$"
        }}
      />

      {/* Cinematic Hero Section */}
      <section 
        ref={sliderRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black cursor-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
              transition: "transform 0.1s ease-out"
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].bgGradient}`} />
            <motion.img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
              style={{ opacity, scale }}
            />
            
            {/* Multi-layer gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
            
            {/* Animated particles */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Content */}
        <div className="relative z-10 text-center max-w-10xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-semibold text-sm tracking-wider">
                  {heroSlides[currentSlide].badge} • {heroSlides[currentSlide].discount}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-6xl md:text-6xl lg:text-5xl font-black text-white leading-none tracking-tighter"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-4 last:mr-0"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/collections" 
                    className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 group-hover:from-gray-200 group-hover:to-white transition-all duration-300" />
                    <ShoppingBag className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">{heroSlides[currentSlide].cta}</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-4 px-12 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:border-white/60 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all duration-300" />
                  <span className="relative z-10">Book Consultation</span>
                  <Clock className="w-5 h-5 relative z-10" />
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Navigation */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-8">
          {/* Play/Pause */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            className="bg-white/20 backdrop-blur-lg rounded-full p-4 hover:bg-white/30 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </motion.button>

          {/* Progress Indicators */}
          <div className="flex gap-4">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const newDirection = index > currentSlide ? 1 : -1;
                  setDirection(newDirection);
                  setCurrentSlide(index);
                }}
                className="relative group"
              >
                <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40 group-hover:bg-white/60'
                }`}>
                  {index === currentSlide && isPlaying && (
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.2, x: -2 }}
              whileTap={{ scale: 0.8 }}
              className="bg-white/20 backdrop-blur-lg rounded-full p-4 hover:bg-white/30 transition-all group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.2, x: 2 }}
              whileTap={{ scale: 0.8 }}
              className="bg-white/20 backdrop-blur-lg rounded-full p-4 hover:bg-white/30 transition-all group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-12 right-12 z-20 bg-black/40 backdrop-blur-lg text-white px-6 py-3 rounded-full text-lg font-light tracking-wider">
          <span className="text-2xl font-bold">0{currentSlide + 1}</span>
          <span className="mx-2 opacity-60">/</span>
          <span className="opacity-60">0{heroSlides.length}</span>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Premium Features Grid */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              The Agumiya Difference
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience luxury shopping redefined through our commitment to excellence, 
              authenticity, and unparalleled service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative z-10 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 hover:border-gray-600 transition-all duration-500 h-full">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                    {feature.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Curated Excellence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Each piece tells a story of craftsmanship, quality, and timeless design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -20, scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Product Card */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative h-96 overflow-hidden">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.img
                      src={product.hoverImage}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {product.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                      <button className="bg-black/80 backdrop-blur-sm rounded-full p-3 hover:bg-black transition-colors">
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button className="bg-black/80 backdrop-blur-sm rounded-full p-3 hover:bg-black transition-colors">
                        <Heart className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-white">
                        {product.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {product.details.slice(0, 2).map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {detail}
                        </div>
                      ))}
                    </div>

                    {/* Add to Cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 group/btn relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Add to Cart
                        <ShoppingBag className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Newsletter Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Join Our World
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto">
              Receive exclusive access to new collections, private events, and personalized 
              styling advice from our fashion consultants
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
            >
              <motion.input
                type="email"
                placeholder="Enter your email address"
                whileFocus={{ scale: 1.02 }}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl text-lg"
              >
                Become an Insider
              </motion.button>
            </motion.div>
            
            <p className="text-white/60 mt-6 text-sm">
              By subscribing, you agree to our Privacy Policy and consent to receive luxury updates
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Add missing Heart component
const Heart = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default Home;