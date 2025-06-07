export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="diary-card p-8 text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h3 className="diary-title text-xl mb-3">Welcome to MindTrace</h3>
        <p className="diary-text mb-4 text-sm leading-relaxed">
          This is your personal journal to record thoughts and reflections.
        </p>
        <p className="diary-text text-sm leading-relaxed opacity-75">
          Use the input above to capture your first thought. Each day becomes a new page in your journal,
          with thoughts numbered sequentially like entries in a diary.
        </p>
      </div>
    </div>
  );
} 