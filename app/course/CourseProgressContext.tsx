'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface CourseProgressState {
  completedLessons: Set<string>; // ids shaped like "module-id/lesson-id"
  examPassed: boolean;
}

interface CourseProgressContextType extends CourseProgressState {
  isLessonComplete: (lessonKey: string) => boolean;
  markLessonComplete: (lessonKey: string) => void;
  markLessonsComplete: (lessonKeys: string[]) => void;
  markExamPassed: () => void;
  resetProgress: () => void;
}

export const STORAGE_KEY = 'resolve.courseProgress.v1';

const CourseProgressContext = createContext<CourseProgressContextType | null>(null);

function loadInitialState(): CourseProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { completedLessons?: string[]; examPassed?: boolean };
      return {
        completedLessons: new Set(parsed.completedLessons ?? []),
        examPassed: !!parsed.examPassed,
      };
    }
  } catch {
    // ignore — fall back to empty state
  }
  return { completedLessons: new Set(), examPassed: false };
}

function persist(next: CourseProgressState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedLessons: Array.from(next.completedLessons),
        examPassed: next.examPassed,
      }),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CourseProgressState>(loadInitialState);

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

  const markLessonsComplete = useCallback((lessonKeys: string[]) => {
    setState((prev) => {
      const merged = new Set(prev.completedLessons);
      let changed = false;
      for (const key of lessonKeys) {
        if (!merged.has(key)) {
          merged.add(key);
          changed = true;
        }
      }
      if (!changed) return prev;
      const next = { ...prev, completedLessons: merged };
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
    const next: CourseProgressState = { completedLessons: new Set<string>(), examPassed: false };
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
        markLessonsComplete,
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
