'use client';

import { useState } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import CourseCompletionOverlay from '@/app/components/CourseCompletionOverlay';
import { useOnboarding } from '@/app/onboarding/OnboardingContext';

export default function CourseConclusionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useOnboarding();
  const [iFinished, setIFinished] = useState(false);
  const [coParentFinished, setCoParentFinished] = useState(false);

  const isRemoteSessionActive = searchParams.get('remote') === 'true';
  const isFlorida = data.floridaTrack;

  const keyPoints = [
    'Implement your plan with patience and flexibility.',
    'Keep communication open and constructive.',
    'Take care of yourselves so you can parent effectively.',
    'Review your plan periodically as life changes and your plan should evolve accordingly.',
  ];

  const handleFinish = () => {
    if (isRemoteSessionActive) {
      setIFinished(true);
      // Simulate co-parent finishing after 3 seconds for demo purposes
      setTimeout(() => setCoParentFinished(true), 3000);
    } else if (isFlorida) {
      // Florida-track requires the final exam before the parenting plan is final.
      router.push('/exam');
    } else {
      router.push('/parenting-plan');
    }
  };

  const handleViewPlan = () => {
    router.push('/parenting-plan');
  };

  return (
    <>
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Course Conclusion and Next Steps</h1>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Video and Key Points */}
        <div className="space-y-6">
          {/* Video/Title Card */}
          <div className="bg-[#1e1b4b] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center space-y-4 px-8">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white/70 uppercase tracking-[0.2em]">Final Considerations</p>
                <div className="w-16 h-0.5 bg-primary-light mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide leading-snug">
                Course Conclusion<br />and Next Steps
              </h2>
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <LightBulbIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Things to keep in mind</h3>
                <ul className="space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Conclusion Content */}
        <div>
          <div className="bg-white rounded-xl border border-border p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Course Conclusion and Next Steps</h2>

            <div className="space-y-4 text-[15px] text-gray-700 leading-relaxed">
              <p>
                Congratulations on completing your comprehensive parenting agreement! This journey
                wasn&apos;t easy, but you&apos;ve created a roadmap for successful co-parenting.
              </p>

              <p>
                As you move forward, remember to implement your plan with patience and flexibility,
                maintain open communication with your co-parent, and present a united front to your
                children. Take care of yourself throughout this process.
              </p>

              <p>
                Set reminders to review your plan regularly as life changes and your plan should
                evolve accordingly. Every time you follow this plan and cooperate with your co-parent,
                you&apos;re showing your children that they&apos;re loved, valued, and supported.
              </p>
            </div>

            <button
              onClick={handleFinish}
              disabled={iFinished}
              className="mt-8 bg-primary text-white font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Finish</span>
              <CheckBadgeIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Overlay */}
      <CourseCompletionOverlay
        isOpen={iFinished}
        coParentFinished={coParentFinished}
        coParentName="your co-parent"
        onViewPlan={handleViewPlan}
      />
    </>
  );
}
