

export const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Customer Support",
    value: "support@agumiyacollections.com",
  },
  {
    icon: Truck,
    label: "Shipping Info",
    value: "Free shipping over $50",
  },
  {
    icon: Shield,
    label: "Returns",
    value: "7-day return policy",
  },
];

// data.js
import { 
  Facebook, 
  Instagram, 
  Mail,
  Truck,
  Gift,
  ShoppingBag,
  Shield,
} from 'lucide-react';

// Quick links matching NavLinks
export const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" }
];

// Shop categories
export const shopCategories = [
  { name: "New Arrivals", href: "/shop?category=new" },
  { name: "Best Sellers", href: "/shop?category=bestsellers" },
  { name: "Men's Collection", href: "/shop?category=men" },
  { name: "Women's Collection", href: "/shop?category=women" },
  { name: "Accessories", href: "/shop?category=accessories" },
  { name: "Sale Items", href: "/shop?category=sale" }
];

// Customer service links
export const customerService = [
  { name: "Shipping Info", href: "/shipping", icon: <Truck size={14} /> },
  { name: "Returns & Exchanges", href: "/returns", icon: <Gift size={14} /> },
  { name: "Size Guide", href: "/size-guide", icon: <ShoppingBag size={14} /> },
];

// Social links
export const socialLinks = [
  { 
    name: "Facebook", 
    icon: <Facebook className="w-5 h-5" />,
    url: "https://facebook.com/agumiyacollections"
  },
  { 
    name: "Instagram", 
    icon: <Instagram className="w-5 h-5" />,
    url: "https://instagram.com/agumiyacollections"
  },
];

// Contact info
export const contactInfo = [
  {
    icon: <Mail size={16} />,
    text: "support@agumiyacollections.com",
    href: "mailto:support@agumiyacollections.com"
  },
];


// Export everything as default object too
export default {
  quickLinks,
  shopCategories,
  customerService,
  socialLinks,
  contactInfo,
};