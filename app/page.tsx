'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import ParentingPlanPreviewModal from './components/ParentingPlanPreviewModal';

export default function Home() {
  const [showMoreSections, setShowMoreSections] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const userData = {
    name: 'Sarah',
    coParentName: 'Michael',
    coParentOnline: true,
    targetDate: new Date('2026-01-09'),
  };

  const daysRemaining = Math.ceil((userData.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const modules = [
    { id: 1, name: 'Welcome to Resolve', progress: 100, completed: true },
    { id: 2, name: 'Parental Responsibility', progress: 85, completed: false },
    { id: 3, name: 'Timesharing Schedule', progress: 40, completed: false },
    { id: 4, name: 'Educational Decisions', progress: 0, completed: false },
    { id: 5, name: 'Final Considerations', progress: 0, completed: false },
  ];

  const overallProgress = 58;
  const completedModules = modules.filter(m => m.completed).length;

  const moreSections = [
    { id: 1, title: 'Transportation and Exchange', time: '20 min' },
    { id: 2, title: 'Weekend Schedule', time: '15 min' },
  ];

  const waitingSections = [
    'Communication Protocols',
    'Information Sharing',
    'Weekday Schedule',
    'Weekend Schedule',
  ];

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
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Preview Plan</span>
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm text-gray-700">{userData.coParentName} is online</span>
              </div>
              <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                SD
              </button>
              <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                MD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData.name}</h1>
            <p className="text-gray-600">You're making great progress on your parenting plan.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Target completion</div>
            <div className="text-lg font-semibold text-gray-900">{formatDate(userData.targetDate)}</div>
            <div className="text-sm text-primary">{daysRemaining} days remaining</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* YOUR MOVE Hero Card */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold uppercase tracking-wide mb-3 text-white/90">
                    Your Move
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Holiday Schedule</h2>
                  <p className="text-white/90 mb-4">Define how holidays will be shared</p>

                  <div className="flex items-center space-x-4 text-sm text-white/80">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Michael answered yesterday</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>About 8 min to complete</span>
                    </div>
                  </div>
                </div>

                <button className="px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-md flex items-center space-x-2 ml-6">
                  <span>Continue</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* More Sections Expandable */}
            <div className="bg-white border border-gray-200 rounded-xl">
              <button
                onClick={() => setShowMoreSections(!showMoreSections)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
              >
                <span className="text-gray-700">+ {moreSections.length} more sections you can work on</span>
                {showMoreSections ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showMoreSections && (
                <div className="px-6 pb-4 space-y-2 border-t border-gray-200 pt-4">
                  {moreSections.map((section) => (
                    <div
                      key={section.id}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{section.title}</span>
                        <span className="text-sm text-gray-600 ml-3">{section.time}</span>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Needs Discussion & Ready to Sign */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Needs Discussion */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <ExclamationCircleIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Needs Discussion</h3>
                    <p className="text-sm text-gray-600">1 section</p>
                  </div>
                </div>

                <div className="bg-white/60 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Extra-curricular Activities</h4>
                  <p className="text-sm text-gray-600">You have different views on activity limits</p>
                </div>

                <button className="w-full px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>Start Discussion</span>
                </button>
              </div>

              {/* Ready to Sign */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <PencilIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ready to Sign</h3>
                    <p className="text-sm text-gray-600">2 sections · Quick wins!</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircleSolidIcon className="w-4 h-4 text-emerald-600" />
                    <span>Shared Decision-Making</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircleSolidIcon className="w-4 h-4 text-emerald-600" />
                    <span>Day-to-Day Decisions</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                  <PencilIcon className="w-5 h-5" />
                  <span>Sign All (2)</span>
                </button>
              </div>
            </div>

            {/* Waiting on Michael */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Waiting on {userData.coParentName}</h3>
                  <p className="text-sm text-gray-600">{waitingSections.length} sections · Last active 2 hours ago</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {waitingSections.map((section, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Michael is Online Card */}
            {userData.coParentOnline && (
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="font-semibold">Michael is online now</span>
                </div>
                <p className="text-white/90 text-sm mb-4">
                  Work through sections together in real-time with video chat.
                </p>
                <button className="w-full px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <VideoCameraIcon className="w-5 h-5" />
                  <span>Start Live Session</span>
                </button>
              </div>
            )}

            {/* Course Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Course Progress</h3>

              {/* Circular Progress */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="#5b21b6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - overallProgress / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{overallProgress}%</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Overall Progress</div>
                  <div className="text-sm text-gray-600">
                    {completedModules} of {modules.length} modules complete
                  </div>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-4 mb-6">
                {modules.map((module) => (
                  <div key={module.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{module.id}</span>
                        <span className="text-sm font-medium text-gray-900">{module.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{module.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          module.completed ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Course CTA */}
              <a
                href="/course"
                className="block w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-center"
              >
                Continue Course
              </a>
            </div>

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
      </main>

      {/* Parenting Plan Preview Panel */}
      <ParentingPlanPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
