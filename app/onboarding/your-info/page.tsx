'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '../OnboardingContext';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function YourInfoPage() {
  const router = useRouter();
  const { data, updateData, markStepComplete } = useOnboarding();

  const canContinue = data.firstName.trim() !== '' && data.lastName.trim() !== '';

  const handleContinue = () => {
    markStepComplete(1);
    router.push('/onboarding/co-parent');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Information</h1>
      <p className="text-gray-500 mb-8">Tell us a bit about yourself to get started.</p>

      {/* Legal Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <input
          type="text"
          placeholder="Street Address"
          value={data.address}
          onChange={(e) => updateData({ address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400 mb-4"
        />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="City"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            className="col-span-2 sm:col-span-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="State"
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
            className="col-span-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="ZIP"
            value={data.zip}
            onChange={(e) => updateData({ zip: e.target.value })}
            className="col-span-1 sm:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="tel"
          placeholder="(555) 123-4567"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Info Callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            It is common to have the same legal address as your co-parent at this stage. You can always adjust your plan as things progress.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
