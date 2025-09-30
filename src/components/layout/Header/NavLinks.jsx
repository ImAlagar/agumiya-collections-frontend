// src/components/Header/NavLinks.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const NavLinks = ({ mobile = false, onItemClick , onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('');
  const [hoveredLink, setHoveredLink] = useState(null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];



  useEffect(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) setActiveLink(currentItem.name);
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: mobile ? 0.05 : 0.1 
      } 
    },
  };

  const itemVariants = mobile
    ? { 
        hidden: { x: -20, opacity: 0 }, 
        visible: { 
          x: 0, 
          opacity: 1, 
          transition: { type: 'spring', stiffness: 300 } 
        } 
      }
    : { 
        hidden: { y: -10, opacity: 0 }, 
        visible: { 
          y: 0, 
          opacity: 1, 
          transition: { type: 'spring', stiffness: 300 } 
        } 
      };

  const handleItemClick = (itemName) => {
    setActiveLink(itemName);
    // Call the onLinkClick prop to close the mobile menu
    if (mobile && onLinkClick) {
      onLinkClick();
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
    if (mobile && onItemClick) {
      onItemClick();
    }
  };

  // Different underline styles for variety
  const underlineStyles = [
    "from-blue-500 to-purple-500 via-cyan-400", // Home
    "from-green-400 to-blue-500 via-teal-400",  // Shop
    "from-orange-400 to-red-500 via-yellow-400", // Track Order
    "from-purple-400 to-pink-500 via-violet-400", // Blog
    "from-teal-400 to-blue-400 via-green-400",   // About
    "from-pink-400 to-rose-500 via-red-400",     // Contact
  ];

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={mobile ? 'space-y-1' : 'flex items-center space-x-1 lg:space-x-8'}
    >
      {navItems.map((item, index) => (
        <motion.div 
          key={item.name} 
          variants={itemVariants}
          className="relative"
          onMouseEnter={() => setHoveredLink(item.name)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <Link
            to={item.path}
            onClick={() => handleItemClick(item.name)}
            className={`
              relative block px-4 py-3 lg:px-3 lg:py-2 font-medium transition-all duration-500
              ${mobile ? 'text-lg' : 'text-sm'}
              ${
                activeLink === item.name
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }
            `}
          >
            {item.name}
            
            {/* Active Link Underline - Gradient Flow */}
            {activeLink === item.name && (
              <motion.span
                initial={false}
                animate={{ scaleX: 1 }}
                className="absolute left-0 bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Hover Effect 1: Expanding Gradient Underline */}
            <motion.span
              initial={false}
              animate={{ 
                scaleX: hoveredLink === item.name ? 1 : 0,
                opacity: hoveredLink === item.name ? 1 : 0
              }}
              className={`absolute left-0 bottom-1 w-full h-0.5 bg-gradient-to-r ${underlineStyles[index]} rounded-full transform origin-left`}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                duration: 0.4 
              }}
            />

            {/* Hover Effect 2: Shimmer Text Effect */}
            {hoveredLink === item.name && activeLink !== item.name && (
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            )}

            {/* Hover Effect 3: Floating Dots */}
            {hoveredLink === item.name && (
              <>
                <motion.span
                  initial={{ scale: 0, y: 0 }}
                  animate={{ scale: 1, y: -2 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                  className="absolute -top-1 -left-1 w-1 h-1 bg-blue-400 rounded-full"
                />
                <motion.span
                  initial={{ scale: 0, y: 0 }}
                  animate={{ scale: 1, y: -2 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  className="absolute -top-1 -right-1 w-1 h-1 bg-purple-400 rounded-full"
                />
              </>
            )}

          </Link>

          {/* Hover Effect 4: Magnetic Pull Animation */}
          {hoveredLink === item.name && !mobile && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 border-2 border-blue-300/30 rounded-lg pointer-events-none"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
};

export default NavLinks;