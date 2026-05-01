'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Set at signup; admin-only flag, not user-modifiable in real app.
  // Drives Florida DCFS-track behavior throughout the course.
  floridaTrack: boolean;
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
  floridaTrack: false,
};

const STORAGE_KEY = 'resolve.onboarding.v1';

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Hydrate from localStorage on mount so floridaTrack survives navigation.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingData>;
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore — fall back to defaults
    }
  }, []);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota / private mode
      }
      return next;
    });
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
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
