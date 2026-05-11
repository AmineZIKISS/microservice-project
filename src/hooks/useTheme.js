import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newTheme); 
      return newTheme;
    });
  };

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  return { theme, toggleTheme };
}