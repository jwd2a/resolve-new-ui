'use client';

import { VideoCameraIcon } from '@heroicons/react/24/solid';
import { UsersIcon } from '@heroicons/react/24/outline';

interface RemoteSessionBannerProps {
  participantCount: number;
}

export default function RemoteSessionBanner({ participantCount }: RemoteSessionBannerProps) {
  return (
    <div className="bg-primary px-6 py-2">
      <div className="max-w-full mx-auto flex items-center justify-center space-x-6 text-white text-sm">
        <div className="flex items-center space-x-2">
          <VideoCameraIcon className="w-4 h-4" />
          <span className="font-medium">Remote Session Active</span>
        </div>
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-4 h-4" />
          <span>{participantCount} parents connected</span>
        </div>
      </div>
    </div>
  );
}
