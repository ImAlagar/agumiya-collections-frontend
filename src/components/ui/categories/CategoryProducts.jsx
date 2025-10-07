import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const CategoryProducts = ({ category, products, onBack }) => {
  const { theme } = useTheme();

  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: 'bg-gray-50',
          text: 'text-gray-900',
          subtitle: 'text-gray-600',
          card: 'bg-white',
          rating: 'text-gray-400'
        };
      case 'dark':
        return {
          background: 'bg-gray-900',
          text: 'text-white',
          subtitle: 'text-gray-300',
          card: 'bg-gray-800',
          rating: 'text-gray-400'
        };
      case 'smokey':
        return {
          background: 'bg-gray-800',
          text: 'text-white',
          subtitle: 'text-gray-300',
          card: 'bg-gray-700',
          rating: 'text-gray-400'
        };
      default:
        return {
          background: 'bg-gray-50',
          text: 'text-gray-900',
          subtitle: 'text-gray-600',
          card: 'bg-white',
          rating: 'text-gray-400'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <section className={`py-20 ${styles.background}`}>
      <div className="container mx-auto px-6">
        {/* Back Button and Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </button>
          
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-light ${styles.text} mb-4`}>
              {category.label}
            </h1>
            <p className={styles.subtitle}>
              Discover our exclusive {category.label.toLowerCase()} collection
            </p>
          </div>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group ${styles.card} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {product.inStock && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                        In Stock
                      </span>
                    </div>
                  )}
                  
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className={`${styles.text} font-semibold mb-2 line-clamp-2`}>
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-bold text-lg">
                      ${product.price}
                    </span>
                    <span className={`${styles.subtitle} text-sm`}>
                      {category.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`${styles.subtitle} text-lg`}>
              No products found in this category.
            </p>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to={`/shop?category=${encodeURIComponent(category.value)}`}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              View All {category.count} Products
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryProducts;