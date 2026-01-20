'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChevronRightIcon,
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
    },
    {
      id: 'waivers',
      label: 'Sign Waivers',
      icon: DocumentTextIcon,
      complete: waiversSigned,
      onAction: onSignWaivers,
    },
    {
      id: 'payment',
      label: 'Complete Payment',
      icon: CreditCardIcon,
      complete: paymentComplete,
      onAction: onCompletePayment,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold">{3 - completedCount}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Required to start</h3>
          <p className="text-sm text-violet-600">Complete these before your first session</p>
        </div>
      </div>

      <div className="space-y-2">
        {requirements.map((req) => {
          const Icon = req.icon;
          const isComplete = req.complete;

          if (isComplete) {
            return (
              <div
                key={req.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10 text-success">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-400 flex-1">
                  {req.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={req.id}
              onClick={req.onAction}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors bg-white hover:bg-white/80 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-violet-100 border border-violet-200 text-violet-600">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium flex-1 text-gray-900">
                {req.label}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-violet-500" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
