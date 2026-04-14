'use client';

import { XMarkIcon, ExclamationTriangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface SoloModeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** 'enable' = switching to solo mode, 'disable' = switching back to collaborative */
  direction: 'enable' | 'disable';
  coParentName?: string;
}

export default function SoloModeConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  direction,
  coParentName = 'your co-parent',
}: SoloModeConfirmModalProps) {
  if (!isOpen) return null;

  const isEnabling = direction === 'enable';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {isEnabling ? (
            <>
              {/* Enable solo mode content */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Switch to Solo Mode?</h2>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  We strongly recommend completing your parenting plan together with {coParentName}. Plans completed collaboratively are more likely to be accepted by the court and followed by both parents.
                </p>
                <p className="text-sm text-gray-600">
                  If {coParentName} is unable or unwilling to participate, you can complete the plan on your own. Your plan will be marked as a <span className="font-medium text-gray-900">Proposed Parenting Plan</span> and signatures will not be collected.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { onConfirm(); onClose(); }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Switch to Solo Mode
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Keep Collaborating
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Disable solo mode content */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Switch Back to Collaborative Mode?</h2>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  Great that {coParentName} is willing to collaborate! Switching back will enable joint sessions, review workflows, and signatures.
                </p>
                <p className="text-sm text-gray-600">
                  Your existing work will be preserved, but the plan will no longer be marked as a proposed draft.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { onConfirm(); onClose(); }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Switch to Collaborative Mode
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Stay in Solo Mode
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
