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
