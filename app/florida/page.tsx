'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEY } from '@/app/onboarding/OnboardingContext';

export default function FloridaSignupEntry() {
  const router = useRouter();

  useEffect(() => {
    // Mirror what the production app would do: flip the admin-only Florida
    // bit on the new user record before sending them into onboarding. In
    // the prototype this lives in localStorage so OnboardingContext picks
    // it up via its lazy useState initializer on the next mount. The write
    // must complete before router.replace fires (it does — both are sync).
    let existing: Record<string, unknown> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) existing = JSON.parse(raw);
    } catch {
      // corrupted blob — start fresh so the Florida flag still lands
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...existing, floridaTrack: true, jurisdictionState: 'Florida' }),
      );
    } catch {
      // ignore quota / private mode
    }
    router.replace('/onboarding/your-info');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Setting up your Florida course</h1>
        <p className="text-sm text-gray-600">One moment while we get things ready…</p>
      </div>
    </div>
  );
}
