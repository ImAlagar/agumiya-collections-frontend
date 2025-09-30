// src/pages/Home.jsx
import CollectionGrid from "../../components/ui/collections/CollectionGrid";
import ResponsiveHero from "../../components/ui/hero/ResponsiveHero";
import FeaturedProducts from "../../components/ui/products/FeaturedProducts";
import { SEO } from "../../contexts/SEOContext";
import '../../styles/swiper-custom.css'

const Home = () => {
  return (
    <div className="">
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
      <CollectionGrid />
      <FeaturedProducts />
    </div>
  );
};

export default Home;