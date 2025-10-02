// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Always start with dark theme on first load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark'; // Default to dark theme
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('Setting theme to:', theme); // Debug log
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document for Tailwind
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('light', 'dark', 'smokey');
    
    // Add current theme class
    html.classList.add(theme);
    
    // For dark mode, also add 'dark' class for Tailwind
    if (theme === 'dark') {
      html.classList.add('dark');
    }
    
    console.log('Document classes:', html.className); // Debug log
    setIsInitialized(true);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'smokey';
        case 'smokey': return 'light';
        default: return 'dark';
      }
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