'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Section, SectionCategory, getCategoryCompletion } from '../types/section';
import SectionStatusBadge from './SectionStatusBadge';

interface ParentingPlanProgressProps {
  sections: Section[];
  onSectionClick?: (section: Section) => void;
  previewMode?: boolean;
}

const categoryLabels: Record<SectionCategory, string> = {
  'timesharing': 'Timesharing Schedule',
  'decision-making': 'Decision-Making & Responsibilities',
  'communication': 'Communication & Information',
  'other': 'Final Considerations',
};

export default function ParentingPlanProgress({ sections, onSectionClick, previewMode = false }: ParentingPlanProgressProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<SectionCategory>>(
    new Set(['timesharing', 'decision-making', 'communication', 'other'])
  );

  const toggleCategory = (category: SectionCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categories: SectionCategory[] = ['timesharing', 'decision-making', 'communication', 'other'];

  // Calculate overall completion
  const totalSections = sections.length;
  const completedSections = sections.filter(s => s.state === 'completed' || s.state === 'signed').length;

  const handleSectionClick = (section: Section) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${previewMode ? 'relative' : ''}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Your Parenting Plan</h2>
            {previewMode && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                <EyeIcon className="w-3.5 h-3.5" />
                Preview
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {totalSections} sections
          </div>
        </div>
        {previewMode ? (
          <p className="text-sm text-gray-500">Complete the required steps to start working on your plan</p>
        ) : (
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(completedSections / totalSections) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Category Sections */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categorySections = sections.filter(s => s.category === category);
          const completion = getCategoryCompletion(sections, category);
          const isExpanded = expandedCategories.has(category);

          if (categorySections.length === 0) return null;

          return (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {isExpanded ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-900">{categoryLabels[category]}</span>
                </div>
                {!previewMode && (
                  <div className="text-sm text-gray-600">
                    {completion.completed} of {completion.total}
                  </div>
                )}
              </button>

              {/* Category Sections */}
              {isExpanded && (
                <div className="divide-y divide-gray-200">
                  {categorySections.map((section) => (
                    previewMode ? (
                      <div
                        key={section.id}
                        className="px-4 py-3 flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-500">
                            {section.title}
                          </div>
                          {section.estimatedTime && (
                            <div className="flex items-center space-x-1 text-xs text-gray-400 mt-0.5">
                              <ClockIcon className="w-3 h-3" />
                              <span>{section.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section)}
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <SectionStatusBadge status={section.state} size="sm" />
                          <div className="text-left flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                              {section.title}
                            </div>
                            {section.state === 'not-started' && section.estimatedTime && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                                <ClockIcon className="w-3 h-3" />
                                <span>{section.estimatedTime}</span>
                              </div>
                            )}
                            {section.state === 'completed' && (
                              <div className="text-xs text-success mt-0.5">Ready to sign</div>
                            )}
                            {section.state === 'signed' && (
                              <div className="text-xs text-success mt-0.5">Signed</div>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalSections === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No sections available yet.</p>
        </div>
      )}

      {/* Completion State */}
      {completedSections === totalSections && totalSections > 0 && (
        <div className="mt-6 p-4 bg-success/10 border-2 border-success rounded-lg text-center">
          <p className="text-success font-semibold">
            🎉 All sections complete! Ready to sign your parenting plan.
          </p>
        </div>
      )}
    </div>
  );
}
