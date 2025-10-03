import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FocusModeContextType {
  focusModeEnabled: boolean;
  toggleFocusMode: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [focusModeEnabled, setFocusModeEnabled] = useState(() => {
    const saved = localStorage.getItem('focusModeEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('focusModeEnabled', JSON.stringify(focusModeEnabled));
  }, [focusModeEnabled]);

  const toggleFocusMode = () => {
    setFocusModeEnabled((prev: boolean) => !prev);
  };

  return (
    <FocusModeContext.Provider value={{ focusModeEnabled, toggleFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusModeContext() {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error('useFocusModeContext must be used within a FocusModeProvider');
  }
  return context;
}
