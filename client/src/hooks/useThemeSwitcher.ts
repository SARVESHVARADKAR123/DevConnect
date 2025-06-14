import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const useThemeSwitcher = () => {
  const theme = useContext(ThemeContext);
  const toggleTheme = () => {
    const next = theme.mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    window.location.reload(); // or trigger re-render
  };
  return toggleTheme;
};
