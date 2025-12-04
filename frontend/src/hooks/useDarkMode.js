import { useEffect } from 'react';

export function useDarkMode() {
  useEffect(() => {
    // Apply dark mode on app load based on localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);
}
