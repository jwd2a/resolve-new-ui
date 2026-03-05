# Onboarding Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 5-step onboarding flow at `/onboarding/` that collects user info, co-parent info, children, jurisdiction, and target completion date.

**Architecture:** Next.js App Router with a shared layout containing a progress stepper. React Context provides shared state across steps. Each step is a separate route under `/onboarding/`. All form state is client-side (no backend).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Heroicons v2

---

### Task 1: Create Onboarding Context Provider

**Files:**
- Create: `app/onboarding/OnboardingContext.tsx`

**Step 1: Create the context with types and provider**

```tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ChildInfo {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
}

export interface OnboardingData {
  // Step 1: Your Info
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;

  // Step 2: Co-Parent
  coParentFirstName: string;
  coParentLastName: string;
  coParentAddress: string;
  coParentCity: string;
  coParentState: string;
  coParentZip: string;
  coParentPhone: string;
  coParentEmail: string;
  inviteSent: boolean;

  // Step 3: Children
  children: ChildInfo[];

  // Step 4: Jurisdiction
  jurisdictionState: string;

  // Step 5: Target Date
  targetDate: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  completedSteps: Set<number>;
  markStepComplete: (step: number) => void;
}

const defaultData: OnboardingData = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  coParentFirstName: '',
  coParentLastName: '',
  coParentAddress: '',
  coParentCity: '',
  coParentState: '',
  coParentZip: '',
  coParentPhone: '',
  coParentEmail: '',
  inviteSent: false,
  children: [{ id: '1', fullName: '', dateOfBirth: '', gender: '' }],
  jurisdictionState: '',
  targetDate: '',
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, completedSteps, markStepComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
```

**Step 2: Verify the file compiles**

Run: `cd /Users/justin/code/resolve/refreshed-ui && npx next build 2>&1 | head -30`
Expected: No errors related to OnboardingContext.tsx

**Step 3: Commit**

```bash
git add app/onboarding/OnboardingContext.tsx
git commit -m "feat: add onboarding context provider for shared form state"
```

---

### Task 2: Create Onboarding Layout with Stepper

**Files:**
- Create: `app/onboarding/layout.tsx`

**Step 1: Build the layout with stepper component**

The layout wraps all onboarding steps. It renders:
- Full-page purple gradient background
- Resolve logo at top center
- Horizontal stepper with 5 steps
- White content card (max-w-2xl, centered)
- Wraps children in the OnboardingProvider

```tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
import {
  UserIcon,
  UsersIcon,
  HeartIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const steps = [
  { number: 1, label: 'Your Info', path: '/onboarding/your-info', icon: UserIcon },
  { number: 2, label: 'Co-Parent', path: '/onboarding/co-parent', icon: UsersIcon },
  { number: 3, label: 'Children', path: '/onboarding/children', icon: HeartIcon },
  { number: 4, label: 'Jurisdiction', path: '/onboarding/jurisdiction', icon: MapPinIcon },
  { number: 5, label: 'Target Date', path: '/onboarding/target-date', icon: CalendarDaysIcon },
];

function StepperContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { completedSteps } = useOnboarding();

  const currentStepIndex = steps.findIndex(s => s.path === pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex flex-col">
      {/* Logo */}
      <div className="pt-8 pb-4 flex justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-bold text-white">Resolve</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-center px-4 pb-8">
        <div className="flex items-center space-x-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isComplete = completedSteps.has(step.number);
            const isCurrent = index === currentStepIndex;
            const isUpcoming = !isComplete && !isCurrent;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step Circle + Label */}
                <div className="flex flex-col items-center">
                  {isComplete ? (
                    <Link href={step.path}>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <CheckIcon className="w-5 h-5 text-primary" />
                      </div>
                    </Link>
                  ) : isCurrent ? (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 backdrop-blur flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/40" />
                    </div>
                  )}
                  <span className={`mt-2 text-xs font-medium ${
                    isCurrent ? 'text-white' : isComplete ? 'text-white/90' : 'text-white/40'
                  }`}>
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-1 mt-[-20px] ${
                    completedSteps.has(steps[index + 1].number) || (isComplete && index + 1 === currentStepIndex)
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 flex justify-center px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 sm:p-10 self-start">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <StepperContent>{children}</StepperContent>
    </OnboardingProvider>
  );
}
```

**Step 2: Create a placeholder index redirect**

Create `app/onboarding/page.tsx` that redirects to step 1:

```tsx
import { redirect } from 'next/navigation';

export default function OnboardingPage() {
  redirect('/onboarding/your-info');
}
```

**Step 3: Verify build**

Run: `cd /Users/justin/code/resolve/refreshed-ui && npx next build 2>&1 | head -30`
Expected: No errors

**Step 4: Commit**

```bash
git add app/onboarding/layout.tsx app/onboarding/page.tsx
git commit -m "feat: add onboarding layout with progress stepper"
```

