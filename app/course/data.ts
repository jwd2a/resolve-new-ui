export interface CourseLesson {
  id: string;
  number: number;
  title: string;
  href: string;
  implemented?: boolean;
  /** Only visible/required when the user is on the Florida track. */
  floridaOnly?: boolean;
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  lessons: CourseLesson[];
}

export const courseModules: CourseModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Welcome to Resolve',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Introduction to Resolve', href: '/course/module-1/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'How the Process Works', href: '/course/module-1/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Setting Expectations', href: '/course/module-1/lesson-3' },
      { id: 'lesson-4', number: 4, title: 'Getting Started', href: '/course/module-1/lesson-4' },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Parental Responsibility and Decision Making',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Shared Decision-Making', href: '/course/module-2/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'Resolving Disagreements', href: '/course/module-2/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Day-to-Day Decisions', href: '/course/module-2/lesson-3' },
      { id: 'lesson-4', number: 4, title: 'Extra-curricular Activities', href: '/course/module-2/lesson-4' },
      { id: 'lesson-5', number: 5, title: 'Sharing Information/Records', href: '/course/module-2/lesson-5' },
      { id: 'lesson-6', number: 6, title: 'Communication', href: '/course/module-2/lesson-6' },
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Timesharing Schedule',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Introduction to Time Sharing', href: '/course/module-3/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'Scheduling and Our Calendar', href: '/course/module-3/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Weekday and Weekend Schedule', href: '/course/module-3/lesson-3', implemented: true },
      { id: 'lesson-4', number: 4, title: 'School Breaks', href: '/course/module-3/lesson-4' },
      { id: 'lesson-5', number: 5, title: 'Holiday Schedule', href: '/course/module-3/lesson-5', implemented: true },
      { id: 'lesson-6', number: 6, title: 'Transportation and Exchange', href: '/course/module-3/lesson-6', implemented: true },
      { id: 'lesson-7', number: 7, title: 'Other Travel Considerations', href: '/course/module-3/lesson-7' },
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Educational Decisions',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'School Choice and Enrollment', href: '/course/module-4/lesson-1' },
      { id: 'lesson-2', number: 2, title: 'Academic Performance and Support', href: '/course/module-4/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Parent-Teacher Communication', href: '/course/module-4/lesson-3' },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Final Considerations',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Number of Overnights', href: '/course/module-5/lesson-1', implemented: true },
      { id: 'lesson-2', number: 2, title: 'Relocation', href: '/course/module-5/lesson-2' },
      { id: 'lesson-3', number: 3, title: 'Changes or Modifications', href: '/course/module-5/lesson-3' },
      // Florida DCFS-required lessons appended here. Hidden unless floridaTrack is true.
      { id: 'lesson-4', number: 4, title: 'Domestic Violence and Family Safety', href: '/course/module-5/lesson-4', floridaOnly: true, implemented: true },
      { id: 'lesson-5', number: 5, title: 'Effects of Divorce on Children', href: '/course/module-5/lesson-5', floridaOnly: true, implemented: true },
      { id: 'lesson-6', number: 6, title: 'Florida Statutes and the Court Process', href: '/course/module-5/lesson-6', floridaOnly: true, implemented: true },
      { id: 'lesson-7', number: 7, title: 'Co-Parenting Best Practices', href: '/course/module-5/lesson-7', floridaOnly: true, implemented: true },
    ],
  },
];

/**
 * Returns the modules visible to a user. All modules are always visible
 * (we don't hide whole modules); call sites should filter lessons by
 * `floridaOnly` separately if they need to hide individual rows.
 */
export function getVisibleModules(isFlorida: boolean): CourseModule[] {
  return courseModules.map((m) => ({
    ...m,
    lessons: m.lessons.filter((l) => isFlorida || !l.floridaOnly),
  }));
}

export function getAllVisibleLessonIds(isFlorida: boolean): string[] {
  return getVisibleModules(isFlorida).flatMap((m) =>
    m.lessons.map((l) => `${m.id}/${l.id}`),
  );
}

export function getFirstImplementedLesson(): string {
  for (const module of courseModules) {
    for (const lesson of module.lessons) {
      if (lesson.implemented && !lesson.floridaOnly) return lesson.href;
    }
  }
  return '/course/module-1/lesson-1';
}
