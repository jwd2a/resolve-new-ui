'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '../OnboardingContext';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

export default function JurisdictionPage() {
  const router = useRouter();
  const { data, updateData, markStepComplete } = useOnboarding();

  const canContinue = data.jurisdictionState !== '';

  const handleContinue = () => {
    markStepComplete(4);
    router.push('/onboarding/target-date');
  };

  const handleBack = () => {
    router.push('/onboarding/children');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Jurisdiction</h1>
      <p className="text-gray-500 mb-8">Last step before setting your target — where will you be filing?</p>

      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-4">
          What state will you be filing your divorce or separation?
        </label>
        <select
          value={data.jurisdictionState}
          onChange={(e) => updateData({ jurisdictionState: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 bg-white"
        >
          <option value="">Select your state</option>
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Footer */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3.5 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="px-8 py-3.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
