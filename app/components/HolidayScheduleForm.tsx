'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, ClockIcon } from '@heroicons/react/24/outline';

type ScheduleType = 'normal' | 'alternating' | 'split' | 'justin' | 'michael';
type TimingType = 'mutual' | 'specify';

interface Holiday {
  id: string;
  name: string;
  scheduleType: ScheduleType;
  alternatingOddYearParent?: 'justin' | 'michael';
  timingType?: TimingType;
  beginTime?: string;
  endTime?: string;
  isExpanded: boolean;
}

export default function HolidayScheduleForm() {
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: '1',
      name: "New Year's Day",
      scheduleType: 'normal',
      isExpanded: false,
    },
    {
      id: '2',
      name: 'Martin Luther King Jr. Day',
      scheduleType: 'alternating',
      alternatingOddYearParent: 'justin',
      timingType: 'mutual',
      isExpanded: true,
    },
    {
      id: '3',
      name: "Presidents' Day",
      scheduleType: 'justin',
      timingType: 'mutual',
      isExpanded: true,
    },
    {
      id: '4',
      name: 'Memorial Day',
      scheduleType: 'split',
      timingType: 'specify',
      beginTime: '',
      endTime: '',
      isExpanded: true,
    },
    {
      id: '5',
      name: 'Juneteenth',
      scheduleType: 'normal',
      isExpanded: false,
    },
    {
      id: '6',
      name: 'Independence Day',
      scheduleType: 'normal',
      isExpanded: false,
    },
    {
      id: '7',
      name: 'Labor Day',
      scheduleType: 'normal',
      isExpanded: false,
    },
    {
      id: '8',
      name: "Columbus Day / Indigenous Peoples' Day",
      scheduleType: 'normal',
      isExpanded: false,
    },
    {
      id: '9',
      name: 'Veterans Day',
      scheduleType: 'normal',
      isExpanded: false,
    },
    {
      id: '10',
      name: 'Thanksgiving',
      scheduleType: 'normal',
      isExpanded: false,
    },
  ]);

  const toggleHoliday = (id: string) => {
    setHolidays(holidays.map(h =>
      h.id === id ? { ...h, isExpanded: !h.isExpanded } : h
    ));
  };

  const updateHolidayScheduleType = (id: string, scheduleType: ScheduleType) => {
    setHolidays(holidays.map(h =>
      h.id === id ? {
        ...h,
        scheduleType,
        timingType: scheduleType === 'normal' ? undefined : 'mutual',
        alternatingOddYearParent: scheduleType === 'alternating' ? 'justin' : undefined,
      } : h
    ));
  };

  const updateHolidayTimingType = (id: string, timingType: TimingType) => {
    setHolidays(holidays.map(h =>
      h.id === id ? { ...h, timingType } : h
    ));
  };

  const updateHolidayAlternatingParent = (id: string, parent: 'justin' | 'michael') => {
    setHolidays(holidays.map(h =>
      h.id === id ? { ...h, alternatingOddYearParent: parent } : h
    ));
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const getBadgeText = (holiday: Holiday): string => {
    switch (holiday.scheduleType) {
      case 'normal':
        return 'Normal Schedule';
      case 'alternating':
        return 'Alternating';
      case 'split':
        return 'Split';
      case 'justin':
        return 'Justin';
      case 'michael':
        return 'Michael';
      default:
        return '';
    }
  };

  const getBadgeColor = (scheduleType: ScheduleType): string => {
    switch (scheduleType) {
      case 'normal':
        return 'bg-blue-100 text-blue-700';
      case 'alternating':
        return 'bg-purple-100 text-purple-700';
      case 'split':
        return 'bg-amber-100 text-amber-700';
      case 'justin':
        return 'bg-green-100 text-green-700';
      case 'michael':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Holiday Schedule</h2>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
            <PlusIcon className="w-4 h-4" />
            <span>Add Custom Holiday</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Agree on your holiday timesharing schedule by selecting which parent will have the children and the times for the start and end times. To review and edit on the details.
        </p>
      </div>

      {/* Holidays List */}
      <div className="divide-y divide-gray-200">
        {holidays.map((holiday) => (
          <div key={holiday.id} className="p-6">
            {/* Holiday Header */}
            <button
              onClick={() => toggleHoliday(holiday.id)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                {holiday.isExpanded ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">{holiday.name}</span>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(holiday.scheduleType)}`}>
                {getBadgeText(holiday)}
              </span>
            </button>

            {/* Holiday Content */}
            {holiday.isExpanded && (
              <div className="mt-6 ml-8 space-y-6">
                {/* Schedule Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    How should this holiday be scheduled?
                  </label>
                  <select
                    value={holiday.scheduleType}
                    onChange={(e) => updateHolidayScheduleType(holiday.id, e.target.value as ScheduleType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="normal">Follow Normal Schedule</option>
                    <option value="alternating">Alternating Years</option>
                    <option value="split">Split Day</option>
                    <option value="justin">Justin has children</option>
                    <option value="michael">Michael has children</option>
                  </select>
                </div>

                {/* Alternating Years Options */}
                {holiday.scheduleType === 'alternating' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Who will have the children for {holiday.name} in odd years?
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateHolidayAlternatingParent(holiday.id, 'justin')}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            holiday.alternatingOddYearParent === 'justin'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Justin Davis
                        </button>
                        <button
                          onClick={() => updateHolidayAlternatingParent(holiday.id, 'michael')}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            holiday.alternatingOddYearParent === 'michael'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Justin Davis
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Holiday Timing (for all except normal schedule) */}
                {holiday.scheduleType !== 'normal' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Holiday Timing
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`timing-${holiday.id}`}
                          value="mutual"
                          checked={holiday.timingType === 'mutual'}
                          onChange={(e) => updateHolidayTimingType(holiday.id, e.target.value as TimingType)}
                          className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          Times to be determined by mutual agreement in advance of the holiday each year
                        </span>
                      </label>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`timing-${holiday.id}`}
                          value="specify"
                          checked={holiday.timingType === 'specify'}
                          onChange={(e) => updateHolidayTimingType(holiday.id, e.target.value as TimingType)}
                          className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          Specify exact times for the holiday
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Time Inputs (when specify is selected) */}
                {holiday.timingType === 'specify' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        When does the holiday time begin?
                      </label>
                      <input
                        type="text"
                        placeholder="Holiday Beginning"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      />
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          placeholder="Begin Time"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        When does the holiday time end?
                      </label>
                      <input
                        type="text"
                        placeholder="Holiday Ending"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      />
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          placeholder="End Time"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove Holiday Button */}
                <button
                  onClick={() => removeHoliday(holiday.id)}
                  className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Remove Holiday</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6">
        <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors mb-3">
          Generate
        </button>
        <div className="text-center">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Skip 'Holiday Schedule' and complete later
          </button>
        </div>
      </div>
    </div>
  );
}
