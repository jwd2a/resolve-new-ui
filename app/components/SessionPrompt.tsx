'use client';

import { VideoCameraIcon, UserGroupIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

interface SessionPromptProps {
  coParentName: string;
  coParentOnline: boolean;
  lastSessionDate?: Date;
  onStartInPerson?: () => void;
  onStartRemote?: () => void;
  onPreviewCourse?: () => void;
  canStartCourse?: boolean;
}

export default function SessionPrompt({
  coParentName,
  coParentOnline,
  lastSessionDate,
  onStartInPerson,
  onStartRemote,
  onPreviewCourse,
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
          {!canStartCourse
            ? 'Preview what you\'ll learn'
            : coParentOnline
            ? 'Work through sections together'
            : 'Start a session when ready'}
        </h3>
        <p className="text-sm text-gray-600">
          {!canStartCourse
            ? 'Explore the course content while you complete your setup requirements.'
            : coParentOnline
            ? `Perfect time to make progress on your parenting plan with ${coParentName}.`
            : `Schedule a time to work with ${coParentName} to complete your parenting plan sections.`}
        </p>
      </div>

      {/* Last Session Info */}
      {canStartCourse && lastSessionDate && (
        <div className="mb-4 text-sm text-gray-500">
          Last session: {formatLastSession(lastSessionDate)}
        </div>
      )}

      {/* Action Buttons */}
      {canStartCourse ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStartInPerson}
            className="flex-1 px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2"
          >
            <UserGroupIcon className="w-5 h-5" />
            <span>In-Person Session</span>
          </button>
          <button
            onClick={onStartRemote}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 ${
              coParentOnline
                ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <VideoCameraIcon className="w-5 h-5" />
            <span>Remote Session</span>
          </button>
        </div>
      ) : (
        <button
          onClick={onPreviewCourse}
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
        >
          <PlayCircleIcon className="w-5 h-5" />
          <span>Preview Course</span>
        </button>
      )}

      {/* Helpful Tip */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          {canStartCourse
            ? '💡 Sessions let you work through sections together in real-time and make decisions collaboratively.'
            : '💡 Complete the setup requirements above to unlock full course access and start working with your co-parent.'}
        </p>
      </div>
    </div>
  );
}
