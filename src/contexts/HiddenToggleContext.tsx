import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useHiddenToggle } from '../hooks/useHiddenToggle';

interface HiddenToggleContextType {
  hideHiddenThoughts: boolean;
  toggleHiddenVisibility: () => void;
}

const HiddenToggleContext = createContext<HiddenToggleContextType | undefined>(undefined);

export function HiddenToggleProvider({ children }: { children: ReactNode }) {
  const { hideHiddenThoughts, toggleHiddenVisibility } = useHiddenToggle();

  const value = {
    hideHiddenThoughts,
    toggleHiddenVisibility,
  };

  return (
    <HiddenToggleContext.Provider value={value}>
      {children}
    </HiddenToggleContext.Provider>
  );
}

export function useHiddenToggleContext() {
  const context = useContext(HiddenToggleContext);
  if (context === undefined) {
    throw new Error('useHiddenToggleContext must be used within a HiddenToggleProvider');
  }
  return context;
} 