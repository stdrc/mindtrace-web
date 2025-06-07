import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mindtrace-hide-hidden-thoughts';

export function useHiddenToggle() {
  const [hideHiddenThoughts, setHideHiddenThoughts] = useState<boolean>(() => {
    // Default is true (hide hidden thoughts)
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hideHiddenThoughts));
  }, [hideHiddenThoughts]);

  const toggleHiddenVisibility = () => {
    setHideHiddenThoughts(prev => !prev);
  };

  return {
    hideHiddenThoughts,
    toggleHiddenVisibility
  };
} 