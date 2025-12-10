'use client';

import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

interface SectionContent {
  id: string;
  title: string;
  agreed: boolean;
}

interface NavigationSection {
  id: string;
  title: string;
  subsections?: { id: string; title: string; current?: boolean }[];
}

interface ParentingPlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionId?: string;
}

const navigationSections: NavigationSection[] = [
  {
    id: 'parental-responsibility',
    title: 'PARENTAL RESPONSIBILITY AND DECISION MAKING',
    subsections: [
      { id: 'family-info', title: 'Family Information and Jurisdiction' },
      { id: 'shared-decision', title: 'Shared Decision-Making' },
      { id: 'resolving-disagreements', title: 'Resolving Disagreements' },
      { id: 'day-to-day', title: 'Day-to-Day Decision-Making' },
      { id: 'extra-curricular', title: 'Extra-curricular Activities' },
      { id: 'sharing-info', title: 'Sharing Information/Records' },
      { id: 'communication', title: 'Communication' },
      { id: 'child-care', title: 'Child Care' },
    ],
  },
  {
    id: 'timesharing',
    title: 'TIMESHARING SCHEDULE',
    subsections: [
      { id: 'scheduling', title: 'Scheduling and Our Calendar' },
      { id: 'weekday-weekend', title: 'Weekday and Weekend Schedule', current: true },
      { id: 'holiday', title: 'Holiday Schedule' },
      { id: 'school-breaks', title: 'School Breaks' },
      { id: 'transportation', title: 'Transportation and Exchange' },
      { id: 'other-travel', title: 'Other Travel Considerations' },
    ],
  },
  {
    id: 'educational',
    title: 'EDUCATIONAL DECISIONS',
    subsections: [
      { id: 'school-choice', title: 'School Choice and Enrollment' },
      { id: 'academic-performance', title: 'Academic Performance and Support' },
      { id: 'parent-teacher', title: 'Parent-Teacher Communication' },
    ],
  },
  {
    id: 'final',
    title: 'FINAL CONSIDERATIONS',
    subsections: [
      { id: 'relocation', title: 'Relocation' },
      { id: 'changes', title: 'Changes or Modifications to the Agreement' },
    ],
  },
];

const contentSections: SectionContent[] = [
  { id: 'weekday-weekend', title: 'Weekday and Weekend Schedule', agreed: false },
  { id: 'holiday', title: 'Holiday Schedule', agreed: false },
  { id: 'school-breaks', title: 'School Breaks', agreed: false },
  { id: 'transportation', title: 'Transportation and Exchange', agreed: false },
  { id: 'other-travel', title: 'Other Travel Considerations', agreed: false },
];

export default function ParentingPlanPreviewModal({
  isOpen,
  onClose,
  currentSectionId = 'weekday-weekend',
}: ParentingPlanPreviewModalProps) {
  const [activeSection, setActiveSection] = useState(currentSectionId);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentContent = contentSections.find(s => s.id === activeSection);
  const currentNavSection = navigationSections
    .flatMap(ns => ns.subsections || [])
    .find(s => s.id === activeSection);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between border-b border-primary-dark">
          <h2 className="text-xl font-bold text-white">Parenting Plan Preview</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Navigation */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-6 space-y-6">
              {navigationSections.map((section) => (
                <div key={section.id}>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
                    {section.title}
                  </h3>
                  {section.subsections && (
                    <ul className="space-y-1">
                      {section.subsections.map((subsection) => {
                        const isActive = subsection.id === activeSection;
                        const isCurrent = subsection.current;

                        return (
                          <li key={subsection.id}>
                            <button
                              onClick={() => setActiveSection(subsection.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                isActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span>{subsection.title}</span>
                              {isCurrent && (
                                <StarIcon className="w-4 h-4 text-amber-500 flex-shrink-0 ml-2" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-8 max-w-3xl">
              {/* Current Section Indicator */}
              {currentNavSection?.current && (
                <div className="flex items-center space-x-2 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-flex">
                  <StarIcon className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700">You are here</span>
                </div>
              )}

              {/* Section Content */}
              <div className="space-y-6">
                {contentSections
                  .filter(section => section.id === activeSection || section.id.startsWith(activeSection))
                  .map((section, index) => (
                    <div key={section.id}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {section.title}
                      </h3>

                      {!section.agreed && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                          <InformationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800">
                            This section has not been agreed upon and is subject to further written
                            agreement or court order.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                {/* Additional sections based on current view */}
                {activeSection === 'weekday-weekend' && (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Holiday Schedule</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          This section has not been agreed upon and is subject to further written
                          agreement or court order.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">School Breaks</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          This section has not been agreed upon and is subject to further written
                          agreement or court order.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Transportation and Exchange
                      </h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          This section has not been agreed upon and is subject to further written
                          agreement or court order.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Other Travel Considerations
                      </h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          This section has not been agreed upon and is subject to further written
                          agreement or court order.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Skip 'Weekday and Weekend Schedule' and complete later →
          </button>
        </div>
      </div>
    </>
  );
}
