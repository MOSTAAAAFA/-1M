import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Get root element
    const root = document.documentElement;

    if (theme === 'light') {
      // Light theme colors
      root.style.setProperty('--black', '#FFFFFF');
      root.style.setProperty('--black-2', '#F5F5F5');
      root.style.setProperty('--black-3', '#F0F0F0');
      root.style.setProperty('--surface', '#FAFAFA');
      root.style.setProperty('--surface-2', '#F5F5F5');
      root.style.setProperty('--surface-3', '#F0F0F0');
      root.style.setProperty('--white', '#000000');
      root.style.setProperty('--white-70', 'rgba(0,0,0,0.70)');
      root.style.setProperty('--white-40', 'rgba(0,0,0,0.40)');
      root.style.setProperty('--white-20', 'rgba(0,0,0,0.20)');
      root.style.setProperty('--white-10', 'rgba(0,0,0,0.10)');
      root.style.setProperty('--border', 'rgba(0,0,0,0.08)');
      root.style.setProperty('--border-2', 'rgba(0,0,0,0.12)');
      root.style.setProperty('--border-3', 'rgba(0,0,0,0.16)');

      // Update body background
      document.body.style.background = '#FFFFFF';
      document.body.style.color = '#000000';
    } else {
      // Dark theme colors (original)
      root.style.setProperty('--black', '#050507');
      root.style.setProperty('--black-2', '#0a0a0e');
      root.style.setProperty('--black-3', '#0f0f15');
      root.style.setProperty('--surface', '#111117');
      root.style.setProperty('--surface-2', '#18181f');
      root.style.setProperty('--surface-3', '#1f1f28');
      root.style.setProperty('--white', '#F0EDE8');
      root.style.setProperty('--white-70', 'rgba(240,237,232,0.70)');
      root.style.setProperty('--white-40', 'rgba(240,237,232,0.40)');
      root.style.setProperty('--white-20', 'rgba(240,237,232,0.20)');
      root.style.setProperty('--white-10', 'rgba(240,237,232,0.10)');
      root.style.setProperty('--border', 'rgba(255,255,255,0.06)');
      root.style.setProperty('--border-2', 'rgba(255,255,255,0.10)');
      root.style.setProperty('--border-3', 'rgba(255,255,255,0.16)');

      // Update body background
      document.body.style.background = '#050507';
      document.body.style.color = '#F0EDE8';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
