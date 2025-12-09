// Six-state model for parenting plan sections
export type SectionState =
  | 'ready-to-start'    // Neither parent has begun
  | 'your-turn'         // Co-parent answered, you haven't
  | 'waiting-on-them'   // You answered, they haven't
  | 'needs-resolution'  // Both answered differently
  | 'ready-to-sign'     // Aligned/resolved, needs signatures
  | 'complete';         // Both signed

export interface Activity {
  by: 'you' | 'them';
  action: string;
  timestamp: Date;
}

export interface Conflict {
  field: string;
  yourValue: any;
  theirValue: any;
  aiSuggestion?: string;
}

export interface SignatureStatus {
  you: boolean;
  them: boolean;
}

export interface StateData {
  yourAnswer?: any;
  theirAnswer?: any;
  conflicts?: Conflict[];
  signatureStatus?: SignatureStatus;
  generatedText?: string;
}

export interface Section {
  id: string;
  moduleId: string;
  moduleName: string;
  title: string;
  description: string;
  state: SectionState;
  estimatedTime?: string;
  actionUrl?: string;
  priority?: number;

  lastActivity?: Activity;
  stateData?: StateData;
}

// Helper functions to categorize sections
export function getSectionsByState(sections: Section[]): {
  readyToStart: Section[];
  yourTurn: Section[];
  waitingOnThem: Section[];
  needsResolution: Section[];
  readyToSign: Section[];
  complete: Section[];
} {
  return {
    readyToStart: sections.filter(s => s.state === 'ready-to-start'),
    yourTurn: sections.filter(s => s.state === 'your-turn'),
    waitingOnThem: sections.filter(s => s.state === 'waiting-on-them'),
    needsResolution: sections.filter(s => s.state === 'needs-resolution'),
    readyToSign: sections.filter(s => s.state === 'ready-to-sign'),
    complete: sections.filter(s => s.state === 'complete'),
  };
}

// Get the priority section (what "Continue" button should target)
export function getPrioritySection(sections: Section[], coParentOnline: boolean): Section | null {
  const categorized = getSectionsByState(sections);

  // 1. If co-parent online and there are conflicts, prioritize those
  if (coParentOnline && categorized.needsResolution.length > 0) {
    return categorized.needsResolution[0];
  }

  // 2. Your turn (responding to co-parent)
  if (categorized.yourTurn.length > 0) {
    return categorized.yourTurn.sort((a, b) =>
      (b.lastActivity?.timestamp.getTime() || 0) - (a.lastActivity?.timestamp.getTime() || 0)
    )[0];
  }

  // 3. Ready to start (in order)
  if (categorized.readyToStart.length > 0) {
    return categorized.readyToStart.sort((a, b) => (a.priority || 0) - (b.priority || 0))[0];
  }

  // 4. Ready to sign (quick wins)
  if (categorized.readyToSign.length > 0) {
    return categorized.readyToSign[0];
  }

  return null;
}

// Check if co-parent has been inactive
export function isCoParentInactive(sections: Section[], dayThreshold: number = 3): boolean {
  const waitingSections = sections.filter(s => s.state === 'waiting-on-them');
  if (waitingSections.length === 0) return false;

  const mostRecentActivity = waitingSections
    .map(s => s.lastActivity?.timestamp.getTime() || 0)
    .reduce((max, time) => Math.max(max, time), 0);

  if (mostRecentActivity === 0) return true;

  const daysSinceActivity = (Date.now() - mostRecentActivity) / (1000 * 60 * 60 * 24);
  return daysSinceActivity >= dayThreshold;
}
