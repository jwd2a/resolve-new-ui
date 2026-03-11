'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

interface SectionSigningApprovalProps {
  sectionTitle: string;
  generatedText: string;
  onEditAndRegenerate: () => void;
  onApprove: (initials: string) => void;
  onSkip: () => void;
  parentName?: string;
  coParentName?: string;
  coParentSigned?: boolean;
}

export default function SectionSigningApproval({
  sectionTitle,
  generatedText,
  onEditAndRegenerate,
  onApprove,
  onSkip,
  parentName,
  coParentName,
  coParentSigned,
}: SectionSigningApprovalProps) {
  const [initials, setInitials] = useState('');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">{sectionTitle}</h2>

      {/* Generated Legal Language */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: generatedText }} />
        </div>

        {/* Edit and Regenerate Link */}
        <button
          onClick={onEditAndRegenerate}
          className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium mt-6 transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Edit Answers and regenerate this section</span>
        </button>
      </div>

      {/* Approval Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval</h3>

        {/* Approval section */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            By entering your initials below, you confirm that you have reviewed and approve of this language.
          </p>

          <div className="flex items-center gap-6">
            {/* Your initials */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1">{parentName || 'Your'} Initials</label>
              <input
                type="text"
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 4))}
                className="w-20 h-12 text-center text-lg font-serif border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="___"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            {/* Co-parent status */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1">{coParentName || 'Co-parent'}</label>
              <div className={`w-20 h-12 flex items-center justify-center text-sm rounded-lg border-2 ${
                coParentSigned
                  ? 'border-success bg-green-50 text-success font-medium'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}>
                {coParentSigned ? 'Signed' : 'Pending'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onApprove(initials)}
            disabled={!initials.trim()}
            className="mt-4 w-full py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Initialed & Approved
          </button>
        </div>
      </div>

      {/* Skip Link */}
      <div className="text-center">
        <button
          onClick={onSkip}
          className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
        >
          Skip '{sectionTitle}' and complete later
        </button>
      </div>
    </div>
  );
}
