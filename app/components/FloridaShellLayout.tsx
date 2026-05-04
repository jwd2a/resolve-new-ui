'use client';

import { Suspense, ReactNode } from 'react';
import { OnboardingProvider } from '@/app/onboarding/OnboardingContext';
import { CourseProgressProvider } from '@/app/course/CourseProgressContext';
import AppNav from './AppNav';

/**
 * Standalone shell for surfaces that are *separate* from the course
 * (exam, certificate). Mounts the OnboardingProvider and
 * CourseProgressProvider so the page can read floridaTrack / progress
 * state, then renders the shared AppNav and a content slot.
 */
export default function FloridaShellLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <OnboardingProvider>
        <CourseProgressProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <AppNav />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</main>
          </div>
        </CourseProgressProvider>
      </OnboardingProvider>
    </Suspense>
  );
}
