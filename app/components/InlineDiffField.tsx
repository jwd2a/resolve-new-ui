'use client';

interface InlineDiffFieldProps {
  label: string;
  currentValue: string;
  previousValue?: string;
  editedBy?: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
  dimmed?: boolean;
}

export default function InlineDiffField({
  label,
  currentValue,
  previousValue,
  editedBy,
  isEditable = false,
  onChange,
  dimmed = false,
}: InlineDiffFieldProps) {
  const hasChange = previousValue !== undefined && previousValue !== currentValue;

  return (
    <div className={`mb-4 ${dimmed ? 'opacity-50' : ''}`}>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>

      {hasChange ? (
        <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-700 uppercase">
              {editedBy ? `${editedBy} changed this` : 'Edited'}
            </span>
          </div>
          {isEditable ? (
            <textarea
              className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary"
              value={currentValue}
              onChange={(e) => onChange?.(e.target.value)}
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-900">{currentValue}</p>
          )}
          <p className="text-xs text-gray-500 mt-2 italic">Was: {previousValue}</p>
        </div>
      ) : (
        <div className="border border-gray-200 bg-white rounded-lg p-3">
          {isEditable ? (
            <textarea
              className="w-full text-sm text-gray-900 bg-white border-0 p-0 focus:ring-0 resize-none"
              value={currentValue}
              onChange={(e) => onChange?.(e.target.value)}
              rows={2}
            />
          ) : (
            <>
              {currentValue ? (
                <p className="text-sm text-gray-900">{currentValue}</p>
              ) : (
                <p className="text-sm italic text-gray-400">Not yet filled in</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
