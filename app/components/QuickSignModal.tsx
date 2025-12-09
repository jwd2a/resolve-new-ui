'use client';

import { XMarkIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Section } from '@/app/types/section';
import { useState } from 'react';

interface QuickSignModalProps {
  sections: Section[];
  coParentName: string;
  onClose: () => void;
  onSign: (sectionIds: string[], signature: string) => void;
}

export default function QuickSignModal({
  sections,
  coParentName,
  onClose,
  onSign,
}: QuickSignModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signature, setSignature] = useState('');
  const [signedSections, setSignedSections] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  if (sections.length === 0) return null;

  const currentSection = sections[currentIndex];
  const progress = ((currentIndex + 1) / sections.length) * 100;

  const toggleExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSignCurrent = () => {
    if (!signature.trim()) return;

    const newSigned = new Set(signedSections);
    newSigned.add(currentSection.id);
    setSignedSections(newSigned);

    if (currentIndex < sections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSignAll = () => {
    if (!signature.trim()) return;
    onSign(sections.map(s => s.id), signature);
  };

  const handleSkip = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const allSigned = signedSections.size === sections.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-success to-success/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Sign Completed Sections</h2>
              <p className="text-white/90 text-sm">{sections.length} sections ready for signature</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100">
          <div
            className="h-full bg-success transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{currentSection.title}</h3>
                <p className="text-sm text-gray-600">
                  Section {currentIndex + 1} of {sections.length}
                </p>
              </div>
              {signedSections.has(currentSection.id) && (
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Signed</span>
                </div>
              )}
            </div>

            {/* Generated Text Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Generated Agreement</h4>
              </div>

              <div className="text-sm text-gray-700 leading-relaxed">
                {currentSection.stateData?.generatedText || (
                  <div className="space-y-2">
                    <p>
                      <strong>{currentSection.title}:</strong> The parents agree to the terms as specified
                      in this section. Both parents have reviewed and agreed to the following provisions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>All decisions will be made jointly and in the best interest of the children</li>
                      <li>Both parents will communicate openly and respectfully</li>
                      <li>Changes to this agreement require mutual consent</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      This is a preview. The final language will be included in your parenting plan.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Your Signature</div>
                  <div className="flex items-center space-x-2">
                    {signedSections.has(currentSection.id) ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-success" />
                        <span className="font-medium text-success">Signed</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">{coParentName}'s Signature</div>
                  <div className="flex items-center space-x-2">
                    {currentSection.stateData?.signatureStatus?.them ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-success" />
                        <span className="font-medium text-success">Signed</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Sections List */}
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold text-foreground mb-3">All Sections ({sections.length})</h4>
            <div className="space-y-2">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`border rounded-lg ${
                    idx === currentIndex
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      setCurrentIndex(idx);
                      toggleExpanded(section.id);
                    }}
                    className="w-full flex items-center justify-between p-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                      <span className="text-sm font-medium text-foreground">{section.title}</span>
                    </div>
                    {signedSections.has(section.id) && (
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          {!allSigned ? (
            <>
              {/* Signature Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type your full name to sign
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-600 hover:text-gray-900"
                  disabled={currentIndex >= sections.length - 1}
                >
                  Skip this section
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSignCurrent}
                    disabled={!signature.trim()}
                    className="px-6 py-2 bg-success text-white font-semibold rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign This Section
                  </button>
                  <button
                    onClick={handleSignAll}
                    disabled={!signature.trim()}
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign All {sections.length} Sections
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">All Sections Signed!</h3>
              <p className="text-gray-600 mb-4">
                Great work! All {sections.length} sections have been signed.
              </p>
              <button
                onClick={() => onSign(Array.from(signedSections), signature)}
                className="px-8 py-3 bg-success text-white font-semibold rounded-xl hover:bg-success/90 transition-colors"
              >
                Complete Signing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
