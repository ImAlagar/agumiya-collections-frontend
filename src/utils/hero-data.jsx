// src/utils/hero-data.js
import hero6 from "../assets/images/hero-slide6.png";
import hero5 from "../assets/images/home.png";
import hero8 from "../assets/images/hero-slide8.png";
import hero9 from "../assets/images/hero-slide5.png";

export const heroSlides = [
  {
    id: 1,
    image: hero9,
    title: "Unisex Collection",
    subtitle: "For Everyone",
    description: "Style without boundaries. Discover our versatile unisex collection designed for all genders and occasions.",
    accentColor: "text-purple-400",
    badge: "Popular",
    discount: "30% OFF",
    bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    features: ["Gender Neutral", "Versatile Styles", "Premium Quality"]
  },
  {
    id: 2,
    image: hero6,
    title: "Phone Accessories",
    subtitle: "Tech Essentials",
    description: "Protect and personalize your devices with our premium phone cases, covers, and tech accessories.",
    accentColor: "text-cyan-400",
    badge: "Bestseller",
    discount: "25% OFF",
    bgImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1600&q=80",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
    features: ["Device Protection", "Latest Models", "Fast Shipping"]
  },
  {
    id: 3,
    image: hero5,
    title: "Home & Living",
    subtitle: "Comfort Redefined",
    description: "Transform your space with our premium home collection. Quality and comfort in every detail.",
    accentColor: "text-emerald-400",
    badge: "Sale",
    discount: "35% OFF",
    bgImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    features: ["Home Essentials", "Quality Materials", "Affordable Luxury"]
  },
  {
    id: 4,
    image: hero8,
    title: "Men's Fashion",
    subtitle: "Modern Style",
    description: "Elevate your wardrobe with our curated men's collection. From casual to formal, we've got you covered.",
    accentColor: "text-blue-400",
    badge: "New Arrivals",
    discount: "40% OFF",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    features: ["Modern Designs", "Premium Fabrics", "Perfect Fit"]
  },
];

export default heroSlides;