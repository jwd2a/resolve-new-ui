'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ChildInfo {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
}

export interface OnboardingData {
  // Step 1: Your Info
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;

  // Step 2: Co-Parent
  coParentFirstName: string;
  coParentLastName: string;
  coParentAddress: string;
  coParentCity: string;
  coParentState: string;
  coParentZip: string;
  coParentPhone: string;
  coParentEmail: string;
  inviteSent: boolean;

  // Step 3: Children
  children: ChildInfo[];

  // Step 4: Jurisdiction
  jurisdictionState: string;

  // Step 5: Target Date
  targetDate: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  completedSteps: Set<number>;
  markStepComplete: (step: number) => void;
}

const defaultData: OnboardingData = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  coParentFirstName: '',
  coParentLastName: '',
  coParentAddress: '',
  coParentCity: '',
  coParentState: '',
  coParentZip: '',
  coParentPhone: '',
  coParentEmail: '',
  inviteSent: false,
  children: [{ id: '1', fullName: '', dateOfBirth: '', gender: '' }],
  jurisdictionState: '',
  targetDate: '',
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, completedSteps, markStepComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
