'use client';

import { LightBulbIcon } from '@heroicons/react/24/outline';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

interface LessonVideoContentProps {
  title: string;
  videoUrl?: string;
  keyPoints: string[];
  onToggleZoomMode?: () => void;
  isZoomMode?: boolean;
}

export default function LessonVideoContent({ title, videoUrl, keyPoints, onToggleZoomMode, isZoomMode = false }: LessonVideoContentProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>

      {/* Video Player */}
      <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative group">
        {videoUrl ? (
          <video
            controls
            className="w-full h-full"
            poster="/video-placeholder.jpg"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
                  Timesharing
                </h3>
                <h2 className="text-2xl font-bold text-white">
                  Transportation<br />and Exchanges
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Zoom Mode Toggle Button */}
        {onToggleZoomMode && (
          <button
            onClick={onToggleZoomMode}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-lg px-3 py-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
            title={isZoomMode ? 'Exit Zoom Mode' : 'Enter Zoom Mode'}
          >
            {isZoomMode ? (
              <>
                <ArrowsPointingInIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Exit Zoom</span>
              </>
            ) : (
              <>
                <ArrowsPointingOutIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Zoom Mode</span>
              </>
            )}
          </button>
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
