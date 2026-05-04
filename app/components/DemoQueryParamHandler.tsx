'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { STORAGE_KEY as ONBOARDING_STORAGE_KEY } from '@/app/onboarding/OnboardingContext';
import { STORAGE_KEY as PROGRESS_STORAGE_KEY } from '@/app/course/CourseProgressContext';
import { getAllVisibleLessonIds } from '@/app/course/data';

/**
 * One-shot demo query-param handler. On any page, append `?demo=florida` to
 * enable Florida mode + complete all lessons + pass the exam (so the
 * certificate unlocks too). Useful for sharing client preview links like
 * `/exam?demo=florida` that drop them straight into the experience.
 *
 * Strips the param from the URL after applying so refreshes don't re-run.
 */
function DemoHandlerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const demo = searchParams.get('demo');
    if (!demo) return;

    const florida = demo === 'florida' || demo === 'florida-pass';
    const passExam = demo === 'florida-pass';

    if (florida) {
      try {
        const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        const existing = raw ? JSON.parse(raw) : {};
        localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify({
            ...existing,
            floridaTrack: true,
            jurisdictionState: 'Florida',
            // Friendly placeholder name so the certificate renders nicely.
            firstName: existing.firstName || 'Florida',
            lastName: existing.lastName || 'Demo',
          }),
        );
      } catch {
        // ignore
      }

      try {
        localStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify({
            completedLessons: getAllVisibleLessonIds(true),
            examPassed: passExam,
          }),
        );
      } catch {
        // ignore
      }
    }

    // Strip the demo param so refreshes/back-nav don't keep firing.
    const next = new URLSearchParams(searchParams.toString());
    next.delete('demo');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);

    // Force a refresh so contexts re-hydrate from the new localStorage state.
    // router.replace alone doesn't remount existing providers.
    if (florida) {
      // Defer a tick so the URL change commits first.
      setTimeout(() => window.location.reload(), 0);
    }
  }, [searchParams, router, pathname]);

  return null;
}

export default function DemoQueryParamHandler() {
  return (
    <Suspense fallback={null}>
      <DemoHandlerInner />
    </Suspense>
  );
}
