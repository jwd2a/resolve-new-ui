import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { HomeIcon, UsersIcon, DocumentTextIcon, AcademicCapIcon, DocumentDuplicateIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Stage {
  id: string;
  name: string;
  icon: any;
  status: 'completed' | 'current' | 'upcoming';
  progress?: number;
  substeps?: { name: string; completed: boolean }[];
}

interface ParentingPlanProgressProps {
  stages: Stage[];
}

export default function ParentingPlanProgress({ stages }: ParentingPlanProgressProps) {
  const getStatusColor = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'current':
        return 'bg-primary text-white';
      case 'upcoming':
        return 'bg-gray-100 text-gray-400';
    }
  };

  const getLineColor = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'current':
        return 'bg-gradient-to-b from-success to-primary';
      case 'upcoming':
        return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Parenting Plan Journey</h3>

      <div className="relative">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="relative">
              <div className="flex items-start space-x-4 mb-6">
                {/* Icon and line */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(
                      stage.status
                    )} shadow-sm relative z-10`}
                  >
                    <Icon className="w-6 h-6" />
                    {stage.status === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                      </div>
                    )}
                  </div>

                  {/* Connecting line */}
                  {!isLast && (
                    <div className={`w-1 h-16 ${getLineColor(stage.status)} my-2`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h4 className="font-semibold text-foreground mb-1">{stage.name}</h4>

                  {stage.status === 'completed' && (
                    <p className="text-sm text-success font-medium">Completed</p>
                  )}

                  {stage.status === 'current' && stage.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">In Progress</span>
                        <span className="text-primary font-medium">{stage.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all"
                          style={{ width: `${stage.progress}%` }}
                        />
                      </div>

                      {/* Substeps if available */}
                      {stage.substeps && stage.substeps.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {stage.substeps.map((substep, subIndex) => (
                            <div key={subIndex} className="flex items-center space-x-2 text-sm">
                              {substep.completed ? (
                                <CheckCircleIcon className="w-4 h-4 text-success flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                              )}
                              <span
                                className={
                                  substep.completed ? 'text-gray-600' : 'text-gray-500'
                                }
                              >
                                {substep.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {stage.status === 'upcoming' && (
                    <p className="text-sm text-gray-400">Coming up</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
