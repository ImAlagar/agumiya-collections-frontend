// src/pages/general/Lookbook.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { lookbookService } from '../../services/api/lookbookService';

const Lookbook = () => {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [collections, setCollections] = useState([]);
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  // Hero slider images
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
      title: 'Spring Collection',
      subtitle: 'Fresh new styles for the season'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80',
      title: 'Summer Vibes',
      subtitle: 'Light and breezy fashion'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1558769132-cb25c5d1d0c7?auto=format&fit=crop&w=1920&q=80',
      title: 'Autumn Essentials',
      subtitle: 'Cozy layers for fall days'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1485231183945-fffde7cb34e0?auto=format&fit=crop&w=1920&q=80',
      title: 'Winter Luxury',
      subtitle: 'Elegant winter collections'
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load collections and looks
  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    loadLooks();
  }, [selectedCollection]);

  const loadCollections = async () => {
    try {
      const response = await lookbookService.getCollections();
      setCollections(response.data);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const loadLooks = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedCollection === 'all') {
        response = await lookbookService.getAllLooks();
      } else {
        response = await lookbookService.getLooks({
          category: selectedCollection
        });
      }
      setLooks(response.data.looks || []);
    } catch (error) {
      console.error('Failed to load looks:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Theme-based styling function
  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: 'bg-gray-50',
          text: 'text-gray-900',
          subtitle: 'text-gray-600',
          card: 'bg-white',
          button: {
            active: 'bg-black text-white shadow-lg',
            inactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          },
          tag: 'bg-gray-100 text-gray-700',
          overlay: 'bg-gradient-to-t from-black/60 via-transparent to-transparent',
          inspiration: {
            background: 'bg-gray-900',
            text: 'text-white',
            subtitle: 'text-gray-300'
          }
        };
      case 'dark':
        return {
          background: 'bg-gray-900',
          text: 'text-white',
          subtitle: 'text-gray-300',
          card: 'bg-gray-800',
          button: {
            active: 'bg-white text-black shadow-lg',
            inactive: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          },
          tag: 'bg-gray-700 text-gray-200',
          overlay: 'bg-gradient-to-t from-black/80 via-transparent to-transparent',
          inspiration: {
            background: 'bg-black',
            text: 'text-white',
            subtitle: 'text-gray-300'
          }
        };
      case 'smokey':
        return {
          background: 'bg-gray-800',
          text: 'text-white',
          subtitle: 'text-gray-300',
          card: 'bg-gray-700',
          button: {
            active: 'bg-white text-black shadow-lg',
            inactive: 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          },
          tag: 'bg-gray-600 text-gray-200',
          overlay: 'bg-gradient-to-t from-black/70 via-transparent to-transparent',
          inspiration: {
            background: 'bg-gray-900',
            text: 'text-white',
            subtitle: 'text-gray-300'
          }
        };
      default:
        return {
          background: 'bg-gray-50',
          text: 'text-gray-900',
          subtitle: 'text-gray-600',
          card: 'bg-white',
          button: {
            active: 'bg-black text-white shadow-lg',
            inactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          },
          tag: 'bg-gray-100 text-gray-700',
          overlay: 'bg-gradient-to-t from-black/60 via-transparent to-transparent',
          inspiration: {
            background: 'bg-gray-900',
            text: 'text-white',
            subtitle: 'text-gray-300'
          }
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`min-h-screen ${styles.background}`}>
      {/* Enhanced Hero Section with Slider */}
      <section className="relative h-screen bg-black text-white overflow-hidden">
        {/* Background Slides */}
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${slide.image})`
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Slide Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="absolute text-center px-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 50
              }}
              transition={{ 
                duration: 0.8,
                delay: currentSlide === index ? 0.3 : 0
              }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  scale: currentSlide === index ? 1 : 0.8
                }}
                transition={{ 
                  duration: 0.8,
                  delay: currentSlide === index ? 0.5 : 0
                }}
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === index ? 1 : 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: currentSlide === index ? 0.7 : 0
                }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  y: currentSlide === index ? 0 : 30
                }}
                transition={{ 
                  duration: 0.8,
                  delay: currentSlide === index ? 0.9 : 0
                }}
              >
                <Link
                  to="/shop"
                  className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  Shop The Collection
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Collection Filter Section */}
      <section className={`py-16 ${theme === 'light' ? 'bg-white' : styles.card}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-bold mb-6 ${styles.text}`}>
              Browse Collections
            </h2>
            <p className={`text-xl ${styles.subtitle} max-w-2xl mx-auto mb-8`}>
              Explore our curated seasonal collections and find inspiration for every occasion
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* All button */}
              <motion.button
                onClick={() => setSelectedCollection('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  selectedCollection === 'all'
                    ? styles.button.active
                    : styles.button.inactive
                }`}
              >
                All Collections
              </motion.button>

              {/* Collection buttons */}
              {collections.map((collection) => (
                <motion.button
                  key={collection.id}
                  onClick={() => setSelectedCollection(collection.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    selectedCollection === collection.name
                      ? styles.button.active
                      : styles.button.inactive
                  }`}
                >
                  {collection.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
              <p className={`mt-4 ${styles.subtitle}`}>Loading inspiring looks...</p>
            </motion.div>
          )}

          {/* Looks Grid */}
          {!loading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {looks.map((look) => (
                <motion.div
                  key={look.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <Link to={`/shop?product=${look.product?.id}`}>
                    <div className={`${styles.card} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative`}>
                      {/* Image Container with Overlay */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <motion.img
                          src={look.image}
                          alt={look.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 ${styles.overlay} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                        
                        {/* Hover Content */}
                        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <div className="text-white">
                            <motion.h3 
                              className="text-xl font-bold mb-2"
                              initial={{ opacity: 0, y: 20 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              {look.title}
                            </motion.h3>
                            <motion.p 
                              className="text-gray-200 text-sm mb-4 line-clamp-2"
                              initial={{ opacity: 0, y: 20 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {look.description}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <span className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-300">
                                View Product
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Tags - Always Visible */}
                        <div className="absolute top-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                          <div className="flex flex-wrap gap-2">
                            {look.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className={`px-3 py-1 ${styles.tag} rounded-full text-sm backdrop-blur-sm bg-opacity-90`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Default Content (Visible when not hovering) */}
                      <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className={`text-xl font-bold mb-2 ${styles.text} line-clamp-1`}>
                          {look.title}
                        </h3>
                        <p className={`${styles.subtitle} line-clamp-2 mb-4`}>
                          {look.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {look.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`px-3 py-1 ${styles.tag} rounded-full text-sm`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && looks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold ${styles.subtitle} mb-4`}>
                No inspiring looks found
              </h3>
              <p className={`${styles.subtitle} text-lg mb-6`}>
                Try selecting a different collection or check back later for new additions.
              </p>
              <button
                onClick={() => setSelectedCollection('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${styles.button.inactive}`}
              >
                View All Collections
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Inspiration Section */}
      <section className={`py-20 ${styles.inspiration.background} ${styles.inspiration.text}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Style Inspiration
            </h2>
            <p className={`text-xl md:text-2xl ${styles.inspiration.subtitle} mb-8`}>
              Get inspired by our latest collections and create looks that reflect your unique personality. 
              From casual everyday wear to special occasion outfits, find your perfect style.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/shop"
                className="bg-white text-black px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Shop All Products
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Get Styling Advice
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Lookbook;