'use client';

import { useState } from 'react';
import { LockClosedIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/app/onboarding/OnboardingContext';
import { useCourseProgress } from '@/app/course/CourseProgressContext';

export default function CertificatePage() {
  const { data } = useOnboarding();
  const { examPassed } = useCourseProgress();

  // Computed once on mount so the value is stable across re-renders and
  // avoids any SSR hydration mismatch from Date.now().
  const [issuedOn] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );
  const [certificateId] = useState(
    () => `RES-${Date.now().toString(36).toUpperCase()}`,
  );

  if (!data.floridaTrack) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Certificate not required</h1>
        <p className="text-gray-600">A certificate of completion is only issued for Florida-approved courses.</p>
      </div>
    );
  }

  if (!examPassed) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl border border-border p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="w-6 h-6 text-gray-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Certificate — Locked</h1>
        <p className="text-sm text-gray-600">
          Pass the final exam to unlock your certificate of completion.
        </p>
      </div>
    );
  }

  const fullName = `${data.firstName} ${data.lastName}`.trim() || 'Course Participant';

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold">Certificate of Completion</h1>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Download / Print
        </button>
      </div>

      <div
        id="certificate"
        className="bg-white border-[6px] border-double border-primary/40 rounded-xl p-12 text-center shadow-xl print:shadow-none print:border-primary"
      >
        <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
          Florida Department of Children and Families — Approved Course
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
        <p className="text-sm text-gray-600 mb-10">This certifies that</p>
        <div className="text-4xl font-serif italic text-primary mb-10">{fullName}</div>
        <p className="text-sm text-gray-700 max-w-xl mx-auto mb-10 leading-relaxed">
          has successfully completed the Resolve Co-Parenting Course, including all required
          coursework, the Florida Parent Education and Family Stabilization curriculum, and the
          end-of-course examination as required by Florida Statute § 61.21.
        </p>
        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-6 border-t border-gray-200">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Issued</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{issuedOn}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Certificate ID</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{certificateId}</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; }
          header, nav, aside, .print\\:hidden { display: none !important; }
          #certificate { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
