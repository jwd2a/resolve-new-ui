'use client';

import LessonVideoContent from '@/app/components/LessonVideoContent';
import OvernightDistributionForm from '@/app/components/OvernightDistributionForm';

export default function NumberOfOvernightsPage() {
  const keyPoints = [
    'Overnight counts help determine child support calculations in many states.',
    'The slider reflects the total distribution across the entire year, including holidays and breaks.',
    'Adjust the slider to match your intended arrangement — even small changes can affect percentages.',
    'This section summarizes the schedule you\'ve already built in earlier modules.',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <LessonVideoContent
          title="Understanding total number of overnights"
          keyPoints={keyPoints}
        />
      </div>
      <div>
        <OvernightDistributionForm />
      </div>
    </div>
  );
}
