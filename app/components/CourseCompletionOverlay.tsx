'use client';

import { useState, useEffect } from 'react';

type OverlayState = 'waiting' | 'celebrating' | 'goodbye';

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
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Initialize state when overlay opens
  useEffect(() => {
    if (isOpen) {
      setState(coParentFinished ? 'celebrating' : 'waiting');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Transition to celebrating when co-parent finishes
  useEffect(() => {
    if (coParentFinished && state === 'waiting') {
      setState('celebrating');
    }
  }, [coParentFinished, state]);

  // Auto-navigate after goodbye state
  useEffect(() => {
    if (state === 'goodbye') {
      const timer = setTimeout(() => onViewPlan(), 3000);
      return () => clearTimeout(timer);
    }
  }, [state, onViewPlan]);

  if (!isOpen) return null;

  const handleLeave = () => {
    setState('goodbye');
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-[400ms] bg-white ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
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
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
      `}</style>

      {/* Waiting State */}
      {state === 'waiting' && (
        <div className="flex flex-col items-center justify-center text-center px-6">
          {/* Pulsing clock icon */}
          <div className="w-16 h-16 rounded-full border-[3px] border-primary/20 flex items-center justify-center mb-6 animate-pulse">
            <div className="w-12 h-12 rounded-full border-[3px] border-primary/40 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round">
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Almost there!</h2>
          <p className="text-gray-500 text-[15px] mb-8 max-w-xs leading-relaxed">
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
            <div className="w-[140px] h-[100px] bg-gray-900 rounded-xl border-[3px] border-gray-300 overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-600/40 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">CP</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-[13px]">You can still talk while you wait</p>
        </div>
      )}

      {/* Celebrating + Next Steps (combined) */}
      {state === 'celebrating' && (
        <div
          className="flex flex-col items-center text-center px-6 w-full overflow-y-auto max-h-full py-10"
          style={{ animation: 'scale-in 400ms ease-out forwards' }}
        >
          {/* Confetti dots */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[
              { left: '10%', delay: '0s', duration: '3s', color: '#5b21b6', size: 8 },
              { left: '20%', delay: '0.2s', duration: '3.2s', color: '#7c3aed', size: 6 },
              { left: '30%', delay: '0.5s', duration: '2.8s', color: '#a78bfa', size: 10 },
              { left: '45%', delay: '0.1s', duration: '3.1s', color: '#10b981', size: 7 },
              { left: '55%', delay: '0.4s', duration: '3s', color: '#5b21b6', size: 8 },
              { left: '65%', delay: '0.3s', duration: '2.9s', color: '#7c3aed', size: 6 },
              { left: '75%', delay: '0.6s', duration: '3.3s', color: '#a78bfa', size: 9 },
              { left: '85%', delay: '0.2s', duration: '3s', color: '#10b981', size: 7 },
              { left: '15%', delay: '0.7s', duration: '3.1s', color: '#5b21b6', size: 5 },
              { left: '50%', delay: '0.3s', duration: '2.7s', color: '#7c3aed', size: 8 },
              { left: '40%', delay: '0.8s', duration: '3.4s', color: '#a78bfa', size: 6 },
              { left: '90%', delay: '0.1s', duration: '3.2s', color: '#10b981', size: 7 },
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

          {/* Large video feeds - the celebration is about THEM */}
          <div
            className="flex gap-6 mb-6"
            style={{ animation: 'fade-in-up 500ms 300ms ease-out forwards', opacity: 0 }}
          >
            <div className="w-[240px] h-[170px] bg-gray-900 rounded-2xl border-[3px] border-primary/20 overflow-hidden flex items-center justify-center shadow-lg">
              <div className="w-14 h-14 rounded-full bg-primary/40 flex items-center justify-center">
                <span className="text-white text-base font-semibold">You</span>
              </div>
            </div>
            <div className="w-[240px] h-[170px] bg-gray-900 rounded-2xl border-[3px] border-primary/20 overflow-hidden flex items-center justify-center shadow-lg">
              <div className="w-14 h-14 rounded-full bg-gray-600/40 flex items-center justify-center">
                <span className="text-white text-base font-semibold">CP</span>
              </div>
            </div>
          </div>

          {/* Checkmark + heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <h1 className="text-2xl font-bold text-foreground">Your Parenting Plan is Complete</h1>
          </div>
          <p className="text-gray-500 text-[15px] max-w-md leading-relaxed mb-8">
            You did it — together. Your cooperation made this possible, and your children will benefit from the effort you&apos;ve both put in.
          </p>

          {/* Next steps action cards */}
          <div
            className="w-full max-w-[480px] flex flex-col gap-3 mb-8"
            style={{ animation: 'fade-in-up 500ms 600ms ease-out forwards', opacity: 0 }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-left mb-1">What&apos;s next</p>

            {/* Download PDF */}
            <button
              onClick={onDownloadPdf}
              className="bg-gray-50 rounded-xl p-4 flex items-center gap-3.5 border border-border hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
                </svg>
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold">Download PDF</div>
                <div className="text-gray-500 text-xs">Save a copy for your records</div>
              </div>
            </button>

            {/* Share with Attorney */}
            <button
              onClick={onShareWithAttorney}
              className="bg-gray-50 rounded-xl p-4 flex items-center gap-3.5 border border-border hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold">Share with Your Attorney</div>
                <div className="text-gray-500 text-xs">Have a professional review your plan</div>
              </div>
            </button>

            {/* Set Review Reminder */}
            <button
              onClick={onSetReminder}
              className="bg-gray-50 rounded-xl p-4 flex items-center gap-3.5 border border-border hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold">Set a Review Reminder</div>
                <div className="text-gray-500 text-xs">Revisit your plan in 6 months</div>
              </div>
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleLeave}
            className="bg-primary text-white font-semibold text-[15px] px-8 py-3.5 rounded-xl shadow-md hover:bg-primary-dark transition-colors"
          >
            View Your Parenting Plan &#10132;
          </button>
        </div>
      )}

      {/* Goodbye State */}
      {state === 'goodbye' && (
        <div
          className="flex flex-col items-center justify-center text-center px-6"
          style={{ animation: 'scale-in 300ms ease-out forwards' }}
        >
          {/* Waving hand */}
          <div
            className="text-6xl mb-6"
            style={{ animation: 'wave 0.8s ease-in-out 2', transformOrigin: '70% 70%' }}
          >
            <span role="img" aria-label="wave">&#128075;</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Say goodbye!</h2>
          <p className="text-gray-500 text-[15px] max-w-sm leading-relaxed mb-8">
            This will end your video call. Take a moment to say bye to your co-parent!
          </p>

          {/* Video feeds so they can see each other */}
          <div className="flex gap-5 mb-8">
            <div className="w-[180px] h-[130px] bg-gray-900 rounded-2xl border-[3px] border-primary/20 overflow-hidden flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-primary/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">You</span>
              </div>
            </div>
            <div className="w-[180px] h-[130px] bg-gray-900 rounded-2xl border-[3px] border-primary/20 overflow-hidden flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gray-600/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">CP</span>
              </div>
            </div>
          </div>

          {/* Countdown hint */}
          <p className="text-gray-400 text-sm mb-4">Redirecting to your parenting plan shortly...</p>

          <button
            onClick={onViewPlan}
            className="text-primary font-medium text-sm hover:underline transition-colors"
          >
            Go now
          </button>
        </div>
      )}
    </div>
  );
}
