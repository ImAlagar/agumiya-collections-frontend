import { useState, useEffect } from 'react';
import CategorySection from "../../components/ui/categories/CategorySection";
import ResponsiveHero from "../../components/ui/hero/ResponsiveHero";
import { SEO } from "../../contexts/SEOContext";
import '../../styles/swiper-custom.css';
import { productService } from '../../services/api/productService';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductFilters();
      
      if (response.success && response.data.categories) {
        const categoriesWithImages = await enhanceCategoriesWithImages(response.data.categories);
        setCategories(categoriesWithImages);
        
        // Fetch products for each category
        fetchCategoryProducts(categoriesWithImages);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const enhanceCategoriesWithImages = async (categories) => {
    // Premium professional images for each category
    const categoryImages = {
      "Accessories": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop&crop=center",
      "Men's Clothing": "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&crop=center",
      "Women's Clothing": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop&crop=center",
      "Home & Living": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center",
      "general": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop&crop=center"
    };

    return categories.map(category => ({
      ...category,
      image: categoryImages[category.value] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop&crop=center",
      gradient: getCategoryGradient(category.value),
      description: getCategoryDescription(category.value)
    }));
  };

  const getCategoryDescription = (categoryValue) => {
    const descriptions = {
      "Accessories": "Elevate your style with our curated collection of premium accessories. From timeless watches to elegant jewelry, each piece is crafted to perfection.",
      "Men's Clothing": "Discover sophisticated menswear that blends contemporary style with classic elegance. Premium fabrics and impeccable tailoring define our collection.",
      "Women's Clothing": "Experience the artistry of fashion with our women's collection. Flowing silhouettes, luxurious textures, and modern designs for the discerning woman.",
      "Home & Living": "Transform your space with our exclusive home collection. Thoughtfully designed pieces that combine functionality with aesthetic appeal.",
      "general": "Explore our diverse collection of premium products, carefully selected to meet the highest standards of quality and design excellence."
    };

    return descriptions[categoryValue] || descriptions["general"];
  };

  const getCategoryGradient = (categoryValue) => {
    const gradients = {
      "Accessories": {
        light: "from-amber-500/20 via-orange-400/10 to-yellow-300/5",
        dark: "from-amber-600/30 via-orange-500/20 to-yellow-400/10",
        smokey: "from-amber-500/40 via-orange-400/30 to-yellow-300/20"
      },
      "Men's Clothing": {
        light: "from-blue-600/20 via-cyan-500/10 to-sky-400/5",
        dark: "from-blue-700/30 via-cyan-600/20 to-sky-500/10",
        smokey: "from-blue-600/40 via-cyan-500/30 to-sky-400/20"
      },
      "Women's Clothing": {
        light: "from-rose-500/20 via-pink-400/10 to-fuchsia-300/5",
        dark: "from-rose-600/30 via-pink-500/20 to-fuchsia-400/10",
        smokey: "from-rose-500/40 via-pink-400/30 to-fuchsia-300/20"
      },
      "Home & Living": {
        light: "from-emerald-500/20 via-teal-400/10 to-green-300/5",
        dark: "from-emerald-600/30 via-teal-500/20 to-green-400/10",
        smokey: "from-emerald-500/40 via-teal-400/30 to-green-300/20"
      },
      "general": {
        light: "from-purple-500/20 via-indigo-400/10 to-violet-300/5",
        dark: "from-purple-600/30 via-indigo-500/20 to-violet-400/10",
        smokey: "from-purple-500/40 via-indigo-400/30 to-violet-300/20"
      }
    };

    return gradients[categoryValue] || gradients["general"];
  };

  const fetchCategoryProducts = async (categories) => {
    const productsMap = {};
    
    for (const category of categories) {
      try {
        const response = await productService.getFilteredProducts({
          categories: category.value
        });
        
        if (response.success && response.data.data && response.data.data.length > 0) {
          productsMap[category.value] = response.data.data.slice(0, 8); // Get first 8 products for pagination
        } else {
          productsMap[category.value] = [];
        }
      } catch (error) {
        console.error(`Error fetching products for category ${category.value}:`, error);
        productsMap[category.value] = [];
      }
    }
    
    setCategoryProducts(productsMap);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-light">Loading Luxury Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <SEO
        title="Agumiya - Redefining Luxury Fashion | Premium Designer Collections"
        description="Experience unparalleled luxury with Agumiya's exclusive designer collections. Sustainable, authentic, and crafted for the discerning individual."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LuxuryGoodsStore",
          "name": "Agumiya Collections",
          "url": "https://agumiya-collections.com",
          "description": "Premium luxury fashion and exclusive designer collections",
          "priceRange": "$$$",
        }}
      />
      
      <ResponsiveHero />
      
      {/* Render each category as a separate section */}
      {categories.map((category, index) => (
        <CategorySection
          key={category.value}
          category={category}
          products={categoryProducts[category.value] || []}
          index={index}
        />
      ))}
    </div>
  );
};

export default Home;