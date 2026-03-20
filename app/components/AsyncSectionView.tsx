'use client';

import { useState } from 'react';
import { Section, EditEntry } from '@/app/types/section';
import AsyncDraftBanner from './AsyncDraftBanner';
import InlineDiffField from './InlineDiffField';

interface AsyncSectionViewProps {
  section: Section;
  coParentName: string;
  isProposed?: boolean;
  onSave?: (data: Record<string, string>) => void;
  onSubmitForReview?: (data: Record<string, string>) => void;
  onComplete?: (data: Record<string, string>) => void;
  onAccept?: () => void;
  onSubmitChanges?: (data: Record<string, string>, edits: EditEntry[]) => void;
  onStartSession?: () => void;
  onClose?: () => void;
}

export default function AsyncSectionView({
  section,
  coParentName,
  isProposed,
  onSave,
  onSubmitForReview,
  onComplete,
  onAccept,
  onSubmitChanges,
  onStartSession,
  onClose,
}: AsyncSectionViewProps) {
  const draftData = (section.draftData ?? {}) as Record<string, string>;
  const [formData, setFormData] = useState<Record<string, string>>(draftData);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  const editHistoryMap = new Map(
    (section.editHistory ?? []).map((e) => [e.fieldId, e])
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setEditedFields((prev) => new Set(prev).add(fieldId));
  };

  // Determine the async mode — this view should only be opened when it's the user's turn
  const bannerState = (() => {
    if (isProposed) return 'proposed' as const;
    if (section.state === 'in-review') return 'reviewing' as const;
    if (section.state === 'contested') return 'contested' as const;
    return 'drafting' as const;
  })();

  const isReviewing = section.state === 'in-review';
  const isContested = section.state === 'contested';
  const isDrafting = section.state === 'draft' || section.state === 'not-started' || section.state === 'completed-draft';

  const formFields = Object.keys(formData);

  // If formFields is empty (e.g., not-started section with no draftData),
  // the caller should provide draftData with empty string values as a field schema.

  const handleAccept = () => {
    onAccept?.();
  };

  const handleSubmitChanges = () => {
    const edits: EditEntry[] = Array.from(editedFields).map((fieldId) => ({
      fieldId,
      previousValue: draftData[fieldId],
      newValue: formData[fieldId],
      editedBy: 'you' as const,
      editedAt: new Date(),
    }));
    onSubmitChanges?.(formData, edits);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{section.description}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
            Close
          </button>
        )}
      </div>

      {/* Async context banner */}
      <div className="mb-6">
        <AsyncDraftBanner
          coParentName={coParentName}
          state={bannerState}
          editCount={section.editHistory?.length}
          onStartSession={isProposed ? undefined : onStartSession}
        />
      </div>

      {/* Form fields */}
      <div className="space-y-1">
        {formFields.map((fieldId) => {
          const editEntry = editHistoryMap.get(fieldId);
          const isChanged = editEntry !== undefined;

          return (
            <InlineDiffField
              key={fieldId}
              label={fieldId.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              currentValue={formData[fieldId]}
              previousValue={isChanged ? editEntry.previousValue : undefined}
              editedBy={isChanged ? coParentName : undefined}
              isEditable={isDrafting || isReviewing || isContested}
              onChange={(value) => handleFieldChange(fieldId, value)}
              dimmed={isContested && !isChanged}
            />
          );
        })}
      </div>

      {/* Action bar */}
      <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
        {isDrafting && (
          <>
            <button
              onClick={() => onSave?.(formData)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save & Continue Later
            </button>
            {isProposed ? (
              <button
                onClick={() => onComplete?.(formData)}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                {section.state === 'completed-draft' ? 'Update' : 'Complete'}
              </button>
            ) : (
              <button
                onClick={() => onSubmitForReview?.(formData)}
                className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Submit for Review
              </button>
            )}
          </>
        )}

        {isReviewing && (
          <>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-white bg-success rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept All
            </button>
            {editedFields.size > 0 && (
              <button
                onClick={handleSubmitChanges}
                className="px-5 py-2 text-sm font-semibold text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors"
              >
                Submit Changes
              </button>
            )}
          </>
        )}

        {isContested && !editedFields.size && (
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold text-white bg-success rounded-lg hover:bg-green-700 transition-colors"
          >
            Accept Changes
          </button>
        )}

        {/* Once the user edits fields in contested mode, show submit button */}
        {isContested && editedFields.size > 0 && (
          <>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Accept Changes Instead
            </button>
            <button
              onClick={handleSubmitChanges}
              className="px-5 py-2 text-sm font-semibold text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Submit My Edits
            </button>
          </>
        )}
      </div>
    </div>
  );
}
