import { ArrowRightIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'waiting' | 'progress';
  waitingOn?: string;
  actionUrl?: string;
  estimatedTime?: string;
}

interface WhatsNextProps {
  nextTask?: Task;
  inProgressTasks: Task[];
  waitingTasks: Task[];
}

export default function WhatsNext({ nextTask, inProgressTasks, waitingTasks }: WhatsNextProps) {
  return (
    <div className="space-y-6">
      {/* Primary Next Action */}
      {nextTask && (
        <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 border-2 border-primary/20 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Up Next
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{nextTask.title}</h3>
              <p className="text-gray-600 mb-4">{nextTask.description}</p>
              {nextTask.estimatedTime && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4" />
                  <span>{nextTask.estimatedTime} to complete</span>
                </div>
              )}
            </div>
            <button
              onClick={() => nextTask.actionUrl && (window.location.href = nextTask.actionUrl)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm flex items-center space-x-2 whitespace-nowrap"
            >
              <span>Start Now</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* In Progress Items */}
      {inProgressTasks.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">What You're Working On</h3>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => task.actionUrl && (window.location.href = task.actionUrl)}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waiting Items */}
      {waitingTasks.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Waiting for {waitingTasks[0].waitingOn}
          </h3>
          <div className="space-y-3">
            {waitingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-4 p-4 bg-amber-50 border border-amber-100 rounded-lg"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-amber-600 mt-2">
                    {task.waitingOn} needs to complete this first
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
