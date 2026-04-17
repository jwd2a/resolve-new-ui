'use client';

import { useState, useEffect } from 'react';

interface CourseCompletionOverlayProps {
  isOpen: boolean;
  coParentFinished: boolean;
  coParentName: string;
  onViewPlan: () => void;
}

export default function CourseCompletionOverlay({
  isOpen,
  coParentFinished,
  coParentName,
  onViewPlan,
}: CourseCompletionOverlayProps) {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Initialize waiting state when overlay opens
  useEffect(() => {
    if (isOpen) {
      setIsWaiting(!coParentFinished);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Transition out of waiting when co-parent finishes
  useEffect(() => {
    if (coParentFinished && isWaiting) {
      setIsWaiting(false);
    }
  }, [coParentFinished, isWaiting]);

  if (!isOpen) return null;

  return (
    <>
      {/* Blurred scrim - sits below the video controls (z-50) */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Modal card - centered, also below video controls */}
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center p-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {isWaiting ? (
            <>
              <div className="w-14 h-14 rounded-full border-[3px] border-primary/20 flex items-center justify-center mx-auto mb-5 animate-pulse">
                <div className="w-10 h-10 rounded-full border-[3px] border-primary/40 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Almost there!</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Waiting for {coParentName} to click Finish...
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-5">
                <span role="img" aria-label="wave">&#128075;</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Say goodbye!</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                This will end your video session and take you to your parenting plan. Say bye!
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={onViewPlan}
                  className="bg-primary text-white font-semibold text-[15px] px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
                >
                  View Your Parenting Plan &#10132;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
