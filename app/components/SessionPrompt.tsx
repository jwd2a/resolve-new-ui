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
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Section Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Start a Joint Session
        </h3>
        <p className="text-sm text-gray-600">
          Work through decisions together in real time, with guidance at each step.
        </p>
      </div>

      {/* Locked Message */}
      {!canStartCourse && (
        <div className="mb-4 flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <LockClosedIcon className="w-4 h-4 flex-shrink-0" />
          <span>Complete the setup requirements above to start your sessions.</span>
        </div>
      )}

      {/* Session Option Cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* In-Person Session Card */}
        <button
          onClick={canStartCourse ? onStartInPerson : undefined}
          disabled={!canStartCourse}
          className={`flex-1 bg-white border border-gray-200 rounded-xl p-4 text-left transition-all ${
            canStartCourse
              ? 'hover:border-primary hover:shadow-sm cursor-pointer'
              : 'opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <UserGroupIcon className={`w-5 h-5 ${canStartCourse ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`font-semibold ${canStartCourse ? 'text-primary' : 'text-gray-400'}`}>
              In-Person Session
            </span>
          </div>
          <p className="text-sm text-gray-500">
            You're in the same room, using one device together
          </p>
        </button>

        {/* Remote Session Card */}
        <button
          onClick={canStartCourse ? onStartRemote : undefined}
          disabled={!canStartCourse}
          className={`flex-1 bg-white border border-gray-200 rounded-xl p-4 text-left transition-all ${
            canStartCourse
              ? 'hover:border-primary hover:shadow-sm cursor-pointer'
              : 'opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <VideoCameraIcon className={`w-5 h-5 ${canStartCourse ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`font-semibold ${canStartCourse ? 'text-primary' : 'text-gray-400'}`}>
              Remote Session
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Join from different locations with live video
          </p>
        </button>
      </div>

      {/* Helpful Tip */}
      <div className="flex items-start space-x-2">
        <span className="text-base">💡</span>
        <p className="text-sm text-gray-500">
          Take your time — you can pause, talk things through, and move at your own pace.
        </p>
      </div>
    </div>
  );
}
