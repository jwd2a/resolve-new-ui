// Three-state model for session-based parenting plan
export type SectionState =
  | 'not-started'  // Section not yet completed
  | 'completed'    // Section finished in a session
  | 'signed';      // Both parents have signed

// Category types for organizing sections
export type SectionCategory =
  | 'timesharing'
  | 'decision-making'
  | 'communication'
  | 'other';

export interface SignatureStatus {
  you: boolean;
  them: boolean;
}

export interface Section {
  id: string;
  moduleId: string;
  moduleName: string;
  category: SectionCategory;
  title: string;
  description: string;
  state: SectionState;
  estimatedTime?: string;
  formUrl?: string;
  priority?: number;

  // Completion data (from sessions)
  completedAt?: Date;
  completedData?: any;

  // Signature data
  signatureStatus?: SignatureStatus;
}

// Helper function to get sections by category
export function getSectionsByCategory(sections: Section[]): {
  timesharing: Section[];
  decisionMaking: Section[];
  communication: Section[];
  other: Section[];
} {
  return {
    timesharing: sections.filter(s => s.category === 'timesharing'),
    decisionMaking: sections.filter(s => s.category === 'decision-making'),
    communication: sections.filter(s => s.category === 'communication'),
    other: sections.filter(s => s.category === 'other'),
  };
}

// Helper function to calculate category completion
export function getCategoryCompletion(sections: Section[], category: SectionCategory): {
  total: number;
  completed: number;
  signed: number;
} {
  const categorySections = sections.filter(s => s.category === category);
  return {
    total: categorySections.length,
    completed: categorySections.filter(s => s.state === 'completed' || s.state === 'signed').length,
    signed: categorySections.filter(s => s.state === 'signed').length,
  };
}
