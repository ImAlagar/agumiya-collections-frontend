// src/pages/general/Lookbook.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Lookbook = () => {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  // Hero slider images with fashion-focused Unsplash URLs
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

  // Mock data for lookbook collections
  const lookbookData = {
    spring: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
        title: 'Urban Spring',
        description: 'Fresh styles for the spring season',
        tags: ['casual', 'spring', 'urban']
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
        title: 'Weekend Vibes',
        description: 'Perfect for your weekend adventures',
        tags: ['weekend', 'comfort', 'spring']
      }
    ],
    summer: [
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        title: 'Beach Ready',
        description: 'Light and breezy summer collection',
        tags: ['summer', 'beach', 'lightweight']
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        title: 'Summer Nights',
        description: 'Elegant evening wear for warm nights',
        tags: ['evening', 'elegant', 'summer']
      }
    ],
    fall: [
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
        title: 'Autumn Layers',
        description: 'Cozy layered looks for fall',
        tags: ['fall', 'layers', 'cozy']
      },
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=80',
        title: 'Harvest Style',
        description: 'Warm tones for the autumn season',
        tags: ['autumn', 'warm', 'comfort']
      }
    ],
    winter: [
      {
        id: 7,
        image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=800&q=80',
        title: 'Winter Warmth',
        description: 'Stay warm in style this winter',
        tags: ['winter', 'warm', 'cozy']
      },
      {
        id: 8,
        image: 'https://images.unsplash.com/photo-1516661786124-7687e0b341e5?auto=format&fit=crop&w=800&q=80',
        title: 'Holiday Glam',
        description: 'Sparkling outfits for holiday parties',
        tags: ['holiday', 'glam', 'party']
      }
    ]
  };

  const allLooks = Object.values(lookbookData).flat();

  const filteredLooks = selectedCollection === 'all' 
    ? allLooks 
    : lookbookData[selectedCollection] || [];

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
            primary: 'bg-black text-white hover:bg-gray-800',
            secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            active: 'bg-black text-white shadow-lg',
            inactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          },
          tag: 'bg-gray-100 text-gray-700',
          overlay: 'bg-black bg-opacity-0 group-hover:bg-opacity-10',
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
            primary: 'bg-white text-black hover:bg-gray-200',
            secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600',
            active: 'bg-white text-black shadow-lg',
            inactive: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          },
          tag: 'bg-gray-700 text-gray-200',
          overlay: 'bg-black bg-opacity-0 group-hover:bg-opacity-20',
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
            primary: 'bg-white text-black hover:bg-gray-200',
            secondary: 'bg-gray-600 text-gray-200 hover:bg-gray-500',
            active: 'bg-white text-black shadow-lg',
            inactive: 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          },
          tag: 'bg-gray-600 text-gray-200',
          overlay: 'bg-black bg-opacity-0 group-hover:bg-opacity-30',
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
            primary: 'bg-black text-white hover:bg-gray-800',
            secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            active: 'bg-black text-white shadow-lg',
            inactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          },
          tag: 'bg-gray-100 text-gray-700',
          overlay: 'bg-black bg-opacity-0 group-hover:bg-opacity-10',
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
              {['all', 'spring', 'summer', 'fall', 'winter'].map((season) => (
                <motion.button
                  key={season}
                  onClick={() => setSelectedCollection(season)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    selectedCollection === season
                      ? styles.button.active
                      : styles.button.inactive
                  }`}
                >
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Looks Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredLooks.map((look) => (
              <motion.div
                key={look.id}
                variants={itemVariants}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div className={`${styles.card} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 ${styles.overlay} transition-all duration-300`} />
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${styles.text}`}>{look.title}</h3>
                    <p className={`${styles.subtitle} mb-4`}>{look.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {look.tags.map((tag) => (
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
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredLooks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className={`text-2xl font-bold ${styles.subtitle} mb-4`}>
                No looks found for this collection
              </h3>
              <p className={`${styles.subtitle} text-lg`}>
                Try selecting a different season or check back later for new additions.
              </p>
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