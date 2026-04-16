'use client';

import { useState, useEffect } from 'react';

type OverlayState = 'waiting' | 'celebrating' | 'next-steps';

interface CourseCompletionOverlayProps {
  isOpen: boolean;
  coParentFinished: boolean;
  coParentName: string;
  onViewPlan: () => void;
  onDownloadPdf?: () => void;
  onShareWithAttorney?: () => void;
  onSetReminder?: () => void;
}

export default function CourseCompletionOverlay({
  isOpen,
  coParentFinished,
  coParentName,
  onViewPlan,
  onDownloadPdf,
  onShareWithAttorney,
  onSetReminder,
}: CourseCompletionOverlayProps) {
  const [state, setState] = useState<OverlayState>('waiting');
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Skip waiting if co-parent already finished, or transition when they do
  useEffect(() => {
    if (coParentFinished && state === 'waiting') {
      setState('celebrating');
    }
  }, [coParentFinished, state]);

  // Show continue button after 2 seconds in celebrating state
  useEffect(() => {
    if (state === 'celebrating') {
      const timer = setTimeout(() => setShowContinueButton(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowContinueButton(false);
  }, [state]);

  // Initialize state when overlay opens
  useEffect(() => {
    if (isOpen) {
      setState(coParentFinished ? 'celebrating' : 'waiting');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-[400ms] ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 40%, #7c3aed 100%)',
      }}
    >
      {/* Waiting State */}
      {state === 'waiting' && (
        <div className="flex flex-col items-center justify-center text-center px-6">
          {/* Pulsing clock icon */}
          <div className="w-16 h-16 rounded-full border-[3px] border-white/30 flex items-center justify-center mb-6 animate-pulse">
            <div className="w-12 h-12 rounded-full border-[3px] border-white/60 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
          <p className="text-white/80 text-[15px] mb-8 max-w-xs leading-relaxed">
            Waiting for {coParentName} to click Finish...
          </p>

          {/* Video feeds centered */}
          <div className="flex gap-4 mb-5">
            {/* Your feed - green border (you're ready) */}
            <div className="w-[140px] h-[100px] bg-gray-900 rounded-xl border-[3px] border-success overflow-hidden flex items-center justify-center relative">
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-success rounded-full" />
              <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">You</span>
              </div>
            </div>
            {/* Co-parent feed - neutral border */}
            <div className="w-[140px] h-[100px] bg-gray-900 rounded-xl border-[3px] border-white/20 overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-600/40 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">CP</span>
              </div>
            </div>
          </div>

          <p className="text-white/50 text-[13px]">You can still talk while you wait</p>
        </div>
      )}

      {/* Celebrating and Next Steps states rendered in subsequent tasks */}
      {state === 'celebrating' && (
        <div className="text-white text-center">Celebration state — coming next</div>
      )}
      {state === 'next-steps' && (
        <div className="text-white text-center">Next steps state — coming next</div>
      )}
    </div>
  );
}
