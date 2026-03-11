import { CheckIcon, PencilSquareIcon, PencilIcon, EyeIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { SectionState } from '../types/section';

interface SectionStatusBadgeProps {
  status: SectionState;
  size?: 'sm' | 'md';
}

export default function SectionStatusBadge({ status, size = 'md' }: SectionStatusBadgeProps) {
  const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const innerSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  switch (status) {
    case 'not-started':
      return (
        <div className={`${iconSize} rounded-full border-2 border-gray-300 bg-white flex items-center justify-center`}>
        </div>
      );
    case 'draft':
      return (
        <div className={`${iconSize} rounded-full bg-amber-100 flex items-center justify-center`}>
          <PencilIcon className={`${innerSize} text-amber-600`} />
        </div>
      );
    case 'in-review':
      return (
        <div className={`${iconSize} rounded-full bg-blue-100 flex items-center justify-center`}>
          <EyeIcon className={`${innerSize} text-blue-600`} />
        </div>
      );
    case 'contested':
      return (
        <div className={`${iconSize} rounded-full bg-amber-100 flex items-center justify-center`}>
          <ArrowUturnLeftIcon className={`${innerSize} text-amber-600`} />
        </div>
      );
    case 'agreed':
      return (
        <div className={`${iconSize} rounded-full bg-success-light flex items-center justify-center`}>
          <CheckIcon className={`${innerSize} text-success`} />
        </div>
      );
    case 'signed':
      return (
        <div className={`${iconSize} rounded-full bg-success-light flex items-center justify-center`}>
          <PencilSquareIcon className={`${innerSize} text-success`} />
        </div>
      );
  }
}
