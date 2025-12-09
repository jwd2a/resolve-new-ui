'use client';

import { UserIcon, PaperAirplaneIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Section } from '@/app/types/section';
import { useState } from 'react';

interface WaitingOnThemProps {
  sections: Section[];
  coParentName: string;
  coParentOnline: boolean;
  canNudge: boolean;
  onSendNudge: () => void;
}

export default function WaitingOnThem({
  sections,
  coParentName,
  coParentOnline,
  canNudge,
  onSendNudge,
}: WaitingOnThemProps) {
  const [showAll, setShowAll] = useState(false);

  if (sections.length === 0) {
    return null;
  }

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return 'yesterday';
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Find most recent activity
  const mostRecentActivity = sections
    .map(s => s.lastActivity?.timestamp)
    .filter(Boolean)
    .sort((a, b) => b!.getTime() - a!.getTime())[0];

  const displayedSections = showAll ? sections : sections.slice(0, 3);

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-start space-x-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          coParentOnline ? 'bg-success/20' : 'bg-gray-100'
        }`}>
          <UserIcon className={`w-5 h-5 ${coParentOnline ? 'text-success' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Waiting on {coParentName}
          </h3>
          <p className="text-sm text-gray-600">
            {sections.length} {sections.length === 1 ? 'section' : 'sections'} to review
          </p>
          {mostRecentActivity && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 mt-1">
              <ClockIcon className="w-3 h-3" />
              <span>Last active {formatTimeAgo(mostRecentActivity)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Online indicator */}
      {coParentOnline && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-success font-medium">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>{coParentName} is online now</span>
          </div>
        </div>
      )}

      {/* Section list */}
      <div className="space-y-2 mb-4">
        {displayedSections.map((section) => (
          <div
            key={section.id}
            className="p-3 bg-gray-50 rounded-lg"
          >
            <div className="font-medium text-sm text-foreground mb-0.5">{section.title}</div>
            {section.lastActivity && (
              <div className="text-xs text-gray-500">
                You completed {formatTimeAgo(section.lastActivity.timestamp)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more/less */}
      {sections.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary hover:text-primary-dark font-medium mb-4"
        >
          {showAll ? 'Show less' : `Show ${sections.length - 3} more`}
        </button>
      )}

      {/* Nudge button */}
      {canNudge && !coParentOnline && (
        <button
          onClick={onSendNudge}
          className="w-full px-4 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          <span>Send Friendly Reminder</span>
        </button>
      )}

      {!canNudge && !coParentOnline && mostRecentActivity && (
        <p className="text-xs text-gray-500 text-center">
          You can send a reminder if they're inactive for 3+ days
        </p>
      )}
    </div>
  );
}
