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
