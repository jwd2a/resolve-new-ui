'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

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

interface HolidayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  holidayName: string;
  initialConfig: HolidayConfig;
  onSave: (config: HolidayConfig) => void;
}

export default function HolidayConfigModal({
  isOpen,
  onClose,
  holidayName,
  initialConfig,
  onSave,
}: HolidayConfigModalProps) {
  const [config, setConfig] = useState<HolidayConfig>(initialConfig);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  const handleScheduleTypeChange = (scheduleType: ScheduleType) => {
    setConfig({
      ...config,
      scheduleType,
      timingType: 'mutual',
      alternatingOddYearParent: scheduleType === 'alternating' ? 'justin' : undefined,
    });
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Configure {holidayName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
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
                <option value="alternating">Alternating Years</option>
                <option value="split">Split Day</option>
                <option value="justin">Justin has children</option>
                <option value="michael">Michael has children</option>
              </select>
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

            {/* Holiday Timing */}
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

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
