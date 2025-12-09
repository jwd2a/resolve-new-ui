'use client';

import { ExclamationTriangleIcon, CheckCircleIcon, VideoCameraIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Section } from '@/app/types/section';
import { useState } from 'react';

interface WorkTogetherProps {
  needsResolution: Section[];
  readyToSign: Section[];
  coParentName: string;
  coParentOnline: boolean;
  onStartLiveSession: () => void;
  onOpenResolution: (section: Section) => void;
  onOpenQuickSign: () => void;
}

export default function WorkTogether({
  needsResolution,
  readyToSign,
  coParentName,
  coParentOnline,
  onStartLiveSession,
  onOpenResolution,
  onOpenQuickSign,
}: WorkTogetherProps) {
  const [expandedResolution, setExpandedResolution] = useState<string | null>(null);

  if (needsResolution.length === 0 && readyToSign.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Work Together</h2>

      {/* Needs Resolution Section */}
      {needsResolution.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {needsResolution.length} {needsResolution.length === 1 ? 'Section Needs' : 'Sections Need'} Discussion
              </h3>
              <p className="text-sm text-gray-600">
                You and {coParentName} have different answers. Resolve these together to continue.
              </p>
            </div>
          </div>

          {/* Live Session Suggestion */}
          {coParentOnline && (
            <div className="bg-white/50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {coParentName} is online - perfect time to resolve these together!
                  </span>
                </div>
                <button
                  onClick={onStartLiveSession}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                  <span>Start Live Session</span>
                </button>
              </div>
            </div>
          )}

          {/* Resolution Items */}
          <div className="space-y-2">
            {needsResolution.map((section) => (
              <div
                key={section.id}
                className="bg-white border border-amber-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedResolution(expandedResolution === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{section.title}</h4>
                    {section.stateData?.conflicts && (
                      <p className="text-sm text-amber-700">
                        {section.stateData.conflicts.length} {section.stateData.conflicts.length === 1 ? 'difference' : 'differences'} to discuss
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenResolution(section);
                      }}
                      className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-1.5"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </button>

                {/* Expanded conflict details */}
                {expandedResolution === section.id && section.stateData?.conflicts && (
                  <div className="border-t border-amber-200 p-4 bg-amber-50/50 space-y-3">
                    {section.stateData.conflicts.map((conflict, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium text-gray-700 mb-1">{conflict.field}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Your answer:</div>
                            <div className="text-gray-900">{String(conflict.yourValue)}</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">{coParentName}'s answer:</div>
                            <div className="text-gray-900">{String(conflict.theirValue)}</div>
                          </div>
                        </div>
                        {conflict.aiSuggestion && (
                          <div className="mt-2 bg-primary/5 border border-primary/20 rounded p-2 text-xs text-gray-700">
                            <span className="font-medium text-primary">AI Suggestion:</span> {conflict.aiSuggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready to Sign Section */}
      {readyToSign.length > 0 && (
        <div className="bg-gradient-to-br from-success/5 to-success/10 border-2 border-success/30 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {readyToSign.length} {readyToSign.length === 1 ? 'Section Ready' : 'Sections Ready'} to Sign
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  You've both completed these sections. Review and sign to make them official.
                </p>

                {/* List of sections */}
                <ul className="space-y-1 mb-4">
                  {readyToSign.slice(0, 3).map((section) => (
                    <li key={section.id} className="text-sm text-gray-700 flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{section.title}</span>
                    </li>
                  ))}
                  {readyToSign.length > 3 && (
                    <li className="text-sm text-gray-500">
                      + {readyToSign.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <button
              onClick={onOpenQuickSign}
              className="px-6 py-3 bg-success text-white font-semibold rounded-xl hover:bg-success/90 transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <span>Quick Sign →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
