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
  FiChevronDown,
  FiChevronUp,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiMessageCircle,
  FiX,
  FiPlus,
  FiMinus
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
  const { formatPrice, userCurrency, convertPrice, getCurrencySymbol } = useCurrency();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFinish, setSelectedFinish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);
  const [showAllFinishes, setShowAllFinishes] = useState(false);
  
  // Animation states
  const [flyingItems, setFlyingItems] = useState([]);
  const addToCartRef = useRef(null);
  const imageScrollRef = useRef(null);

  // ✅ PROFESSIONAL CATEGORY CONFIGURATION
  const categoryConfig = {
    // Clothing Categories
    "Men's Clothing": {
      type: 'clothing',
      selectionTexts: {
        size: 'Select Size',
        color: 'Select Color',
        model: 'Select Style',
        finish: 'Select Material'
      },
      displayOrder: ['color', 'size']
    },
    "Women's Clothing": {
      type: 'clothing',
      selectionTexts: {
        size: 'Select Size',
        color: 'Select Color',
        model: 'Select Style',
        finish: 'Select Material'
      },
      displayOrder: ['color', 'size']
    },
    "Unisex": {
      type: 'clothing',
      selectionTexts: {
        size: 'Select Color',
        color: 'Select Size',
        model: 'Select Style',
        finish: 'Select Material'
      },
      displayOrder: ['size', 'color']
    },
    
    // Accessories
    "Accessories": {
      type: 'accessories',
      selectionTexts: {
        size: 'Select Size',
        color: 'Select Color',
        model: 'Select Phone Model',
        finish: 'Select Finish'
      },
      displayOrder: ['model', 'finish']
    },
    
    // Home & Living
    "Home & Living": {
      type: 'homeLiving',
      selectionTexts: {
        size: 'Select Size',
        color: 'Select Color',
        model: 'Select Type',
        finish: 'Select Finish'
      },
      displayOrder: ['color', 'size'] // CHANGED FROM ['size'] TO ['size', 'color']

    },
    
    // Mugs
    "Mugs": {
      type: 'mugs',
      selectionTexts: {
        size: 'Select Mug Size',
        color: 'Select Color',
        model: 'Select Style',
        finish: 'Select Finish'
      },
      displayOrder: ['size']
    },
    
    // Anime Inspired
    "Anime Inspired": {
      type: 'clothing',
      selectionTexts: {
        size: 'Select Color',
        color: 'Select Size',
        model: 'Select Character',
        finish: 'Select Style'
      },
      displayOrder: ['size', 'color']
    },
    
    // General (fallback)
    "general": {
      type: 'default',
      selectionTexts: {
        size: 'Select Size',
        color: 'Select Color',
        model: 'Select Option',
        finish: 'Select Finish'
      },
      displayOrder: ['size', 'color']
    }
  };

  // ✅ GET CATEGORY CONFIG
  const getCategoryConfig = () => {
    if (!product?.category) return categoryConfig["general"];
    return categoryConfig[product.category] || categoryConfig["general"];
  };

  // ✅ GET SELECTION TEXT
  const getSelectionText = (selectionType) => {
    const config = getCategoryConfig();
    return config.selectionTexts[selectionType] || `Select ${selectionType}`;
  };

  // ✅ ENHANCED TITLE PARSER: Better parsing for different categories
  const parseVariantTitle = (title, category) => {
    const parts = title.split('/').map(part => part.trim());
    const config = categoryConfig[category] || categoryConfig["general"];
    
    // Define category-specific parsing rules
    const parsingRules = {
      // Clothing categories - Size/Color format
      "clothing": () => ({
        size: parts[0],
        color: parts[1],
        optionType: 'clothing'
      }),
      
      // Home & Living & Mugs - usually just Size
      "homeLiving": () => ({
        size: parts[0],
         color: parts[1], // ADD THIS LINE TOO IF MUGS HAVE COLORS
        optionType: 'homeLiving'
      }),
      "mugs": () => ({
        size: parts[0],
        color: parts[1], // ADD THIS LINE
        optionType: 'mugs'
      }),
      
      // Accessories - Phone Model/Finish (remove gift packaging)
      "accessories": () => {
        // Filter out gift packaging options
        const filteredParts = parts.filter(part => 
          !part.toLowerCase().includes('gift packaging')
        );
        
        if (filteredParts.length === 3) {
          return {
            model: filteredParts[0],
            finish: filteredParts[1],
            option: filteredParts[2],
            optionType: 'phoneCase'
          };
        } else if (filteredParts.length === 2) {
          return {
            model: filteredParts[0],
            finish: filteredParts[1],
            optionType: 'phoneCase'
          };
        }
        return {
          option: filteredParts[0],
          optionType: 'simple'
        };
      },
      
      // Default fallback
      "default": () => {
        if (parts.length === 2) {
          return {
            size: parts[0],
            color: parts[1],
            optionType: 'clothing'
          };
        } else if (parts.length === 1) {
          const singlePart = parts[0];
          const isSize = /^\d+oz$|^\d+$|^[XSMLXL\d]+$|^ONE SIZE$|^OS$/i.test(singlePart);
          
          if (isSize) {
            return {
              size: singlePart,
              optionType: 'sizeOnly'
            };
          } else {
            return {
              option: singlePart,
              optionType: 'optionOnly'
            };
          }
        }
        return {
          raw: parts,
          optionType: 'complex'
        };
      }
    };

    const rule = parsingRules[config.type] || parsingRules.default;
    return rule();
  };

  // ✅ GET AVAILABLE SIZES (only enabled variants)
  const getAvailableSizes = () => {
    if (!product?.printifyVariants) return [];
    
    const sizes = new Set();
    
    product.printifyVariants.forEach(variant => {
      if (variant.is_enabled === true) {
        const parsed = parseVariantTitle(variant.title, product.category);
        if (parsed.size) {
          sizes.add(parsed.size);
        }
      }
    });
    
    return Array.from(sizes);
  };

  // ✅ GET AVAILABLE COLORS with unique keys
  const getAvailableColors = () => {
    if (!product?.printifyVariants) return [];
    
    const colors = new Map();
    
    product.printifyVariants.forEach(variant => {
      if (variant.is_enabled === true) {
        const parsed = parseVariantTitle(variant.title, product.category);
        if (parsed.color) {
          const colorKey = `${parsed.color}-${getColorHexCode(parsed.color)}`;
          colors.set(colorKey, {
            name: parsed.color,
            hexCode: getColorHexCode(parsed.color),
            uniqueKey: colorKey
          });
        }
      }
    });
    
    return Array.from(colors.values());
  };

  // ✅ GET AVAILABLE MODELS (for accessories and other categories)
  const getAvailableModels = () => {
    if (!product?.printifyVariants) return [];
    
    const models = new Set();
    
    product.printifyVariants.forEach(variant => {
      if (variant.is_enabled === true) {
        const parsed = parseVariantTitle(variant.title, product.category);
        if (parsed.model) {
          models.add(parsed.model);
        }
      }
    });
    
    return Array.from(models);
  };

  // ✅ GET AVAILABLE FINISHES (remove gift packaging)
  const getAvailableFinishes = () => {
    if (!product?.printifyVariants) return [];
    
    const finishes = new Set();
    
    product.printifyVariants.forEach(variant => {
      if (variant.is_enabled === true) {
        const parsed = parseVariantTitle(variant.title, product.category);
        
        // Filter out gift packaging options
        if (parsed.finish && !parsed.finish.toLowerCase().includes('gift packaging')) {
          finishes.add(parsed.finish);
        }
        if (parsed.option && !parsed.option.toLowerCase().includes('gift packaging')) {
          finishes.add(parsed.option);
        }
      }
    });
    
    return Array.from(finishes);
  };

  // ✅ GET ENABLED VARIANTS ONLY
  const getEnabledVariants = () => {
    if (!product?.printifyVariants) return [];
    return product.printifyVariants.filter(variant => variant.is_enabled === true);
  };

  // ✅ GET DISABLED VARIANTS (for showing out of stock)
  const getDisabledVariants = () => {
    if (!product?.printifyVariants) return [];
    return product.printifyVariants.filter(variant => variant.is_enabled === false);
  };

  // ✅ FIND VARIANT BY SELECTIONS
  const findVariantBySelections = (color, size, model, finish) => {
    if (!product?.printifyVariants) return null;
    
    return product.printifyVariants.find(variant => {
      const parsed = parseVariantTitle(variant.title, product.category);
      
      let matches = true;
      
      if (color && parsed.color !== color) matches = false;
      if (size && parsed.size !== size) matches = false;
      if (model && parsed.model !== model) matches = false;
      if (finish) {
        if (parsed.finish !== finish && parsed.option !== finish) {
          matches = false;
        }
      }
      
      return matches && variant.is_enabled === true;
    });
  };

  // ✅ GET COLOR HEX CODE with null safety
  const getColorHexCode = (colorName) => {
    if (!product?.colorOptions) return '#cccccc';
    
    const colorOption = product.colorOptions.find(
      color => color.name.toLowerCase() === colorName?.toLowerCase()
    );
    
    return colorOption?.hexCode || '#cccccc';
  };

  // ✅ GET SELECTION DISPLAY TEXT
  const getSelectionDisplayText = () => {
    const parts = [];
    
    if (selectedSize) parts.push(selectedSize);
    if (selectedColor) parts.push(selectedColor);
    if (selectedModel) parts.push(selectedModel);
    if (selectedFinish) parts.push(selectedFinish);
    
    return parts.join(' • ');
  };

  // ✅ FIXED: LOAD PRODUCT WITH BETTER ERROR HANDLING
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const productData = await getProductById(id);
          setProduct(productData);

          // Get enabled variants
          const enabledVariants = getEnabledVariants();
          
          if (enabledVariants.length > 0) {
            // Use first enabled variant as default
            const firstVariant = enabledVariants[0];
            setSelectedVariant(firstVariant);
            
            const parsed = parseVariantTitle(firstVariant.title, productData.category);
            
            // Set initial selections based on parsed data and product type
            if (parsed.size) setSelectedSize(parsed.size);
            if (parsed.color) setSelectedColor(parsed.color);
            if (parsed.model) setSelectedModel(parsed.model);
            if (parsed.finish) setSelectedFinish(parsed.finish);
          } else {
            // If no enabled variants, set a safe fallback
            setSelectedVariant(productData.printifyVariants?.[0] || null);
          }
        } catch (error) {
          console.error('Error loading product:', error);
          setProduct(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProduct();
  }, [id, getProductById]);

  // Load similar products
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

  // ✅ HANDLE SIZE SELECTION
