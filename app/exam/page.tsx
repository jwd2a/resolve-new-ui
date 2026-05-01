'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/app/onboarding/OnboardingContext';
import { useCourseProgress } from '@/app/course/CourseProgressContext';
import { getAllVisibleLessonIds } from '@/app/course/data';
import { examQuestions, PASSING_THRESHOLD } from './data';

export default function ExamPage() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { completedLessons, markExamPassed, markLessonsComplete } = useCourseProgress();

  const requiredLessons = useMemo(() => getAllVisibleLessonIds(data.floridaTrack), [data.floridaTrack]);
  const allLessonsComplete = requiredLessons.every((id) => completedLessons.has(id));

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!data.floridaTrack) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Exam not required</h1>
        <p className="text-gray-600">The end-of-course exam is only required for Florida-approved courses.</p>
      </div>
    );
  }

  if (!allLessonsComplete) {
    const remaining = requiredLessons.length - Array.from(completedLessons).filter((id) => requiredLessons.includes(id)).length;
    return (
      <div className="max-w-2xl bg-white rounded-2xl border border-border p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="w-6 h-6 text-gray-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Final Exam — Locked</h1>
        <p className="text-sm text-gray-600 mb-6">
          Finish all required lessons to unlock the exam. {remaining} lesson{remaining === 1 ? '' : 's'} remaining.
        </p>
        <div className="border-t border-gray-200 pt-5 mt-2">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
            Testing
          </p>
          <button
            onClick={() => markLessonsComplete(requiredLessons)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <KeyIcon className="w-4 h-4" />
            Manually unlock exam (testing)
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Marks all required lessons complete so you can preview the exam flow.
          </p>
        </div>
      </div>
    );
  }

  const numCorrect = Object.entries(answers).reduce((acc, [qid, idx]) => {
    const q = examQuestions.find((x) => x.id === qid);
    return q && q.correctIndex === idx ? acc + 1 : acc;
  }, 0);
  const score = numCorrect / examQuestions.length;
  const passed = score >= PASSING_THRESHOLD;
  const allAnswered = Object.keys(answers).length === examQuestions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed) {
      markExamPassed();
    }
  };

  if (submitted && passed) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl border border-border p-10 text-center">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">You passed!</h1>
        <p className="text-gray-600 mb-6">
          You scored {numCorrect}/{examQuestions.length} ({Math.round(score * 100)}%).
        </p>
        <button
          onClick={() => router.push('/certificate')}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold"
        >
          View your certificate
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Final Exam</h1>
        <p className="text-sm text-gray-600 mt-1">
          {examQuestions.length} questions. Passing score: {Math.round(PASSING_THRESHOLD * 100)}%.
        </p>
      </header>

      {submitted && !passed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          You scored {numCorrect}/{examQuestions.length} ({Math.round(score * 100)}%). You can review your answers and resubmit.
        </div>
      )}

      <ol className="space-y-6">
        {examQuestions.map((q, idx) => {
          const selected = answers[q.id];
          const showCorrectness = submitted;
          return (
            <li key={q.id} className="bg-white rounded-xl border border-border p-5">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                {idx + 1}. {q.prompt}
              </div>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selected === optIdx;
                  const isCorrect = showCorrectness && q.correctIndex === optIdx;
                  const isWrongPick = showCorrectness && isSelected && q.correctIndex !== optIdx;
                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm ${
                        isCorrect
                          ? 'border-success bg-success/5 text-success'
                          : isWrongPick
                          ? 'border-red-400 bg-red-50 text-red-900'
                          : isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={isSelected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: optIdx }))}
                        className="accent-primary"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex justify-end">
        <button
          disabled={!allAnswered}
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitted ? 'Resubmit' : 'Submit answers'}
        </button>
      </div>
    </div>
  );
}
