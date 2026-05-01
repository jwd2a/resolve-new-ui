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
