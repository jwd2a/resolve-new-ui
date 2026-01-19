'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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

interface SelectHolidaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolidays: (holidays: Holiday[]) => void;
  existingHolidayNames: string[];
}

export default function SelectHolidaysModal({
  isOpen,
  onClose,
  onAddHolidays,
  existingHolidayNames,
}: SelectHolidaysModalProps) {
  const [selectedHolidayNames, setSelectedHolidayNames] = useState<string[]>([]);
  const [customHolidays, setCustomHolidays] = useState<string[]>([]);
  const [customHolidayInput, setCustomHolidayInput] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedHolidayNames([]);
      setCustomHolidays([]);
      setCustomHolidayInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableCommonHolidays = COMMON_HOLIDAYS.filter(
    name => !existingHolidayNames.includes(name)
  );

  const toggleHolidaySelection = (name: string) => {
    setSelectedHolidayNames(prev =>
      prev.includes(name)
        ? prev.filter(h => h !== name)
        : [...prev, name]
    );
  };

  const addCustomHoliday = () => {
    const trimmedName = customHolidayInput.trim();
    if (
      trimmedName.length >= 2 &&
      !customHolidays.includes(trimmedName) &&
      !existingHolidayNames.includes(trimmedName) &&
      !COMMON_HOLIDAYS.includes(trimmedName)
    ) {
      setCustomHolidays([...customHolidays, trimmedName]);
      setSelectedHolidayNames([...selectedHolidayNames, trimmedName]);
      setCustomHolidayInput('');
    }
  };

  const removeCustomHoliday = (name: string) => {
    setCustomHolidays(customHolidays.filter(h => h !== name));
    setSelectedHolidayNames(selectedHolidayNames.filter(h => h !== name));
  };

  const handleAddHolidays = () => {
    // Create Holiday objects with unconfigured state - user must configure each one
    const newHolidays: Holiday[] = selectedHolidayNames.map(name => ({
      id: Date.now().toString() + Math.random(),
      name,
      config: {
        scheduleType: 'normal',
      },
    }));
    onAddHolidays(newHolidays);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Holidays
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Select the holidays that need special scheduling. You&apos;ll configure each one after adding them.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Common Holidays */}
            {availableCommonHolidays.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Common Holidays</h3>
                <div className="space-y-2">
                  {availableCommonHolidays.map((name) => (
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
            )}

            {availableCommonHolidays.length === 0 && customHolidays.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  All common holidays have been added. You can add custom holidays below.
                </p>
              </div>
            )}

            {/* Custom Holidays */}
            <div>
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
                    if (e.key === 'Enter') addCustomHoliday();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={addCustomHoliday}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Selected Count */}
            {selectedHolidayNames.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                <p className="text-sm text-primary font-medium">
                  {selectedHolidayNames.length} {selectedHolidayNames.length === 1 ? 'holiday' : 'holidays'} selected
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddHolidays}
              disabled={selectedHolidayNames.length === 0}
              className="px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Selected Holidays
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
