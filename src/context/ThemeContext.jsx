import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ThemeContext provides global light/dark theme state across
 * the entire component tree without prop-drilling.
 */
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Read initial theme preference from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      return saved ? JSON.parse(saved) : 'light';
    } catch {
      return 'light';
    }
  });

  // Keep DOM data-theme attribute and localStorage in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('app_theme', JSON.stringify(theme));
    } catch (err) {
      console.error('Failed to save theme in localStorage:', err);
    }
  }, [theme]);

  // Toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for convenient access to ThemeContext
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
