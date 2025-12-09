'use client';

interface AmbientProgressIndicatorProps {
  userProgress: number;
  coParentProgress: number;
  coParentName: string;
  coParentOnline?: boolean;
}

export default function AmbientProgressIndicator({
  userProgress,
  coParentProgress,
  coParentName,
  coParentOnline = false,
}: AmbientProgressIndicatorProps) {
  const overallProgress = Math.min(userProgress, coParentProgress);

  return (
    <div className="flex items-center space-x-6">
      {/* Mini Progress Ring */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#5b21b6"
            strokeWidth="3"
            fill="none"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * (1 - overallProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">{overallProgress}%</span>
        </div>
      </div>

      {/* Progress Details */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-gray-600">You: <span className="font-semibold text-gray-900">{userProgress}%</span></span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-2 h-2 bg-primary-light rounded-full" />
            {coParentOnline && (
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-success rounded-full ring-1 ring-white" />
            )}
          </div>
          <span className="text-gray-600">
            {coParentName}: <span className="font-semibold text-gray-900">{coParentProgress}%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
