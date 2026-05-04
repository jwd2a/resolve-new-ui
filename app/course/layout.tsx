'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ArrowLeftIcon, DocumentTextIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import AppNav from '@/app/components/AppNav';
import CourseNavSidebar from '@/app/components/CourseNavSidebar';
import RemoteSessionBanner from '@/app/components/RemoteSessionBanner';
import VideoCollaborationControls from '@/app/components/VideoCollaborationControls';
import ParentingPlanPreviewModal from '@/app/components/ParentingPlanPreviewModal';
import { getVisibleModules } from './data';
import { CourseProgressProvider, useCourseProgress } from './CourseProgressContext';
import { OnboardingProvider, useOnboarding } from '@/app/onboarding/OnboardingContext';

function CourseLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);

  const { data } = useOnboarding();
  const { completedLessons } = useCourseProgress();
  const isFlorida = data.floridaTrack;

  const isRemoteSessionActive = searchParams.get('remote') === 'true';

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

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    router.push(`/course/${moduleId}/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isRemoteSessionActive && <RemoteSessionBanner participantCount={2} />}
      <AppNav />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <CourseNavSidebar modules={sidebarModules} onLessonClick={handleLessonClick} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {/* Top Actions */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreviewPanel(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Preview Parenting Plan</span>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRightCircleIcon className="w-5 h-5" />
                  <span>Exit Course</span>
                </button>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>

      {isRemoteSessionActive && (
        <VideoCollaborationControls
          onToggleMicrophone={() => console.log('Toggle microphone')}
          onToggleCamera={() => console.log('Toggle camera')}
          onToggleChat={() => console.log('Toggle chat')}
        />
      )}

      <ParentingPlanPreviewModal
        isOpen={showPreviewPanel}
        onClose={() => setShowPreviewPanel(false)}
      />
    </div>
  );
}

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
