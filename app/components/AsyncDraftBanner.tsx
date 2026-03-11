'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface AsyncDraftBannerProps {
  coParentName: string;
  state: 'drafting' | 'reviewing' | 'contested';
  editCount?: number;
  onStartSession?: () => void;
}

export default function AsyncDraftBanner({ coParentName, state, editCount, onStartSession }: AsyncDraftBannerProps) {
  const config = {
    drafting: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconColor: 'text-amber-500',
      title: "You're drafting this on your own",
      subtitle: `${coParentName} will review your answers when you submit.`,
    },
    reviewing: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-500',
      title: `${coParentName} submitted this draft`,
      subtitle: 'Review each answer. You can accept as-is, or edit any field to suggest changes.',
    },
    contested: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconColor: 'text-amber-500',
      title: `${coParentName} suggested changes to ${editCount ?? 0} field${editCount !== 1 ? 's' : ''}`,
      subtitle: 'Review the changes. Accept to agree, or edit further.',
    },
  };

  const { bg, border, iconColor, title, subtitle } = config[state];

  return (
    <div className={`${bg} ${border} border rounded-lg p-4 flex items-start gap-3`}>
      <InformationCircleIcon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
        {onStartSession && (
          <button
            onClick={onStartSession}
            className="text-sm text-primary hover:text-primary-dark font-medium mt-2 underline"
          >
            Start a live session to work on this together
          </button>
        )}
      </div>
    </div>
  );
}
