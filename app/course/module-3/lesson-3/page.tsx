'use client';

import { Suspense, useState } from 'react';
import { ArrowLeftIcon, DocumentTextIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import CourseNavSidebar from '@/app/components/CourseNavSidebar';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import RemoteSessionBanner from '@/app/components/RemoteSessionBanner';
import VideoCollaborationControls from '@/app/components/VideoCollaborationControls';
import ScheduleCalendar, { ScheduleData, ScheduleType } from '@/app/components/ScheduleCalendar';
import { SparklesIcon } from '@heroicons/react/24/outline';

function WeekdayWeekendScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if remote session mode is enabled via query param
  const isRemoteSessionActive = searchParams.get('remote') === 'true';

  // Form state
  const [scheduleType, setScheduleType] = useState<ScheduleType>('2-2-5-5');
  const [exchangeLocation, setExchangeLocation] = useState('');
  const [scheduleFutureChange, setScheduleFutureChange] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    days: {},
    parent1Name: 'Justin Davis',
    parent2Name: 'Other Parent',
  });

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
      lessons: [
        {
          id: 'lesson-1',
          number: 1,
          title: 'Introduction to Time Sharing',
          completed: true,
        },
        {
          id: 'lesson-2',
          number: 2,
          title: 'Scheduling and Our Calendar',
          completed: true,
        },
        {
          id: 'lesson-3',
          number: 3,
          title: 'Weekday and Weekend Schedule',
          completed: false,
          current: true,
        },
        {
          id: 'lesson-4',
          number: 4,
          title: 'Holiday Schedule',
          completed: false,
        },
        {
          id: 'lesson-5',
          number: 5,
          title: 'School Breaks',
          completed: false,
        },
        {
          id: 'lesson-6',
          number: 6,
          title: 'Transportation and Exchange',
          completed: false,
        },
        {
          id: 'lesson-7',
          number: 7,
          title: 'Other Travel Considerations',
          completed: false,
        },
      ],
      expanded: true,
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
      lessons: [],
      expanded: false,
    },
  ];

  const keyPoints = [
    'Choose a schedule that prioritizes stability for the child and consistency.',
    'Build in buffer time for smooth transitions.',
    'Remember that you\'ll probably get to see your kids at activities during the other parent\'s timesharing.',
  ];

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    console.log('Navigate to:', moduleId, lessonId);
    // In real app, this would navigate to the lesson
  };

  const handlePreviewPlan = () => {
    console.log('Preview parenting plan');
    // In real app, this would show a preview
  };

  const handleExitCourse = () => {
    router.push('/');
  };

  const handleGenerate = () => {
    console.log('Generating parenting plan with:', {
      scheduleType,
      exchangeLocation,
      scheduleFutureChange,
      scheduleData,
    });
    // In real app, this would generate the schedule section
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
              {/* Left Column - Video and Content */}
              <div>
                <LessonVideoContent
                  title="Weekday and Weekend Schedule"
                  keyPoints={keyPoints}
                />
              </div>

              {/* Right Column - Schedule Form */}
              <div>
                <div className="bg-white rounded-xl border border-border p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Weekday and Weekend Schedule
                    </h2>
                    <p className="text-sm text-gray-600">
                      Select the schedule type that works best for your family
                    </p>
                  </div>

                  {/* Schedule Type Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Schedule Type:
                    </label>
                    <select
                      value={scheduleType}
                      onChange={(e) => setScheduleType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="2-2-5-5">2-2-5-5 Schedule</option>
                      <option value="2-2-3">2-2-3 Schedule</option>
                      <option value="3-4-4-3">3-4-4-3 Schedule</option>
                      <option value="alternating-weeks">Alternating Weeks</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>

                  {/* Calendar Component */}
                  <ScheduleCalendar
                    weeks={4}
                    scheduleType={scheduleType}
                    initialSchedule={scheduleData}
                    onScheduleChange={setScheduleData}
                  />

                  {/* Exchange Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Exchanges will generally be conducted at
                    </label>
                    <select
                      value={exchangeLocation}
                      onChange={(e) => setExchangeLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select location...</option>
                      <option value="parent1-home">Justin Davis's home</option>
                      <option value="parent2-home">Other parent's home</option>
                      <option value="school">School</option>
                      <option value="public-location">Public location</option>
                    </select>
                  </div>

                  {/* Future Changes Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="scheduleFutureChange"
                      checked={scheduleFutureChange}
                      onChange={(e) => setScheduleFutureChange(e.target.checked)}
                      className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="scheduleFutureChange" className="text-sm text-gray-700">
                      Schedule a future change to the parenting plan
                    </label>
                  </div>

                  {/* Generate Button */}
                  <div className="flex flex-col items-center gap-3 pt-2">
                    <button
                      onClick={handleGenerate}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <SparklesIcon className="w-5 h-5" />
                      Generate
                    </button>

                    <button className="text-sm text-gray-600 hover:text-primary transition-colors">
                      Skip 'Weekday and Weekend Schedule' and complete later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Collaboration Controls */}
      {isRemoteSessionActive && (
        <VideoCollaborationControls
          onToggleMicrophone={() => console.log('Toggle microphone')}
          onToggleCamera={() => console.log('Toggle camera')}
          onToggleChat={() => console.log('Toggle chat')}
        />
      )}
    </div>
  );
}

export default function WeekdayWeekendSchedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <WeekdayWeekendScheduleContent />
    </Suspense>
  );
}
