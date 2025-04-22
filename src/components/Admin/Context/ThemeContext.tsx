import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme') as ThemeMode | null;
    return savedMode || 'system';
  });
  
  const [isDark, setIsDark] = useState<boolean>(false);
  
  // Effect to handle system preference and update when mode changes
  useEffect(() => {
    const updateTheme = () => {
      let darkMode = false;
      
      if (mode === 'system') {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        darkMode = mode === 'dark';
      }
      
      setIsDark(darkMode);
      document.documentElement.classList.toggle('dark', darkMode);
    };
    
    updateTheme();
    
    // Save to localStorage
    localStorage.setItem('theme', mode);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        updateTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);
  
  const toggleMode = () => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };
  
  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};