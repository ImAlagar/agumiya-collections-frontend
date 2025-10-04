// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import logger from '../utils/logger'; // ✅ Professional logger

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        logger.info(`🎨 Loaded saved theme: ${savedTheme}`);
        return savedTheme;
      }
      logger.info('🎨 No saved theme found, defaulting to dark');
      return 'dark';
    } catch (error) {
      logger.error('❌ Failed to load theme from localStorage', error);
      return 'dark';
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Save theme to localStorage
      localStorage.setItem('theme', theme);

      // Apply to document for Tailwind
      const html = document.documentElement;
      html.classList.remove('light', 'dark', 'smokey');
      html.classList.add(theme);

      if (theme === 'dark') html.classList.add('dark');

      logger.info(`🌗 Theme applied: ${theme}`);
      setIsInitialized(true);
    } catch (error) {
      logger.error('❌ Failed to apply theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme =
        prev === 'light' ? 'dark' :
        prev === 'dark' ? 'smokey' :
        'light';
      logger.info(`🔁 Theme toggled: ${prev} → ${nextTheme}`);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    logger.error('❌ useTheme used outside of ThemeProvider');
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
