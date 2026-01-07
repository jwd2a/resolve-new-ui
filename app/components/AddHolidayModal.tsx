'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

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

interface AddHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHoliday: (holiday: Holiday) => void;
  existingHolidayNames: string[];
}

export default function AddHolidayModal({
  isOpen,
  onClose,
  onAddHoliday,
  existingHolidayNames,
}: AddHolidayModalProps) {
  const [step, setStep] = useState<'selection' | 'configuration'>('selection');
  const [selectedHolidayName, setSelectedHolidayName] = useState<string>('');
  const [customHolidayName, setCustomHolidayName] = useState<string>('');
  const [config, setConfig] = useState<HolidayConfig>({
    scheduleType: 'normal',
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('selection');
      setSelectedHolidayName('');
      setCustomHolidayName('');
      setConfig({ scheduleType: 'normal' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableHolidays = COMMON_HOLIDAYS.filter(
    name => !existingHolidayNames.includes(name)
  );

  const isCustomHoliday = selectedHolidayName === '__custom__';
  const holidayName = isCustomHoliday ? customHolidayName : selectedHolidayName;

  // Validation for step 1
  const canProceedToConfig = isCustomHoliday
    ? customHolidayName.trim().length >= 2 && !existingHolidayNames.includes(customHolidayName.trim())
    : selectedHolidayName !== '';

  const handleScheduleTypeChange = (scheduleType: ScheduleType) => {
    setConfig({
      ...config,
      scheduleType,
      timingType: scheduleType === 'normal' ? undefined : 'mutual',
      alternatingOddYearParent: scheduleType === 'alternating' ? 'justin' : undefined,
    });
  };

  const handleNext = () => {
    if (canProceedToConfig) {
      setStep('configuration');
    }
  };

  const handleBack = () => {
    setStep('selection');
  };

  const handleAddHoliday = () => {
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name: holidayName.trim(),
      config,
    };
    onAddHoliday(newHoliday);
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {step === 'selection' ? 'Add Holiday' : `Configure ${holidayName}`}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-2">
              <div className={`flex items-center ${step === 'selection' ? 'text-primary' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                  step === 'selection' ? 'border-primary bg-primary text-white' : 'border-gray-300'
                }`}>1</span>
                <span className="ml-2 text-sm font-medium">Select</span>
              </div>
              <div className={`w-12 h-0.5 ${step === 'configuration' ? 'bg-primary' : 'bg-gray-300'}`} />
              <div className={`flex items-center ${step === 'configuration' ? 'text-primary' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                  step === 'configuration' ? 'border-primary bg-primary text-white' : 'border-gray-300'
                }`}>2</span>
                <span className="ml-2 text-sm font-medium">Configure</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {step === 'selection' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select a holiday to add to your schedule, or create a custom holiday.
                </p>

                {/* Available Holidays */}
                {availableHolidays.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Common Holidays</h4>
                    {availableHolidays.map((name) => (
                      <button
                        key={name}
                        onClick={() => {
                          setSelectedHolidayName(name);
                          setCustomHolidayName('');
                        }}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                          selectedHolidayName === name
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{name}</span>
                          {selectedHolidayName === name && (
                            <CheckCircleIcon className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600">
                      All common holidays have been added. You can add a custom holiday below.
                    </p>
                  </div>
                )}

                {/* Custom Holiday */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Custom Holiday</h4>
                  <button
                    onClick={() => {
                      setSelectedHolidayName('__custom__');
                      setTimeout(() => {
                        document.getElementById('custom-holiday-input')?.focus();
                      }, 100);
                    }}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-colors mb-3 ${
                      selectedHolidayName === '__custom__'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Add Custom Holiday</span>
                      {selectedHolidayName === '__custom__' && (
                        <CheckCircleIcon className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>

                  {selectedHolidayName === '__custom__' && (
                    <div>
                      <input
                        id="custom-holiday-input"
                        type="text"
                        placeholder="Enter holiday name"
                        value={customHolidayName}
                        onChange={(e) => setCustomHolidayName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {customHolidayName.trim().length > 0 && customHolidayName.trim().length < 2 && (
                        <p className="mt-2 text-sm text-red-600">
                          Holiday name must be at least 2 characters
                        </p>
                      )}
                      {customHolidayName.trim().length >= 2 && existingHolidayNames.includes(customHolidayName.trim()) && (
                        <p className="mt-2 text-sm text-red-600">
                          This holiday has already been added
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Configuration Step
              <div className="space-y-6">
                {/* Schedule Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    How should this holiday be scheduled?
                  </label>
                  <select
                    value={config.scheduleType}
                    onChange={(e) => handleScheduleTypeChange(e.target.value as ScheduleType)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="normal">Follow Normal Schedule</option>
                    <option value="alternating">Alternating Years</option>
                    <option value="split">Split Day</option>
                    <option value="justin">Justin has children</option>
                    <option value="michael">Michael has children</option>
                  </select>
                  {config.scheduleType === 'normal' && (
                    <p className="mt-2 text-sm text-gray-600">
                      Christmas is not included here by default because it is handled in the Winter Break section, but you may add it here if that works better for you.
                    </p>
                  )}
                </div>

                {/* Alternating Years Options */}
                {config.scheduleType === 'alternating' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Who will have the children for {holidayName} in odd years?
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setConfig({ ...config, alternatingOddYearParent: 'justin' })}
                          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                            config.alternatingOddYearParent === 'justin'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Justin Davis
                        </button>
                        <button
                          onClick={() => setConfig({ ...config, alternatingOddYearParent: 'michael' })}
                          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                            config.alternatingOddYearParent === 'michael'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Michael Davis
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Holiday Timing (for all except normal schedule) */}
                {config.scheduleType !== 'normal' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Holiday Timing
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="timing"
                          value="mutual"
                          checked={config.timingType === 'mutual'}
                          onChange={(e) => setConfig({ ...config, timingType: e.target.value as TimingType })}
                          className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          Times to be determined by mutual agreement in advance of the holiday each year
                        </span>
                      </label>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="timing"
                          value="specify"
                          checked={config.timingType === 'specify'}
                          onChange={(e) => setConfig({ ...config, timingType: e.target.value as TimingType })}
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
                {config.timingType === 'specify' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        When does the holiday time begin?
                      </label>
                      <input
                        type="text"
                        placeholder="Holiday Beginning"
                        value={config.beginDate || ''}
                        onChange={(e) => setConfig({ ...config, beginDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      />
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          placeholder="Begin Time"
                          value={config.beginTime || ''}
                          onChange={(e) => setConfig({ ...config, beginTime: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        value={config.endDate || ''}
                        onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      />
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          placeholder="End Time"
                          value={config.endTime || ''}
                          onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              {step === 'configuration' && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {step === 'selection' ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToConfig}
                  className="px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Configure Holiday
                </button>
              ) : (
                <button
                  onClick={handleAddHoliday}
                  className="px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Add Holiday
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
