// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      return 'dark';
    } catch (error) {
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

      setIsInitialized(true);
    } catch (error) {
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme =
        prev === 'light' ? 'dark' :
        prev === 'dark' ? 'smokey' :
        'light';
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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
