// src/constants.js
import {
  Mail,
  Phone,
  MapPin,
  Truck,
  Headphones,
  Shield,
} from "lucide-react";

export const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Customer Support",
    value: "agumiyacollections",
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

export const SOCIAL_LINKS = [
  {
    name: "Instagram",
    icon: ({ size = 22 }) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={size} height={size} viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.25 14.816 3.76 13.665 3.76 12.368s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
      </svg>
    ),
    url: "https://instagram.com/agumiyacollections",
    color: "hover:text-pink-400",
    bgcolor: "hover:bg-pink-800",
  },
  {
    name: "Facebook",
    icon: ({ size = 22 }) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={size} height={size} viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    url: "https://facebook.com/agumiyacollections",
    color: "hover:text-blue-400",
    bgcolor: "hover:bg-blue-800",
  },
  {
    name: "Twitter",
    icon: ({ size = 22 }) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={size} height={size} viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.543l-.047-.02z"/>
      </svg>
    ),
    url: "https://twitter.com/agumiyacollections",
    color: "hover:text-sky-400",
    bgcolor: "hover:bg-sky-800",
  },
  {
    name: "Pinterest",
    icon: ({ size = 22 }) => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={size} height={size} viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM13.761 15.86c-1.049 0-2.03-.52-2.456-1.378l-.656-2.536c-.203.406-.812 1.114-1.214 1.114-.244 0-.447-.203-.447-.52 0-.894 1.378-2.68 1.378-4.542 0-1.703-1.012-2.721-2.6-2.721-1.541 0-2.761 1.114-2.761 2.598 0 .732.244 1.256.65 1.622.182.203.244.325.162.569-.04.162-.203.813-.244.975-.081.325-.325.406-.569.244-1.541-.894-2.315-3.17-2.315-4.867 0-3.17 2.315-5.728 6.5-5.728 3.536 0 5.89 2.315 5.89 5.24 0 3.536-1.865 5.89-4.378 5.89z"/>
      </svg>
    ),
    url: "https://pinterest.com/agumiyacollections",
    color: "hover:text-red-400",
    bgcolor: "hover:bg-red-800",
  },
];


export const DEFAULT_HERO_DATA = {
  title: "I'm Alagar",
  subtitles: ["Full Stack Developer"],
  descriptions: ["I build scalable web applications"],
  buttonText: "Download CV",
  buttonLink: "#",
  imageUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  stats: {
    projects: "10+",
    customers: "15+",
    libraries: "5+",
    experience: "3+",
  },
  // 👇 give at least one background
  backgrounds: [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    },
  ],
  socialLinks: [],
};
