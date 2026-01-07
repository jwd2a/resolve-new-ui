'use client';

import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
  InformationCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export type OnboardingTaskStatus = 'not-started' | 'in-progress' | 'complete';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: OnboardingTaskStatus;
  icon: any;
  actionLabel: string;
  onAction?: () => void;
}

interface OnboardingChecklistProps {
  tasks: OnboardingTask[];
  userName: string;
}

export default function OnboardingChecklist({ tasks, userName }: OnboardingChecklistProps) {
  const completedCount = tasks.filter(t => t.status === 'complete').length;
  const totalCount = tasks.length;
  const allComplete = completedCount === totalCount;
  const progressPercent = (completedCount / totalCount) * 100;

  const getStatusBadge = (status: OnboardingTaskStatus) => {
    if (status === 'complete') {
      return (
        <div className="flex items-center space-x-2 text-success">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Complete</span>
        </div>
      );
    }

    if (status === 'in-progress') {
      return (
        <div className="flex items-center space-x-2 text-amber-600">
          <ClockIcon className="w-5 h-5" />
          <span className="text-sm font-medium">In Progress</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        <span className="text-sm font-medium">Not Started</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Resolve, {userName}!
        </h1>
        <p className="text-lg text-gray-600">
          Complete these steps to get started with your parenting plan.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Getting Started</h2>
            <p className="text-white/90">
              {allComplete
                ? "You're all set! Ready to begin your course."
                : `${completedCount} of ${totalCount} steps complete`}
            </p>
          </div>
          {allComplete && (
            <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-3">
              <CheckCircleIcon className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4 mb-8">
        {tasks.map((task, index) => {
          const Icon = task.icon;
          const isComplete = task.status === 'complete';
          const isInProgress = task.status === 'in-progress';

          return (
            <div
              key={task.id}
              className={`bg-white border-2 rounded-xl p-6 transition-all ${
                isComplete
                  ? 'border-success/30 bg-success/5'
                  : isInProgress
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Step Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isComplete
                    ? 'bg-success text-white'
                    : isInProgress
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {isComplete ? (
                    <CheckCircleIcon className="w-7 h-7" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <div className="flex-shrink-0">
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {task.description}
                  </p>

                  {/* Action Button */}
                  {!isComplete && (
                    <button
                      onClick={task.onAction}
                      className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                        isInProgress
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      <span>{task.actionLabel}</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Complete State */}
      {allComplete && (
        <div className="bg-gradient-to-br from-success to-emerald-600 rounded-2xl p-8 text-white text-center shadow-lg">
          <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">You're All Set!</h3>
          <p className="text-white/90 mb-6">
            You've completed all the setup steps. You can now start working on your parenting plan.
          </p>
          <button className="px-8 py-3 bg-white text-success font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-md">
            Start Your Course
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Need help getting started?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Our support team is here to guide you through each step of the onboarding process.
            </p>
            <button className="text-sm font-medium text-primary hover:text-primary-dark">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
