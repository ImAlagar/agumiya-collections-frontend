

export const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Customer Support",
    value: "support@agumiyacollections.com",
  },
  {
    icon: Phone,
    label: "Order Support",
    value: "+1 (555) 123-4567",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "123 Fashion Street, Chennai, India",
  },
  {
    icon: Truck,
    label: "Shipping Info",
    value: "Free shipping over $50",
  },
  {
    icon: Headphones,
    label: "Live Chat",
    value: "Available 24/7",
  },
  {
    icon: Shield,
    label: "Returns",
    value: "30-day return policy",
  },
];

// data.js
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Truck,
  Gift,
  ShoppingBag,
  Shield,
  Headphones
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
  { name: "Privacy Policy", href: "/privacy", icon: <Shield size={14} /> },
  { name: "Terms of Service", href: "/terms", icon: <Shield size={14} /> }
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
  { 
    name: "Twitter", 
    icon: <Twitter className="w-5 h-5" />,
    url: "https://twitter.com/agumiyacollections"
  },
  { 
    name: "WhatsApp", 
    icon: <MessageCircle className="w-5 h-5" />,
    url: "https://wa.me/yourphonenumber"
  }
];

// Contact info
export const contactInfo = [
  {
    icon: <Mail size={16} />,
    text: "support@agumiyacollections.com",
    href: "mailto:support@agumiyacollections.com"
  },
  {
    icon: <Phone size={16} />,
    text: "+1 (555) 123-4567",
    href: "tel:+15551234567"
  },
  {
    icon: <MapPin size={16} />,
    text: "123 Fashion Street, Chennai, India",
    href: "#"
  }
];

// Payment methods
export const paymentMethods = [
  "Visa", "MasterCard", "PayPal", "Apple Pay", "Google Pay"
];

// Export everything as default object too
export default {
  quickLinks,
  shopCategories,
  customerService,
  socialLinks,
  contactInfo,
  paymentMethods
};