// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';
import SearchBox from '../components/Search/SearchBox';
import ProductCard from '../components/Products/ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { performGlobalSearch, searchResults, isLoading, error } = useSearch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    try {
      await performGlobalSearch(query, activeTab);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (searchQuery) {
      performGlobalSearch(searchQuery, tab);
    }
  };

  const renderResults = () => {
    if (!searchResults) return null;

    const tabs = {
      all: { label: 'All', count: searchResults.meta?.totalResults || 0 },
      products: { label: 'Products', count: searchResults.products?.total || 0 },
      users: { label: 'Users', count: searchResults.users?.total || 0 },
      orders: { label: 'Orders', count: searchResults.orders?.total || 0 }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <SearchBox />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Found {tabs[activeTab].count} results
          </p>
        </div>

        {/* Results Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {Object.entries(tabs).map(([key, { label, count }]) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </nav>
        </div>

        {/* Results Content */}
        {renderResultsContent()}
      </div>
    );
  };

  const renderResultsContent = () => {
    if (isLoading) {
      return <div className="text-center py-12">Loading...</div>;
    }

    if (error) {
      return <div className="text-center py-12 text-red-600">{error}</div>;
    }

    if (!searchResults) {
      return <div className="text-center py-12">Start typing to search</div>;
    }

    switch (activeTab) {
      case 'products':
        return renderProducts();
      case 'users':
        return renderUsers();
      case 'orders':
        return renderOrders();
      case 'all':
      default:
        return renderAllResults();
    }
  };

  const renderProducts = () => {
    const products = searchResults.products?.data || [];
    
    if (products.length === 0) {
      return <div className="text-center py-12">No products found</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  // Add similar render functions for users and orders...

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderResults()}
    </motion.div>
  );
};

export default SearchResults;