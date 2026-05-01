# Florida Parenting Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Florida-track" mode that satisfies Florida Department of Children and Family Services (DCFS) approval requirements: four extra lessons, a resource center (glossary + community resources), a locked video player (no skip/fast-forward), an end-of-course exam, and a downloadable certificate. The track is enabled at signup via a flag on the user record and is not user-modifiable thereafter.

**Architecture:** A single `floridaTrack` boolean flag (set at signup, persisted in `OnboardingContext` + `localStorage`) drives all conditional behavior. Course data gains `floridaOnly` markers on the four new lessons (appended to the existing Module 5 "Final Considerations" — no new module is created for now), the sidebar filters by mode, the existing `LessonVideoContent` gains a `lockedPlayback` mode that disables seeking and gates the "Next" button until the video is watched in full, and three new pages (`/course/resources`, `/course/exam`, `/course/certificate`) cover the remaining DCFS deliverables. No backend exists in this prototype — completion state lives in a new `CourseProgressContext` backed by `localStorage`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Heroicons. No backend.

**Source transcript:** `/Users/justin/Downloads/Eric __ Justin Transcript.txt` (Eric ↔ Justin, 2026-04-30)

**Out of scope (separate plans/streams):**
- The "you take it / I take it / we merge it" solo+merge flow.
- Mobile-only home screen / mobile course access.
- Re-shooting the existing course in solo voice (assets-only work, no code).
- Real backend persistence and admin tooling for the flag.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `app/onboarding/OnboardingContext.tsx` | Modify | Add `floridaTrack: boolean` to `OnboardingData`, persist to `localStorage` so the flag survives navigation between `/onboarding/*` and `/course/*`. |
| `app/florida/page.tsx` | Create | Florida-only signup entry. Sets `floridaTrack=true` then redirects to `/onboarding/your-info`. Mirrors the future production "different subdomain / different signup page" decision discussed in the transcript. |
| `app/course/data.ts` | Modify | Add `floridaOnly?: boolean` to `CourseLesson`. Append the four DCFS-required lessons to Module 5 ("Final Considerations") with the `floridaOnly` flag. Add `getVisibleModules(isFlorida)` and `getAllVisibleLessonIds(isFlorida)` helpers. |
| `app/course/CourseProgressContext.tsx` | Create | Tracks `completedLessons: Set<string>`, `examPassed: boolean`, `markLessonComplete()`, `markExamPassed()`. Backed by `localStorage`. |
| `app/course/layout.tsx` | Modify | Wrap children with `CourseProgressProvider`. Filter sidebar modules through `getVisibleModules(floridaTrack)`. Add Florida-only sidebar entries for Resources, Exam, Certificate. |
| `app/components/CourseNavSidebar.tsx` | Modify | Render an additional "Florida Requirements" sub-nav (Resources / Exam / Certificate) below the modules when in Florida mode. Show lock icons on Exam/Certificate until prerequisites met. |
| `app/components/LessonVideoContent.tsx` | Modify | Accept `lockedPlayback?: boolean` and `onComplete?: () => void`. When locked: hide native controls, render a single Play/Pause + progress bar (no scrubbing), call `onComplete` when video reaches the end, and disable the page-level Next button (via a render-prop or sibling) until then. |
| `app/course/module-5/lesson-4/page.tsx` | Create | Florida lesson — Domestic Violence & Family Safety. Locked video. |
| `app/course/module-5/lesson-5/page.tsx` | Create | Florida lesson — Effects of Divorce on Children (Florida-specific). Locked video. |
| `app/course/module-5/lesson-6/page.tsx` | Create | Florida lesson — Florida Statutes & Court Process. Locked video. |
| `app/course/module-5/lesson-7/page.tsx` | Create | Florida lesson — Co-Parenting Best Practices (Florida-specific). Locked video. |
| `app/course/resources/page.tsx` | Create | Resource center: Glossary of Terms, Community Resources, Participant Satisfaction Survey link. |
| `app/course/exam/page.tsx` | Create | End-of-course test. Locked until all visible lessons complete. 10-question multiple-choice quiz, pass = 80%. On pass, sets `examPassed=true` and routes to `/course/certificate`. |
| `app/course/certificate/page.tsx` | Create | DCFS certificate of completion. Locked until `examPassed`. "Download" button uses `window.print()` against a print-styled certificate `<div>`. |
| `app/course/exam/data.ts` | Create | Exam questions array (10 Florida-specific MCQs). |
| `app/course/resources/data.ts` | Create | Glossary entries + community resource entries. |

---

### Task 1: Persist `floridaTrack` flag in `OnboardingContext`

**Files:**
- Modify: `app/onboarding/OnboardingContext.tsx`

- [ ] **Step 1: Add `floridaTrack` to the data shape, defaults, and provider**

Replace the entire contents of `app/onboarding/OnboardingContext.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify type-check and build still pass**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: Build completes with no TypeScript errors. Existing onboarding pages still compile.

- [ ] **Step 3: Commit**

```bash
git add app/onboarding/OnboardingContext.tsx
git commit -m "feat(onboarding): persist floridaTrack flag in context + localStorage"
```

---

### Task 2: Florida signup entry page

**Files:**
- Create: `app/florida/page.tsx`

- [ ] **Step 1: Create the entry page that sets the flag and redirects**

Create `app/florida/page.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'resolve.onboarding.v1';

