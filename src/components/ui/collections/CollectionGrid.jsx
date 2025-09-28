// src/components/ui/collections/CollectionGrid.jsx
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';

const collections = [
  {
    id: 1,
    title: "Women's Luxury Wear",
    items: "120+ Products",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    gradient: "from-pink-500/10 to-rose-500/10"
  },
  {
    id: 2,
    title: "Men's Premium Collection",
    items: "85+ Products",
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&h=800&fit=crop",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    id: 3,
    title: "Accessories & Bags",
    items: "60+ Products",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    gradient: "from-amber-500/10 to-orange-500/10"
  },
  {
    id: 4,
    title: "Footwear Collection",
    items: "45+ Products",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop",
    gradient: "from-emerald-500/10 to-teal-500/10"
  }
];


const CollectionGrid = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Our Exclusive Collections
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
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
              className="group relative bg-gray-900 rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-50`}></div>
              
              <div className="relative h-80 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
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