const handleSizeSelect = (size) => {
  setSelectedSize(size);
  
  // Find matching variant with current selections
  const config = getCategoryConfig();
  
  if (config.type === 'clothing') {
    const matchingVariant = findVariantBySelections(selectedColor, size, null, null);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  } else if (config.type === 'homeLiving' || config.type === 'mugs') {
    // UPDATED: Include color selection for Home & Living
    const matchingVariant = findVariantBySelections(selectedColor, size, null, null);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }
};

  // ✅ HANDLE COLOR SELECTION
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    
    // Find matching variant with current selections
    const matchingVariant = findVariantBySelections(color, selectedSize, null, null);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // ✅ HANDLE MODEL SELECTION
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    
    // Find matching variant with current selections
    const matchingVariant = findVariantBySelections(null, null, model, selectedFinish);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // ✅ HANDLE FINISH SELECTION
  const handleFinishSelect = (finish) => {
    setSelectedFinish(finish);
    
    // Find matching variant with current selections
    const matchingVariant = findVariantBySelections(null, null, selectedModel, finish);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Touch handlers for mobile
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

    if (isLeftSwipe && product?.images && product.images.length > 1) {
      nextImage();
    } else if (isRightSwipe && product?.images && product.images.length > 1) {
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // ✅ FIXED: Calculate savings with null safety
  const calculateSavings = () => {
    if (!product || !product.originalPrice) return null;
    
    const currentPrice = selectedVariant?.price || product.price || 0;
    if (product.originalPrice <= currentPrice) return null;
    
    const savings = product.originalPrice - currentPrice;
    const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(0);
    
    return { savings, savingsPercentage };
  };

  // ✅ FIXED: Add to cart function with null safety
  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addToCart({
        product: {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          image: product.images?.[0],
          printifyProductId: product.printifyProductId,
          printifyVariants: product.printifyVariants,
          category: product.category,
          images: product.images
        },
        variant: {
          id: selectedVariant.id,
          title: selectedVariant.title,
          price: selectedVariant.price || 0,
          sku: selectedVariant.sku,
          isAvailable: selectedVariant.isAvailable,
          isEnabled: selectedVariant.isEnabled,
          image: product.images?.[0]
        },
        quantity: quantity,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        selectedModel: selectedModel,
        selectedFinish: selectedFinish
      });
      
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

  // Get data for display
  const availableSizes = getAvailableSizes();
  const availableColors = getAvailableColors();
  const availableModels = getAvailableModels();
  const availableFinishes = getAvailableFinishes();
  const enabledVariants = getEnabledVariants();
  const disabledVariants = getDisabledVariants();
  const savingsInfo = calculateSavings();
  const categoryConfigData = getCategoryConfig();

  // ✅ FIXED: Price calculations with null safety
  const currentPrice = selectedVariant?.price || product?.price || 0;
  const { formatted: currentFormattedPrice, original: currentOriginalPrice } = 
    formatPrice(currentPrice, userCurrency, true);
  
  const { formatted: originalFormattedPrice } = 
    product?.originalPrice ? formatPrice(product.originalPrice, userCurrency) : { formatted: null };

  const { formatted: savingsFormatted } = 
    savingsInfo ? formatPrice(savingsInfo.savings, userCurrency) : { formatted: null };

  // ✅ RENDER SELECTION SECTIONS DYNAMICALLY
  const renderSelectionSections = () => {
    const sections = [];
    const config = getCategoryConfig();

    config.displayOrder.forEach(sectionType => {
      switch (sectionType) {
                case 'color':
          if (availableColors.length > 0) {
            sections.push(
              <div key="color" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getSelectionText('color')}
                  </h3>
                  {selectedColor && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: getColorHexCode(selectedColor) }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedColor}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableColors.slice(0, showAllColors ? availableColors.length : 6).map((colorObj) => {
                      const isSelected = selectedColor === colorObj.name;
                      
                      return (
                        <button
                          key={colorObj.uniqueKey}
                          onClick={() => handleColorSelect(colorObj.name)}
                          className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: colorObj.hexCode }}
                          />
                          <span className={`font-medium ${
                            isSelected 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {colorObj.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {availableColors.length > 6 && (
                    <button
                      onClick={() => setShowAllColors(!showAllColors)}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm"
                    >
                      {showAllColors ? (
                        <>
                          <FiMinus size={16} />
                          <span>Show Less Colors</span>
                        </>
                      ) : (
                        <>
                          <FiPlus size={16} />
                          <span>Show More Colors ({availableColors.length - 6} more)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          }
          break;

        case 'size':
          if (availableSizes.length > 0) {
            sections.push(
              <div key="size" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getSelectionText('size')}
                  </h3>
                  {selectedSize && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedSize}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.slice(0, showAllSizes ? availableSizes.length : 6).map((size) => {
                      const isSelected = selectedSize === size;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white dark:bg-blue-500 dark:border-blue-500'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {availableSizes.length > 6 && (
                    <button
                      onClick={() => setShowAllSizes(!showAllSizes)}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm"
                    >
                      {showAllSizes ? (
                        <>
                          <FiMinus size={16} />
                          <span>Show Less Sizes</span>
                        </>
                      ) : (
                        <>
                          <FiPlus size={16} />
                          <span>Show More Sizes ({availableSizes.length - 6} more)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          }
          break;


        case 'model':
          if (availableModels.length > 0) {
            sections.push(
              <div key="model" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getSelectionText('model')}
                  </h3>
                  {selectedModel && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedModel}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {availableModels.slice(0, showAllModels ? availableModels.length : 6).map((model) => {
                      const isSelected = selectedModel === model;
                      
                      return (
                        <button
                          key={model}
                          onClick={() => handleModelSelect(model)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white dark:bg-blue-500 dark:border-blue-500'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {model}
                        </button>
                      );
                    })}
                  </div>

                  {availableModels.length > 6 && (
                    <button
                      onClick={() => setShowAllModels(!showAllModels)}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm"
                    >
                      {showAllModels ? (
                        <>
                          <FiMinus size={16} />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <FiPlus size={16} />
                          <span>Show More ({availableModels.length - 6} more)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          }
          break;

        case 'finish':
          if (availableFinishes.length > 0) {
            sections.push(
              <div key="finish" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getSelectionText('finish')}
                  </h3>
                  {selectedFinish && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedFinish}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {availableFinishes.slice(0, showAllFinishes ? availableFinishes.length : 6).map((finish) => {
                      const isSelected = selectedFinish === finish;
                      
                      return (
                        <button
                          key={finish}
                          onClick={() => handleFinishSelect(finish)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white dark:bg-blue-500 dark:border-blue-500'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {finish}
                        </button>
                      );
                    })}
                  </div>

                  {availableFinishes.length > 6 && (
                    <button
                      onClick={() => setShowAllFinishes(!showAllFinishes)}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium text-sm"
                    >
                      {showAllFinishes ? (
                        <>
                          <FiMinus size={16} />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <FiPlus size={16} />
                          <span>Show More ({availableFinishes.length - 6} more)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          }
          break;
      }
    });

    return sections;
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

  return (
    <>
      <SEO
        title={`${product.name} | Agumiya Collections`}
        description={product.description?.replace(/<[^>]*>/g, '').substring(0, 160)}
        image={product.images?.[selectedImage] || product.images?.[0]}
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
          {/* Breadcrumb */}
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
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={product.images?.[selectedImage] || '/api/placeholder/600/600'}
                    alt={product.name}
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

                  {product.images && product.images.length > 1 && (
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

                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="lg:hidden">
                  <div 
                    ref={imageScrollRef}
                    className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {product.images.map((image, index) => (
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

              {product.images && product.images.length > 1 && (
                <div className="hidden lg:block">
                  <div className="relative">
                    <div 
                      className="flex space-x-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
                      style={{ 
                        scrollbarWidth: 'thin',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {product.images.map((image, index) => (
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
                      enabledVariants.length > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {enabledVariants.length > 0 ? 'In Stock' : 'Out of Stock'}
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

              {/* ✅ DYNAMIC SELECTION SECTIONS */}
              {renderSelectionSections()}

              {/* ✅ OUT OF STOCK VARIANTS DISPLAY */}
              {disabledVariants.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Out of Stock Options:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {disabledVariants.slice(0, 8).map((variant, index) => {
                      const parsed = parseVariantTitle(variant.title, product.category);
                      const displayText = [parsed.size, parsed.color, parsed.model, parsed.finish]
                        .filter(Boolean)
                        .join(' • ');
                      
                      return (
                        <span
                          key={`disabled-${index}-${variant.id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 line-through"
                        >
                          {displayText || variant.title}
                        </span>
                      );
                    })}
                    {disabledVariants.length > 8 && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        +{disabledVariants.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Show message if no enabled variants */}
              {enabledVariants.length === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    This product is currently out of stock. Please check back later.
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
                    disabled={enabledVariants.length === 0 || !selectedVariant}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3 relative overflow-hidden"
                  >
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10 flex items-center space-x-3"
                    >
                      <FiShoppingCart size={24} />
                      <span>
                        {enabledVariants.length === 0 ? 'Out of Stock' : 
                         !selectedVariant ? 'Select Options' : 'Add to Cart'}
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
                    disabled={enabledVariants.length === 0 || !selectedVariant}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Selection Summary */}
              {(selectedSize || selectedColor || selectedModel || selectedFinish) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Selected:
                    </span>
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {getSelectionDisplayText()}
                    </span>
                  </div>
                </div>
              )}

              {/* Enhanced Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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