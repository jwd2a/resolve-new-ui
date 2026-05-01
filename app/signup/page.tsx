'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { STORAGE_KEY } from '@/app/onboarding/OnboardingContext';

function SignupInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFlorida = searchParams.get('florida') === 'true';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = firstName && lastName && email && password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    let existing: Record<string, unknown> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) existing = JSON.parse(raw);
    } catch {
      // corrupted blob — start fresh
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existing,
          firstName,
          lastName,
          floridaTrack: isFlorida,
          ...(isFlorida ? { jurisdictionState: 'Florida' } : {}),
        }),
      );
    } catch {
      // ignore quota / private mode
    }
    router.replace('/onboarding/your-info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isFlorida && (
          <div className="bg-white/15 backdrop-blur border border-white/30 rounded-xl p-4 mb-4 flex items-start gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
            <div className="text-white">
              <div className="text-sm font-semibold">Florida-Approved Parent Education Course</div>
              <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                You&apos;re registering for the Florida Department of Children and Families approved
                Parent Education and Family Stabilization Course. Complete the program and exam to
                receive your certificate of completion.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Resolve</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-600 mb-6">
            {isFlorida
              ? 'Set up your account to begin the Florida parenting course.'
              : 'Set up your account to start your parenting plan.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">At least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFlorida ? 'Create account & start Florida course' : 'Create account'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-5">
            By creating an account you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light" />}>
      <SignupInner />
    </Suspense>
  );
}
