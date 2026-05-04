'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { STORAGE_KEY as ONBOARDING_STORAGE_KEY } from '@/app/onboarding/OnboardingContext';
import { STORAGE_KEY as PROGRESS_STORAGE_KEY } from '@/app/course/CourseProgressContext';
import { getAllVisibleLessonIds } from '@/app/course/data';

interface AppNavProps {
  /** Extra slot rendered to the left of the avatar (page-specific actions, indicators, etc.). */
  rightExtras?: ReactNode;
  /** Hide the avatar entirely (e.g. on signup/onboarding chrome). */
  hideAvatar?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  /** Render as disabled/locked. */
  locked?: boolean;
  lockedHint?: string;
}

function readFloridaTrack(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { floridaTrack?: boolean };
    return !!parsed.floridaTrack;
  } catch {
    return false;
  }
}

function readExamUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { completedLessons?: string[] };
    const done = new Set(parsed.completedLessons ?? []);
    const required = getAllVisibleLessonIds(true);
    return required.every((id) => done.has(id));
  } catch {
    return false;
  }
}

const BASE_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/course', label: 'Course' },
  { href: '/parenting-plan', label: 'Parenting Plan' },
  { href: '/family-info', label: 'Family Info' },
];

export default function AppNav({ rightExtras, hideAvatar = false }: AppNavProps) {
  const pathname = usePathname();
  // Lazy init keeps the value stable across renders without an effect.
  const [isFlorida] = useState(() => readFloridaTrack());
  const [examUnlocked] = useState(() => readExamUnlocked());

  const floridaItems: NavItem[] = isFlorida
    ? [
        { href: '/resources', label: 'Resources' },
        {
          href: '/exam',
          label: 'Final Exam',
          locked: !examUnlocked,
          lockedHint: 'Finish all lessons to unlock',
        },
      ]
    : [];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/course') {
      // Dashboard, exam, certificate, resources are NOT considered "course".
      return (
        pathname === '/course' ||
        (pathname.startsWith('/course/') && pathname !== '/resources')
      );
    }
    if (href === '/exam') return pathname === '/exam';
    if (href === '/resources') return pathname === '/resources';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Resolve</span>
            </a>
            <nav className="hidden md:flex items-center space-x-1">
              {BASE_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} />
              ))}
              {floridaItems.length > 0 && (
                <>
                  <span className="mx-2 h-5 w-px bg-gray-200" aria-hidden />
                  {floridaItems.map((item) => (
                    <NavLink key={item.href} item={item} active={isActive(item.href)} />
                  ))}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {rightExtras}
            {!hideAvatar && (
              <button
                aria-label="Account"
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                SD
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const baseClass = 'px-3 py-2 text-sm font-medium rounded-lg transition-colors';
  if (item.locked) {
    return (
      <span
        title={item.lockedHint}
        className={`${baseClass} text-gray-400 cursor-not-allowed inline-flex items-center gap-1`}
      >
        {item.label}
        <LockClosedIcon className="w-3.5 h-3.5" />
      </span>
    );
  }
  return (
    <a
      href={item.href}
      className={
        active
          ? `${baseClass} text-primary bg-primary/5`
          : `${baseClass} text-gray-600 hover:text-primary hover:bg-primary/5`
      }
    >
      {item.label}
    </a>
  );
}
