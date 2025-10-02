// src/components/ui/collections/CollectionGrid.jsx
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const collections = [
  {
    id: 1,
    title: "Women's Luxury Wear",
    items: "120+ Products",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    gradient: {
      light: "from-pink-500/10 to-rose-500/10",
      dark: "from-pink-600/20 to-rose-600/20",
      smokey: "from-pink-500/30 to-rose-500/30"
    }
  },
  {
    id: 2,
    title: "Men's Premium Collection",
    items: "85+ Products",
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&h=800&fit=crop",
    gradient: {
      light: "from-blue-500/10 to-cyan-500/10",
      dark: "from-blue-600/20 to-cyan-600/20",
      smokey: "from-blue-500/30 to-cyan-500/30"
    }
  },
  {
    id: 3,
    title: "Accessories & Bags",
    items: "60+ Products",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    gradient: {
      light: "from-amber-500/10 to-orange-500/10",
      dark: "from-amber-600/20 to-orange-600/20",
      smokey: "from-amber-500/30 to-orange-500/30"
    }
  },
  {
    id: 4,
    title: "Footwear Collection",
    items: "45+ Products",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop",
    gradient: {
      light: "from-emerald-500/10 to-teal-500/10",
      dark: "from-emerald-600/20 to-teal-600/20",
      smokey: "from-emerald-500/30 to-teal-500/30"
    }
  }
];

const CollectionGrid = () => {
  const { theme } = useTheme();

  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: 'bg-white',
          text: 'text-gray-900',
          subtitle: 'text-gray-600',
          card: 'bg-gray-50',
          overlay: 'bg-black/20 group-hover:bg-black/10'
        };
      case 'dark':
        return {
          background: 'bg-gray-900',
          text: 'text-white',
          subtitle: 'text-gray-300',
          card: 'bg-gray-800',
          overlay: 'bg-black/40 group-hover:bg-black/30'
        };
      case 'smokey':
        return {
          background: 'bg-gray-800',
          text: 'text-white',
          subtitle: 'text-gray-300',
          card: 'bg-gray-700',
          overlay: 'bg-black/50 group-hover:bg-black/40'
        };
      default:
        return {
          background: 'bg-white',
          text: 'text-gray-900',
          subtitle: 'text-gray-600',
          card: 'bg-gray-50',
          overlay: 'bg-black/20 group-hover:bg-black/10'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <section className={`py-20 ${styles.background}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-light ${styles.text} mb-4`}>
            Our Exclusive Collections
          </h2>
          <p className={`${styles.subtitle} max-w-2xl mx-auto`}>
            Discover carefully curated pieces that embody sophistication and timeless elegance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`group relative ${styles.card} rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient[theme]} opacity-60`}></div>
              
              <div className="relative h-80 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 ${styles.overlay} transition-all duration-300`}></div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-xl font-semibold mb-2">{collection.title}</h3>
                <p className="text-gray-300 text-sm">{collection.items}</p>
                <button className="mt-3 text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors">
                  Explore Collection →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;