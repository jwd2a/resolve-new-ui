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
      {/* Animations */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

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
        <div
          className="flex flex-col items-center justify-center text-center px-6"
          style={{ animation: 'scale-in 400ms ease-out forwards' }}
        >
          {/* Confetti dots */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[
              { left: '10%', delay: '0s', duration: '3s', color: '#fbbf24', size: 8 },
              { left: '20%', delay: '0.2s', duration: '3.2s', color: '#34d399', size: 6 },
              { left: '30%', delay: '0.5s', duration: '2.8s', color: '#f472b6', size: 10 },
              { left: '45%', delay: '0.1s', duration: '3.1s', color: '#60a5fa', size: 7 },
              { left: '55%', delay: '0.4s', duration: '3s', color: '#a78bfa', size: 8 },
              { left: '65%', delay: '0.3s', duration: '2.9s', color: '#fbbf24', size: 6 },
              { left: '75%', delay: '0.6s', duration: '3.3s', color: '#34d399', size: 9 },
              { left: '85%', delay: '0.2s', duration: '3s', color: '#f472b6', size: 7 },
              { left: '15%', delay: '0.7s', duration: '3.1s', color: '#60a5fa', size: 5 },
              { left: '50%', delay: '0.3s', duration: '2.7s', color: '#a78bfa', size: 8 },
              { left: '40%', delay: '0.8s', duration: '3.4s', color: '#fbbf24', size: 6 },
              { left: '90%', delay: '0.1s', duration: '3.2s', color: '#34d399', size: 7 },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: dot.left,
                  top: '-10px',
                  width: dot.size,
                  height: dot.size,
                  backgroundColor: dot.color,
                  animation: `confetti-fall ${dot.duration} ${dot.delay} ease-in-out forwards`,
                }}
              />
            ))}
          </div>

          {/* Checkmark icon */}
          <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mb-6 backdrop-blur-sm">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M20 6L9 17l-5-5"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: 24,
                  animation: 'checkmark-draw 600ms 400ms ease-out forwards',
                }}
              />
            </svg>
          </div>

          {/* Text */}
          <h1 className="text-[32px] font-bold text-white mb-3">Your Parenting Plan is Complete</h1>
          <p className="text-white/85 text-[17px] max-w-[500px] leading-relaxed mb-9">
            You&apos;ve both worked hard to create a thoughtful plan for your children. This is a meaningful step forward.
          </p>

          {/* Elevated video feeds */}
          <div
            className="flex gap-5 mb-9"
            style={{ animation: 'fade-in-up 500ms 300ms ease-out forwards', opacity: 0 }}
          >
            <div className="w-[180px] h-[130px] bg-gray-900 rounded-2xl border-[3px] border-white/30 overflow-hidden flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="w-12 h-12 rounded-full bg-primary/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">You</span>
              </div>
            </div>
            <div className="w-[180px] h-[130px] bg-gray-900 rounded-2xl border-[3px] border-white/30 overflow-hidden flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="w-12 h-12 rounded-full bg-gray-600/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">CP</span>
              </div>
            </div>
          </div>

          {/* Continue button - fades in after 2 seconds */}
          <button
            onClick={() => setState('next-steps')}
            className={`bg-white text-primary font-semibold text-base px-9 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition-all duration-500 ${
              showContinueButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Continue &#10132;
          </button>
        </div>
      )}
      {state === 'next-steps' && (
        <div className="text-white text-center">Next steps state — coming next</div>
      )}
    </div>
  );
}
