'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';

const TOTAL_NIGHTS = 365;

export default function OvernightDistributionForm() {
  const [parent1Nights, setParent1Nights] = useState(184);

  const parent2Nights = TOTAL_NIGHTS - parent1Nights;
  const parent1Pct = ((parent1Nights / TOTAL_NIGHTS) * 100).toFixed(2);
  const parent2Pct = ((parent2Nights / TOTAL_NIGHTS) * 100).toFixed(2);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setParent1Nights(Number(e.target.value));
  }, []);

  const handleGenerate = () => {
    console.log('Generate with overnight distribution:', { parent1Nights, parent2Nights });
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Number of Overnights</h2>

      <div>
        <h3 className="text-base font-semibold text-primary mb-3">Overnight Distribution</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Overnight totals are automatically calculated as you build your schedule.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-2">
          If you&apos;ve added custom text or split time during holidays in a unique way, take a moment to confirm the totals represent your intended arrangement.
        </p>
      </div>

      <p className="text-sm text-gray-500 italic leading-relaxed">
        For example, if one parent has the children for the entire summer, but you otherwise alternate each week, then the parent with the children in the summer probably has the kids 70% of the time over an entire year. The night count will update in real-time as you adjust the slider.
      </p>

      {/* Slider Card */}
      <div className="border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Parent Names */}
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-primary">Justin Davis</span>
          <span className="text-sm font-semibold text-primary">Other Parent</span>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full overflow-hidden pointer-events-none">
            <div
              className="absolute inset-y-0 left-0 bg-primary/60 rounded-l-full"
              style={{ width: `${(parent1Nights / TOTAL_NIGHTS) * 100}%` }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-amber-400/70 rounded-r-full"
              style={{ width: `${(parent2Nights / TOTAL_NIGHTS) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={TOTAL_NIGHTS}
            value={parent1Nights}
            onChange={handleSliderChange}
            className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{parent1Pct}%</div>
            <div className="text-sm text-gray-500 mt-1">({parent1Nights} nights)</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{parent2Pct}%</div>
            <div className="text-sm text-gray-500 mt-1">({parent2Nights} nights)</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-2">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          Back
        </button>

        <button
          onClick={handleGenerate}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Generate</span>
        </button>
      </div>
    </div>
  );
}
