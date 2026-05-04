'use client';

import { BookOpenIcon, PhoneIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { glossary, communityResources } from './data';

export default function ResourceCenterPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Resource Center</h1>
        <p className="text-sm text-gray-600 mt-1">
          Required reference material for Florida-approved parenting courses.
        </p>
      </header>

      {/* Glossary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Glossary of Terms</h2>
        </div>
        <dl className="bg-white rounded-xl border border-border divide-y divide-border">
          {glossary.map((g) => (
            <div key={g.term} className="p-5">
              <dt className="text-sm font-semibold text-gray-900">{g.term}</dt>
              <dd className="text-sm text-gray-600 mt-1 leading-relaxed">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Community resources */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Community Resources</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {communityResources.map((r) => (
            <li key={r.name} className="bg-white rounded-xl border border-border p-5">
              <div className="text-sm font-semibold text-gray-900">{r.name}</div>
              <p className="text-sm text-gray-600 mt-1">{r.description}</p>
              <div className="mt-3 space-y-1 text-sm">
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    {r.url.replace(/^https?:\/\//, '')}
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {r.phone && <div className="text-gray-700">{r.phone}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Participant satisfaction survey */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Participant Satisfaction Survey</h2>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 text-sm text-gray-700">
          We&apos;ll ask for your feedback after you complete the course. Your responses help DCFS evaluate the program and remain anonymous.
        </div>
      </section>
    </div>
  );
}
