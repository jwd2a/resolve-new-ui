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

      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-full mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-semibold text-foreground">Resolve</span>
              </div>
              <nav className="hidden md:flex space-x-1">
                <a href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  HOME
                </a>
                <a href="/course" className="px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg">
                  COURSE
                </a>
                <a href="/parenting-plan" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  PARENTING PLAN
                </a>
              </nav>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

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
