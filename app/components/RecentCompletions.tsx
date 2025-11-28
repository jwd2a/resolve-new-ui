import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

interface Completion {
  name: string;
  time: string;
  category?: string;
}

interface RecentCompletionsProps {
  completions: Completion[];
}

export default function RecentCompletions({ completions }: RecentCompletionsProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recently Completed</h3>
        <span className="text-sm text-gray-500">{completions.length} this week</span>
      </div>
      <div className="space-y-3">
        {completions.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg border border-success/10">
            <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              {item.category && (
                <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 whitespace-nowrap">
              <ClockIcon className="w-3 h-3" />
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