---

### Task 3: Build Step 1 — Your Info

**Files:**
- Create: `app/onboarding/your-info/page.tsx`

**Step 1: Build the Your Info form page**

```tsx
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
        <div className="grid grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="City"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            className="col-span-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
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
            className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-900 placeholder-gray-400"
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
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify in browser**

Run: `cd /Users/justin/code/resolve/refreshed-ui && npm run dev`
Navigate to: `http://localhost:3000/onboarding/your-info`
Expected: Form renders with stepper showing step 1 active, purple gradient background, white card

**Step 3: Commit**

```bash
git add app/onboarding/your-info/page.tsx
git commit -m "feat: add onboarding step 1 - your info"
```

---

### Task 4: Build Step 2 — Co-Parent

**Files:**
- Create: `app/onboarding/co-parent/page.tsx`

**Step 1: Build the Co-Parent form page**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '../OnboardingContext';
import { InformationCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function CoParentPage() {
  const router = useRouter();
  const { data, updateData, markStepComplete } = useOnboarding();

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
      <p className="text-gray-500 mb-8">Add your co-parent's details. They'll need to register as well.</p>

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

      {/* Co-Parent Email */}
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

      {/* Invite Section */}
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
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/onboarding/co-parent`
Expected: Co-parent form renders, stepper shows step 2 active

**Step 3: Commit**

```bash
git add app/onboarding/co-parent/page.tsx
git commit -m "feat: add onboarding step 2 - co-parent info"
```

---

### Task 5: Build Step 3 — Children

**Files:**
- Create: `app/onboarding/children/page.tsx`

**Step 1: Build the Children form page**

```tsx
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
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/onboarding/children`
Expected: Children form with add/remove, stepper shows step 3 active

**Step 3: Commit**

```bash
git add app/onboarding/children/page.tsx
git commit -m "feat: add onboarding step 3 - children info"
```

---

### Task 6: Build Step 4 — Jurisdiction

**Files:**
- Create: `app/onboarding/jurisdiction/page.tsx`

**Step 1: Build the Jurisdiction form page**

```tsx
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
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/onboarding/jurisdiction`
Expected: State dropdown, stepper shows step 4 active

**Step 3: Commit**

```bash
git add app/onboarding/jurisdiction/page.tsx
git commit -m "feat: add onboarding step 4 - jurisdiction"
```

---

### Task 7: Build Step 5 — Target Date

**Files:**
- Create: `app/onboarding/target-date/page.tsx`

**Step 1: Build the Target Date page with preset cards + custom date**

```tsx
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        {presets.map(({ days, label }) => {
          const isSelected = selectedPreset === days;
          const targetDate = addDays(days);

          return (
            <button
              key={days}
              onClick={() => handlePresetSelect(days)}
              className={`relative p-5 rounded-xl border-2 text-center transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isSelected && (
                <CheckCircleIcon className="w-5 h-5 text-primary absolute top-3 right-3" />
              )}
              <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                {label}
              </div>
              <div className={`text-sm ${isSelected ? 'text-primary/70' : 'text-gray-500'}`}>
                {formatDate(targetDate)}
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
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/onboarding/target-date`
Expected: Three preset cards (30/60/90 days), custom date option, summary line when selected

**Step 3: Commit**

```bash
git add app/onboarding/target-date/page.tsx
git commit -m "feat: add onboarding step 5 - target date with presets"
```

---

### Task 8: End-to-End Verification & Polish

**Files:**
- Possibly modify: `app/onboarding/layout.tsx` (if stepper adjustments needed)

**Step 1: Test the full flow end-to-end**

Run: `cd /Users/justin/code/resolve/refreshed-ui && npm run dev`
Navigate to: `http://localhost:3000/onboarding`

Walk through all 5 steps:
1. Fill in your info → Continue → stepper updates
2. Fill in co-parent (or skip) → Continue
3. Add children → Continue
4. Select state → Continue
5. Pick a target date → Complete Onboarding → redirects to `/`

Verify:
- Stepper shows completed steps with checkmarks
- Clicking completed steps navigates back
- Back buttons work
- Continue disabled when required fields empty
- Purple gradient background on all steps
- White card is well-sized and centered

**Step 2: Run build to verify no TypeScript errors**

Run: `cd /Users/justin/code/resolve/refreshed-ui && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no errors

**Step 3: Commit any polish fixes**

```bash
git add -A
git commit -m "fix: polish onboarding flow after end-to-end testing"
```

**Step 4: Use `@superpowers:frontend-design` skill to review and polish the visual design**

After verifying functionality works, invoke the frontend-design skill to do a design quality pass on the onboarding flow. Focus on:
- Visual hierarchy and spacing
- Stepper visual treatment
- Target date card design
- Responsive behavior on mobile
- Transitions between steps
