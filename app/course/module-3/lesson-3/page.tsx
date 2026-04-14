'use client';

import { useState } from 'react';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import ScheduleCalendar, { ScheduleData, ScheduleType } from '@/app/components/ScheduleCalendar';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function WeekdayWeekendSchedulePage() {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('2-2-5-5');
  const [exchangeLocation, setExchangeLocation] = useState('');
  const [scheduleFutureChange, setScheduleFutureChange] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    days: {},
    parent1Name: 'Justin Davis',
    parent2Name: 'Other Parent',
  });

  const keyPoints = [
    'Choose a schedule that prioritizes stability for the child and consistency.',
    'Build in buffer time for smooth transitions.',
    'Remember that you\'ll probably get to see your kids at activities during the other parent\'s timesharing.',
  ];

  const handleGenerate = () => {
    console.log('Generating parenting plan with:', {
      scheduleType,
      exchangeLocation,
      scheduleFutureChange,
      scheduleData,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <LessonVideoContent
          title="Weekday and Weekend Schedule"
          keyPoints={keyPoints}
        />
      </div>

      <div>
        <div className="bg-white rounded-xl border border-border p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Weekday and Weekend Schedule
            </h2>
            <p className="text-sm text-gray-600">
              Select the schedule type that works best for your family
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Schedule Type:
            </label>
            <select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="2-2-5-5">2-2-5-5 Schedule</option>
              <option value="2-2-3">2-2-3 Schedule</option>
              <option value="3-4-4-3">3-4-4-3 Schedule</option>
              <option value="alternating-weeks">Alternating Weeks</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>

          <ScheduleCalendar
            weeks={4}
            scheduleType={scheduleType}
            initialSchedule={scheduleData}
            onScheduleChange={setScheduleData}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exchanges will generally be conducted at
            </label>
            <select
              value={exchangeLocation}
              onChange={(e) => setExchangeLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select location...</option>
              <option value="parent1-home">Justin Davis&apos;s home</option>
              <option value="parent2-home">Other parent&apos;s home</option>
              <option value="school">School</option>
              <option value="public-location">Public location</option>
            </select>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="scheduleFutureChange"
              checked={scheduleFutureChange}
              onChange={(e) => setScheduleFutureChange(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="scheduleFutureChange" className="text-sm text-gray-700">
              Schedule a future change to the parenting plan
            </label>
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate
            </button>

            <button className="text-sm text-gray-600 hover:text-primary transition-colors">
              Skip &apos;Weekday and Weekend Schedule&apos; and complete later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
