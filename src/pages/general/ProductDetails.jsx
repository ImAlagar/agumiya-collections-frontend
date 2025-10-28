// src/pages/general/ProductDetails.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../contexts/ProductsContext';
import { useCart } from '../../contexts/CartContext';
import { SEO } from '../../contexts/SEOContext';

import {
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiArrowLeft,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
  FiMessageCircle
} from 'react-icons/fi';
import FlyingItem from '../../components/user/products/FlyingItem';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useTheme } from '../../contexts/ThemeContext';
import CurrencySelector from '../../components/common/CurrencySelector';
import EnhancedSimilarProducts from '../../components/user/products/EnhancedSimilarProducts';
import ProductReviews from '../../components/reviews/ProductReviews';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getProductById, 
    getSimilarProducts
  } = useProducts();
  const { formatPrice, userCurrency, getCurrencySymbol } = useCurrency();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllColors, setShowAllColors] = useState(false);

  // Animation states
  const [flyingItems, setFlyingItems] = useState([]);
  const addToCartRef = useRef(null);
  const imageScrollRef = useRef(null);

  // ✅ DYNAMIC: Parse variant title into structured data
  const parseVariantTitle = (title) => {
    const parts = title.split('/').map(part => part.trim());
    
    // Common patterns to identify
    const sizePatterns = [
      'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL',
      '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48',
      'SMALL', 'MEDIUM', 'LARGE', 'X-LARGE', 'XX-LARGE', 'XXX-LARGE',
      'US 4', 'US 6', 'US 8', 'US 10', 'US 12', 'US 14', 'US 16', 'US 18',
      'ONE SIZE', 'OS'
    ];
    
    const optionPatterns = [
      'GLOSSY', 'MATTE', 'WITH GIFT PACKAGING', 'WITHOUT GIFT PACKAGING'
    ];
    
    const devicePatterns = [
      'IPHONE', 'SAMSUNG', 'GALAXY', 'PIXEL', 'ANDROID'
    ];

    const result = {
      raw: title,
      parts: parts,
      color: null,
      size: null,
      option: null,
      device: null,
      packaging: null,
      type: 'simple' // simple, clothing, phone_case, mug
    };

    // Analyze parts to determine product type and extract components
    if (parts.length === 1) {
      // Simple products like "11oz", "15oz"
      result.type = 'simple';
      result.color = parts[0];
    } 
    else if (parts.length === 2) {
      // Check if it's clothing (Color / Size) or simple option
      const hasSize = sizePatterns.includes(parts[1].toUpperCase().replace('-', '').replace(' ', ''));
      
      if (hasSize) {
        result.type = 'clothing';
        result.color = parts[0];
        result.size = parts[1];
      } else {
        result.type = 'simple_option';
        result.color = parts[0];
        result.option = parts[1];
      }
    }
    else if (parts.length === 3) {
      // Complex products like phone cases
      const hasDevice = devicePatterns.some(pattern => parts[0].toUpperCase().includes(pattern));
      const hasOption = optionPatterns.includes(parts[1].toUpperCase());
      
      if (hasDevice && hasOption) {
        result.type = 'phone_case';
        result.device = parts[0];
        result.option = parts[1];
        result.packaging = parts[2];
      } else {
        // Fallback for other 3-part variants
        result.type = 'complex';
        result.color = parts[0];
        result.size = parts[1];
        result.option = parts[2];
      }
    }

    return result;
  };

  // ✅ DYNAMIC: Get product type based on all variants
  const getProductType = () => {
    if (!product?.printifyVariants) return 'simple';
    
    const variantTypes = product.printifyVariants.map(variant => 
      parseVariantTitle(variant.title).type
    );
    
    // Determine dominant type
    if (variantTypes.includes('phone_case')) return 'phone_case';
    if (variantTypes.includes('clothing')) return 'clothing';
    if (variantTypes.includes('complex')) return 'complex';
    if (variantTypes.includes('simple_option')) return 'simple_option';
    
    return 'simple';
  };

  const productType = getProductType();

  // ✅ UPDATED: Extract ALL unique colors from variants (both enabled and disabled)
  const getUniqueColors = () => {
    if (!product?.printifyVariants) return [];
    
    const colors = new Set();
    
    product.printifyVariants.forEach(variant => {
      const parsed = parseVariantTitle(variant.title);
      if (parsed.color) {
        colors.add(parsed.color);
      }
    });

    return Array.from(colors);
  };

  // ✅ UPDATED: Extract ALL unique sizes from variants (both enabled and disabled)
  const getUniqueSizes = () => {
    if (!product?.printifyVariants) return [];
    
    const sizes = new Set();
    
    product.printifyVariants.forEach(variant => {
      const parsed = parseVariantTitle(variant.title);
      if (parsed.size) {
        sizes.add(parsed.size);
      }
    });

    // Sort sizes logically
    return Array.from(sizes).sort((a, b) => {
      const sizeOrder = [
        'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL',
        '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48'
      ];
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
  };

  // ✅ UPDATED: Extract ALL unique options from variants (both enabled and disabled)
  const getUniqueOptions = () => {
    if (!product?.printifyVariants) return [];
    
    const options = new Set();
    
    product.printifyVariants.forEach(variant => {
      const parsed = parseVariantTitle(variant.title);
      if (parsed.option) {
        options.add(parsed.option);
      }
    });

    return Array.from(options);
  };

  // ✅ UPDATED: Extract ALL devices from variants (both enabled and disabled)
  const getUniqueDevices = () => {
    if (!product?.printifyVariants) return [];
    
    const devices = new Set();
    
    product.printifyVariants.forEach(variant => {
      const parsed = parseVariantTitle(variant.title);
      if (parsed.device) {
        devices.add(parsed.device);
      }
    });

    return Array.from(devices);
  };

  // ✅ UPDATED: Check if a color is available (has at least one enabled variant)
  const isColorAvailable = (color) => {
    return product.printifyVariants.some(variant => {
      const parsed = parseVariantTitle(variant.title);
      return parsed.color === color && variant.is_enabled === true;
    });
  };

  // ✅ UPDATED: Check if a specific size is available for selected color
  const isSizeAvailable = (size) => {
    if (!selectedColor || productType !== 'clothing') return false;
    
    return product.printifyVariants.some(variant => {
      const parsed = parseVariantTitle(variant.title);
      return parsed.color === selectedColor && 
             parsed.size === size && 
             variant.is_enabled === true;
    });
  };

  // ✅ UPDATED: Check if an option is available for selected color/device
  const isOptionAvailable = (option) => {
    if (productType === 'phone_case') {
      // For phone cases, check against selected device
      return product.printifyVariants.some(variant => {
        const parsed = parseVariantTitle(variant.title);
        return parsed.device === selectedColor && // Using selectedColor as device for phone cases
               parsed.option === option && 
               variant.is_enabled === true;
      });
    } else {
      // For other products, check against selected color
      if (!selectedColor) return false;
      
      return product.printifyVariants.some(variant => {
        const parsed = parseVariantTitle(variant.title);
        return parsed.color === selectedColor && 
               parsed.option === option && 
               variant.is_enabled === true;
      });
    }
  };

  // ✅ UPDATED: Get ALL sizes for selected color (both enabled and disabled)
  const getAllSizesForColor = () => {
    if (!selectedColor || productType !== 'clothing') return [];
    
    const allSizes = new Set();
    
    product.printifyVariants.forEach(variant => {
      const parsed = parseVariantTitle(variant.title);
      if (parsed.color === selectedColor && parsed.size) {
        allSizes.add(parsed.size);
      }
    });
    
    return Array.from(allSizes).sort((a, b) => {
      const sizeOrder = [
        'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL',
        '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48'
      ];
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
  };

  // ✅ UPDATED: Get ALL options for selected color/device (both enabled and disabled)
  const getAllOptionsForColor = () => {
    if (!selectedColor) return [];
    
    const allOptions = new Set();
    
    product.printifyVariants.forEach(variant => {
      const parsed = parseVariantTitle(variant.title);
      
      if (productType === 'phone_case') {
        if (parsed.device === selectedColor && parsed.option) {
          allOptions.add(parsed.option);
        }
      } else {
        if (parsed.color === selectedColor && parsed.option) {
          allOptions.add(parsed.option);
        }
      }
    });
    
    return Array.from(allOptions);
  };

  // ✅ DYNAMIC: Get selection label based on product type
  const getSelectionLabel = () => {
    switch (productType) {
      case 'phone_case':
        return 'Device Model';
      case 'clothing':
        return 'Color';
      case 'simple_option':
        return 'Style';
      default:
        return 'Option';
    }
  };

  // ✅ DYNAMIC: Get option label based on product type
  const getOptionLabel = () => {
    switch (productType) {
      case 'phone_case':
        return 'Finish';
      case 'simple_option':
        return 'Option';
      case 'clothing':
        return 'Size';
      default:
        return 'Option';
    }
  };

  // ✅ IMPROVED: Load product with automatic selection detection
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const productData = await getProductById(id);
          setProduct(productData);

          // Set first ENABLED variant as default
          const enabledVariants = productData.printifyVariants?.filter(v => v.is_enabled === true) || [];
          if (enabledVariants.length > 0) {
            const firstVariant = enabledVariants[0];
            setSelectedVariant(firstVariant);
            
            // Dynamically extract selections based on product type
            const parsed = parseVariantTitle(firstVariant.title);
            
            setSelectedColor(parsed.color || parsed.device || firstVariant.title);
            
            if (parsed.size) setSelectedSize(parsed.size);
            if (parsed.option) setSelectedOption(parsed.option);
          } else if (productData?.printifyVariants?.[0]) {
            // Fallback to first variant if no enabled variants
            const firstVariant = productData.printifyVariants[0];
            setSelectedVariant(firstVariant);
            
            const parsed = parseVariantTitle(firstVariant.title);
            setSelectedColor(parsed.color || parsed.device || firstVariant.title);
            
            if (parsed.size) setSelectedSize(parsed.size);
            if (parsed.option) setSelectedOption(parsed.option);
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

  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (product) {
        try {
          const similar = await getSimilarProducts(product.id, 4);
          setSimilarProducts(similar);
        } catch (error) {
          console.error('Error loading similar products:', error);
          setSimilarProducts([]);
        }
      }
    };
    
    loadSimilarProducts();
  }, [product, getSimilarProducts]);

  // ✅ UPDATED: Handle selection - only allow selection of available options
  const handleColorSelect = (color) => {
    if (!isColorAvailable(color)) return; // Only allow available colors
    
    setSelectedColor(color);
    
    // Reset dependent selections
    setSelectedSize(null);
    setSelectedOption(null);
    
    // Auto-select first available size for clothing
    if (productType === 'clothing') {
      const availableSizes = getAllSizesForColor().filter(size => isSizeAvailable(size));
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      }
    }
    
    // Auto-select first available option for other product types
    const availableOptions = getAllOptionsForColor().filter(option => isOptionAvailable(option));
    if (availableOptions.length > 0) {
      setSelectedOption(availableOptions[0]);
    }
    
    // Find and set the corresponding variant
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
    
    setSelectedImage(0);
  };

  // ✅ UPDATED: Handle size selection - only allow available sizes
  const handleSizeSelect = (size) => {
    if (!isSizeAvailable(size)) return; // Only allow available sizes
    
    setSelectedSize(size);
    
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // ✅ UPDATED: Handle option selection - only allow available options
  const handleOptionSelect = (option) => {
    if (!isOptionAvailable(option)) return; // Only allow available options
    
    setSelectedOption(option);
    
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // ✅ DYNAMIC: Find matching variant based on current selections
  const findMatchingVariant = () => {
    return product.printifyVariants.find(variant => {
      const parsed = parseVariantTitle(variant.title);
      
      let matches = variant.is_enabled === true; // Only match enabled variants
      
      if (productType === 'phone_case') {
        matches = matches && parsed.device === selectedColor;
      } else {
        matches = matches && parsed.color === selectedColor;
      }
      
      if (productType === 'clothing' && selectedSize) {
        matches = matches && parsed.size === selectedSize;
      }
      
      if ((productType === 'phone_case' || productType === 'simple_option') && selectedOption) {
        matches = matches && parsed.option === selectedOption;
      }
      
      return matches;
    });
  };

  // ✅ Get hex code for a color from colorOptions
  const getColorHexCode = (colorName) => {
    if (!product?.colorOptions) return '#000000';
    
    const colorOption = product.colorOptions.find(
      color => color.name.toLowerCase() === colorName.toLowerCase()
    );
    
    return colorOption ? colorOption.hexCode : '#000000';
  };

  // Navigation functions for desktop arrows
  const nextImage = () => {
    if (currentImages && currentImages.length > 1) {
      setSelectedImage((prev) => 
        prev === currentImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (currentImages && currentImages.length > 1) {
      setSelectedImage((prev) => 
        prev === 0 ? currentImages.length - 1 : prev - 1
      );
    }
  };

  // Handle swipe for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImages && currentImages.length > 1) {
      nextImage();
    } else if (isRightSwipe && currentImages && currentImages.length > 1) {
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

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
    if (product && selectedVariant && selectedColor) {
      // Validation based on product type
      if (productType === 'clothing' && (!selectedColor || !selectedSize)) {
        alert('Please select both color and size before adding to cart.');
        return;
      }
      
      if ((productType === 'phone_case' || productType === 'simple_option') && (!selectedColor || !selectedOption)) {
        const label = productType === 'phone_case' ? 'device and finish' : 'option';
        alert(`Please select both ${label} before adding to cart.`);
        return;
      }

      const cartItem = {
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        name: product.name,
        price: selectedVariant.price,
        image: currentImages?.[0] || product.images?.[0],
        variant: selectedVariant,
        variantId: selectedVariant.id,
        color: selectedColor,
        size: selectedSize,
        option: selectedOption,
        quantity
      };
      
      addToCart(cartItem);
      triggerFlyingAnimation();
    } else {
      alert('Please select required options before adding to cart.');
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
      image: currentImages?.[0] || product.images?.[0],
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

  // ✅ DYNAMIC: Extract color images from product data
  const getColorImages = () => {
    if (!product) return {};
    
    if (product.colorImages) {
      return product.colorImages;
    }
    
    const colorImages = {};
    if (product.colorOptions && product.colorOptions.length > 0) {
      product.colorOptions.forEach(colorOption => {
        colorImages[colorOption.name.toLowerCase()] = product.images;
      });
    }
    
    return colorImages;
  };

  const colorImages = getColorImages();

  // Get current images based on selected color
  const getCurrentImages = () => {
    if (!product || !product.images) return ['/api/placeholder/600/600'];
    
    if (selectedColor && colorImages) {
      const colorKey = selectedColor.toLowerCase();
      if (colorImages[colorKey]) {
        return colorImages[colorKey];
      }
    }
    
    return product.images;
  };

  const currentImages = getCurrentImages();

  // Get enabled variants only
  const getEnabledVariants = () => {
    if (!product?.printifyVariants) return [];
    return product.printifyVariants.filter(variant => variant.is_enabled === true);
  };

  const colors = getUniqueColors();
  const sizes = getUniqueSizes();
  const options = getUniqueOptions();
  const devices = getUniqueDevices();
  const enabledVariants = getEnabledVariants();
  const savingsInfo = calculateSavings();
  const allSizes = getAllSizesForColor();
  const allOptions = getAllOptionsForColor();
  
  const selectionLabel = getSelectionLabel();
  const optionLabel = getOptionLabel();

  // Show more/less functionality
  const visibleColorsCount = 6;
  const displayColors = showAllColors ? colors : colors.slice(0, visibleColorsCount);
  const hasMoreColors = colors.length > visibleColorsCount;

  // ✅ DYNAMIC: Get current selection display text
  const getCurrentSelectionText = () => {
    if (!selectedColor) return null;
    
    let text = selectedColor;
    if (selectedSize) text += ` / ${selectedSize}`;
    if (selectedOption) text += ` / ${selectedOption}`;
    
    return text;
  };

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
        image={currentImages?.[0] || product.images?.[0]}
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

      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-6 sm:py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Breadcrumb with Currency Selector */}
          <nav className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <ol className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
              <li className="mx-1">•</li>
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li className="mx-1">•</li>
              <li>
                <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
              </li>
              <li className="mx-1">•</li>
              <li className="text-gray-900 dark:text-white font-medium truncate max-w-[120px] sm:max-w-xs">
                {product.name}
              </li>
            </ol>

            <div className="flex items-center space-x-3 self-end sm:self-auto">
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
              <div className="relative">
                <div 
                  className="aspect-square bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden relative"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <motion.img
                    key={`${selectedImage}-${selectedColor}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentImages[selectedImage] || '/api/placeholder/600/600'}
                    alt={`${product.name} - ${selectedColor || 'Default'}`}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                      <FiGlobe size={16} />
                      <span className="font-semibold text-sm">
                        {userCurrency} {getCurrencySymbol()}
                      </span>
                    </div>
                  </div>

                  {currentImages && currentImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-white w-10 h-10 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <FiChevronLeft size={20} />
                      </button>

                      <button
                        onClick={nextImage}
                        className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-white w-10 h-10 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {currentImages && currentImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {currentImages.length}
                    </div>
                  )}
                </div>
              </div>

              {currentImages && currentImages.length > 1 && (
                <div className="lg:hidden">
                  <div 
                    ref={imageScrollRef}
                    className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {currentImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all snap-center ${
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
                </div>
              )}

              {currentImages && currentImages.length > 1 && (
                <div className="hidden lg:block">
                  <div className="relative">
                    <div 
                      className="flex space-x-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
                      style={{ 
                        scrollbarWidth: 'thin',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {currentImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-blue-600 dark:border-blue-400 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
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
                    
                    <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 sm:space-y-8">
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
                <div className="space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {currentFormattedPrice}
                    </span>
                    
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        {originalFormattedPrice}
                      </span>
                    )}
                  </div>

                  {savingsInfo && (
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium">
                        Save {savingsFormatted} ({savingsInfo.savingsPercentage}% OFF)
                      </span>
                    </div>
                  )}

                  {userCurrency !== 'USD' && currentOriginalPrice && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Original: {currentOriginalPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ UPDATED: Main Selection (Color/Device/Style) - Show ALL with strikeout for unavailable */}
              {(colors.length > 0 || devices.length > 0) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectionLabel}
                    </h3>
                    {/* Show selected option dynamically */}
                    {selectedColor && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Selected:
                        </span>
                        <div className="flex items-center space-x-2">
                          {productType !== 'phone_case' && (
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: getColorHexCode(selectedColor) }}
                            />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getCurrentSelectionText()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {displayColors.map((colorOption) => {
                        const colorName = typeof colorOption === 'string' ? colorOption : colorOption.name;
                        const available = isColorAvailable(colorName);
                        
                        return (
                          <button
                            key={colorName}
                            onClick={() => available && handleColorSelect(colorName)}
                            disabled={!available}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all relative ${
                              selectedColor === colorName
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                : available
                                  ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {/* Show color swatch only for non-phone case products */}
                            {productType !== 'phone_case' && (
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                                style={{ 
                                  backgroundColor: getColorHexCode(colorName),
                                  opacity: available ? 1 : 0.5
                                }}
                              />
                            )}
                            <span className={`font-medium ${
                              available ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {colorName}
                            </span>
                            
                            {/* ✅ UPDATED: Gray strikeout ONLY for unavailable options */}
                            {!available && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full border-t-2 border-gray-400 dark:border-gray-500 transform rotate-12"></div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Show More/Less Button */}
                    {hasMoreColors && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => setShowAllColors(!showAllColors)}
                          className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <span className="font-medium">
                            {showAllColors ? 'Show Less' : `Show More (${colors.length - visibleColorsCount} more)`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ UPDATED: Size Selection for Clothing - Show ALL with strikeout for unavailable - NO DROPDOWN */}
              {productType === 'clothing' && allSizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Select Size
                    </h3>
                    {!selectedSize && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Please select a size
                      </p>
                    )}
                  </div>
                  
                  {/* Button Group for Size Selection */}
                  <div className="flex flex-wrap gap-3">
                    {allSizes.map((size) => {
                      const available = isSizeAvailable(size);
                      
                      return (
                        <button
                          key={size}
                          onClick={() => available && handleSizeSelect(size)}
                          disabled={!available}
                          className={`px-4 py-3 rounded-lg border-2 transition-all relative min-w-[60px] text-center ${
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                              : available
                                ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <span className={`font-medium ${
                            selectedSize === size ? 'font-semibold' : 'font-normal'
                          }`}>
                            {size}
                          </span>
                          
                          {/* Gray strikeout for unavailable sizes */}
                          {!available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4/5 border-t-2 border-gray-400 dark:border-gray-500 transform rotate-12"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ✅ UPDATED: Options Selection - Show ALL with strikeout for unavailable - NO DROPDOWN */}
              {(productType === 'phone_case' || productType === 'simple_option') && allOptions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Select {optionLabel}
                    </h3>
                    {!selectedOption && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Please select a {optionLabel.toLowerCase()}
                      </p>
                    )}
                  </div>
                  
                  {/* Button Group for Options Selection */}
                  <div className="flex flex-wrap gap-3">
                    {allOptions.map((option) => {
                      const available = isOptionAvailable(option);
                      
                      return (
                        <button
                          key={option}
                          onClick={() => available && handleOptionSelect(option)}
                          disabled={!available}
                          className={`px-4 py-3 rounded-lg border-2 transition-all relative ${
                            selectedOption === option
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                              : available
                                ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <span className={`font-medium ${
                            selectedOption === option ? 'font-semibold' : 'font-normal'
                          }`}>
                            {option}
                          </span>
                          
                          {/* Gray strikeout for unavailable options */}
                          {!available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4/5 border-t-2 border-gray-400 dark:border-gray-500 transform rotate-12"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Show message if no enabled variants */}
              {enabledVariants.length === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    No product options are currently available. Please check back later.
                  </p>
                </div>
              )}

              {/* Quantity + Actions */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 text-gray-900 dark:text-white font-medium min-w-[60px] text-center text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    ref={addToCartRef}
                    onClick={handleAddToCart}
                    disabled={!product.inStock || !selectedColor || 
                      (productType === 'clothing' && !selectedSize) || 
                      ((productType === 'phone_case' || productType === 'simple_option') && !selectedOption)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3 relative overflow-hidden"
                  >
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10 flex items-center space-x-3"
                    >
                      <FiShoppingCart size={24} />
                      <span>
                        {!product.inStock ? 'Out of Stock' : 
                         !selectedColor || 
                         (productType === 'clothing' && !selectedSize) || 
                         ((productType === 'phone_case' || productType === 'simple_option') && !selectedOption) ? 
                         'Select Options' : 'Add to Cart'}
                      </span>
                    </motion.span>
                    
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock || !selectedColor || 
                      (productType === 'clothing' && !selectedSize) || 
                      ((productType === 'phone_case' || productType === 'simple_option') && !selectedOption)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Enhanced Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* 🚚 Free Shipping */}
                <div className="flex items-center space-x-3">
                  <FiTruck className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-base">
                      Free Shipping
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      On orders above $50
                    </p>
                  </div>
                </div>

                {/* 🛡️ Secure Payment */}
                <div className="flex items-center space-x-3">
                  <FiShield className="text-blue-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-base">
                      Secure Payment
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      100% Secure & Encrypted
                    </p>
                  </div>
                </div>

                {/* 🎨 Custom Orders */}
                <div className="flex items-center space-x-3">
                  <FiMessageCircle className="text-pink-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-base">
                      Custom Orders
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      DM us on Instagram for color or design changes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex overflow-x-auto">
                {['description', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 sm:flex-none py-4 px-6 font-medium text-sm border-b-2 transition-colors capitalize ${
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

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-lg max-w-none prose-gray dark:prose-invert"
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
                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <ProductReviews productId={product.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts && similarProducts.length > 0 && (
            <EnhancedSimilarProducts
              products={similarProducts}
              title="Related Products You'll Love"
              maxDisplay={4}
              showViewAll={true}
            />
          )}
        </div>  
      </div>
    </>
  );
};

export default ProductDetails;