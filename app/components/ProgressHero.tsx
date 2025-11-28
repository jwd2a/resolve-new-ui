import { VideoCameraIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

interface ProgressHeroProps {
  userProgress: number;
  coParentProgress: number;
  coParentName: string;
  coParentOnline?: boolean;
  estimatedCompletionDate: Date;
  onStartLiveSession: () => void;
}

export default function ProgressHero({
  userProgress,
  coParentProgress,
  coParentName,
  coParentOnline = false,
  estimatedCompletionDate,
  onStartLiveSession,
}: ProgressHeroProps) {
  const overallProgress = Math.min(userProgress, coParentProgress);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Circular Progress */}
        <div className="flex items-center space-x-8">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-5xl font-bold text-white">{overallProgress}%</div>
              <div className="text-white/80 text-sm">Complete</div>
            </div>
          </div>

          <div className="text-white space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Parenting Plan Journey</h1>
              <p className="text-white/90">Working together with {coParentName}</p>
            </div>

            <div className="flex items-center space-x-2 text-white/90">
              <ClockIcon className="w-5 h-5" />
              <span>Est. completion: {formatDate(estimatedCompletionDate)}</span>
            </div>
          </div>
        </div>

        {/* Right: Progress Comparison & CTA */}
        <div className="flex flex-col items-stretch space-y-4 w-full lg:w-auto lg:min-w-[280px]">
          {/* Progress Bars */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm text-white/90 mb-1">
                <span>Your Progress</span>
                <span className="font-semibold">{userProgress}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${userProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-white/90 mb-1">
                <span>{coParentName}'s Progress</span>
                <span className="font-semibold">{coParentProgress}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${coParentProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Live Session Button */}
          <button
            onClick={onStartLiveSession}
            className="bg-white text-primary font-semibold px-6 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center space-x-3 group"
          >
            <div className="relative">
              <VideoCameraIcon className="w-6 h-6" />
              {coParentOnline && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full ring-2 ring-white" />
              )}
            </div>
            <span>Start Live Session</span>
          </button>

          {coParentOnline && (
            <div className="flex items-center justify-center space-x-2 text-white/90 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>{coParentName} is online</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
