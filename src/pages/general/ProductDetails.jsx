// src/pages/general/ProductDetails.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../contexts/ProductsContext';
import { useCart } from '../../contexts/CartContext';
import { SEO } from '../../contexts/SEOContext';
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiStar,
  FiTruck,
  FiShield,
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiGlobe
} from 'react-icons/fi';
import FlyingItem from '../../components/user/products/FlyingItem';
import { useCurrency } from '../../contexts/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, similarProducts } = useProducts();
  const { formatPrice, userCurrency, convertPrice, getCurrencySymbol } = useCurrency();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllVariants, setShowAllVariants] = useState(false);

  // Animation states
  const [flyingItems, setFlyingItems] = useState([]);
  const addToCartRef = useRef(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const productData = await getProductById(id);
          setProduct(productData);
          if (productData?.printifyVariants?.[0]) {
            setSelectedVariant(productData.printifyVariants[0]);
          }
        } catch (error) {
          console.error('Error loading product:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProduct();
  }, [id, getProductById]);

  // Safe calculateSavings function with null checks
  const calculateSavings = () => {
    if (!product || !product.originalPrice || product.originalPrice <= (selectedVariant?.price || product.price)) {
      return null;
    }
    
    const currentPrice = selectedVariant?.price || product.price;
    const savings = product.originalPrice - currentPrice;
    const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(0);
    
    return { savings, savingsPercentage };
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      const cartItem = {
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images?.[0],
        variant: selectedVariant,
        quantity
      };
      
      addToCart(cartItem);
      
      // Trigger flying animation
      triggerFlyingAnimation();
    }
  };

  const triggerFlyingAnimation = () => {
    if (!addToCartRef.current || !product) return;

    const addToCartRect = addToCartRef.current.getBoundingClientRect();
    const endPosition = {
      x: window.innerWidth - 60,
      y: 60,
    };  

    const startPosition = {
      x: addToCartRect.left + addToCartRect.width / 2,
      y: addToCartRect.top + addToCartRect.height / 2,
    };

    const newFlyingItems = Array.from({ length: 3 }, (_, index) => ({
      id: Date.now() + index,
      startPosition: {
        x: startPosition.x + (Math.random() - 0.5) * 50,
        y: startPosition.y + (Math.random() - 0.5) * 30,
      },
      endPosition,
      image: product.images?.[0],
      delay: index * 100,
    }));

    setFlyingItems(prev => [...prev, ...newFlyingItems]);
  };

  const handleFlyingComplete = (itemId) => {
    setFlyingItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // Get variants to display
  const getDisplayVariants = () => {
    if (!product?.printifyVariants) return [];
    
    const variants = product.printifyVariants;
    if (showAllVariants || variants.length <= 6) {
      return variants;
    }
    return variants.slice(0, 6);
  };

  const displayVariants = getDisplayVariants();
  const hasMoreVariants = product?.printifyVariants?.length > 6;
  const remainingCount = product?.printifyVariants ? product.printifyVariants.length - 6 : 0;
  const savingsInfo = calculateSavings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl sm:text-6xl mb-4">😔</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium sm:font-semibold transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Safe price calculations
  const currentPrice = selectedVariant?.price || product.price;
  const { formatted: currentFormattedPrice, original: currentOriginalPrice } = 
    formatPrice(currentPrice, userCurrency, true);
  
  const { formatted: originalFormattedPrice } = 
    product.originalPrice ? formatPrice(product.originalPrice, userCurrency) : { formatted: null };

  const { formatted: savingsFormatted } = 
    savingsInfo ? formatPrice(savingsInfo.savings, userCurrency) : { formatted: null };

  return (
    <>
      <SEO
        title={`${product.name} | Agumiya Collections`}
        description={product.description?.replace(/<[^>]*>/g, '').substring(0, 160)}
        image={product.images?.[0]}
        canonical={`/shop/products/${product.id}`}
      />

      {/* Flying Items Animation */}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <FlyingItem
            key={item.id}
            startPosition={item.startPosition}
            endPosition={item.endPosition}
            image={item.image}
            onComplete={() => handleFlyingComplete(item.id)}
            size={50}
          />
        ))}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Breadcrumb with Currency Selector */}
          <nav className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ol className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                >
                  <FiArrowLeft size={14} className="sm:hidden" />
                  <FiArrowLeft size={16} className="hidden sm:block" />
                  <span>Back</span>
                </button>
              </li>
              <li>•</li>
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/shop" className="hover:text-blue-600 transition-colors">
                  Shop
                </Link>
              </li>
              <li>•</li>
              <li className="text-gray-900 dark:text-white font-medium truncate max-w-[120px] sm:max-w-xs">
                {product.name}
              </li>
            </ol>
            
            {/* Currency Selector */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiGlobe size={16} />
                <span>Currency:</span>
              </div>
              <CurrencySelector />
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden relative">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.images?.[selectedImage] || '/api/placeholder/600/600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Currency Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                    <FiGlobe size={16} />
                    <span className="font-semibold text-sm">
                      {userCurrency} {getCurrencySymbol()}
                    </span>
                  </div>
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-600 dark:border-blue-400 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-5 sm:space-y-6">
              {/* Name + Stock */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 sm:space-x-4 mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      product.inStock
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>

                  {product.category && (
                    <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {product.category}
                    </span>
                  )}

                </div>

                {/* Enhanced Price Section */}
                <div className="space-y-2 mb-5 sm:mb-6">
                  <div className="flex items-baseline space-x-2 sm:space-x-3">
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {currentFormattedPrice}
                    </span>
                    
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <span className="text-base sm:text-lg text-gray-500 line-through">
                        {originalFormattedPrice}
                      </span>
                    )}
                  </div>

                  {/* Savings Badge */}
                  {savingsInfo && (
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-sm font-medium">
                        Save {savingsFormatted} ({savingsInfo.savingsPercentage}%)
                      </span>
                    </div>
                  )}

                  {/* Original USD Price */}
                  {userCurrency !== 'USD' && currentOriginalPrice && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Original: {currentOriginalPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants */}
              {product.printifyVariants && product.printifyVariants.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Available Options
                    </h3>
                    {hasMoreVariants && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {showAllVariants ? 'Showing all' : `Showing 6 of ${product.printifyVariants.length}`}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayVariants
                      .filter((variant, index, self) => {
                        const cleanTitle = variant.title.split('/')[0].trim();
                        return self.findIndex(v => v.title.split('/')[0].trim() === cleanTitle) === index;
                      })
                      .map((variant) => {
                        const { formatted: variantFormattedPrice } = formatPrice(variant.price, userCurrency);
                        const { formatted: variantOriginalPrice } = formatPrice(variant.price, 'USD');
                        
                        // Clean the title by removing everything after first slash
                        const cleanTitle = variant.title.split('/')[0].trim();
                        
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                              selectedVariant?.id === variant.id
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {cleanTitle}
                            </p>

                            {variant.description && (
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {variant.description}
                              </p>
                            )}
                          </button>
                        );
                      })}
                  </div>

                  {/* Show More/Less Button */}
                  {hasMoreVariants && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowAllVariants(!showAllVariants)}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <span className="font-medium">
                          {showAllVariants ? 'Show Less' : `Show ${remainingCount} More Options`}
                        </span>
                        {showAllVariants ? (
                          <FiChevronUp size={16} />
                        ) : (
                          <FiChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity + Actions */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 sm:px-5 py-1.5 sm:py-2 text-gray-900 dark:text-white font-medium min-w-[40px] sm:min-w-[48px] text-center text-sm sm:text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-row gap-3">
                  {/* Add to Cart button */}
                  <button
                    ref={addToCartRef}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 sm:py-4 px-5 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg transition-colors flex items-center justify-center space-x-2 relative overflow-hidden"
                  >
                    <motion.span
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="relative z-10 flex  items-center space-x-2"
                    >
                      <FiShoppingCart size={18} className="sm:hidden" />
                      <FiShoppingCart size={20} className="hidden sm:block" />
                      <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </motion.span>
                    
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 sm:py-4 px-5 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Enhanced Features with Currency Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <FiTruck className="text-green-600 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Free Shipping
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Worldwide
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiShield className="text-blue-600 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      2-Year Warranty
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Guarantee
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiGlobe className="text-purple-600 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Local Pricing
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {userCurrency} {getCurrencySymbol()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      Price Guarantee
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Best exchange rates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex overflow-x-auto">
                {['description', 'specifications', 'reviews', 'shipping', 'currency'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 sm:flex-none py-3 sm:py-4 px-4 sm:px-6 font-medium text-xs sm:text-sm border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-sm sm:prose max-w-none prose-gray dark:prose-invert"
                  >
                    {product.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        No description available.
                      </p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'specifications' && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3 sm:space-y-4 text-sm sm:text-base"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      Specifications coming soon...
                    </p>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3 sm:space-y-4 text-sm sm:text-base"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      Reviews coming soon...
                    </p>
                  </motion.div>
                )}

                {activeTab === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3 sm:space-y-4 text-sm sm:text-base"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      Shipping information coming soon...
                    </p>
                  </motion.div>
                )}

                {activeTab === 'currency' && (
                  <motion.div
                    key="currency"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Currency Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Current Currency:</strong> {userCurrency}</p>
                          <p><strong>Symbol:</strong> {getCurrencySymbol()}</p>
                          <p><strong>Base Price:</strong> ${currentPrice.toFixed(2)} USD</p>
                        </div>
                        <div>
                          <p><strong>Converted Price:</strong> {currentFormattedPrice}</p>
                          <p><strong>Exchange Rate:</strong> 1 USD = {convertPrice(1, 'USD', userCurrency).toFixed(2)} {userCurrency}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <CurrencySelector />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Similar Products section */}
          {similarProducts && similarProducts.length > 0 && (
            <section className="mt-12 sm:mt-16">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {similarProducts.slice(0, 4).map((similarProduct) => {
                  const { formatted: similarFormattedPrice } = formatPrice(similarProduct.price, userCurrency);
                  
                  return (
                    <div
                      key={similarProduct.id}
                      onClick={() => navigate(`/shop/products/${similarProduct.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-3 sm:p-4 hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-300">
                        <img
                          src={similarProduct.images?.[0] || '/api/placeholder/300/300'}
                          alt={similarProduct.name}
                          className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        <h3 className="font-medium sm:font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base">
                          {similarProduct.name}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-lg">
                          {similarFormattedPrice}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;