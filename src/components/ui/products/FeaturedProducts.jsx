// src/components/ui/products/FeaturedProducts.jsx
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const featuredProducts = [
  {
    id: 1,
    name: "Designer Silk Dress",
    price: "$299",
    originalPrice: "$399",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Premium Leather Jacket",
    price: "$459",
    originalPrice: "$599",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
    badge: "New"
  },
  {
    id: 3,
    name: "Luxury Handbag",
    price: "$699",
    originalPrice: "$899",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    badge: "Limited"
  },
  {
    id: 4,
    name: "Designer Footwear",
    price: "$249",
    originalPrice: "$349",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=600&h=800&fit=crop",
    badge: "Sale"
  }
];

const FeaturedProducts = () => {
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
      <Link to={'shop'} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-light ${styles.text} mb-4`}>
            Featured Products
          </h2>
          <p className={styles.subtitle}>Handpicked excellence from our luxury collection</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group ${styles.card} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === "Bestseller" ? "bg-orange-500 text-white" :
                      product.badge === "New" ? "bg-green-500 text-white" :
                      product.badge === "Limited" ? "bg-red-500 text-white" :
                      "bg-blue-500 text-white"
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}
                
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : styles.rating
                      }`}
                    />
                  ))}
                  <span className={`${styles.rating} text-sm ml-2`}>({product.rating})</span>
                </div>
                
                <h3 className={`${styles.text} font-semibold mb-2`}>{product.name}</h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-lg">{product.price}</span>
                  <span className={`${styles.subtitle} line-through text-sm`}>{product.originalPrice}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Link>
    </section>
  );
};

export default FeaturedProducts;