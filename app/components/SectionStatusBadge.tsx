import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/solid';
import { SectionState } from '../types/section';

interface SectionStatusBadgeProps {
  status: SectionState;
  size?: 'sm' | 'md';
}

export default function SectionStatusBadge({ status, size = 'md' }: SectionStatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSizeClasses = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  if (status === 'not-started') {
    return (
      <div className={`${sizeClasses} rounded-full border-2 border-gray-300 bg-white flex items-center justify-center`}>
        {/* Empty circle for not started */}
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className={`${sizeClasses} rounded-full bg-success flex items-center justify-center`}>
        <CheckCircleIcon className={`${iconSizeClasses} text-white`} />
      </div>
    );
  }

  if (status === 'signed') {
    return (
      <div className={`${sizeClasses} rounded-full bg-success flex items-center justify-center`}>
        <PencilIcon className={`${iconSizeClasses} text-white`} />
      </div>
    );
  }

  return null;
}
