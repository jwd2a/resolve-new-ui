'use client';

import LessonVideoContent from '@/app/components/LessonVideoContent';
import TransportationExchangeForm from '@/app/components/TransportationExchangeForm';

export default function TransportationExchangePage() {
  const keyPoints = [
    'Define who is responsible for pick-ups and drop-offs.',
    'Avoid conflict by keeping exchanges brief and neutral.',
    'Handle delays and schedule changes with courtesy.',
    'Use public locations for transitions if necessary.',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <LessonVideoContent
          title="Transportation and Exchange"
          keyPoints={keyPoints}
        />
      </div>
      <div>
        <TransportationExchangeForm />
      </div>
    </div>
  );
}
