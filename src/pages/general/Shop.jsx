import React from 'react';
import { SEO } from '../../contexts/SEOContext';

const Shop = () => {
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Product",
        "position": 1,
        "name": "Premium Cotton T-Shirt",
        "url": "https://shopstyle.com/products/premium-cotton-tshirt",
        "image": "https://shopstyle.com/images/tshirt.jpg",
        "description": "100% cotton premium t-shirt for everyday comfort",
        "offers": {
          "@type": "Offer",
          "price": "29.99",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Shop All Products | ShopStyle"
        description="Browse our complete collection of fashion, electronics, and lifestyle products. Filter by category, price, and ratings."
        keywords="products, shop, fashion, electronics, filter, categories"
        canonical="https://shopstyle.com/shop"
        structuredData={productStructuredData}
      />
      
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-heading text-gray-900 dark:text-white">All Products</h1>
          {/* Shop content */}
        </div>
      </div>
    </>
  );
};

export default Shop;