import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const CategoryGrid = ({ categories, onCategorySelect, categoryProducts }) => {
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

  if (!categories || categories.length === 0) {
    return (
      <section className={`py-20 ${styles.background}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-light ${styles.text} mb-4`}>
            No Categories Available
          </h2>
          <p className={styles.subtitle}>Check back later for our latest collections</p>
        </div>
      </section>
    );
  }

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
            Shop By Category
          </h2>
          <p className={`${styles.subtitle} max-w-2xl mx-auto`}>
            Discover our carefully curated collections across different categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => onCategorySelect(category)}
              className={`group relative ${styles.card} rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient[theme]} opacity-60`}></div>
              
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 ${styles.overlay} transition-all duration-300`}></div>
                
                {/* Product Count */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                    {category.count} Products
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-xl font-semibold mb-2">{category.label}</h3>
                <p className="text-gray-300 text-sm">
                  {categoryProducts[category.value]?.length || 0} featured items
                </p>
                <button className="mt-3 text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors">
                  Explore {category.label} →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;