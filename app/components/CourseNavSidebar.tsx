'use client';

import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Lesson {
  id: string;
  number: number;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface Module {
  id: string;
  number: number;
  title: string;
  lessons: Lesson[];
  expanded?: boolean;
}

interface CourseNavSidebarProps {
  modules: Module[];
  onLessonClick?: (moduleId: string, lessonId: string) => void;
}

export default function CourseNavSidebar({ modules: initialModules, onLessonClick }: CourseNavSidebarProps) {
  const [modules, setModules] = useState(initialModules);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, expanded: !module.expanded }
        : module
    ));
  };

  return (
    <div className="w-64 bg-white border-r border-border h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        {modules.map((module) => (
          <div key={module.id} className="space-y-1">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Module {module.number}</div>
                <div className="text-sm font-medium text-gray-900">{module.title}</div>
              </div>
              {module.expanded ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {module.expanded && (
              <div className="ml-3 pl-3 border-l-2 border-gray-200 space-y-1">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonClick?.(module.id, lesson.id)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors text-left ${
                      lesson.current
                        ? 'bg-primary/5 text-primary'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      lesson.completed
                        ? 'bg-success text-white'
                        : lesson.current
                        ? 'bg-primary text-white text-xs font-semibold'
                        : 'bg-gray-200 text-gray-600 text-xs font-semibold'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircleIcon className="w-4 h-4" />
                      ) : (
                        lesson.number
                      )}
                    </div>
                    <span className="text-sm flex-1">{lesson.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
