export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface CommunityResource {
  name: string;
  description: string;
  url?: string;
  phone?: string;
}

export const glossary: GlossaryEntry[] = [
  { term: 'Best Interest of the Child', definition: 'The legal standard Florida courts use when deciding parenting plans. Courts weigh factors including the child\'s relationship with each parent, stability, and safety.' },
  { term: 'Parental Responsibility', definition: 'The right and duty to make major decisions about a child\'s upbringing, including education, healthcare, and religion.' },
  { term: 'Time-Sharing Schedule', definition: 'The schedule that specifies when each parent has the child, including weekdays, weekends, holidays, and school breaks.' },
  { term: 'Parenting Plan', definition: 'The written document, required under Florida Statute 61.13, that describes how parents will share parenting responsibilities.' },
  { term: 'Mediation', definition: 'A confidential process in which a neutral third party helps parents reach agreement on disputed issues.' },
  { term: 'Relocation', definition: 'A change of principal residence by a parent that is more than 50 miles from the residence at the time of the last court order.' },
  { term: 'Mediator', definition: 'A neutral, court-approved third party who facilitates negotiation between parents.' },
];

export const communityResources: CommunityResource[] = [
  { name: 'Florida Department of Children and Families', description: 'Statewide child welfare agency.', url: 'https://www.myflfamilies.com', phone: '1-800-962-2873' },
  { name: 'Florida Coalition Against Domestic Violence', description: 'Statewide hotline and shelter referrals.', url: 'https://www.fcadv.org', phone: '1-800-500-1119' },
  { name: 'Florida Bar Lawyer Referral Service', description: 'Find an attorney by area of practice and county.', url: 'https://www.floridabar.org/public/lrs/', phone: '1-800-342-8011' },
  { name: '211 — United Way Helpline', description: 'Connects callers with local social services, food, housing, and counseling.', phone: '211' },
];
