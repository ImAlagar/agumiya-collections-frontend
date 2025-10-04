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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5Zm0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5ZM17.75 6a.75.75 0 1 1 0 1.5h-.01a.75.75 0 0 1 0-1.5h.01Z" />
      </svg>
    ),
    url: "https://instagram.com/agumiyacollections_com",
    color: "hover:text-pink-400",
    bgcolor: "hover:bg-pink-800",
  },
  {
    name: "Facebook",
    icon: ({ size = 22 }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.5 22v-8.25h2.77l.41-3.2h-3.18V8.83c0-.93.26-1.56 1.58-1.56h1.69V4.35A22.41 22.41 0 0 0 13.88 4C11.46 4 9.75 5.5 9.75 8.52v2.03H7v3.2h2.75V22h3.75Z" />
      </svg>
    ),
    url: "https://www.facebook.com/profile.php?id=61581576428542",
    color: "hover:text-blue-400",
    bgcolor: "hover:bg-blue-800",
  },
];


