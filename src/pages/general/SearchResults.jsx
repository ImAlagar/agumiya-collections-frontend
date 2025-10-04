import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearch } from '../../contexts/SearchContext';
import ProductCard from '../../components/user/products/ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const { performGlobalSearch, searchResults, isLoading, error } = useSearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 🔍 Trigger search when query changes in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
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

  // ✅ Render Products
  const renderProducts = () => {
    const products = searchResults?.products?.data || [];

    if (products.length === 0) {
      return <div className="text-center py-12">No products found</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  // ✅ Render Users
  const renderUsers = () => {
    const users = searchResults?.users?.data || [];

    if (users.length === 0) {
      return <div className="text-center py-12">No users found</div>;
    }

    return (
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </li>
        ))}
      </ul>
    );
  };

  // ✅ Render Orders
  const renderOrders = () => {
    const orders = searchResults?.orders?.data || [];

    if (orders.length === 0) {
      return <div className="text-center py-12">No orders found</div>;
    }

    return (
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-900 dark:text-white font-semibold">Order #{order.id}</p>
            <p className="text-gray-500 text-sm">Status: {order.status}</p>
            <p className="text-gray-500 text-sm">Total: ${order.total}</p>
          </li>
        ))}
      </ul>
    );
  };

  // ✅ FIXED FUNCTION — Render all results together
  const renderAllResults = () => {
    const hasProducts = searchResults?.products?.data?.length > 0;
    const hasUsers = searchResults?.users?.data?.length > 0;
    const hasOrders = searchResults?.orders?.data?.length > 0;

    if (!hasProducts && !hasUsers && !hasOrders) {
      return <div className="text-center py-12">No results found</div>;
    }

    return (
      <div className="space-y-12">
        {hasProducts && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Products
            </h2>
            {renderProducts()}
          </section>
        )}

        {hasUsers && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Users
            </h2>
            {renderUsers()}
          </section>
        )}

        {hasOrders && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Orders
            </h2>
            {renderOrders()}
          </section>
        )}
      </div>
    );
  };

  // ✅ Decides what to render
  const renderResultsContent = () => {
    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
    if (!searchResults) return <div className="text-center py-12">Start typing to search</div>;

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

  const tabs = {
    all: 'All',
    products: 'Products',
    users: 'Users',
    orders: 'Orders'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Tabs */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results for “{searchQuery}”
          </h1>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {Object.entries(tabs).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {renderResultsContent()}
      </div>
    </motion.div>
  );
};

export default SearchResults;
