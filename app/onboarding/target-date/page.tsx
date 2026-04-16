'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '../OnboardingContext';
import { CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type PresetOption = 30 | 60 | 90;

function addDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function TargetDatePage() {
  const router = useRouter();
  const { data, updateData, markStepComplete } = useOnboarding();
  const [selectedPreset, setSelectedPreset] = useState<PresetOption | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const presets: { days: PresetOption; label: string }[] = [
    { days: 30, label: '30 days' },
    { days: 60, label: '60 days' },
    { days: 90, label: '90 days' },
  ];

  const handlePresetSelect = (days: PresetOption) => {
    setSelectedPreset(days);
    setShowCustom(false);
    updateData({ targetDate: toISODate(addDays(days)) });
  };

  const handleCustomDate = (dateStr: string) => {
    setSelectedPreset(null);
    updateData({ targetDate: dateStr });
  };

  const handleShowCustom = () => {
    setShowCustom(true);
    setSelectedPreset(null);
  };

  const canComplete = data.targetDate !== '';

  const handleComplete = () => {
    markStepComplete(5);
    router.push('/');
  };

  const handleBack = () => {
    router.push('/onboarding/jurisdiction');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Set Your Target Date</h1>
      <p className="text-gray-500 mb-8">When would you like to have your parenting plan complete? Setting a target helps you stay on track. You can always adjust this later.</p>

      {/* Preset Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {presets.map(({ days, label }) => {
          const isSelected = selectedPreset === days;
          const targetDate = addDays(days);

          return (
            <button
              key={days}
              onClick={() => handlePresetSelect(days)}
              className={`relative p-4 sm:p-5 rounded-xl border-2 text-center sm:text-center flex sm:flex-col items-center sm:items-center justify-between sm:justify-center transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`text-xl sm:text-2xl font-bold sm:mb-1 ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                {label}
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-sm ${isSelected ? 'text-primary/70' : 'text-gray-500'}`}>
                  {formatDate(targetDate)}
                </div>
                {isSelected && (
                  <CheckCircleIcon className="w-5 h-5 text-primary sm:absolute sm:top-3 sm:right-3" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Date Toggle */}
      {!showCustom ? (
        <button
          onClick={handleShowCustom}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-6 block"
        >
          Or pick a specific date
        </button>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose a date</label>
          <input
            type="date"
            value={data.targetDate}
            min={toISODate(new Date())}
            onChange={(e) => handleCustomDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900"
          />
        </div>
      )}

      {/* Selected Date Summary */}
      {data.targetDate && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-center space-x-3">
          <CalendarDaysIcon className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm font-medium text-gray-900">
            Your target: <span className="text-primary">{formatDate(new Date(data.targetDate + 'T00:00:00'))}</span>
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3.5 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className="px-8 py-3.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
}
