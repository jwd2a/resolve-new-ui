export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const examQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    prompt: 'Under Florida Statute 61.13, what standard guides the court when approving a parenting plan?',
    options: [
      'Equal time for both parents regardless of circumstances',
      'The best interest of the child',
      'Whichever parent files first',
      'The preference of the older parent',
    ],
    correctIndex: 1,
  },
  {
    id: 'q2',
    prompt: 'Which of the following is required content of a Florida parenting plan?',
    options: [
      'A list of the parents\' employers',
      'A description of how parental responsibility will be shared',
      'A statement of fault for the divorce',
      'The parents\' favorite holidays',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    prompt: 'Most negative outcomes for children of divorce are driven by:',
    options: [
      'The divorce itself',
      'Ongoing conflict between parents',
      'The number of weekends with each parent',
      'Whether each parent remarries',
    ],
    correctIndex: 1,
  },
  {
    id: 'q4',
    prompt: 'In Florida, "relocation" of a parent is generally defined as a move:',
    options: [
      'Out of the country only',
      'More than 50 miles from the prior principal residence for at least 60 consecutive days',
      'Across any county line',
      'To a different school district',
    ],
    correctIndex: 1,
  },
  {
    id: 'q5',
    prompt: 'When safety concerns are present, parenting plan logistics should:',
    options: [
      'Always defer to the higher-earning parent',
      'Take a back seat to a documented safety plan',
      'Be decided by the children',
      'Remain unchanged',
    ],
    correctIndex: 1,
  },
  {
    id: 'q6',
    prompt: 'Which of these is a recommended communication practice for co-parents?',
    options: [
      'Use children to relay messages',
      'Communicate in writing for important decisions',
      'Avoid documenting agreements',
      'Discuss parenting only in person, never in writing',
    ],
    correctIndex: 1,
  },
  {
    id: 'q7',
    prompt: 'A "time-sharing schedule" specifies:',
    options: [
      'How parents will divide household chores',
      'When the child will be with each parent',
      'How parents will split tax deductions',
      'Which parent files the parenting plan',
    ],
    correctIndex: 1,
  },
  {
    id: 'q8',
    prompt: 'Mediation is best described as:',
    options: [
      'A trial in front of a judge',
      'A confidential process where a neutral third party helps parents reach agreement',
      'A binding arbitration ruling',
      'A counseling session for the children',
    ],
    correctIndex: 1,
  },
  {
    id: 'q9',
    prompt: 'Children typically benefit most when both parents:',
    options: [
      'Compete for the child\'s loyalty',
      'Maintain consistent routines and shielding the child from adult conflict',
      'Avoid all contact with each other',
      'Combine households whenever possible',
    ],
    correctIndex: 1,
  },
  {
    id: 'q10',
    prompt: 'A parenting plan is most likely to succeed when it:',
    options: [
      'Is intentionally vague to avoid conflict',
      'Is specific, written, and centered on the child\'s needs',
      'Is verbal only',
      'Mirrors a friend\'s plan exactly',
    ],
    correctIndex: 1,
  },
];

export const PASSING_THRESHOLD = 0.8;
