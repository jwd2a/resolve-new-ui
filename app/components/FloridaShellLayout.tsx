'use client';

import { Suspense, ReactNode } from 'react';
import { OnboardingProvider } from '@/app/onboarding/OnboardingContext';
import { CourseProgressProvider } from '@/app/course/CourseProgressContext';

/**
 * Standalone shell for Florida-track surfaces that are *separate* from the
 * course (exam, certificate). Provides the OnboardingProvider and
 * CourseProgressProvider plus a minimal top header — no course sidebar, no
 * lesson chrome. Pages render their own content area below this header.
 */
export default function FloridaShellLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <OnboardingProvider>
        <CourseProgressProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-white border-b border-border">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                  <a href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <span className="text-xl font-semibold text-foreground">Resolve</span>
                  </a>
                  <nav className="hidden md:flex space-x-1 items-center">
                    <a href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      HOME
                    </a>
                    <a href="/course" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      COURSE
                    </a>
                    <a href="/parenting-plan" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      PARENTING PLAN
                    </a>
                    <span className="mx-2 h-5 w-px bg-gray-200" aria-hidden />
                    <a href="/course/resources" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      RESOURCES
                    </a>
                    <a href="/exam" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      FINAL EXAM
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</main>
          </div>
        </CourseProgressProvider>
      </OnboardingProvider>
    </Suspense>
  );
}
