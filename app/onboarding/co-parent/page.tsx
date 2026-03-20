'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '../OnboardingContext';
import { InformationCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { usePlan } from '@/app/PlanContext';

export default function CoParentPage() {
  const router = useRouter();
  const { data, updateData, markStepComplete } = useOnboarding();
  const { isProposed, setIsProposed } = usePlan();

  const handleContinue = () => {
    markStepComplete(2);
    router.push('/onboarding/children');
  };

  const handleBack = () => {
    router.push('/onboarding/your-info');
  };

  const handleSendInvite = () => {
    if (data.coParentEmail.trim()) {
      updateData({ inviteSent: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Co-Parent Information</h1>
      <p className="text-gray-500 mb-8">Add your co-parent&apos;s details. They&apos;ll need to register as well.</p>

      {/* Solo mode toggle */}
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isProposed}
            onChange={(e) => setIsProposed(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              My co-parent will not be completing this with me
            </span>
            <p className="text-xs text-gray-500 mt-1">
              You&apos;ll create a proposed parenting plan on your own. Your co-parent or a lawyer can review it later.
            </p>
          </div>
        </label>
      </div>

      {/* Co-Parent Legal Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Co-Parent Legal Name</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={data.coParentFirstName}
            onChange={(e) => updateData({ coParentFirstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={data.coParentLastName}
            onChange={(e) => updateData({ coParentLastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Co-Parent Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Co-Parent Legal Address</label>
        <input
          type="text"
          placeholder="Street Address"
          value={data.coParentAddress}
          onChange={(e) => updateData({ coParentAddress: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400 mb-4"
        />
        <div className="grid grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="City"
            value={data.coParentCity}
            onChange={(e) => updateData({ coParentCity: e.target.value })}
            className="col-span-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="State"
            value={data.coParentState}
            onChange={(e) => updateData({ coParentState: e.target.value })}
            className="col-span-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="ZIP"
            value={data.coParentZip}
            onChange={(e) => updateData({ coParentZip: e.target.value })}
            className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Co-Parent Phone */}
      {!isProposed && (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Co-Parent Phone Number</label>
        <input
          type="tel"
          placeholder="(555) 123-4567"
          value={data.coParentPhone}
          onChange={(e) => updateData({ coParentPhone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
        />
      </div>
      )}

      {/* Co-Parent Email */}
      {!isProposed && (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Co-Parent Email</label>
        <input
          type="email"
          placeholder="co-parent@email.com"
          value={data.coParentEmail}
          onChange={(e) => updateData({ coParentEmail: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
        />
      </div>
      )}

      {/* Invite Section */}
      {!isProposed && (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Since you and your co-parent will take the course together, they will need to register as well. You can also invite them later from the home screen.
            </p>
            {data.inviteSent ? (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                <span>Invite sent!</span>
              </div>
            ) : (
              <button
                onClick={handleSendInvite}
                disabled={!data.coParentEmail.trim()}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <EnvelopeIcon className="w-4 h-4" />
                <span>Send Invite Email Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Footer */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
