'use client';

import { useState } from 'react';
import { PlusIcon, Cog6ToothIcon, TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import HolidayConfigModal from './HolidayConfigModal';
import AddHolidayModal from './AddHolidayModal';

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

interface HolidayScheduleFormProps {
  flowType?: string;
}

export default function HolidayScheduleForm({ flowType = 'inline' }: HolidayScheduleFormProps) {
  // State for inline flow
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [addHolidayModalOpen, setAddHolidayModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  // State for selection flow
  const [step, setStep] = useState<'selection' | 'configuration'>('selection');
  const [selectedHolidayNames, setSelectedHolidayNames] = useState<string[]>([]);
  const [customHolidays, setCustomHolidays] = useState<string[]>([]);
  const [customHolidayInput, setCustomHolidayInput] = useState('');

  // Shared functions
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

  // Selection flow functions
  const toggleHolidaySelection = (name: string) => {
    setSelectedHolidayNames(prev =>
      prev.includes(name)
        ? prev.filter(h => h !== name)
        : [...prev, name]
    );
  };

  const addCustomHolidayToSelection = () => {
    if (customHolidayInput.trim() && !customHolidays.includes(customHolidayInput.trim())) {
      setCustomHolidays([...customHolidays, customHolidayInput.trim()]);
      setSelectedHolidayNames([...selectedHolidayNames, customHolidayInput.trim()]);
      setCustomHolidayInput('');
    }
  };

  const removeCustomHoliday = (name: string) => {
    setCustomHolidays(customHolidays.filter(h => h !== name));
    setSelectedHolidayNames(selectedHolidayNames.filter(h => h !== name));
  };

  const proceedToConfiguration = () => {
    // Create holidays from selected names
    const newHolidays: Holiday[] = selectedHolidayNames.map(name => ({
      id: Date.now().toString() + Math.random(),
      name,
      config: {
        scheduleType: 'alternating',
        alternatingOddYearParent: 'justin',
        timingType: 'mutual',
      },
    }));
    setHolidays(newHolidays);
    setStep('configuration');
  };

  const goBackToSelection = () => {
    // Preserve current selections
    const holidayNames = holidays.map(h => h.name);
    setSelectedHolidayNames(holidayNames);
    setStep('selection');
  };

  // Render inline flow (original version)
  if (flowType === 'inline') {
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
            <button
              onClick={() => setAddHolidayModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Holiday</span>
            </button>
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

        {/* Add Holiday Modal */}
        <AddHolidayModal
          isOpen={addHolidayModalOpen}
          onClose={() => setAddHolidayModalOpen(false)}
          onAddHoliday={(holiday) => {
            setHolidays([...holidays, holiday]);
            setAddHolidayModalOpen(false);
          }}
          existingHolidayNames={holidays.map(h => h.name)}
        />

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

  // Render selection flow (alternative version)
  if (step === 'selection') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Holidays</h2>
          <p className="text-sm text-gray-600">
            Choose the holidays that need special scheduling. If you are going to follow the same schedule, no need to select.
            You&apos;ll configure each selected holiday in the next step.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Common Holidays */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Common Holidays</h3>
            <div className="space-y-2">
              {COMMON_HOLIDAYS.map((name) => (
                <label
                  key={name}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedHolidayNames.includes(name)}
                    onChange={() => toggleHolidaySelection(name)}
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                  />
                  <span className="ml-3 text-sm text-gray-900">{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Holidays */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Holidays</h3>

            {customHolidays.length > 0 && (
              <div className="space-y-2 mb-3">
                {customHolidays.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-blue-50"
                  >
                    <label className="flex items-center flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedHolidayNames.includes(name)}
                        onChange={() => toggleHolidaySelection(name)}
                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">{name}</span>
                    </label>
                    <button
                      onClick={() => removeCustomHoliday(name)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a custom holiday"
                value={customHolidayInput}
                onChange={(e) => setCustomHolidayInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustomHolidayToSelection();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={addCustomHolidayToSelection}
                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Count */}
          {selectedHolidayNames.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-primary font-medium">
                {selectedHolidayNames.length} {selectedHolidayNames.length === 1 ? 'holiday' : 'holidays'} selected
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={proceedToConfiguration}
            disabled={selectedHolidayNames.length === 0}
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors mb-3 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>Next: Configure Holidays</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <div className="text-center">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Skip &apos;Holiday Schedule&apos; and complete later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render configuration step (step 2 of selection flow)
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Configure Holidays</h2>
          <button
            onClick={goBackToSelection}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            ← Back to Selection
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Set up how each holiday should be scheduled. Click &quot;Configure&quot; to customize each one.
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
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
              <button
                onClick={() => openConfigModal(holiday)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Configure</span>
              </button>
            </div>
          ))}
        </div>
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
