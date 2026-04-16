'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CoursePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/course/module-3/lesson-3');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-gray-500">Redirecting to course...</p>
    </div>
  );
}
