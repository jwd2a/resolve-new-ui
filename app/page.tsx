'use client';

import { useState, useEffect } from 'react';
import { DocumentTextIcon, UserGroupIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon as DocumentTextSolidIcon } from '@heroicons/react/24/solid';
import ParentingPlanPreviewModal from './components/ParentingPlanPreviewModal';
import ParentingPlanProgress from './components/ParentingPlanProgress';
import SessionPrompt from './components/SessionPrompt';
import OnboardingChecklist, { OnboardingTask } from './components/OnboardingChecklist';
import CourseOutline from './components/CourseOutline';
import PreCourseRequirementsBanner, { PreCourseRequirementsState } from './components/PreCourseRequirementsBanner';
import { Section } from './types/section';

export default function Home() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showCoursePreview, setShowCoursePreview] = useState(false);
  const [showPreCourse, setShowPreCourse] = useState(false);
  const [preCourseState, setPreCourseState] = useState<PreCourseRequirementsState>({
    coParentInvited: true,
    waiverStatus: { you: false, them: false },
    paymentStatus: { you: false, them: false },
  });

  // Check for query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Onboarding params
    const onboardingParam = params.get('onboarding');
    setIsOnboarding(onboardingParam === 'true' || onboardingParam === 'preview');
    setShowCoursePreview(onboardingParam === 'preview');

    // Pre-course requirements params
    // ?precourse=true shows pre-course requirements view
    // Individual states: ?invited=true&waiver_you=true&waiver_them=true&paid_you=true&paid_them=true
    const preCourseParam = params.get('precourse');
    if (preCourseParam === 'true' || preCourseParam !== null) {
      setShowPreCourse(true);

      // Check individual requirement states (default invited to true for demo)
      const invited = params.get('invited') !== 'false';
      const waiverYou = params.get('waiver_you') === 'true';
      const waiverThem = params.get('waiver_them') === 'true';
      const paidYou = params.get('paid_you') === 'true';
      const paidThem = params.get('paid_them') === 'true';

      setPreCourseState({
        coParentInvited: invited,
        waiverStatus: { you: waiverYou, them: waiverThem },
        paymentStatus: { you: paidYou, them: paidThem },
      });
    }
  }, []);

  const userData = {
    name: 'Sarah',
    coParentName: 'Michael',
    coParentOnline: true,
    targetDate: new Date('2026-01-09'),
  };

  // Mock course modules
  const courseModules = [
    {
      id: 'module-1',
      number: 1,
      title: 'Welcome to Resolve',
      description: 'Introduction to the parenting plan process and setting your goals for co-parenting success.',
      duration: '30 min',
      lessonCount: 4,
      locked: true,
    },
    {
      id: 'module-2',
      number: 2,
      title: 'Parental Responsibility',
      description: 'Define decision-making authority, daily responsibilities, and how to handle disagreements.',
      duration: '45 min',
      lessonCount: 6,
      locked: true,
    },
    {
      id: 'module-3',
      number: 3,
      title: 'Timesharing Schedule',
      description: 'Create a practical schedule for holidays, weekends, vacations, and day-to-day parenting time.',
      duration: '60 min',
      lessonCount: 8,
      locked: true,
    },
    {
      id: 'module-4',
      number: 4,
      title: 'Educational Decisions',
      description: 'Plan for school choices, academic support, and parent-teacher communication.',
      duration: '30 min',
      lessonCount: 5,
      locked: true,
    },
    {
      id: 'module-5',
      number: 5,
      title: 'Final Considerations',
      description: 'Address relocation, modifications to the plan, and finalizing your agreement.',
      duration: '30 min',
      lessonCount: 4,
      locked: true,
    },
  ];

  // Mock onboarding tasks
  const onboardingTasks: OnboardingTask[] = [
    {
      id: 'family-info',
      title: 'Complete Your Family Information',
      description: 'Tell us about your family, children, and current situation so we can personalize your experience.',
      status: 'complete',
      icon: UserGroupIcon,
      actionLabel: 'Complete Family Info',
      onAction: () => alert('Navigate to family info form'),
    },
    {
      id: 'coparent-signup',
      title: 'Invite Your Co-Parent',
      description: 'Send an invitation to your co-parent so they can join and work with you on the parenting plan.',
      status: 'in-progress',
      icon: UserGroupIcon,
      actionLabel: 'Send Invitation',
      onAction: () => alert('Navigate to co-parent invitation'),
    },
    {
      id: 'sign-waivers',
      title: 'Sign Required Waivers',
      description: 'Review and sign the necessary legal waivers and agreements to participate in the program.',
      status: 'not-started',
      icon: DocumentTextSolidIcon,
      actionLabel: 'Review & Sign',
      onAction: () => alert('Navigate to waivers'),
    },
    {
      id: 'payment',
      title: 'Complete Payment',
      description: 'Complete your enrollment payment to unlock full access to the course and parenting plan tools.',
      status: 'not-started',
      icon: CreditCardIcon,
      actionLabel: 'Complete Payment',
      onAction: () => alert('Navigate to payment'),
    },
  ];

  const daysRemaining = Math.ceil((userData.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Mock parenting plan sections with new structure
  const mockSections: Section[] = [
    // Timesharing
    { id: 'holiday-schedule', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Holiday Schedule', description: 'Define how holidays will be shared', state: 'signed', estimatedTime: '~20 min', formUrl: '/forms/holiday', signatureStatus: { you: true, them: true } },
    { id: 'weekend-schedule', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Weekend Schedule', description: 'Plan weekend parenting time', state: 'completed', estimatedTime: '~15 min', formUrl: '/forms/weekend', signatureStatus: { you: false, them: false } },
    { id: 'weekday-schedule', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Weekday Schedule', description: 'Define weekday schedule', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/weekday' },
    { id: 'school-breaks', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'School Breaks & Vacations', description: 'Plan school breaks and summer', state: 'not-started', estimatedTime: '~20 min', formUrl: '/forms/breaks' },
    { id: 'transportation', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Transportation & Exchange', description: 'Define pickup and dropoff', state: 'completed', estimatedTime: '~10 min', formUrl: '/forms/transport', signatureStatus: { you: false, them: false } },

    // Decision-Making
    { id: 'shared-decisions', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Shared Decision-Making', description: 'Major decisions requiring both parents', state: 'signed', estimatedTime: '~15 min', formUrl: '/forms/shared-decisions', signatureStatus: { you: true, them: true } },
    { id: 'day-to-day', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Day-to-Day Decisions', description: 'Routine daily decisions', state: 'completed', estimatedTime: '~10 min', formUrl: '/forms/daily', signatureStatus: { you: false, them: false } },
    { id: 'extracurricular', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Extra-curricular Activities', description: 'Sports, clubs, and activities', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/activities' },
    { id: 'healthcare', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Healthcare Decisions', description: 'Medical care and insurance', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/healthcare' },

    // Communication
    { id: 'communication-methods', moduleId: 'communication', moduleName: 'Communication', category: 'communication', title: 'Communication Protocols', description: 'How you\'ll communicate', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/communication' },
    { id: 'information-sharing', moduleId: 'communication', moduleName: 'Communication', category: 'communication', title: 'Information Sharing', description: 'Sharing important updates', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/info-sharing' },

    // Other
    { id: 'relocation', moduleId: 'other', moduleName: 'Final Considerations', category: 'other', title: 'Relocation', description: 'Plans if either parent moves', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/relocation' },
    { id: 'modifications', moduleId: 'other', moduleName: 'Final Considerations', category: 'other', title: 'Changes & Modifications', description: 'How to update this plan', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/modifications' },
  ];

  const handleSectionClick = (section: Section) => {
    if (section.state === 'not-started') {
      alert('Start a session to work on this section together');
    } else if (section.state === 'completed') {
      alert('Open signing modal for: ' + section.title);
      // TODO: Open QuickSignModal
    } else if (section.state === 'signed') {
      alert('View signed agreement for: ' + section.title);
      // TODO: Open agreement preview
    }
  };

  const handleStartInPerson = () => {
    alert('Starting in-person session...');
    // TODO: Create session with type 'in-person'
  };

  const handleStartRemote = () => {
    alert('Starting remote session...');
    // TODO: Create session with type 'remote'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Resolve</span>
              </div>
              {!isOnboarding && (
                <nav className="flex space-x-1">
                  <a href="/" className="px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg">
                    Dashboard
                  </a>
                  <a href="/course" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Course
                  </a>
                  <a href="/parenting-plan" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Parenting Plan
                  </a>
                  <a href="/family-info" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Family Info
                  </a>
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Preview Plan</span>
                  </button>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!isOnboarding && userData.coParentOnline && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm text-gray-700">{userData.coParentName} is online</span>
                </div>
              )}
              <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                SD
              </button>
              {!isOnboarding && (
                <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                  MD
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isOnboarding ? (
          /* Onboarding State */
          showCoursePreview ? (
            /* Onboarding with Course Preview */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <OnboardingChecklist tasks={onboardingTasks} userName={userData.name} />
              </div>
              <div className="lg:sticky lg:top-8 lg:self-start">
                <CourseOutline modules={courseModules} />
              </div>
            </div>
          ) : (
            /* Onboarding Only */
            <OnboardingChecklist tasks={onboardingTasks} userName={userData.name} />
          )
        ) : (
          /* Normal Dashboard State */
          <>
            {/* Welcome Section */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData.name}</h1>
                <p className="text-gray-600">You're making great progress on your parenting plan.</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Target completion</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(userData.targetDate)}</div>
                {daysRemaining > 0 ? (
                  <div className="text-sm text-primary">{daysRemaining} days remaining</div>
                ) : daysRemaining === 0 ? (
                  <div className="text-sm text-amber-600">Due today</div>
                ) : (
                  <button className="text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2">
                    Set a new target date
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Session Prompt */}
                <SessionPrompt
                  coParentName={userData.coParentName}
                  coParentOnline={userData.coParentOnline}
                  lastSessionDate={new Date('2026-01-01')}
                  onStartInPerson={handleStartInPerson}
                  onStartRemote={handleStartRemote}
                  canStartCourse={!showPreCourse || (preCourseState.coParentInvited && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
                />

                {/* Parenting Plan Progress - THE MAIN COMPONENT */}
                <ParentingPlanProgress
                  sections={mockSections}
                  onSectionClick={handleSectionClick}
                  previewMode={showPreCourse && !(preCourseState.coParentInvited && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
                />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Pre-Course Requirements */}
                {showPreCourse && (
                  <PreCourseRequirementsBanner
                    state={preCourseState}
                    onInviteCoParent={() => alert('Open co-parent invitation flow')}
                    onSignWaivers={() => alert('Open waivers signing flow')}
                    onCompletePayment={() => alert('Open payment flow')}
                  />
                )}

                {/* Need Assistance */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Need assistance?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to help you through the process.
                  </p>
                  <button className="w-full px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Parenting Plan Preview Panel */}
      <ParentingPlanPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
