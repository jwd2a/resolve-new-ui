'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PlanContextType {
  isProposed: boolean;
  setIsProposed: (value: boolean) => void;
}

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [isProposed, setIsProposed] = useState(false);

  return (
    <PlanContext.Provider value={{ isProposed, setIsProposed }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
