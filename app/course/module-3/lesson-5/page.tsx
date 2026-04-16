'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import LessonVideoContent from '@/app/components/LessonVideoContent';
import HolidayScheduleForm from '@/app/components/HolidayScheduleForm';

function HolidayScheduleContent() {
  const searchParams = useSearchParams();
  const flowType = searchParams.get('flow') || 'inline';

  const keyPoints = [
    'Plan ahead to ensure stress-free holiday transitions.',
    'Be open to creating new traditions.',
    'Give yourself permission to grieve or splitting holiday time.',
    'Prioritize your child\'s joy over personal preferences.',
    'If a holiday isn\'t important in your family, just use the normal schedule.',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <LessonVideoContent
          title="Holiday Schedule"
          keyPoints={keyPoints}
        />
      </div>
      <div>
        <HolidayScheduleForm flowType={flowType} />
      </div>
    </div>
  );
}

export default function HolidaySchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HolidayScheduleContent />
    </Suspense>
  );
}
