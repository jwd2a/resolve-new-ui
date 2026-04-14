import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function UnimplementedLessonPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <DocumentTextIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Not Yet Available</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        This section hasn&apos;t been incorporated into the prototype.
      </p>
    </div>
  );
}
