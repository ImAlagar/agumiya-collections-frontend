import React, { createContext, useContext } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SEOContext = createContext();

export const SEOProvider = ({ children }) => {
  const defaultSEO = {
    title: 'Agumiya Collections - Your Fashion Destination',
    description: 'Discover the latest fashion trends at ShopStyle. Quality products, best prices, and fast shipping.',
    keywords: 'fashion, clothing, ecommerce, shop, style',
    canonical: 'https://agumiya-collections.com',
    ogImage: 'https://agumiya.com/og-image.jpg',
    twitterHandle: '@agumiya'
  };

  const updateSEO = (seoConfig = {}) => {
    return {
      ...defaultSEO,
      ...seoConfig
    };
  };

  return (
    <HelmetProvider>
      <SEOContext.Provider value={{ updateSEO, defaultSEO }}>
        {children}
      </SEOContext.Provider>
    </HelmetProvider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
};

// SEO Component for individual pages
export const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  ogType = 'website',
  structuredData 
}) => {
  const { defaultSEO } = useSEO();
  
  const seoConfig = {
    title: title || defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    canonical: canonical || defaultSEO.canonical,
    ogImage: ogImage || defaultSEO.ogImage
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      <meta name="keywords" content={seoConfig.keywords} />
      <link rel="canonical" href={seoConfig.canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={seoConfig.title} />
      <meta property="og:description" content={seoConfig.description} />
      <meta property="og:image" content={seoConfig.ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={seoConfig.canonical} />
      <meta property="og:site_name" content="ShopStyle" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.description} />
      <meta name="twitter:image" content={seoConfig.ogImage} />
      <meta name="twitter:creator" content={defaultSEO.twitterHandle} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};