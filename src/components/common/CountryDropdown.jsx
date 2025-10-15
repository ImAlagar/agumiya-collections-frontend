// components/CountryDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import countriesData from '../../utils/country.json'; // Adjust path as needed

const CountryDropdown = ({ 
  value, 
  onChange, 
  disabled = false,
  theme = 'light',
  placeholder = "Select your country"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const isDark = theme === 'dark' || theme === 'smokey';

  // Process countries to ensure unique keys by combining name and dialing_code
  const processedCountries = countriesData.map(country => ({
    ...country,
    // Create a unique key by combining name and dialing_code
    uniqueKey: `${country.name}_${country.dialing_code}`
  }));

  // Filter countries based on search term
  const filteredCountries = processedCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected country
  const selectedCountry = processedCountries.find(country => 
    country.name === value
  );

  const handleCountrySelect = (country) => {
    onChange(country.name);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Theme-based styles
  const getInputBackground = () => {
    return isDark ? "bg-gray-700" : "bg-gray-50";
  };

  const getInputBorder = () => {
    return isDark ? "border-gray-600" : "border-gray-300";
  };

  const getTextColor = () => {
    return isDark ? "text-white" : "text-gray-800";
  };

  const getSecondaryTextColor = () => {
    return isDark ? "text-gray-300" : "text-gray-600";
  };

  const getDropdownBackground = () => {
    return isDark ? "bg-gray-800" : "bg-white";
  };

  const getHoverBackground = () => {
    return isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Country Display */}
      <button
        type="button"
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-between ${getInputBackground()} ${getInputBorder()} ${getTextColor()} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center space-x-3">
        {selectedCountry && (
          <span className={`text-sm font-medium ${getSecondaryTextColor()}`}>
            +{selectedCountry.dialing_code}
          </span>
        )}
          
          <span className={value ? getTextColor() : getSecondaryTextColor()}>
            {selectedCountry ? selectedCountry.name : placeholder}
          </span>
        </div>
        

                
        {!selectedCountry && (
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${getSecondaryTextColor()}`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border z-50 ${getDropdownBackground()} ${getInputBorder()} max-h-80 overflow-hidden`}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <Search 
                  size={18} 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getSecondaryTextColor()}`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search countries..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:border-transparent focus:ring-2 focus:ring-blue-500 ${getInputBackground()} ${getInputBorder()} ${getTextColor()}`}
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <motion.div
                    key={country.uniqueKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${getHoverBackground()} ${
                      selectedCountry?.name === country.name 
                        ? (isDark ? 'bg-blue-900/30' : 'bg-blue-50') 
                        : ''
                    }`}
                    onClick={() => handleCountrySelect(country)}
                    whileHover={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={getTextColor()}>{country.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${getSecondaryTextColor()}`}>
                        +{country.dialing_code}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={`px-4 py-3 text-center ${getSecondaryTextColor()}`}>
                  No countries found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryDropdown;