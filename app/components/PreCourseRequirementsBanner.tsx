'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export interface PreCourseRequirementsState {
  coParentInvited: boolean;
  waiversSigned: boolean;
  paymentComplete: boolean;
}

interface PreCourseRequirementsBannerProps {
  state: PreCourseRequirementsState;
  onInviteCoParent?: () => void;
  onSignWaivers?: () => void;
  onCompletePayment?: () => void;
}

export default function PreCourseRequirementsBanner({
  state,
  onInviteCoParent,
  onSignWaivers,
  onCompletePayment,
}: PreCourseRequirementsBannerProps) {
  const { coParentInvited, waiversSigned, paymentComplete } = state;

  const allComplete = coParentInvited && waiversSigned && paymentComplete;
  const completedCount = [coParentInvited, waiversSigned, paymentComplete].filter(Boolean).length;

  // Don't render if all requirements are complete
  if (allComplete) {
    return null;
  }

  const requirements = [
    {
      id: 'invite',
      label: 'Invite Co-Parent',
      icon: UserGroupIcon,
      complete: coParentInvited,
      onAction: onInviteCoParent,
      locked: false,
    },
    {
      id: 'waivers',
      label: 'Sign Waivers',
      icon: DocumentTextIcon,
      complete: waiversSigned,
      onAction: onSignWaivers,
      locked: !coParentInvited,
    },
    {
      id: 'payment',
      label: 'Complete Payment',
      icon: CreditCardIcon,
      complete: paymentComplete,
      onAction: onCompletePayment,
      locked: !waiversSigned,
    },
  ];

  // Find the next incomplete requirement
  const nextRequirement = requirements.find(r => !r.complete && !r.locked);

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Message */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Complete setup to start your course
          </h3>
          <p className="text-sm text-gray-600">
            {completedCount} of 3 requirements complete. Feel free to explore while you finish setting up.
          </p>
        </div>

        {/* Right: Requirements checklist */}
        <div className="flex items-center gap-6">
          {/* Progress indicators */}
          <div className="flex items-center gap-3">
            {requirements.map((req) => {
              const Icon = req.icon;
              const isComplete = req.complete;
              const isLocked = req.locked;
              const isNext = !isComplete && !isLocked;

              return (
                <div
                  key={req.id}
                  className="flex items-center gap-2"
                  title={req.label}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isComplete
                        ? 'bg-success text-white'
                        : isNext
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-sm font-medium hidden xl:inline ${
                    isComplete ? 'text-success' : isNext ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Next action button */}
          {nextRequirement && (
            <button
              onClick={nextRequirement.onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              <span>{nextRequirement.label}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
