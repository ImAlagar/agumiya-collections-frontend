// src/constants.js
import {
  Mail,
  Truck,
  Shield,
} from "lucide-react";

export const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Customer Support",
    value: "agumiyacollections",
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
    {
    icon: Shield, // or you can use a different icon (like DollarSign) for refund
    label: "Refund",
    value: "Refund within 3 days",
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
