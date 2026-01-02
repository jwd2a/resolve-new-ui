'use client';

import { useState } from 'react';
import { PlusIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';
import HolidayConfigModal from './HolidayConfigModal';

type ScheduleType = 'normal' | 'alternating' | 'split' | 'justin' | 'michael';
type TimingType = 'mutual' | 'specify';

interface HolidayConfig {
  scheduleType: ScheduleType;
  alternatingOddYearParent?: 'justin' | 'michael';
  timingType?: TimingType;
  beginTime?: string;
  endTime?: string;
  beginDate?: string;
  endDate?: string;
}

interface Holiday {
  id: string;
  name: string;
  config: HolidayConfig;
}

const COMMON_HOLIDAYS = [
  "New Year's Day",
  "Martin Luther King Jr. Day",
  "Presidents' Day",
  "Memorial Day",
  "Juneteenth",
  "Independence Day",
  "Labor Day",
  "Columbus Day / Indigenous Peoples' Day",
  "Veterans Day",
  "Thanksgiving",
  "Christmas Eve",
  "Christmas Day",
  "New Year's Eve",
];

export default function HolidayScheduleForm() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHolidayName, setCustomHolidayName] = useState('');
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const addHoliday = (name: string) => {
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name,
      config: {
        scheduleType: 'normal',
      },
    };
    setHolidays([...holidays, newHoliday]);
    setShowAddMenu(false);
    setShowCustomInput(false);
    setCustomHolidayName('');
  };

  const addCustomHoliday = () => {
    if (customHolidayName.trim()) {
      addHoliday(customHolidayName.trim());
    }
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const openConfigModal = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setConfigModalOpen(true);
  };

  const saveHolidayConfig = (config: HolidayConfig) => {
    if (selectedHoliday) {
      setHolidays(holidays.map(h =>
        h.id === selectedHoliday.id ? { ...h, config } : h
      ));
    }
  };

  const getBadgeText = (config: HolidayConfig): string => {
    switch (config.scheduleType) {
      case 'normal':
        return 'Normal Schedule';
      case 'alternating':
        return 'Alternating';
      case 'split':
        return 'Split Day';
      case 'justin':
        return 'Justin';
      case 'michael':
        return 'Michael';
      default:
        return 'Not Configured';
    }
  };

  const getBadgeColor = (config: HolidayConfig): string => {
    switch (config.scheduleType) {
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

  const availableHolidays = COMMON_HOLIDAYS.filter(
    name => !holidays.some(h => h.name === name)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Holiday Schedule</h2>
        <p className="text-sm text-gray-600">
          Add the holidays your family celebrates together, then configure how each holiday should be scheduled.
          All holidays not listed here will follow your normal schedule.
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Add Holiday Button */}
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Holiday</span>
            </button>

            {/* Dropdown Menu */}
            {showAddMenu && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                    Common Holidays
                  </div>
                  {availableHolidays.length > 0 ? (
                    availableHolidays.map((name) => (
                      <button
                        key={name}
                        onClick={() => addHoliday(name)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 italic">
                      All common holidays added
                    </div>
                  )}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setShowCustomInput(true);
                        setShowAddMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded transition-colors"
                    >
                      + Add Custom Holiday
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Holiday Input */}
          {showCustomInput && (
            <div className="mt-3 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter holiday name"
                value={customHolidayName}
                onChange={(e) => setCustomHolidayName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustomHoliday();
                  if (e.key === 'Escape') {
                    setShowCustomInput(false);
                    setCustomHolidayName('');
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              <button
                onClick={addCustomHoliday}
                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomHolidayName('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Holidays List */}
        {holidays.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No holidays added yet</p>
            <p className="text-sm text-gray-500">
              Click &quot;Add Holiday&quot; to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div
                key={holiday.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{holiday.name}</span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getBadgeColor(holiday.config)}`}>
                      {getBadgeText(holiday.config)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openConfigModal(holiday)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                  <button
                    onClick={() => removeHoliday(holiday.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6">
        <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors mb-3">
          Continue
        </button>
        <div className="text-center">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Skip &apos;Holiday Schedule&apos; and complete later
          </button>
        </div>
      </div>

      {/* Config Modal */}
      {selectedHoliday && (
        <HolidayConfigModal
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setSelectedHoliday(null);
          }}
          holidayName={selectedHoliday.name}
          initialConfig={selectedHoliday.config}
          onSave={saveHolidayConfig}
        />
      )}
    </div>
  );
}
