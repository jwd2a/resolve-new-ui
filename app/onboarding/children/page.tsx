'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding, ChildInfo } from '../OnboardingContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ChildrenPage() {
  const router = useRouter();
  const { data, updateData, markStepComplete } = useOnboarding();

  const canContinue = data.children.length > 0 && data.children.every(c => c.fullName.trim() !== '');

  const handleContinue = () => {
    markStepComplete(3);
    router.push('/onboarding/jurisdiction');
  };

  const handleBack = () => {
    router.push('/onboarding/co-parent');
  };

  const updateChild = (id: string, updates: Partial<ChildInfo>) => {
    const updated = data.children.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    updateData({ children: updated });
  };

  const addChild = () => {
    const newChild: ChildInfo = {
      id: String(Date.now()),
      fullName: '',
      dateOfBirth: '',
      gender: '',
    };
    updateData({ children: [...data.children, newChild] });
  };

  const removeChild = (id: string) => {
    if (data.children.length <= 1) return;
    updateData({ children: data.children.filter(c => c.id !== id) });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Children Information</h1>
      <p className="text-gray-500 mb-8">Add information about each child who will be included in the parenting plan.</p>

      {/* Children List */}
      <div className="space-y-6 mb-6">
        {data.children.map((child, index) => (
          <div key={child.id} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Child {index + 1}</h3>
              {data.children.length > 1 && (
                <button
                  onClick={() => removeChild(child.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Child's Full Name"
                  value={child.fullName}
                  onChange={(e) => updateChild(child.id, { fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={child.dateOfBirth}
                  onChange={(e) => updateChild(child.id, { dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={child.gender}
                onChange={(e) => updateChild(child.id, { gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Another Child */}
      <button
        onClick={addChild}
        className="inline-flex items-center space-x-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-primary hover:text-primary transition-colors mb-8 w-full justify-center"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="font-medium">Add Another Child</span>
      </button>

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
