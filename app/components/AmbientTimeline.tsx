import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface AmbientTimelineProps {
  startDate: Date;
  targetDate: Date;
  currentProgress: number;
}

export default function AmbientTimeline({ startDate, targetDate, currentProgress }: AmbientTimelineProps) {
  const today = new Date();
  const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = (daysElapsed / totalDays) * 100;

  const expectedProgress = progressPercentage;
  const isBehindSchedule = currentProgress < expectedProgress - 10;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          <span>Target: {formatDate(targetDate)}</span>
        </div>
        <div className={`flex items-center space-x-2 font-medium ${isBehindSchedule ? 'text-amber-600' : 'text-gray-700'}`}>
          <ClockIcon className="w-4 h-4" />
          <span>{daysRemaining} days remaining</span>
        </div>
      </div>

      {/* Compact progress bar */}
      <div className="flex items-center space-x-3">
        <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-10">{currentProgress}%</span>
      </div>
    </div>
  );
}
