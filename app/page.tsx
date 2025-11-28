'use client';

import { HomeIcon, UsersIcon, DocumentTextIcon, AcademicCapIcon, DocumentDuplicateIcon, SparklesIcon, QuestionMarkCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import AmbientTimeline from './components/AmbientTimeline';
import ProgressHero from './components/ProgressHero';
import WhatsNext from './components/WhatsNext';
import ParentingPlanProgress from './components/ParentingPlanProgress';
import RecentCompletions from './components/RecentCompletions';

export default function Home() {
  // Mock data - in real app, this would come from API/database
  const userData = {
    name: 'Sarah',
    progress: 65,
    coParentName: 'Michael',
    coParentProgress: 58,
    coParentOnline: true,
    startDate: new Date('2024-10-01'),
    targetDate: new Date('2026-01-10'),
  };

  const estimatedCompletion = new Date('2026-01-05');

  const nextTask = {
    id: '1',
    title: 'Continue Module 3: Timesharing Schedule',
    description: 'Complete the remaining lessons on creating your timesharing schedule, including transportation and exchange protocols.',
    type: 'action' as const,
    estimatedTime: '20 minutes',
    actionUrl: '/course/module-3/lesson-6',
  };

  const inProgressTasks = [
    {
      id: '2',
      title: 'Weekday and Weekend Schedule',
      description: 'Define the regular timesharing schedule for weekdays and weekends',
      type: 'progress' as const,
      actionUrl: '/parenting-plan/timesharing/weekday-weekend',
    },
    {
      id: '4',
      title: 'Day-to-Day Decision-Making',
      description: 'Establish protocols for immediate decisions affecting your children',
      type: 'progress' as const,
      actionUrl: '/parenting-plan/parental-responsibility/day-to-day',
    },
  ];

  const waitingTasks = [
    {
      id: '3',
      title: 'Review Financial Disclosures',
      description: 'Both parents need to review and approve the financial documentation before proceeding',
      type: 'waiting' as const,
      waitingOn: userData.coParentName,
    },
  ];

  const parentingPlanStages = [
    {
      id: 'onboarding',
      name: 'Initial Setup',
      icon: HomeIcon,
      status: 'completed' as const,
    },
    {
      id: 'registration',
      name: 'Co-Parent Connection',
      icon: UsersIcon,
      status: 'completed' as const,
    },
    {
      id: 'course',
      name: 'Complete Course',
      icon: AcademicCapIcon,
      status: 'current' as const,
      progress: 65,
      substeps: [
        { name: 'Module 1: Welcome to Resolve', completed: true },
        { name: 'Module 2: Parental Responsibility and Decision Making', completed: true },
        { name: 'Module 3: Timesharing Schedule', completed: false },
        { name: 'Module 4: Educational Decisions', completed: false },
        { name: 'Module 5: Final Considerations', completed: false },
      ],
    },
    {
      id: 'plan',
      name: 'Build Parenting Plan',
      icon: DocumentDuplicateIcon,
      status: 'upcoming' as const,
    },
    {
      id: 'finalize',
      name: 'Review & Finalize',
      icon: SparklesIcon,
      status: 'upcoming' as const,
    },
  ];

  const courseIncludes = [
    '5 Interactive Course Modules',
    'Video Lessons & Assessments',
    'Guided Parenting Plan Builder',
  ];

  const recentCompletions = [
    { name: 'Lesson 5: School Breaks', time: '1 hour ago', category: 'Course' },
    { name: 'Shared Decision-Making Section', time: 'Yesterday', category: 'Parenting Plan' },
    { name: 'Lesson 4: Holiday Schedule', time: '2 days ago', category: 'Course' },
    { name: 'Module 2: Parental Responsibility', time: '3 days ago', category: 'Course' },
  ];

  const handleStartLiveSession = () => {
    console.log('Starting live session...');
    // In real app, this would initiate the video session
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-semibold text-foreground">Resolve</span>
              </div>
              <nav className="hidden md:flex space-x-1">
                <a href="/" className="px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg">
                  HOME
                </a>
                <a href="/course" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
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

      {/* Ambient Timeline Bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <AmbientTimeline
            startDate={userData.startDate}
            targetDate={userData.targetDate}
            currentProgress={userData.progress}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Progress Hero */}
        <ProgressHero
          userProgress={userData.progress}
          coParentProgress={userData.coParentProgress}
          coParentName={userData.coParentName}
          coParentOnline={userData.coParentOnline}
          estimatedCompletionDate={estimatedCompletion}
          onStartLiveSession={handleStartLiveSession}
        />

        {/* Main Dashboard Grid - Adjusted to 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - What's Next (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <WhatsNext
              nextTask={nextTask}
              inProgressTasks={inProgressTasks}
              waitingTasks={waitingTasks}
            />

            {/* Recent Completions - moved to left column */}
            <RecentCompletions completions={recentCompletions} />
          </div>

          {/* Right Column - Progress Tracker & Info (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parenting Plan Progress */}
            <ParentingPlanProgress stages={parentingPlanStages} />

            {/* Course Access Info */}
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Course Access</h3>
                <div className="flex items-center space-x-1 text-success text-sm font-medium">
                  <CheckCircleSolidIcon className="w-4 h-4" />
                  <span>Active</span>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {courseIncludes.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleSolidIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is here for you
              </p>
              <button className="w-full px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2">
                <EnvelopeIcon className="w-5 h-5" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
