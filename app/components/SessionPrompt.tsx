'use client';

import { VideoCameraIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface SessionPromptProps {
  coParentName: string;
  coParentOnline: boolean;
  lastSessionDate?: Date;
  onStartInPerson?: () => void;
  onStartRemote?: () => void;
  canStartCourse?: boolean;
}

export default function SessionPrompt({
  coParentName,
  coParentOnline,
  lastSessionDate,
  onStartInPerson,
  onStartRemote,
  canStartCourse = true,
}: SessionPromptProps) {
  const formatLastSession = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'earlier today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Online Status */}
      {coParentOnline && (
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm font-medium text-success">{coParentName} is online now</span>
        </div>
      )}

      {/* Main Message */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {coParentOnline ? 'Work through sections together' : 'Start a session when ready'}
        </h3>
        <p className="text-sm text-gray-600">
          {coParentOnline
            ? `Perfect time to make progress on your parenting plan with ${coParentName}.`
            : `Schedule a time to work with ${coParentName} to complete your parenting plan sections.`}
        </p>
      </div>

      {/* Last Session Info */}
      {lastSessionDate && (
        <div className="mb-4 text-sm text-gray-500">
          Last session: {formatLastSession(lastSessionDate)}
        </div>
      )}

      {/* Locked Message */}
      {!canStartCourse && (
        <div className="mb-4 flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <LockClosedIcon className="w-4 h-4 flex-shrink-0" />
          <span>Complete the setup requirements above to start your sessions.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={canStartCourse ? onStartInPerson : undefined}
          disabled={!canStartCourse}
          className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 ${
            canStartCourse
              ? 'bg-white border-2 border-primary text-primary hover:bg-primary/5'
              : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <UserGroupIcon className="w-5 h-5" />
          <span>In-Person Session</span>
        </button>
        <button
          onClick={canStartCourse ? onStartRemote : undefined}
          disabled={!canStartCourse}
          className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 ${
            !canStartCourse
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : coParentOnline
              ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <VideoCameraIcon className="w-5 h-5" />
          <span>Remote Session</span>
        </button>
      </div>

      {/* Helpful Tip */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 Sessions let you work through sections together in real-time and make decisions collaboratively.
        </p>
      </div>
    </div>
  );
}
