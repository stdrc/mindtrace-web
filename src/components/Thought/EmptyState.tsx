export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="modern-card p-8 text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-interactive shadow-sm border border-medium flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="MindTrace Logo" 
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
        <h3 className="modern-title text-xl mb-3">Welcome to MindTrace</h3>
        <p className="modern-text mb-4 text-sm leading-relaxed">
          This is your personal journal to record thoughts and reflections.
        </p>
        <p className="modern-text text-sm leading-relaxed opacity-75">
          Use the input above to capture your first thought. Each day becomes a new page in your journal,
          with thoughts numbered sequentially like entries in a diary.
        </p>
      </div>
    </div>
  );
} 