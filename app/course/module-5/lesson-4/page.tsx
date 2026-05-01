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
