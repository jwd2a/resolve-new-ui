'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export type ScheduleType = '2-2-5-5' | '2-2-3' | '3-4-4-3' | 'alternating-weeks' | 'custom' | '';

interface ScheduleCalendarProps {
  weeks?: number;
  onScheduleChange?: (schedule: ScheduleData) => void;
  initialSchedule?: ScheduleData;
  scheduleType?: ScheduleType;
}

export interface ScheduleData {
  days: { [key: string]: 'parent1' | 'parent2' | undefined };
  parent1Name?: string;
  parent2Name?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PARENT_COLORS = {
  parent1: {
    bg: 'bg-blue-300',
    hover: 'hover:bg-blue-400',
    label: 'bg-blue-300',
  },
  parent2: {
    bg: 'bg-yellow-300',
    hover: 'hover:bg-yellow-400',
    label: 'bg-yellow-300',
  },
};

// Schedule preset patterns (repeating 2-week cycles)
const SCHEDULE_PRESETS: { [key in ScheduleType]: (weekIndex: number, dayIndex: number) => 'parent1' | 'parent2' | undefined } = {
  '2-2-5-5': (weekIndex: number, dayIndex: number) => {
    // Week pattern: P1:Mon-Tue, P2:Wed-Thu, P1:Fri-Sun, then P2:Mon-Tue, P1:Wed-Thu, P2:Fri-Sun
    const twoWeekCycle = weekIndex % 2;
    if (twoWeekCycle === 0) {
      if (dayIndex <= 1) return 'parent1'; // Mon-Tue
      if (dayIndex <= 3) return 'parent2'; // Wed-Thu
      return 'parent1'; // Fri-Sun
    } else {
      if (dayIndex <= 1) return 'parent2'; // Mon-Tue
      if (dayIndex <= 3) return 'parent1'; // Wed-Thu
      return 'parent2'; // Fri-Sun
    }
  },
  '2-2-3': (weekIndex: number, dayIndex: number) => {
    // Week pattern: P1:Mon-Tue, P2:Wed-Thu, P1:Fri-Sun, then same
    const twoWeekCycle = weekIndex % 2;
    if (twoWeekCycle === 0) {
      if (dayIndex <= 1) return 'parent1'; // Mon-Tue
      if (dayIndex <= 3) return 'parent2'; // Wed-Thu
      return 'parent1'; // Fri-Sun
    } else {
      if (dayIndex <= 1) return 'parent2'; // Mon-Tue
      if (dayIndex <= 3) return 'parent1'; // Wed-Thu
      return 'parent2'; // Fri-Sun
    }
  },
  '3-4-4-3': (weekIndex: number, dayIndex: number) => {
    // Week pattern: P1:Mon-Wed (3), P2:Thu-Sun (4), then P2:Mon-Thu (4), P1:Fri-Sun (3)
    const twoWeekCycle = weekIndex % 2;
    if (twoWeekCycle === 0) {
      if (dayIndex <= 2) return 'parent1'; // Mon-Wed (3 days)
      return 'parent2'; // Thu-Sun (4 days)
    } else {
      if (dayIndex <= 3) return 'parent2'; // Mon-Thu (4 days)
      return 'parent1'; // Fri-Sun (3 days)
    }
  },
  'alternating-weeks': (weekIndex: number, _dayIndex: number) => {
    return weekIndex % 2 === 0 ? 'parent1' : 'parent2';
  },
  'custom': () => undefined,
  '': () => undefined,
};

export default function ScheduleCalendar({
  weeks = 4,
  onScheduleChange,
  initialSchedule,
  scheduleType = 'custom'
}: ScheduleCalendarProps) {
  const [schedule, setSchedule] = useState<ScheduleData>(initialSchedule || {
    days: {},
    parent1Name: 'Parent 1',
    parent2Name: 'Parent 2',
  });
  const [selectedParent, setSelectedParent] = useState<'parent1' | 'parent2'>('parent1');
  const lastClickedRef = useRef<{ weekIndex: number; dayIndex: number } | null>(null);

  // Apply preset pattern when scheduleType changes
  useEffect(() => {
    if (scheduleType !== 'custom' && scheduleType !== '') {
      const preset = SCHEDULE_PRESETS[scheduleType];
      const newDays: { [key: string]: 'parent1' | 'parent2' | undefined } = {};

      for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          const key = `${weekIndex}-${dayIndex}`;
          const parent = preset(weekIndex, dayIndex);
          if (parent) {
            newDays[key] = parent;
          }
        }
      }

      const newSchedule = {
        ...schedule,
        days: newDays,
      };
      setSchedule(newSchedule);
      onScheduleChange?.(newSchedule);
    }
  }, [scheduleType, weeks]);

  const handleDayClick = (weekIndex: number, dayIndex: number, shiftKey: boolean) => {
    const key = `${weekIndex}-${dayIndex}`;

    // Handle shift-click range selection
    if (shiftKey && lastClickedRef.current) {
      const lastClicked = lastClickedRef.current;
      const newDays = { ...schedule.days };

      // Calculate range
      const startWeek = Math.min(lastClicked.weekIndex, weekIndex);
      const endWeek = Math.max(lastClicked.weekIndex, weekIndex);
      const startDay = lastClicked.weekIndex === weekIndex
        ? Math.min(lastClicked.dayIndex, dayIndex)
        : 0;
      const endDay = lastClicked.weekIndex === weekIndex
        ? Math.max(lastClicked.dayIndex, dayIndex)
        : 6;

      // Fill range with selected parent
      for (let w = startWeek; w <= endWeek; w++) {
        const dayStart = w === startWeek ? startDay : 0;
        const dayEnd = w === endWeek ? endDay : 6;

        for (let d = dayStart; d <= dayEnd; d++) {
          const rangeKey = `${w}-${d}`;
          newDays[rangeKey] = selectedParent;
        }
      }

      const newSchedule = {
        ...schedule,
        days: newDays,
      };
      setSchedule(newSchedule);
      onScheduleChange?.(newSchedule);
    } else {
      // Normal click: cycle through parent1 -> parent2 -> none
      const currentValue = schedule.days[key];
      let newValue: 'parent1' | 'parent2' | undefined;

      if (currentValue === 'parent1') {
        newValue = 'parent2';
      } else if (currentValue === 'parent2') {
        newValue = undefined;
      } else {
        newValue = 'parent1';
      }

      const newDays = { ...schedule.days };
      if (newValue === undefined) {
        delete newDays[key];
      } else {
        newDays[key] = newValue;
      }

      const newSchedule = {
        ...schedule,
        days: newDays,
      };
      setSchedule(newSchedule);
      onScheduleChange?.(newSchedule);
    }

    // Update last clicked reference
    lastClickedRef.current = { weekIndex, dayIndex };
  };

  const handleSwapParents = () => {
    const newDays: { [key: string]: 'parent1' | 'parent2' } = {};
    Object.entries(schedule.days).forEach(([key, value]) => {
      newDays[key] = value === 'parent1' ? 'parent2' : 'parent1';
    });
    const newSchedule = {
      ...schedule,
      days: newDays,
    };
    setSchedule(newSchedule);
    onScheduleChange?.(newSchedule);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <div className="space-y-3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week Rows */}
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {DAYS.map((_, dayIndex) => {
              const key = `${weekIndex}-${dayIndex}`;
              const assignedParent = schedule.days[key];
              const colors = assignedParent ? PARENT_COLORS[assignedParent] : null;

              return (
                <button
                  key={dayIndex}
                  onClick={(e) => handleDayClick(weekIndex, dayIndex, e.shiftKey)}
                  className={`
                    aspect-square rounded-lg border-2 transition-all
                    ${assignedParent
                      ? `${colors?.bg} ${colors?.hover} border-transparent`
                      : 'bg-white border-gray-200 hover:border-primary hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  `}
                  aria-label={`${DAYS[dayIndex]} week ${weekIndex + 1}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSelectedParent('parent1')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              selectedParent === 'parent1'
                ? 'bg-blue-50 ring-2 ring-blue-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded ${PARENT_COLORS.parent1.label}`} />
            <span className="text-sm font-medium text-gray-700">
              {schedule.parent1Name}
            </span>
          </button>

          <button
            onClick={() => setSelectedParent('parent2')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              selectedParent === 'parent2'
                ? 'bg-yellow-50 ring-2 ring-yellow-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded ${PARENT_COLORS.parent2.label}`} />
            <span className="text-sm font-medium text-gray-700">
              {schedule.parent2Name}
            </span>
          </button>
        </div>

        <button
          onClick={handleSwapParents}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
          title="Swap parent assignments"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
