'use client';

import { ArrowRightIcon, ClockIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Section } from '@/app/types/section';
import { useState } from 'react';

interface YourMoveProps {
  prioritySection: Section | null;
  readyToStart: Section[];
  yourTurn: Section[];
  coParentName: string;
}

export default function YourMove({ prioritySection, readyToStart, yourTurn, coParentName }: YourMoveProps) {
  const [showAllReady, setShowAllReady] = useState(false);
  const [showAllYourTurn, setShowAllYourTurn] = useState(false);

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return 'yesterday';
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleContinue = () => {
    if (prioritySection?.actionUrl) {
      window.location.href = prioritySection.actionUrl;
    }
  };

  const handleSectionClick = (section: Section) => {
    if (section.actionUrl) {
      window.location.href = section.actionUrl;
    }
  };

  // Separate priority section from lists
  const otherReadyToStart = readyToStart.filter(s => s.id !== prioritySection?.id);
  const otherYourTurn = yourTurn.filter(s => s.id !== prioritySection?.id);

  const displayedReady = showAllReady ? otherReadyToStart : otherReadyToStart.slice(0, 2);
  const displayedYourTurn = showAllYourTurn ? otherYourTurn : otherYourTurn.slice(0, 2);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Your Move</h2>

      {/* Priority Action Card */}
      {prioritySection && (
        <div className={`rounded-xl p-6 border-2 ${
          prioritySection.state === 'your-turn'
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
            : 'bg-gradient-to-br from-primary/5 to-primary-light/5 border-primary/20'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                {prioritySection.state === 'your-turn' ? (
                  <>
                    <SparklesIcon className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                      Your Turn
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Up Next
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{prioritySection.title}</h3>
              <p className="text-gray-600 mb-3">{prioritySection.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                {prioritySection.estimatedTime && (
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>{prioritySection.estimatedTime}</span>
                  </div>
                )}
                {prioritySection.state === 'your-turn' && prioritySection.lastActivity && (
                  <div className="flex items-center space-x-1.5 text-amber-700 font-medium">
                    <span>→</span>
                    <span>{coParentName} answered {formatTimeAgo(prioritySection.lastActivity.timestamp)}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm flex items-center space-x-2 whitespace-nowrap"
            >
              <span>Continue</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* No priority section - empty state */}
      {!prioritySection && (readyToStart.length > 0 || yourTurn.length > 0) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-600">Select a section below to continue</p>
        </div>
      )}

      {/* Your Turn Sections (Additional) */}
      {otherYourTurn.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              More Your Turn ({otherYourTurn.length})
            </h3>
            {otherYourTurn.length > 2 && (
              <button
                onClick={() => setShowAllYourTurn(!showAllYourTurn)}
                className="text-sm text-primary hover:text-primary-dark flex items-center space-x-1"
              >
                <span>{showAllYourTurn ? 'Show less' : 'Show all'}</span>
                {showAllYourTurn ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedYourTurn.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className="w-full flex items-start justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground">{section.title}</h4>
                    {section.lastActivity && (
                      <span className="text-xs text-amber-600">
                        {formatTimeAgo(section.lastActivity.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {section.estimatedTime && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{section.estimatedTime}</span>
                    </div>
                  )}
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ready to Start Sections */}
      {otherReadyToStart.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Ready to Start ({otherReadyToStart.length})
            </h3>
            {otherReadyToStart.length > 2 && (
              <button
                onClick={() => setShowAllReady(!showAllReady)}
                className="text-sm text-primary hover:text-primary-dark flex items-center space-x-1"
              >
                <span>{showAllReady ? 'Show less' : 'Show all'}</span>
                {showAllReady ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedReady.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className="w-full flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{section.title}</h4>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {section.estimatedTime && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{section.estimatedTime}</span>
                    </div>
                  )}
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completely Empty State */}
      {!prioritySection && readyToStart.length === 0 && yourTurn.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">All caught up!</h3>
          <p className="text-gray-600">You've completed all available sections. Check back for new items or work together on pending resolutions.</p>
        </div>
      )}
    </div>
  );
}
