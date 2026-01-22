'use client';

import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/solid';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

// Detailed status for items requiring both parties
export interface PartyStatus {
  you: boolean;
  them: boolean;
}

export interface PreCourseRequirementsState {
  coParentInvited: boolean;
  waiverStatus: PartyStatus; // Both parties need to sign
  paymentStatus: PartyStatus; // Both parties need to pay
}

interface PreCourseRequirementsBannerProps {
  state: PreCourseRequirementsState;
  onInviteCoParent?: () => void;
  onSignWaivers?: () => void;
  onCompletePayment?: () => void;
}

// Helper to check if both parties completed
function isBothComplete(status: PartyStatus): boolean {
  return status.you && status.them;
}

// Helper to get status text for party-based items
function getPartyStatusText(status: PartyStatus): { you: string; them: string } {
  return {
    you: status.you ? 'Complete' : 'Pending',
    them: status.them ? 'Complete' : 'Pending',
  };
}

export default function PreCourseRequirementsBanner({
  state,
  onInviteCoParent,
  onSignWaivers,
  onCompletePayment,
}: PreCourseRequirementsBannerProps) {
  const { coParentInvited, waiverStatus, paymentStatus } = state;

  const waiversComplete = isBothComplete(waiverStatus);
  const paymentComplete = isBothComplete(paymentStatus);
  const allComplete = coParentInvited && waiversComplete && paymentComplete;

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
      cta: 'Send Invite',
      partyStatus: null, // Single-party item
    },
    {
      id: 'waivers',
      label: 'Sign Waivers',
      icon: DocumentTextIcon,
      complete: waiversComplete,
      onAction: onSignWaivers,
      cta: waiverStatus.you ? 'View Status' : 'Sign Now',
      partyStatus: waiverStatus,
    },
    {
      id: 'payment',
      label: 'Complete Payment',
      icon: CreditCardIcon,
      complete: paymentComplete,
      onAction: onCompletePayment,
      cta: paymentStatus.you ? 'View Status' : 'Pay Now',
      partyStatus: paymentStatus,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Required to start</h3>
        <p className="text-sm text-violet-600">Complete these before your first session</p>
      </div>

      <div className="space-y-3">
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

          // For incomplete items with party status
          const statusText = req.partyStatus ? getPartyStatusText(req.partyStatus) : null;

          return (
            <button
              key={req.id}
              onClick={req.onAction}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors bg-white hover:bg-white/80 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-violet-100 border border-violet-200 text-violet-600">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 block">
                  {req.label}
                </span>
                {statusText && (
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs flex items-center gap-1 ${req.partyStatus?.you ? 'text-success' : 'text-gray-500'}`}>
                      {req.partyStatus?.you && <CheckIcon className="w-3 h-3" />}
                      You: {statusText.you}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${req.partyStatus?.them ? 'text-success' : 'text-gray-500'}`}>
                      {req.partyStatus?.them && <CheckIcon className="w-3 h-3" />}
                      Co-Parent: {statusText.them}
                    </span>
                  </div>
                )}
              </div>
              <span className="px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                {req.cta}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
