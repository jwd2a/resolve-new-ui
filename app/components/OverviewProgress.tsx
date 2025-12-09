'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';

interface Module {
  id: string;
  number: number;
  name: string;
  progress: number;
  completed: boolean;
}

interface OverviewProgressProps {
  modules: Module[];
  targetDate: Date;
  estimatedCompletion: Date;
}

export default function OverviewProgress({ modules, targetDate, estimatedCompletion }: OverviewProgressProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const overallProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Progress Overview</h3>

      {/* Module Progress */}
      <div className="space-y-3 mb-6">
        {modules.map((module) => (
          <div key={module.id}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-700 font-medium">Module {module.number}</span>
              <span className="text-gray-600">{module.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  module.completed ? 'bg-success' : 'bg-primary'
                }`}
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Stats */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-lg font-bold text-primary">{overallProgress}%</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-gray-600">Target Date</div>
              <div className="font-semibold text-gray-900">
                {formatDate(targetDate)}
              </div>
              <div className="text-xs text-gray-500">
                {getDaysRemaining(targetDate)} remaining
              </div>
            </div>
          </div>

          {estimatedCompletion && (
            <div className="flex items-start space-x-2">
              <CalendarIcon className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-gray-600">Est. Completion</div>
                <div className="font-semibold text-success">
                  {formatDate(estimatedCompletion)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
