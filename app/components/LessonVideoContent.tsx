'use client';

import { useEffect, useRef, useState } from 'react';
import { LightBulbIcon, LockClosedIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface LessonVideoContentProps {
  title: string;
  videoUrl?: string;
  keyPoints: string[];
  /**
   * When true, the player runs in DCFS-compliant locked mode:
   * native controls hidden, no scrubbing, no fast-forward. The user
   * must reach the end before the page-level Next button is enabled.
   */
  lockedPlayback?: boolean;
  /** Fired once when the video reaches its end (locked mode only). */
  onComplete?: () => void;
}

export default function LessonVideoContent({
  title,
  videoUrl,
  keyPoints,
  lockedPlayback = false,
  onComplete,
}: LessonVideoContentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxAllowedTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [hasCompleted, setHasCompleted] = useState(false);

  // Lock mode: prevent forward seeks. Allow rewinds.
  useEffect(() => {
    if (!lockedPlayback) return;
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      if (v.currentTime > maxAllowedTimeRef.current + 0.25) {
        // user attempted to seek forward (or browser glitched) — snap back
        v.currentTime = maxAllowedTimeRef.current;
      } else {
        maxAllowedTimeRef.current = Math.max(maxAllowedTimeRef.current, v.currentTime);
      }
      if (v.duration > 0) setProgress(v.currentTime / v.duration);
    };
    const onSeeking = () => {
      if (v.currentTime > maxAllowedTimeRef.current + 0.25) {
        v.currentTime = maxAllowedTimeRef.current;
      }
    };
    const onEnded = () => {
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete?.();
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('seeking', onSeeking);
    v.addEventListener('ended', onEnded);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('seeking', onSeeking);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [lockedPlayback, hasCompleted, onComplete]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>

      {/* Video Player */}
      <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls={!lockedPlayback}
              controlsList={lockedPlayback ? 'nodownload noplaybackrate' : undefined}
              disablePictureInPicture={lockedPlayback}
              onContextMenu={(e) => lockedPlayback && e.preventDefault()}
              className="w-full h-full"
              poster="/video-placeholder.jpg"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {lockedPlayback && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-900"
                >
                  {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                {/* Progress (read-only — no scrubbing) */}
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden" aria-hidden>
                  <div
                    className="h-full bg-white"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <LockClosedIcon className="w-3.5 h-3.5" />
                  <span>Required</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <PlayIcon className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {lockedPlayback && (
                  <p className="text-white/70 text-xs flex items-center justify-center gap-1">
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    Florida-required: must be watched in full
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
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
  );
}
