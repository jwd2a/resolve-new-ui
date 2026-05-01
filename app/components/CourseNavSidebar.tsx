'use client';

import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, LockClosedIcon } from '@heroicons/react/24/solid';
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

export interface FloridaSidebarFooter {
  examUnlocked: boolean;
  examPassed: boolean;
  resourcesHref: string;
  examHref: string;
  certificateHref: string;
  currentPath: string;
  onNavigate: (href: string) => void;
}

interface CourseNavSidebarProps {
  modules: Module[];
  onLessonClick?: (moduleId: string, lessonId: string) => void;
  floridaFooter?: FloridaSidebarFooter | null;
}

function SidebarFooterLink({
  label,
  active,
  locked = false,
  onClick,
}: {
  label: string;
  href: string;
  active: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
        active
          ? 'bg-primary/5 text-primary font-medium'
          : locked
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span>{label}</span>
      {locked && <LockClosedIcon className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function CourseNavSidebar({ modules: propModules, onLessonClick, floridaFooter }: CourseNavSidebarProps) {
  const [manualExpanded, setManualExpanded] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setManualExpanded(prev => ({ ...prev, [moduleId]: !getExpanded(moduleId) }));
  };

  const getExpanded = (moduleId: string) => {
    if (moduleId in manualExpanded) return manualExpanded[moduleId];
    return propModules.find(m => m.id === moduleId)?.expanded ?? false;
  };

  const modules = propModules.map(m => ({
    ...m,
    expanded: getExpanded(m.id),
  }));

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

        {floridaFooter && (
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-1">
            <div className="px-3 text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Florida Requirements
            </div>
            <SidebarFooterLink
              label="Resources"
              href={floridaFooter.resourcesHref}
              active={floridaFooter.currentPath === floridaFooter.resourcesHref}
              onClick={() => floridaFooter.onNavigate(floridaFooter.resourcesHref)}
            />
            <SidebarFooterLink
              label="Final Exam"
              href={floridaFooter.examHref}
              active={floridaFooter.currentPath === floridaFooter.examHref}
              locked={!floridaFooter.examUnlocked}
              onClick={() => floridaFooter.examUnlocked && floridaFooter.onNavigate(floridaFooter.examHref)}
            />
            <SidebarFooterLink
              label="Certificate"
              href={floridaFooter.certificateHref}
              active={floridaFooter.currentPath === floridaFooter.certificateHref}
              locked={!floridaFooter.examPassed}
              onClick={() => floridaFooter.examPassed && floridaFooter.onNavigate(floridaFooter.certificateHref)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
