'use client';

import { useState, useEffect } from 'react';
import { DocumentTextIcon, UserGroupIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon as DocumentTextSolidIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { STORAGE_KEY as ONBOARDING_STORAGE_KEY } from './onboarding/OnboardingContext';
import AppNav from './components/AppNav';
import ParentingPlanPreviewModal from './components/ParentingPlanPreviewModal';
import ParentingPlanProgress from './components/ParentingPlanProgress';
import SessionPrompt from './components/SessionPrompt';
import OnboardingChecklist, { OnboardingTask } from './components/OnboardingChecklist';
import CourseOutline from './components/CourseOutline';
import PreCourseRequirementsBanner, { PreCourseRequirementsState } from './components/PreCourseRequirementsBanner';
import { Section, SectionState } from './types/section';
import AsyncSectionView from '@/app/components/AsyncSectionView';
import QuickSignModal from '@/app/components/QuickSignModal';
import SoloModeConfirmModal from './components/SoloModeConfirmModal';
import { usePlan } from '@/app/PlanContext';

export default function Home() {
  const { isProposed, setIsProposed } = usePlan();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [asyncViewSection, setAsyncViewSection] = useState<Section | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showCoursePreview, setShowCoursePreview] = useState(false);
  const [showPreCourse, setShowPreCourse] = useState(false);
  const [showSoloModeModal, setShowSoloModeModal] = useState(false);
  const [soloModalDirection, setSoloModalDirection] = useState<'enable' | 'disable'>('enable');
  const [preCourseState, setPreCourseState] = useState<PreCourseRequirementsState>({
    inviteStatus: 'accepted',
    waiverStatus: { you: false, them: false },
    paymentStatus: { you: false, them: false },
  });
  const [isFloridaTrack, setIsFloridaTrack] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { floridaTrack?: boolean };
        setIsFloridaTrack(!!parsed.floridaTrack);
      }
    } catch {
      // ignore
    }
  }, []);

  // Check for query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Onboarding params
    const onboardingParam = params.get('onboarding');
    setIsOnboarding(onboardingParam === 'true' || onboardingParam === 'preview');
    setShowCoursePreview(onboardingParam === 'preview');

    // Pre-course requirements params
    // ?precourse=true shows pre-course requirements view
    // Invite states: ?invite=not_invited|invited|accepted
    // Individual states: ?waiver_you=true&waiver_them=true&paid_you=true&paid_them=true
    const preCourseParam = params.get('precourse');
    if (preCourseParam === 'true' || preCourseParam !== null) {
      setShowPreCourse(true);

      // Check individual requirement states
      const inviteParam = params.get('invite') as 'not_invited' | 'invited' | 'accepted' | null;
      const inviteStatus = inviteParam || 'accepted'; // Default to accepted for demo
      const waiverYou = params.get('waiver_you') === 'true';
      const waiverThem = params.get('waiver_them') === 'true';
      const paidYou = params.get('paid_you') === 'true';
      const paidThem = params.get('paid_them') === 'true';

      setPreCourseState({
        inviteStatus,
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
    { id: 'weekday-schedule', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Weekday Schedule', description: 'Define weekday schedule', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/weekday' },
    { id: 'weekend-schedule', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Weekend Schedule', description: 'Plan weekend parenting time', state: 'agreed', estimatedTime: '~15 min', formUrl: '/forms/weekend', signatureStatus: { you: false, them: false } },
    { id: 'school-breaks', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'School Breaks & Vacations', description: 'Plan school breaks and summer', state: 'in-review' as SectionState, estimatedTime: '~20 min', formUrl: '/forms/breaks', draftedBy: 'them' as const, currentTurn: 'you' as const, draftData: { springBreak: 'Alternating years', winterBreak: 'Split evenly — first half with one parent, second half with other', summerBreak: 'Each parent gets two consecutive weeks' } },
    { id: 'holiday-schedule', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Holiday Schedule', description: 'Define how holidays will be shared', state: 'signed', estimatedTime: '~20 min', formUrl: '/forms/holiday', signatureStatus: { you: true, them: true } },
    { id: 'transportation', moduleId: 'timesharing', moduleName: 'Timesharing Schedule', category: 'timesharing', title: 'Transportation & Exchange', description: 'Define pickup and dropoff', state: 'agreed', estimatedTime: '~10 min', formUrl: '/forms/transport', signatureStatus: { you: false, them: false } },

    // Decision-Making
    { id: 'shared-decisions', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Shared Decision-Making', description: 'Major decisions requiring both parents', state: 'signed', estimatedTime: '~15 min', formUrl: '/forms/shared-decisions', signatureStatus: { you: true, them: true } },
    { id: 'day-to-day', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Day-to-Day Decisions', description: 'Routine daily decisions', state: 'agreed', estimatedTime: '~10 min', formUrl: '/forms/daily', signatureStatus: { you: false, them: false } },
    { id: 'extracurricular', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Extra-curricular Activities', description: 'Sports, clubs, and activities', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/activities' },
    { id: 'healthcare', moduleId: 'decision-making', moduleName: 'Parental Responsibility', category: 'decision-making', title: 'Healthcare Decisions', description: 'Medical care and insurance', state: 'contested' as SectionState, estimatedTime: '~15 min', formUrl: '/forms/healthcare', draftedBy: 'you' as const, currentTurn: 'you' as const, draftData: { primaryPhysician: 'Both parents must agree on primary physician', emergencyDecisions: 'Either parent can authorize emergency treatment', mentalHealth: 'Both parents must consent to ongoing therapy' }, editHistory: [ { fieldId: 'mentalHealth', previousValue: 'Primary custodial parent decides on therapy', newValue: 'Both parents must consent to ongoing therapy', editedBy: 'them' as const, editedAt: new Date('2026-03-09') } ] },

    // Communication
    { id: 'communication-methods', moduleId: 'communication', moduleName: 'Communication', category: 'communication', title: 'Communication Protocols', description: 'How you\'ll communicate', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/communication' },
    { id: 'information-sharing', moduleId: 'communication', moduleName: 'Communication', category: 'communication', title: 'Information Sharing', description: 'Sharing important updates', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/info-sharing' },

    // Other
    { id: 'number-of-overnights', moduleId: 'other', moduleName: 'Final Considerations', category: 'other', title: 'Number of Overnights', description: 'Calculate annual overnight totals', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/overnights' },
    { id: 'relocation', moduleId: 'other', moduleName: 'Final Considerations', category: 'other', title: 'Relocation', description: 'Plans if either parent moves', state: 'not-started', estimatedTime: '~15 min', formUrl: '/forms/relocation' },
    { id: 'modifications', moduleId: 'other', moduleName: 'Final Considerations', category: 'other', title: 'Changes & Modifications', description: 'How to update this plan', state: 'not-started', estimatedTime: '~10 min', formUrl: '/forms/modifications' },
  ];

  const handleSectionClick = (section: Section) => {
    switch (section.state) {
      case 'not-started':
        console.log('Start section:', section.id);
        break;
      case 'draft':
      case 'completed-draft':
      case 'in-review':
      case 'contested':
        setAsyncViewSection(section);
        break;
      case 'agreed':
        if (isProposed) {
          setShowPreviewModal(true);
        } else {
          setShowSignModal(true);
        }
        break;
      case 'signed':
        setShowPreviewModal(true);
        break;
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

  const handleOpenSoloModal = (direction: 'enable' | 'disable') => {
    setSoloModalDirection(direction);
    setShowSoloModeModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav
        rightExtras={
          !isOnboarding ? (
            <>
              {!isProposed && userData.coParentOnline && (
                <div className="hidden md:flex items-center space-x-2 mr-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm text-gray-700">{userData.coParentName} is online</span>
                </div>
              )}
              <button
                onClick={() => setShowPreviewModal(true)}
                className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Preview Plan</span>
              </button>
            </>
          ) : null
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isFloridaTrack && !isOnboarding && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Enrolled in the Florida-Approved Parent Education Course
              </div>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                You&apos;re completing the Florida Department of Children and Families approved
                Parent Education and Family Stabilization Course. Finish all lessons and pass the
                final exam to receive your certificate of completion.
              </p>
            </div>
          </div>
        )}
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
                <p className="text-gray-600">
                  {isProposed
                    ? 'Complete your proposed parenting plan.'
                    : 'Collaborate with your co-parent to complete your parenting plan.'}
                </p>
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

            {isProposed && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <p className="text-sm text-purple-800 font-medium">
                    Proposed Plan Mode — You are completing this plan without your co-parent
                  </p>
                </div>
                <button
                  onClick={() => handleOpenSoloModal('disable')}
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Change
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Session Prompt */}
                {isProposed ? (
                  <SessionPrompt
                    coParentName={userData.coParentName}
                    coParentOnline={false}
                    isSoloMode
                    onStartSession={() => alert('Starting solo session...')}
                  />
                ) : (
                  <>
                    <SessionPrompt
                      coParentName={userData.coParentName}
                      coParentOnline={userData.coParentOnline}
                      lastSessionDate={new Date('2026-01-01')}
                      onStartInPerson={handleStartInPerson}
                      onStartRemote={handleStartRemote}
                      canStartCourse={!showPreCourse || (preCourseState.inviteStatus === 'accepted' && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
                    />
                    {/* Solo mode entry point */}
                    <div className="text-center">
                      <button
                        onClick={() => handleOpenSoloModal('enable')}
                        className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
                      >
                        Co-parent unable to participate? Switch to solo mode
                      </button>
                    </div>
                  </>
                )}

                {/* Parenting Plan Progress - THE MAIN COMPONENT */}
                <ParentingPlanProgress
                  sections={mockSections}
                  onSectionClick={handleSectionClick}
                  coParentName="Michael"
                  previewMode={showPreCourse && !(preCourseState.inviteStatus === 'accepted' && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
                  isProposed={isProposed}
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
        isProposed={isProposed}
      />

      {asyncViewSection && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="py-8 px-4">
            <AsyncSectionView
              section={asyncViewSection}
              coParentName="Michael"
              isProposed={isProposed}
              onSave={(data) => {
                console.log('Saved draft:', data);
                setAsyncViewSection(null);
              }}
              onSubmitForReview={(data) => {
                console.log('Submitted for review:', data);
                setAsyncViewSection(null);
              }}
              onAccept={() => {
                console.log('Accepted');
                setAsyncViewSection(null);
              }}
              onSubmitChanges={(data, edits) => {
                console.log('Submitted changes:', data, edits);
                setAsyncViewSection(null);
              }}
              onComplete={(data) => {
                console.log('Completed proposed section:', data);
                setAsyncViewSection(null);
              }}
              onStartSession={isProposed ? undefined : () => { setAsyncViewSection(null); }}
              onClose={() => setAsyncViewSection(null)}
            />
          </div>
        </div>
      )}

      {showSignModal && !isProposed && (
        <QuickSignModal
          sections={mockSections.filter(s => s.state === 'agreed' && !s.signatureStatus?.you)}
          coParentName="Michael"
          onClose={() => setShowSignModal(false)}
          onSign={(sectionIds, signature) => {
            console.log('Signed sections:', sectionIds, 'with signature:', signature);
            setShowSignModal(false);
          }}
        />
      )}

      <SoloModeConfirmModal
        isOpen={showSoloModeModal}
        onClose={() => setShowSoloModeModal(false)}
        onConfirm={() => setIsProposed(soloModalDirection === 'enable')}
        direction={soloModalDirection}
        coParentName={userData.coParentName}
      />
    </div>
  );
}
