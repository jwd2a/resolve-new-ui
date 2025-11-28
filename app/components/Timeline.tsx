import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TimelineProps {
  startDate: Date;
  targetDate: Date;
  currentProgress: number;
}

export default function Timeline({ startDate, targetDate, currentProgress }: TimelineProps) {
  const today = new Date();
  const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = (daysElapsed / totalDays) * 100;

  const expectedProgress = progressPercentage;
  const isBehindSchedule = currentProgress < expectedProgress - 10;
  const isAheadSchedule = currentProgress > expectedProgress + 10;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Timeline to Completion</h2>
          <p className="text-sm text-gray-600">Target deadline: {formatDate(targetDate)}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${isBehindSchedule ? 'text-amber-600' : 'text-primary'}`}>
            {daysRemaining}
          </div>
          <div className="text-sm text-gray-600">days remaining</div>
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="relative">
        {/* Background track */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          {/* Time progress (how much time has passed) */}
          <div
            className="h-full bg-gray-300 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Work progress (how much work is done) */}
        <div
          className="absolute top-0 h-3 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all"
          style={{ width: `${currentProgress}%` }}
        />

        {/* Milestone markers */}
        <div className="absolute top-0 left-0 w-full h-3 flex justify-between items-center">
          {/* Start marker */}
          <div className="w-4 h-4 bg-success rounded-full border-2 border-white -ml-2 shadow-sm" />

          {/* Today marker */}
          <div
            className="absolute -mt-8"
            style={{ left: `${progressPercentage}%` }}
          >
            <div className="relative -ml-8">
              <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
              <div className="text-xs font-medium text-gray-600 whitespace-nowrap mt-1">
                Today
              </div>
            </div>
          </div>

          {/* End marker */}
          <div className="w-4 h-4 bg-white border-2 border-primary rounded-full -mr-2 shadow-sm" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-8 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary-light rounded-full" />
            <span className="text-gray-600">Your progress ({currentProgress.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <span className="text-gray-600">Time elapsed</span>
          </div>
        </div>

        {isBehindSchedule && (
          <div className="flex items-center space-x-2 text-amber-600">
            <ClockIcon className="w-4 h-4" />
            <span className="font-medium">Action needed to stay on track</span>
          </div>
        )}
        {isAheadSchedule && (
          <div className="flex items-center space-x-2 text-success">
            <ClockIcon className="w-4 h-4" />
            <span className="font-medium">Ahead of schedule</span>
          </div>
        )}
      </div>
    </div>
  );
}
