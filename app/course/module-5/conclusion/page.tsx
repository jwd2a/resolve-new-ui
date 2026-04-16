'use client';

import { Suspense, useState } from 'react';
import { DocumentTextIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import CourseNavSidebar from '@/app/components/CourseNavSidebar';
import RemoteSessionBanner from '@/app/components/RemoteSessionBanner';
import VideoCollaborationControls from '@/app/components/VideoCollaborationControls';
import ParentingPlanPreviewModal from '@/app/components/ParentingPlanPreviewModal';
import CourseCompletionOverlay from '@/app/components/CourseCompletionOverlay';

function CourseConclusionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);
  const [iFinished, setIFinished] = useState(false);
  const [coParentFinished, setCoParentFinished] = useState(false);

  const isRemoteSessionActive = searchParams.get('remote') === 'true';

  const courseModules = [
    {
      id: 'module-1',
      number: 1,
      title: 'Welcome to Resolve',
      lessons: [],
      expanded: false,
    },
    {
      id: 'module-2',
      number: 2,
      title: 'Parental Responsibility and Decision Making',
      lessons: [],
      expanded: false,
    },
    {
      id: 'module-3',
      number: 3,
      title: 'Timesharing Schedule',
      lessons: [],
      expanded: false,
    },
    {
      id: 'module-4',
      number: 4,
      title: 'Educational Decisions',
      lessons: [],
      expanded: false,
    },
    {
      id: 'module-5',
      number: 5,
      title: 'Final Considerations',
      lessons: [
        {
          id: 'lesson-1',
          number: 1,
          title: 'Introduction to Final Considerations',
          completed: true,
        },
        {
          id: 'lesson-2',
          number: 2,
          title: 'Relocation',
          completed: true,
        },
        {
          id: 'lesson-3',
          number: 3,
          title: 'Changes or Modifications to the Agreement',
          completed: true,
        },
        {
          id: 'lesson-4',
          number: 4,
          title: 'Special Circumstances & Household Norms',
          completed: true,
        },
        {
          id: 'lesson-5',
          number: 5,
          title: 'Finalizing and Signing the Agreement',
          completed: true,
        },
      ],
      expanded: true,
    },
  ];

  const keyPoints = [
    'Implement your plan with patience and flexibility.',
    'Keep communication open and constructive.',
    'Take care of yourselves so you can parent effectively.',
    'Review your plan periodically as life changes and your plan should evolve accordingly.',
  ];

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    console.log('Navigate to:', moduleId, lessonId);
  };

  const handlePreviewPlan = () => {
    setShowPreviewPanel(true);
  };

  const handleExitCourse = () => {
    router.push('/');
  };

  const handleFinish = () => {
    if (isRemoteSessionActive) {
      setIFinished(true);
      // Simulate co-parent finishing after 3 seconds for demo purposes
      setTimeout(() => setCoParentFinished(true), 3000);
    } else {
      router.push('/parenting-plan');
    }
  };

  const handleViewPlan = () => {
    router.push('/parenting-plan');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Remote Session Banner */}
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
                <a href="/family-info" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  FAMILY INFO
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
        {/* Sidebar */}
        <CourseNavSidebar modules={courseModules} onLessonClick={handleLessonClick} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Course Conclusion and Next Steps</h1>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePreviewPlan}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Preview Parenting Plan</span>
                </button>
                <button
                  onClick={handleExitCourse}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRightCircleIcon className="w-5 h-5" />
                  <span>Exit Course</span>
                </button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Video and Key Points */}
              <div className="space-y-6">
                {/* Video/Title Card */}
                <div className="bg-[#1e1b4b] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center space-y-4 px-8">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white/70 uppercase tracking-[0.2em]">Final Considerations</p>
                      <div className="w-16 h-0.5 bg-primary-light mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide leading-snug">
                      Course Conclusion<br />and Next Steps
                    </h2>
                  </div>
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

              {/* Right Column - Conclusion Content */}
              <div>
                <div className="bg-white rounded-xl border border-border p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Course Conclusion and Next Steps</h2>

                  <div className="space-y-4 text-[15px] text-gray-700 leading-relaxed">
                    <p>
                      Congratulations on completing your comprehensive parenting agreement! This journey
                      wasn&apos;t easy, but you&apos;ve created a roadmap for successful co-parenting.
                    </p>

                    <p>
                      As you move forward, remember to implement your plan with patience and flexibility,
                      maintain open communication with your co-parent, and present a united front to your
                      children. Take care of yourself throughout this process.
                    </p>

                    <p>
                      Set reminders to review your plan regularly as life changes and your plan should
                      evolve accordingly. Every time you follow this plan and cooperate with your co-parent,
                      you&apos;re showing your children that they&apos;re loved, valued, and supported.
                    </p>
                  </div>

                  <button
                    onClick={handleFinish}
                    disabled={iFinished}
                    className="mt-8 bg-primary text-white font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Finish</span>
                    <CheckBadgeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Collaboration Controls - hidden when overlay is showing */}
      {isRemoteSessionActive && !iFinished && (
        <VideoCollaborationControls
          onToggleMicrophone={() => console.log('Toggle microphone')}
          onToggleCamera={() => console.log('Toggle camera')}
          onToggleChat={() => console.log('Toggle chat')}
        />
      )}

      {/* Completion Overlay */}
      <CourseCompletionOverlay
        isOpen={iFinished}
        coParentFinished={coParentFinished}
        coParentName="your co-parent"
        onViewPlan={handleViewPlan}
        onDownloadPdf={() => console.log('Download PDF')}
        onShareWithAttorney={() => console.log('Share with attorney')}
        onSetReminder={() => console.log('Set reminder')}
      />

      {/* Parenting Plan Preview Panel */}
      <ParentingPlanPreviewModal
        isOpen={showPreviewPanel}
        onClose={() => setShowPreviewPanel(false)}
        currentSectionId="conclusion"
      />
    </div>
  );
}

export default function CourseConclusionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <CourseConclusionContent />
    </Suspense>
  );
}
