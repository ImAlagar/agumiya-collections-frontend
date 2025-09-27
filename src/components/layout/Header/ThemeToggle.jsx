// src/components/Header/ThemeToggle.jsx
import { motion } from 'framer-motion';
import { Sun, Moon } from "lucide-react";
import { useTheme } from '../../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 
                 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:shadow-md transition-all"
    >
      {theme ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
};

export default ThemeToggle;