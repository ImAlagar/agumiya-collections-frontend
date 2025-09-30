import React from 'react';
import { SEO } from '../../contexts/SEOContext';
import { AboutHero, MissionSection, StatsSection, WhyChooseUs } from '../../components/user/about';


const About = () => {
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Agumiya Collections - Anime Inspired Fashion",
    "description": "Discover Agumiya Collections - where anime culture meets fashion. Express your personality with unique designs, premium quality, and trending styles since 2024.",
    "url": "https://agumiya-collections.com/about",
    "publisher": {
      "@type": "Organization",
      "name": "Agumiya Collections",
      "logo": {
        "@type": "ImageObject",
        "url": "https://agumiya-collections.com/logo.png",
        "width": 200,
        "height": 60
      },
      "description": "Anime-inspired fashion brand offering unique clothing and accessories",
      "url": "https://agumiya-collections.com"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "Agumiya Collections",
      "founder": "Agumiya Fashion Group",
      "foundingDate": "2024",
      "description": "Agumiya Collections is an anime-inspired fashion brand that blends unique designs with premium quality fabrics for self-expression.",
      "slogan": "Fashion That Expresses YOU - Anime Inspired • Premium Quality • Community Driven"
    }
  };

  return (
    <>
      <SEO
        title="About Agumiya Collections | Anime Inspired Fashion Brand"
        description="Discover Agumiya Collections - where anime culture meets fashion trends. Express your personality with unique designs, premium quality fabrics, and community-driven collections."
        keywords="agumiya about, anime fashion, anime clothing, premium quality, unique designs, fashion community, self-expression"
        canonical="https://agumiya-collections.com/about"
        ogImage="https://agumiya-collections.com/og-about-image.jpg"
        ogType="website"
        structuredData={aboutStructuredData}
      />

      <div className="min-h-screen relative overflow-hidden">
        <AboutHero />
        <WhyChooseUs />
        <MissionSection />
        <StatsSection />
      </div>
    </>
  );
};

export default About;