export default function FloridaSignupEntry() {
  const router = useRouter();

  useEffect(() => {
    // Mirror what the production app would do: flip the admin-only Florida
    // bit on the new user record before sending them into onboarding. In
    // the prototype this lives in localStorage so OnboardingContext picks
    // it up on hydrate.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...existing, floridaTrack: true, jurisdictionState: 'Florida' }),
      );
    } catch {
      // ignore
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
```

- [ ] **Step 2: Manually verify the redirect**

Run: `npm run dev`

Visit `http://localhost:3000/florida`. Expected: brief loading card, then redirect to `/onboarding/your-info`. Open DevTools → Application → Local Storage → `resolve.onboarding.v1` and confirm `floridaTrack: true`.

- [ ] **Step 3: Commit**

```bash
git add app/florida/page.tsx
git commit -m "feat(florida): add /florida signup entry that flips floridaTrack flag"
```

---

### Task 3: Add Florida lessons to course data + visibility helpers

**Files:**
- Modify: `app/course/data.ts`

- [ ] **Step 1: Extend types and append Florida lessons to Module 5**

Per the design decision: do NOT create a new module. Instead, append the four DCFS-required lessons to Module 5 ("Final Considerations") with a `floridaOnly` flag so non-Florida users don't see them.

Replace the entire contents of `app/course/data.ts` with:

```ts
export interface CourseLesson {
  id: string;
  number: number;
  title: string;
  href: string;
  implemented?: boolean;
  /** Only visible/required when the user is on the Florida track. */
  floridaOnly?: boolean;
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  lessons: CourseLesson[];
}

export const courseModules: CourseModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Welcome to Resolve',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Introduction to Resolve', href: '/course/module-1/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'How the Process Works', href: '/course/module-1/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Setting Expectations', href: '/course/module-1/lesson-3' },
      { id: 'lesson-4', number: 4, title: 'Getting Started', href: '/course/module-1/lesson-4' },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Parental Responsibility and Decision Making',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Shared Decision-Making', href: '/course/module-2/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'Resolving Disagreements', href: '/course/module-2/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Day-to-Day Decisions', href: '/course/module-2/lesson-3' },
      { id: 'lesson-4', number: 4, title: 'Extra-curricular Activities', href: '/course/module-2/lesson-4' },
      { id: 'lesson-5', number: 5, title: 'Sharing Information/Records', href: '/course/module-2/lesson-5' },
      { id: 'lesson-6', number: 6, title: 'Communication', href: '/course/module-2/lesson-6' },
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Timesharing Schedule',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Introduction to Time Sharing', href: '/course/module-3/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'Scheduling and Our Calendar', href: '/course/module-3/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Weekday and Weekend Schedule', href: '/course/module-3/lesson-3', implemented: true },
      { id: 'lesson-4', number: 4, title: 'School Breaks', href: '/course/module-3/lesson-4' },
      { id: 'lesson-5', number: 5, title: 'Holiday Schedule', href: '/course/module-3/lesson-5', implemented: true },
      { id: 'lesson-6', number: 6, title: 'Transportation and Exchange', href: '/course/module-3/lesson-6', implemented: true },
      { id: 'lesson-7', number: 7, title: 'Other Travel Considerations', href: '/course/module-3/lesson-7' },
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Educational Decisions',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'School Choice and Enrollment', href: '/course/module-4/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'Academic Performance and Support', href: '/course/module-4/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Parent-Teacher Communication', href: '/course/module-4/lesson-3' },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Final Considerations',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Number of Overnights', href: '/course/module-5/lesson-1', implemented: true },
      { id: 'lesson-2', number: 2, title: 'Relocation', href: '/course/module-5/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Changes or Modifications', href: '/course/module-5/lesson-3' },
      // Florida DCFS-required lessons appended here. Hidden unless floridaTrack is true.
      { id: 'lesson-4', number: 4, title: 'Domestic Violence and Family Safety', href: '/course/module-5/lesson-4', floridaOnly: true, implemented: true },
      { id: 'lesson-5', number: 5, title: 'Effects of Divorce on Children', href: '/course/module-5/lesson-5', floridaOnly: true, implemented: true },
      { id: 'lesson-6', number: 6, title: 'Florida Statutes and the Court Process', href: '/course/module-5/lesson-6', floridaOnly: true, implemented: true },
      { id: 'lesson-7', number: 7, title: 'Co-Parenting Best Practices', href: '/course/module-5/lesson-7', floridaOnly: true, implemented: true },
    ],
  },
];

/**
 * Returns the modules visible to a user. All modules are always visible
 * (we don't hide whole modules); call sites should filter lessons by
 * `floridaOnly` separately if they need to hide individual rows.
 */
export function getVisibleModules(isFlorida: boolean): CourseModule[] {
  return courseModules.map((m) => ({
    ...m,
    lessons: m.lessons.filter((l) => isFlorida || !l.floridaOnly),
  }));
}

export function getAllVisibleLessonIds(isFlorida: boolean): string[] {
  return getVisibleModules(isFlorida).flatMap((m) =>
    m.lessons.map((l) => `${m.id}/${l.id}`),
  );
}

export function getFirstImplementedLesson(): string {
  for (const module of courseModules) {
    for (const lesson of module.lessons) {
      if (lesson.implemented && !lesson.floridaOnly) return lesson.href;
    }
  }
  return '/course/module-1/lesson-1';
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors. Existing imports of `courseModules` and `getFirstImplementedLesson` still resolve.

- [ ] **Step 3: Commit**

```bash
git add app/course/data.ts
git commit -m "feat(course): add Florida-only module + getVisibleModules helper"
```

---

### Task 4: Course progress tracking context

**Files:**
- Create: `app/course/CourseProgressContext.tsx`

- [ ] **Step 1: Build the provider**

Create `app/course/CourseProgressContext.tsx`:

```tsx
'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface CourseProgressState {
  completedLessons: Set<string>; // ids shaped like "module-id/lesson-id"
  examPassed: boolean;
}

interface CourseProgressContextType extends CourseProgressState {
  isLessonComplete: (lessonKey: string) => boolean;
  markLessonComplete: (lessonKey: string) => void;
  markExamPassed: () => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'resolve.courseProgress.v1';

const CourseProgressContext = createContext<CourseProgressContextType | null>(null);

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CourseProgressState>({
    completedLessons: new Set(),
    examPassed: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { completedLessons: string[]; examPassed: boolean };
      setState({
        completedLessons: new Set(parsed.completedLessons ?? []),
        examPassed: !!parsed.examPassed,
      });
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: CourseProgressState) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedLessons: Array.from(next.completedLessons),
          examPassed: next.examPassed,
        }),
      );
    } catch {
      // ignore
    }
  };

  const isLessonComplete = useCallback(
    (lessonKey: string) => state.completedLessons.has(lessonKey),
    [state.completedLessons],
  );

  const markLessonComplete = useCallback((lessonKey: string) => {
    setState((prev) => {
      if (prev.completedLessons.has(lessonKey)) return prev;
      const next = {
        ...prev,
        completedLessons: new Set(prev.completedLessons).add(lessonKey),
      };
      persist(next);
      return next;
    });
  }, []);

  const markExamPassed = useCallback(() => {
    setState((prev) => {
      if (prev.examPassed) return prev;
      const next = { ...prev, examPassed: true };
      persist(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const next = { completedLessons: new Set<string>(), examPassed: false };
    setState(next);
    persist(next);
  }, []);

  return (
    <CourseProgressContext.Provider
      value={{
        completedLessons: state.completedLessons,
        examPassed: state.examPassed,
        isLessonComplete,
        markLessonComplete,
        markExamPassed,
        resetProgress,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const ctx = useContext(CourseProgressContext);
  if (!ctx) throw new Error('useCourseProgress must be used within a CourseProgressProvider');
  return ctx;
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/course/CourseProgressContext.tsx
git commit -m "feat(course): add CourseProgressContext for lesson + exam tracking"
```

---

### Task 5: Wrap course layout with progress provider + read Florida flag

**Files:**
- Modify: `app/course/layout.tsx`

- [ ] **Step 1: Add the provider, read floridaTrack, filter sidebar modules**

In `app/course/layout.tsx`, replace the import block at the top (lines 1–11) with:

```tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ArrowLeftIcon, DocumentTextIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import CourseNavSidebar from '@/app/components/CourseNavSidebar';
import RemoteSessionBanner from '@/app/components/RemoteSessionBanner';
import VideoCollaborationControls from '@/app/components/VideoCollaborationControls';
import ParentingPlanPreviewModal from '@/app/components/ParentingPlanPreviewModal';
import { getVisibleModules } from './data';
import { CourseProgressProvider, useCourseProgress } from './CourseProgressContext';
import { OnboardingProvider, useOnboarding } from '@/app/onboarding/OnboardingContext';
```

Then replace the `sidebarModules` derivation (currently lines 22–40) with:

```tsx
  const { data } = useOnboarding();
  const { completedLessons, examPassed } = useCourseProgress();
  const isFlorida = data.floridaTrack;

  // Build sidebar modules with current/expanded derived from URL.
  // getVisibleModules() already strips Florida-only lessons for non-Florida users.
  const sidebarModules = getVisibleModules(isFlorida).map((module) => {
    const lessons = module.lessons.map((lesson) => ({
      id: lesson.id,
      number: lesson.number,
      title: lesson.title,
      completed: completedLessons.has(`${module.id}/${lesson.id}`),
      current: pathname === lesson.href,
    }));

    const hasCurrentLesson = lessons.some((l) => l.current);

    return {
      id: module.id,
      number: module.number,
      title: module.title,
      lessons,
      expanded: hasCurrentLesson,
    };
  });
```

Then change the default-export wrapper at the bottom (currently lines 137–143) to:

```tsx
export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <OnboardingProvider>
        <CourseProgressProvider>
          <CourseLayoutInner>{children}</CourseLayoutInner>
        </CourseProgressProvider>
      </OnboardingProvider>
    </Suspense>
  );
}
```

Inside `CourseLayoutInner` you also need to pass the Florida-mode footer entries to the sidebar. Add this just above the `return (` statement:

```tsx
  const floridaFooter = isFlorida
    ? {
        examUnlocked: completedLessons.size >= 0 /* tightened in Task 7 */ && true,
        examPassed,
      }
    : null;
```

(The exact unlock check is implemented later in Task 7 once we know how many lessons exist; the footer shape is fixed now to keep prop typing stable.)

- [ ] **Step 2: Verify build and that existing lessons still render**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors. Then run `npm run dev` and visit `http://localhost:3000/course/module-3/lesson-3` — sidebar should still show Modules 1–5 (no Florida module) because no Florida flag is set yet.

- [ ] **Step 3: Verify Florida sidebar appears when flag is set**

While dev server is running, in DevTools console run:

```js
localStorage.setItem('resolve.onboarding.v1', JSON.stringify({ floridaTrack: true, jurisdictionState: 'Florida' }));
location.reload();
```

Expected: After reload, sidebar shows "Module 0: Florida Requirements" above Module 1.

Clear the override before continuing: `localStorage.removeItem('resolve.onboarding.v1'); location.reload();`

- [ ] **Step 4: Commit**

```bash
git add app/course/layout.tsx
git commit -m "feat(course): wrap layout in providers + filter sidebar by floridaTrack"
```

---

### Task 6: Locked-playback mode in `LessonVideoContent`

**Files:**
- Modify: `app/components/LessonVideoContent.tsx`

- [ ] **Step 1: Replace the component to support locked playback**

Replace the entire contents of `app/components/LessonVideoContent.tsx` with:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { LightBulbIcon, LockClosedIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface LessonVideoContentProps {
  title: string;
  videoUrl?: string;
  keyPoints: string[];
  /**
   * When true, the player runs in DCFS-compliant locked mode:
   * native controls hidden, no scrubbing, no fast-forward. The user
   * must reach the end before the page-level Next button is enabled.
   */
  lockedPlayback?: boolean;
  /** Fired once when the video reaches its end (locked mode only). */
  onComplete?: () => void;
}

export default function LessonVideoContent({
  title,
  videoUrl,
  keyPoints,
  lockedPlayback = false,
  onComplete,
}: LessonVideoContentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxAllowedTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [hasCompleted, setHasCompleted] = useState(false);

  // Lock mode: prevent forward seeks. Allow rewinds.
  useEffect(() => {
    if (!lockedPlayback) return;
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      if (v.currentTime > maxAllowedTimeRef.current + 0.25) {
        // user attempted to seek forward (or browser glitched) — snap back
        v.currentTime = maxAllowedTimeRef.current;
      } else {
        maxAllowedTimeRef.current = Math.max(maxAllowedTimeRef.current, v.currentTime);
      }
      if (v.duration > 0) setProgress(v.currentTime / v.duration);
    };
    const onSeeking = () => {
      if (v.currentTime > maxAllowedTimeRef.current + 0.25) {
        v.currentTime = maxAllowedTimeRef.current;
      }
    };
    const onEnded = () => {
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete?.();
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('seeking', onSeeking);
    v.addEventListener('ended', onEnded);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('seeking', onSeeking);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [lockedPlayback, hasCompleted, onComplete]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>

      {/* Video Player */}
      <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls={!lockedPlayback}
              controlsList={lockedPlayback ? 'nodownload noplaybackrate' : undefined}
              disablePictureInPicture={lockedPlayback}
              onContextMenu={(e) => lockedPlayback && e.preventDefault()}
              className="w-full h-full"
              poster="/video-placeholder.jpg"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {lockedPlayback && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900"
                >
                  {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                {/* Progress (read-only — no scrubbing) */}
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden" aria-hidden>
                  <div
                    className="h-full bg-white"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <LockClosedIcon className="w-3.5 h-3.5" />
                  <span>Required</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <PlayIcon className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {lockedPlayback && (
                  <p className="text-white/70 text-xs flex items-center justify-center gap-1">
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    Florida-required: must be watched in full
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Points */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Things to keep in mind</h3>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                  <span className="text-sm text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build and that existing lesson 3-3 still renders**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors.

Run `npm run dev` and visit `http://localhost:3000/course/module-3/lesson-3`. Expected: page renders identically to before (no `lockedPlayback` prop ⇒ default `false` ⇒ native controls).

- [ ] **Step 3: Commit**

```bash
git add app/components/LessonVideoContent.tsx
git commit -m "feat(course): add lockedPlayback mode to LessonVideoContent"
```

---

### Task 7: Build the four Florida lesson pages

These four lessons live inside Module 5 ("Final Considerations") as lessons 4–7. They are gated by `floridaOnly: true` in `data.ts` so non-Florida users never see or visit them.

**Files:**
- Create: `app/course/module-5/lesson-4/page.tsx`
- Create: `app/course/module-5/lesson-5/page.tsx`
- Create: `app/course/module-5/lesson-6/page.tsx`
- Create: `app/course/module-5/lesson-7/page.tsx`

- [ ] **Step 1: Create lesson 4 (Domestic Violence and Family Safety)**

Create `app/course/module-5/lesson-4/page.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import { useCourseProgress } from '@/app/course/CourseProgressContext';

const LESSON_KEY = 'module-5/lesson-4';

export default function FloridaDomesticViolencePage() {
  const router = useRouter();
  const { isLessonComplete, markLessonComplete } = useCourseProgress();
  const completed = isLessonComplete(LESSON_KEY);

  return (
    <div className="space-y-6 max-w-3xl">
      <LessonVideoContent
        title="Domestic Violence and Family Safety"
        keyPoints={[
          'Recognize signs of domestic violence and how it affects co-parenting decisions.',
          'Florida law provides specific protections — know what is available to you and your children.',
          'Safety planning takes priority over typical co-parenting agreements.',
        ]}
        lockedPlayback
        onComplete={() => markLessonComplete(LESSON_KEY)}
      />

      <div className="flex justify-end">
        <button
          disabled={!completed}
          onClick={() => router.push('/course/module-5/lesson-5')}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completed ? 'Continue' : 'Watch the full video to continue'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create lesson 5 (Effects of Divorce on Children)**

Create `app/course/module-5/lesson-5/page.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import { useCourseProgress } from '@/app/course/CourseProgressContext';

const LESSON_KEY = 'module-5/lesson-5';

export default function FloridaEffectsOnChildrenPage() {
  const router = useRouter();
  const { isLessonComplete, markLessonComplete } = useCourseProgress();
  const completed = isLessonComplete(LESSON_KEY);

  return (
    <div className="space-y-6 max-w-3xl">
      <LessonVideoContent
        title="Effects of Divorce on Children"
        keyPoints={[
          'Children process divorce differently at each developmental stage.',
          'Conflict between parents — not divorce itself — drives most negative outcomes.',
          'Consistent routines and clear communication protect children during transitions.',
        ]}
        lockedPlayback
        onComplete={() => markLessonComplete(LESSON_KEY)}
      />

      <div className="flex justify-end">
        <button
          disabled={!completed}
          onClick={() => router.push('/course/module-5/lesson-6')}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completed ? 'Continue' : 'Watch the full video to continue'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create lesson 6 (Florida Statutes and the Court Process)**

Create `app/course/module-5/lesson-6/page.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import { useCourseProgress } from '@/app/course/CourseProgressContext';

const LESSON_KEY = 'module-5/lesson-6';

export default function FloridaStatutesPage() {
  const router = useRouter();
  const { isLessonComplete, markLessonComplete } = useCourseProgress();
  const completed = isLessonComplete(LESSON_KEY);

  return (
    <div className="space-y-6 max-w-3xl">
      <LessonVideoContent
        title="Florida Statutes and the Court Process"
        keyPoints={[
          'Florida Statutes Chapter 61 governs parenting plans and timesharing.',
          'Courts always evaluate the "best interest of the child" standard.',
          'A complete parenting plan addresses time-sharing, decision-making, and communication.',
        ]}
        lockedPlayback
        onComplete={() => markLessonComplete(LESSON_KEY)}
      />

      <div className="flex justify-end">
        <button
          disabled={!completed}
          onClick={() => router.push('/course/module-5/lesson-7')}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completed ? 'Continue' : 'Watch the full video to continue'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create lesson 7 (Co-Parenting Best Practices)**

Create `app/course/module-5/lesson-7/page.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import { useCourseProgress } from '@/app/course/CourseProgressContext';

const LESSON_KEY = 'module-5/lesson-7';

export default function FloridaCoParentingBestPracticesPage() {
  const router = useRouter();
  const { isLessonComplete, markLessonComplete } = useCourseProgress();
  const completed = isLessonComplete(LESSON_KEY);

  // This is the final Florida-only lesson; route the user toward the exam.
  return (
    <div className="space-y-6 max-w-3xl">
      <LessonVideoContent
        title="Co-Parenting Best Practices"
        keyPoints={[
          'Treat co-parenting as a business relationship focused on the child.',
          'Communicate in writing for important decisions; keep tone neutral.',
          'Avoid putting children in the middle of conflict or using them as messengers.',
        ]}
        lockedPlayback
        onComplete={() => markLessonComplete(LESSON_KEY)}
      />

      <div className="flex justify-end">
        <button
          disabled={!completed}
          onClick={() => router.push('/course/exam')}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completed ? 'Continue to final exam' : 'Watch the full video to continue'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify build and visual sanity check**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors. Build completes.

Then run `npm run dev` and (after setting `floridaTrack: true` in localStorage as in Task 5 step 3) visit `http://localhost:3000/course/module-5/lesson-4`. Expected: page renders, the locked-playback footer with progress bar appears beneath the video poster, "Continue" button is disabled. The sidebar shows lessons 4–7 nested under Module 5.

Also confirm non-Florida regression: clear localStorage, visit `http://localhost:3000/course/module-5/lesson-1`. Sidebar Module 5 should show only lessons 1–3 (no Florida lessons).

- [ ] **Step 6: Commit**

```bash
git add app/course/module-5/lesson-4 app/course/module-5/lesson-5 app/course/module-5/lesson-6 app/course/module-5/lesson-7
git commit -m "feat(course): add four Florida-required lessons under Module 5 with locked playback"
```

---

### Task 8: Resource center page (glossary + community resources)

**Files:**
- Create: `app/course/resources/data.ts`
- Create: `app/course/resources/page.tsx`

- [ ] **Step 1: Create the resource data file**

Create `app/course/resources/data.ts`:

```ts
export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface CommunityResource {
  name: string;
  description: string;
  url?: string;
  phone?: string;
}

export const glossary: GlossaryEntry[] = [
  { term: 'Best Interest of the Child', definition: 'The legal standard Florida courts use when deciding parenting plans. Courts weigh factors including the child\'s relationship with each parent, stability, and safety.' },
  { term: 'Parental Responsibility', definition: 'The right and duty to make major decisions about a child\'s upbringing, including education, healthcare, and religion.' },
  { term: 'Time-Sharing Schedule', definition: 'The schedule that specifies when each parent has the child, including weekdays, weekends, holidays, and school breaks.' },
  { term: 'Parenting Plan', definition: 'The written document, required under Florida Statute 61.13, that describes how parents will share parenting responsibilities.' },
  { term: 'Mediation', definition: 'A confidential process in which a neutral third party helps parents reach agreement on disputed issues.' },
  { term: 'Relocation', definition: 'A change of principal residence by a parent that is more than 50 miles from the residence at the time of the last court order.' },
  { term: 'Mediator', definition: 'A neutral, court-approved third party who facilitates negotiation between parents.' },
];

export const communityResources: CommunityResource[] = [
  { name: 'Florida Department of Children and Families', description: 'Statewide child welfare agency.', url: 'https://www.myflfamilies.com', phone: '1-800-962-2873' },
  { name: 'Florida Coalition Against Domestic Violence', description: 'Statewide hotline and shelter referrals.', url: 'https://www.fcadv.org', phone: '1-800-500-1119' },
  { name: 'Florida Bar Lawyer Referral Service', description: 'Find an attorney by area of practice and county.', url: 'https://www.floridabar.org/public/lrs/', phone: '1-800-342-8011' },
  { name: '211 — United Way Helpline', description: 'Connects callers with local social services, food, housing, and counseling.', phone: '211' },
];
```

- [ ] **Step 2: Create the resource center page**

Create `app/course/resources/page.tsx`:

```tsx
'use client';

import { BookOpenIcon, PhoneIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { glossary, communityResources } from './data';

export default function ResourceCenterPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Resource Center</h1>
        <p className="text-sm text-gray-600 mt-1">
          Required reference material for Florida-approved parenting courses.
        </p>
      </header>

      {/* Glossary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Glossary of Terms</h2>
        </div>
        <dl className="bg-white rounded-xl border border-border divide-y divide-border">
          {glossary.map((g) => (
            <div key={g.term} className="p-5">
              <dt className="text-sm font-semibold text-gray-900">{g.term}</dt>
              <dd className="text-sm text-gray-600 mt-1 leading-relaxed">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Community resources */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Community Resources</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {communityResources.map((r) => (
            <li key={r.name} className="bg-white rounded-xl border border-border p-5">
              <div className="text-sm font-semibold text-gray-900">{r.name}</div>
              <p className="text-sm text-gray-600 mt-1">{r.description}</p>
              <div className="mt-3 space-y-1 text-sm">
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    {r.url.replace(/^https?:\/\//, '')}
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {r.phone && <div className="text-gray-700">{r.phone}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Participant satisfaction survey */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Participant Satisfaction Survey</h2>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 text-sm text-gray-700">
          We&apos;ll ask for your feedback after you complete the course. Your responses help DCFS evaluate the program and remain anonymous.
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors. Visit `http://localhost:3000/course/resources` and confirm both sections render. (Sidebar entry is wired up in Task 11.)

- [ ] **Step 4: Commit**

```bash
git add app/course/resources
git commit -m "feat(florida): add Resource Center page with glossary and community resources"
```

---

### Task 9: End-of-course exam page

**Files:**
- Create: `app/course/exam/data.ts`
- Create: `app/course/exam/page.tsx`

- [ ] **Step 1: Create the exam questions**

Create `app/course/exam/data.ts`:

```ts
export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const examQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    prompt: 'Under Florida Statute 61.13, what standard guides the court when approving a parenting plan?',
    options: [
      'Equal time for both parents regardless of circumstances',
      'The best interest of the child',
      'Whichever parent files first',
      'The preference of the older parent',
    ],
    correctIndex: 1,
  },
  {
    id: 'q2',
    prompt: 'Which of the following is required content of a Florida parenting plan?',
    options: [
      'A list of the parents\' employers',
      'A description of how parental responsibility will be shared',
      'A statement of fault for the divorce',
      'The parents\' favorite holidays',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    prompt: 'Most negative outcomes for children of divorce are driven by:',
    options: [
      'The divorce itself',
      'Ongoing conflict between parents',
      'The number of weekends with each parent',
      'Whether each parent remarries',
    ],
    correctIndex: 1,
  },
  {
    id: 'q4',
    prompt: 'In Florida, "relocation" of a parent is generally defined as a move:',
    options: [
      'Out of the country only',
      'More than 50 miles from the prior principal residence for at least 60 consecutive days',
      'Across any county line',
      'To a different school district',
    ],
    correctIndex: 1,
  },
  {
    id: 'q5',
    prompt: 'When safety concerns are present, parenting plan logistics should:',
    options: [
      'Always defer to the higher-earning parent',
      'Take a back seat to a documented safety plan',
      'Be decided by the children',
      'Remain unchanged',
    ],
    correctIndex: 1,
  },
  {
    id: 'q6',
    prompt: 'Which of these is a recommended communication practice for co-parents?',
    options: [
      'Use children to relay messages',
      'Communicate in writing for important decisions',
      'Avoid documenting agreements',
      'Discuss parenting only in person, never in writing',
    ],
    correctIndex: 1,
  },
  {
    id: 'q7',
    prompt: 'A "time-sharing schedule" specifies:',
    options: [
      'How parents will divide household chores',
      'When the child will be with each parent',
      'How parents will split tax deductions',
      'Which parent files the parenting plan',
    ],
    correctIndex: 1,
  },
  {
    id: 'q8',
    prompt: 'Mediation is best described as:',
    options: [
      'A trial in front of a judge',
      'A confidential process where a neutral third party helps parents reach agreement',
      'A binding arbitration ruling',
      'A counseling session for the children',
    ],
    correctIndex: 1,
  },
  {
    id: 'q9',
    prompt: 'Children typically benefit most when both parents:',
    options: [
      'Compete for the child\'s loyalty',
      'Maintain consistent routines and shielding the child from adult conflict',
      'Avoid all contact with each other',
      'Combine households whenever possible',
    ],
    correctIndex: 1,
  },
  {
    id: 'q10',
    prompt: 'A parenting plan is most likely to succeed when it:',
    options: [
      'Is intentionally vague to avoid conflict',
      'Is specific, written, and centered on the child\'s needs',
      'Is verbal only',
      'Mirrors a friend\'s plan exactly',
    ],
    correctIndex: 1,
  },
];

export const PASSING_THRESHOLD = 0.8;
```

- [ ] **Step 2: Create the exam page**

Create `app/course/exam/page.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/app/onboarding/OnboardingContext';
import { useCourseProgress } from '@/app/course/CourseProgressContext';
import { getAllVisibleLessonIds } from '@/app/course/data';
import { examQuestions, PASSING_THRESHOLD } from './data';

export default function ExamPage() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { completedLessons, markExamPassed } = useCourseProgress();

  const requiredLessons = useMemo(() => getAllVisibleLessonIds(data.floridaTrack), [data.floridaTrack]);
  const allLessonsComplete = requiredLessons.every((id) => completedLessons.has(id));

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!data.floridaTrack) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Exam not required</h1>
        <p className="text-gray-600">The end-of-course exam is only required for Florida-approved courses.</p>
      </div>
    );
  }

  if (!allLessonsComplete) {
    const remaining = requiredLessons.length - Array.from(completedLessons).filter((id) => requiredLessons.includes(id)).length;
    return (
      <div className="max-w-2xl bg-white rounded-2xl border border-border p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="w-6 h-6 text-gray-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Final Exam — Locked</h1>
        <p className="text-sm text-gray-600">
          Finish all required lessons to unlock the exam. {remaining} lesson{remaining === 1 ? '' : 's'} remaining.
        </p>
      </div>
    );
  }

  const numCorrect = Object.entries(answers).reduce((acc, [qid, idx]) => {
    const q = examQuestions.find((x) => x.id === qid);
    return q && q.correctIndex === idx ? acc + 1 : acc;
  }, 0);
  const score = numCorrect / examQuestions.length;
  const passed = score >= PASSING_THRESHOLD;
  const allAnswered = Object.keys(answers).length === examQuestions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed) {
      markExamPassed();
    }
  };

  if (submitted && passed) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl border border-border p-10 text-center">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">You passed!</h1>
        <p className="text-gray-600 mb-6">
          You scored {numCorrect}/{examQuestions.length} ({Math.round(score * 100)}%).
        </p>
        <button
          onClick={() => router.push('/course/certificate')}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold"
        >
          View your certificate
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Final Exam</h1>
        <p className="text-sm text-gray-600 mt-1">
          {examQuestions.length} questions. Passing score: {Math.round(PASSING_THRESHOLD * 100)}%.
        </p>
      </header>

      {submitted && !passed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          You scored {numCorrect}/{examQuestions.length} ({Math.round(score * 100)}%). You can review your answers and resubmit.
        </div>
      )}

      <ol className="space-y-6">
        {examQuestions.map((q, idx) => {
          const selected = answers[q.id];
          const showCorrectness = submitted;
          return (
            <li key={q.id} className="bg-white rounded-xl border border-border p-5">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                {idx + 1}. {q.prompt}
              </div>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selected === optIdx;
                  const isCorrect = showCorrectness && q.correctIndex === optIdx;
                  const isWrongPick = showCorrectness && isSelected && q.correctIndex !== optIdx;
                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm ${
                        isCorrect
                          ? 'border-success bg-success/5 text-success'
                          : isWrongPick
                          ? 'border-red-400 bg-red-50 text-red-900'
                          : isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={isSelected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: optIdx }))}
                        className="accent-primary"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex justify-end">
        <button
          disabled={!allAnswered}
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitted ? 'Resubmit' : 'Submit answers'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/course/exam
git commit -m "feat(florida): add end-of-course exam with 80% pass threshold"
```

---

### Task 10: Certificate page

**Files:**
- Create: `app/course/certificate/page.tsx`

- [ ] **Step 1: Create the certificate page**

Create `app/course/certificate/page.tsx`:

```tsx
'use client';

import { LockClosedIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/app/onboarding/OnboardingContext';
import { useCourseProgress } from '@/app/course/CourseProgressContext';

export default function CertificatePage() {
  const { data } = useOnboarding();
  const { examPassed } = useCourseProgress();

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
  const issuedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            <div className="text-sm font-semibold text-gray-900 mt-1">RES-{Date.now().toString(36).toUpperCase()}</div>
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
```

- [ ] **Step 2: Verify build and a happy-path render**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors.

While dev is running, in DevTools console set the flag and exam-pass:

```js
localStorage.setItem('resolve.onboarding.v1', JSON.stringify({ floridaTrack: true, firstName: 'Test', lastName: 'User' }));
localStorage.setItem('resolve.courseProgress.v1', JSON.stringify({ completedLessons: [], examPassed: true }));
location.assign('/course/certificate');
```

Expected: certificate renders with name "Test User" and a "Download / Print" button. Click → browser print preview opens.

Reset before continuing: `localStorage.clear(); location.reload();`

- [ ] **Step 3: Commit**

```bash
git add app/course/certificate
git commit -m "feat(florida): add certificate of completion page with print support"
```

---

### Task 11: Wire Florida footer entries into the sidebar

**Files:**
- Modify: `app/components/CourseNavSidebar.tsx`
- Modify: `app/course/layout.tsx`

- [ ] **Step 1: Extend `CourseNavSidebar` to render an optional Florida footer**

In `app/components/CourseNavSidebar.tsx`, add this just below the existing `CourseNavSidebarProps` interface:

```tsx
export interface FloridaSidebarFooter {
  examUnlocked: boolean;
  examPassed: boolean;
  resourcesHref: string;
  examHref: string;
  certificateHref: string;
  currentPath: string;
  onNavigate: (href: string) => void;
}
```

Then change `CourseNavSidebarProps` to also include it:

```tsx
interface CourseNavSidebarProps {
  modules: Module[];
  onLessonClick?: (moduleId: string, lessonId: string) => void;
  floridaFooter?: FloridaSidebarFooter | null;
}
```

Update the function signature:

```tsx
export default function CourseNavSidebar({ modules: propModules, onLessonClick, floridaFooter }: CourseNavSidebarProps) {
```

And inside the outer wrapper `<div className="w-64 ...">`, just before the closing `</div>`, render:

```tsx
        {floridaFooter && (
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-1">
            <div className="px-3 text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Florida Requirements
            </div>
            <SidebarFooterLink
              label="Resources"
              href={floridaFooter.resourcesHref}
              active={floridaFooter.currentPath === floridaFooter.resourcesHref}
              onClick={() => floridaFooter.onNavigate(floridaFooter.resourcesHref)}
            />
            <SidebarFooterLink
              label="Final Exam"
              href={floridaFooter.examHref}
              active={floridaFooter.currentPath === floridaFooter.examHref}
              locked={!floridaFooter.examUnlocked}
              onClick={() => floridaFooter.examUnlocked && floridaFooter.onNavigate(floridaFooter.examHref)}
            />
            <SidebarFooterLink
              label="Certificate"
              href={floridaFooter.certificateHref}
              active={floridaFooter.currentPath === floridaFooter.certificateHref}
              locked={!floridaFooter.examPassed}
              onClick={() => floridaFooter.examPassed && floridaFooter.onNavigate(floridaFooter.certificateHref)}
            />
          </div>
        )}
```

Then add this helper component just above `export default function CourseNavSidebar`:

```tsx
function SidebarFooterLink({
  label,
  active,
  locked = false,
  onClick,
}: {
  label: string;
  href: string;
  active: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
        active
          ? 'bg-primary/5 text-primary font-medium'
          : locked
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span>{label}</span>
      {locked && (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="9" width="12" height="8" rx="2" />
          <path d="M7 9V6a3 3 0 016 0v3" />
        </svg>
      )}
    </button>
  );
}
```

(`href` is included in the prop type for clarity even though the button doesn't navigate via it directly — it makes the calling code in `layout.tsx` self-documenting.)

- [ ] **Step 2: Pass the footer from `CourseLayoutInner`**

In `app/course/layout.tsx`, find the `<CourseNavSidebar modules={sidebarModules} onLessonClick={handleLessonClick} />` line and replace it with:

```tsx
        <CourseNavSidebar
          modules={sidebarModules}
          onLessonClick={handleLessonClick}
          floridaFooter={
            isFlorida
              ? {
                  examUnlocked: (() => {
                    // Lazy-import to avoid a top-level cycle.
                    const ids = require('./data').getAllVisibleLessonIds(true) as string[];
                    return ids.every((id) => completedLessons.has(id));
                  })(),
                  examPassed,
                  resourcesHref: '/course/resources',
                  examHref: '/course/exam',
                  certificateHref: '/course/certificate',
                  currentPath: pathname,
                  onNavigate: (href) => router.push(href),
                }
              : null
          }
        />
```

Also remove the now-dead `floridaFooter` placeholder local introduced in Task 5 step 1 (the `const floridaFooter = isFlorida ? { ... } : null;` block) — it has been superseded.

- [ ] **Step 3: Verify build and visual check**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: No TypeScript errors.

Then `npm run dev`, set `floridaTrack` in localStorage (per Task 5 step 3), and visit `/course/module-3/lesson-3`. Expected: sidebar shows the Module 0 Florida lessons up top AND a "Florida Requirements" footer with Resources / Final Exam (locked) / Certificate (locked).

- [ ] **Step 4: Commit**

```bash
git add app/components/CourseNavSidebar.tsx app/course/layout.tsx
git commit -m "feat(florida): add Resources/Exam/Certificate sidebar footer with lock states"
```

---

### Task 12: End-to-end verification & docs update

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Manual end-to-end walkthrough**

Run `npm run dev`. Walk the full Florida path and confirm every gate:

1. Visit `/florida` → confirm redirect to `/onboarding/your-info` and that `localStorage.resolve.onboarding.v1` has `floridaTrack: true`.
2. Skim through onboarding (you can use any values), end up on the dashboard.
3. Navigate to `/course/module-5/lesson-4` (the first Florida-only lesson). Confirm:
   - Locked-mode footer appears under the video poster.
   - "Continue" button is disabled.
   - When the video has no source (current placeholder state), the page still gates because `onComplete` never fires — manually call `markLessonComplete` in DevTools to advance:
     ```js
     // Simulate watching every visible lesson for a Florida user
     const ids = [
       'module-1/lesson-1','module-1/lesson-2','module-1/lesson-3','module-1/lesson-4',
       'module-2/lesson-1','module-2/lesson-2','module-2/lesson-3','module-2/lesson-4','module-2/lesson-5','module-2/lesson-6',
       'module-3/lesson-1','module-3/lesson-2','module-3/lesson-3','module-3/lesson-4','module-3/lesson-5','module-3/lesson-6','module-3/lesson-7',
       'module-4/lesson-1','module-4/lesson-2','module-4/lesson-3',
       'module-5/lesson-1','module-5/lesson-2','module-5/lesson-3',
       'module-5/lesson-4','module-5/lesson-5','module-5/lesson-6','module-5/lesson-7',
     ];
     localStorage.setItem('resolve.courseProgress.v1', JSON.stringify({ completedLessons: ids, examPassed: false }));
     location.reload();
     ```
   - Sidebar's "Final Exam" entry is now unlocked.
4. Navigate to `/course/exam`. Answer all questions correctly (each correct answer is index 1 in `examQuestions`). Click Submit → see "You passed!" → click "View your certificate".
5. Confirm certificate renders with your onboarding name. Click "Download / Print" → browser print dialog opens.
6. Clear localStorage. Visit `/course/exam` directly → "Exam not required" message because `floridaTrack` is false. Visit `/course/certificate` → same.

Expected: every gate behaves as described.

- [ ] **Step 2: Add a Florida-mode section to the README**

In `README.md`, immediately after the `### Normal Dashboard` section (currently around line 87), add:

```markdown
### Florida-Approved Course Mode

Users who sign up via `/florida` are flagged as `floridaTrack: true`. This unlocks:

- Four extra DCFS-required lessons appended to **Module 5: Final Considerations** (lessons 4–7), hidden from non-Florida users
- A locked video player (no skip / no fast-forward) for those Florida lessons
- A Resource Center at `/course/resources`
- A Final Exam at `/course/exam` (locked until all visible lessons complete; passing score 80%)
- A printable Certificate of Completion at `/course/certificate` (locked until exam passed)

To toggle the flag manually for testing:

```js
// Enable Florida mode
localStorage.setItem('resolve.onboarding.v1', JSON.stringify({ floridaTrack: true }));
// Disable
localStorage.removeItem('resolve.onboarding.v1');
```
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document Florida-track mode and testing flags in README"
```

---

## Self-Review Notes

- **Spec coverage check (transcript):**
  - Florida flag set at signup, not user-modifiable → Tasks 1, 2 (entry page sets it; nothing in onboarding UI exposes it).
  - Four new videos appended to existing Module 5 (no new module) → Tasks 3, 7.
  - Resource center (glossary, community resources) → Task 8.
  - End-of-course test → Task 9 (10 questions, 80% threshold).
  - Certificate → Task 10 (printable; gated on exam pass).
  - No skip / no fast-forward in Florida mode → Task 6 (snapping `currentTime` back, hiding native controls, blocking the Next button).
  - Same-app architecture, flag-driven (Justin's "feature flag" framing in transcript at ~21:21–23:53) → Tasks 1, 5, 11.
  - Existing non-Florida users see no behavior change → Tasks 5 (provider wraps but defaults are inert), 6 (`lockedPlayback` defaults to false).

- **Out of scope (intentionally left for separate plans):** the merge/solo flow, mobile-only home screen, real backend persistence, and the "loss leader free draft" idea Justin floated at ~16:31. These are flagged at the top of this plan.

- **Type consistency:** `CourseProgressContext` uses keys shaped `${moduleId}/${lessonId}`. All call sites (lesson pages in Task 7, sidebar in Task 5, exam in Task 9, sidebar footer in Task 11) use `getAllVisibleLessonIds` which returns the same shape. `floridaTrack` is read via `useOnboarding().data.floridaTrack` in every consumer.
