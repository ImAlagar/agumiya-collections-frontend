import { useState, useEffect } from 'react';
import CategorySection from "../../components/ui/categories/CategorySection";
import ResponsiveHero from "../../components/ui/hero/ResponsiveHero";
import { SEO } from "../../contexts/SEOContext";
import { useTheme } from "../../contexts/ThemeContext";
import '../../styles/swiper-custom.css';
import { productService } from '../../services/api/productService';
import accessoriesBanner from '../../assets/images/categories/accessories-banner.jpg';
import mensClothingBanner from '../../assets/images/categories/mens-clothing-banner.jpg';
import womensClothingBanner from '../../assets/images/categories/womens-clothing-banner.jpg';
import homeLivingBanner from '../../assets/images/categories/home-living-banner.jpg';
import generalBanner from '../../assets/images/categories/general-banner.jpg';
import defaultBanner from '../../assets/images/categories/default-banner.jpg';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categoryReviewStats, setCategoryReviewStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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
        
        await fetchCategoryProductsWithReviews(categoriesWithImages);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProductsWithReviews = async (categories) => {
    const productsMap = {};
    const reviewStatsMap = {};
    
    for (const category of categories) {
      try {
        const productsResponse = await productService.getFilteredProducts({
          categories: category.value,
          limit: 8
        });
        
        if (productsResponse.success && productsResponse.data.data) {
          const products = productsResponse.data.data.slice(0, 8);
          
          const productsWithReviews = await Promise.all(
            products.map(async (product) => {
              try {
                const reviewResponse = await productService.getProductReviewStats(product.id);
                return {
                  ...product,
                  reviewStats: reviewResponse.data || {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                  }
                };
              } catch (error) {
                return {
                  ...product,
                  reviewStats: {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                  }
                };
              }
            })
          );
          
          productsMap[category.value] = productsWithReviews;
          
          const categoryStats = calculateCategoryReviewStats(productsWithReviews);
          reviewStatsMap[category.value] = categoryStats;
        } else {
          productsMap[category.value] = [];
          reviewStatsMap[category.value] = {
            averageRating: 0,
            totalReviews: 0,
            totalProducts: 0
          };
        }
      } catch (error) {
        console.error(`Error fetching products for category ${category.value}:`, error);
        productsMap[category.value] = [];
        reviewStatsMap[category.value] = {
          averageRating: 0,
          totalReviews: 0,
          totalProducts: 0
        };
      }
    }
    
    setCategoryProducts(productsMap);
    setCategoryReviewStats(reviewStatsMap);
  };

  const calculateCategoryReviewStats = (products) => {
    if (!products || products.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        totalProducts: 0
      };
    }

    const totalReviews = products.reduce((sum, product) => 
      sum + (product.reviewStats?.totalReviews || 0), 0
    );
    
    const totalRating = products.reduce((sum, product) => 
      sum + (product.reviewStats?.averageRating || 0) * (product.reviewStats?.totalReviews || 0), 0
    );
    
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      totalProducts: products.length
    };
  };

  const enhanceCategoriesWithImages = async (categories) => {
    const categoryImages = {
      "Accessories": accessoriesBanner,
      "Men's Clothing": mensClothingBanner, 
      "Women's Clothing": womensClothingBanner,
      "Home & Living": homeLivingBanner,
      "general": generalBanner
    };

    return categories.map(category => ({
      ...category,
      image: categoryImages[category.value] || defaultBanner,
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

  const getThemeStyles = () => {
    const baseStyles = {
      light: {
        background: 'bg-gradient-to-br from-gray-50 to-gray-100',
        text: 'text-gray-900',
        loading: {
          background: 'bg-gradient-to-br from-gray-50 to-gray-100',
          text: 'text-gray-600'
        }
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 to-gray-800',
        text: 'text-white',
        loading: {
          background: 'bg-gradient-to-br from-gray-900 to-gray-800',
          text: 'text-gray-300'
        }
      },
      smokey: {
        background: 'bg-gradient-to-br from-gray-800 to-gray-700',
        text: 'text-white',
        loading: {
          background: 'bg-gradient-to-br from-gray-800 to-gray-700',
          text: 'text-gray-300'
        }
      }
    };

    return baseStyles[theme] || baseStyles.light;
  };

  const styles = getThemeStyles();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.loading.background}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={`${styles.loading.text} text-lg font-light`}>Loading Luxury Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${styles.background} ${styles.text}`}>
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
      
      {categories.map((category, index) => (
        <CategorySection
          key={category.value}
          category={category}
          products={categoryProducts[category.value] || []}
          reviewStats={categoryReviewStats[category.value]}
          index={index}
        />
      ))}
    </div>
  );
};

export default Home;