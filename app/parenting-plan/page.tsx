'use client';

import { DocumentTextIcon, ArrowDownTrayIcon, ShareIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import AppNav from '@/app/components/AppNav';

export default function ParentingPlanPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Parenting Plan</h1>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircleIcon className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">Completed and signed by both parents</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-border">
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Plan Document Placeholder */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Document Header */}
            <div className="bg-primary/5 border-b border-border px-8 py-6">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Parenting Plan Agreement</h2>
                  <p className="text-sm text-gray-500">Finalized April 16, 2026</p>
                </div>
              </div>
            </div>

            {/* Placeholder Sections */}
            <div className="p-8 space-y-6">
              {[
                'Parental Responsibility and Decision Making',
                'Weekday and Weekend Schedule',
                'Holiday Schedule',
                'School Breaks',
                'Transportation and Exchange',
                'Relocation',
                'Changes or Modifications',
                'Special Circumstances & Household Norms',
              ].map((section, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0" />
                    <h3 className="text-base font-semibold text-foreground">{section}</h3>
                  </div>
                  <div className="ml-7 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-11/12" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Signatures */}
            <div className="border-t border-border px-8 py-6 bg-gray-50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Signatures</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Parent 1</p>
                  <div className="h-10 border-b-2 border-gray-300 flex items-end pb-1">
                    <span className="text-gray-400 italic text-sm">Signed electronically</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Parent 2</p>
                  <div className="h-10 border-b-2 border-gray-300 flex items-end pb-1">
                    <span className="text-gray-400 italic text-sm">Signed electronically</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <button className="bg-white rounded-xl border border-border p-4 hover:bg-gray-50 transition-colors text-left">
              <ArrowDownTrayIcon className="w-5 h-5 text-primary mb-2" />
              <div className="text-sm font-semibold text-foreground">Download PDF</div>
              <div className="text-xs text-gray-500">Save for your records</div>
            </button>
            <button className="bg-white rounded-xl border border-border p-4 hover:bg-gray-50 transition-colors text-left">
              <ShareIcon className="w-5 h-5 text-primary mb-2" />
              <div className="text-sm font-semibold text-foreground">Share with Attorney</div>
              <div className="text-xs text-gray-500">Send for professional review</div>
            </button>
            <button className="bg-white rounded-xl border border-border p-4 hover:bg-gray-50 transition-colors text-left">
              <CalendarIcon className="w-5 h-5 text-primary mb-2" />
              <div className="text-sm font-semibold text-foreground">Set Review Reminder</div>
              <div className="text-xs text-gray-500">Revisit in 6 months</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
