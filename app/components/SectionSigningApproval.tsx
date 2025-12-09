'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

interface SectionSigningApprovalProps {
  sectionTitle: string;
  generatedText: string;
  onEditAndRegenerate: () => void;
  onApprove: (parent1Initials: string, parent2Initials: string) => void;
  onSkip: () => void;
  parent1Name?: string;
  parent2Name?: string;
}

export default function SectionSigningApproval({
  sectionTitle,
  generatedText,
  onEditAndRegenerate,
  onApprove,
  onSkip,
  parent1Name = 'Parent 1',
  parent2Name = 'Parent 2',
}: SectionSigningApprovalProps) {
  const [parent1Initials, setParent1Initials] = useState('');
  const [parent2Initials, setParent2Initials] = useState('');

  const handleApprove = () => {
    if (parent1Initials && parent2Initials) {
      onApprove(parent1Initials, parent2Initials);
    }
  };

  const canApprove = parent1Initials.trim() !== '' && parent2Initials.trim() !== '';

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
        <p className="text-sm text-gray-700 mb-6">
          By entering your initials and clicking "Approve & Continue", you confirm that this text
          accurately represents your understanding and agreement.
        </p>

        {/* Initial Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Parent 1 Initials */}
          <div>
            <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 text-center">
              <input
                type="text"
                value={parent1Initials}
                onChange={(e) => setParent1Initials(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="Initials"
                className="w-full text-center text-4xl font-serif italic bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-300"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">{parent1Name} Initials</p>
          </div>

          {/* Parent 2 Initials */}
          <div>
            <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 text-center">
              <input
                type="text"
                value={parent2Initials}
                onChange={(e) => setParent2Initials(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="Initials"
                className="w-full text-center text-4xl font-serif italic bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-300"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">{parent2Name} Initials</p>
          </div>
        </div>

        {/* Approve Button */}
        <button
          onClick={handleApprove}
          disabled={!canApprove}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            canApprove
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Initialed & Approved
        </button>
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
