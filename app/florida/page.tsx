'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FloridaSignupEntry() {
  const router = useRouter();

  useEffect(() => {
    // Distribution-channel landing for the Florida-approved course.
    // The actual flag is set on signup, so just route there with the
    // florida query param. The flag is not user-modifiable thereafter.
    router.replace('/signup?florida=true');
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
