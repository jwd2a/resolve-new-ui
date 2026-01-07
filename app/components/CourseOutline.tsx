'use client';

import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  lessonCount: number;
  locked?: boolean;
}

interface CourseOutlineProps {
  modules: CourseModule[];
}

export default function CourseOutline({ modules }: CourseOutlineProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Course Outline</h2>
            <p className="text-sm text-gray-600">What you'll learn after onboarding</p>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module, index) => {
          const isLocked = module.locked !== false; // Default to locked

          return (
            <div
              key={module.id}
              className={`border rounded-lg p-4 transition-all ${
                isLocked
                  ? 'border-gray-200 bg-gray-50/50'
                  : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Module Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isLocked
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-primary text-white'
                    }`}>
                      {module.number}
                    </div>
                    <h3 className={`font-semibold ${
                      isLocked ? 'text-gray-600' : 'text-gray-900'
                    }`}>
                      {module.title}
                    </h3>
                  </div>

                  <p className={`text-sm mb-3 ${
                    isLocked ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {module.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="text-gray-400">•</div>
                    <div className="text-gray-500">
                      {module.lessonCount} {module.lessonCount === 1 ? 'lesson' : 'lessons'}
                    </div>
                  </div>
                </div>

                {/* Lock/Complete Indicator */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <LockClosedIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {modules.length} modules • ~{modules.reduce((acc, m) => {
              const mins = parseInt(m.duration);
              return acc + (isNaN(mins) ? 0 : mins);
            }, 0)} minutes total
          </span>
          <div className="flex items-center space-x-2 text-gray-400">
            <LockClosedIcon className="w-4 h-4" />
            <span className="text-xs">Unlocks after onboarding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
