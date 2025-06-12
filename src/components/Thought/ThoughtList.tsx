import { useEffect, useRef, useCallback } from 'react';
import { useThoughts } from '../../contexts/ThoughtContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import ThoughtItem from './ThoughtItem';
import { calculateLifeDays, formatDateForDisplay, sortDatesDesc } from '../../utils/dateUtils';
import EmptyState from './EmptyState';

export default function ThoughtList() {
  const { thoughts, loading, loadMoreThoughts, hasMore } = useThoughts();
  const { profile } = useUserProfile();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // No longer filter out hidden thoughts - they will be shown but with content hidden
  const filteredThoughts = thoughts;

  // Sort dates newest to oldest - Twitter style
  const sortedDates = sortDatesDesc(Object.keys(filteredThoughts));

  // Set up intersection observer for infinite scrolling
  const lastThoughtRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreThoughts();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreThoughts]
  );

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (sortedDates.length === 0 && !loading) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {sortedDates.map((date, dateIndex) => (
        <div key={date} className="space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="date-label px-4 py-2 rounded-full">
                {(() => {
                  const lifeDays = calculateLifeDays(date, profile?.birth_date || null);
                  const calendarDate = formatDateForDisplay(date);
                  
                  if (lifeDays) {
                    return (
                      <>
                        <span>{lifeDays}</span>
                        <span className="mx-1">·</span>
                        <span>{calendarDate}</span>
                      </>
                    );
                  } else {
                    return <span>{calendarDate}</span>;
                  }
                })()}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {filteredThoughts[date].map((thought, thoughtIndex) => {
              // Determine if this is the last thought overall
              const isLast = dateIndex === sortedDates.length - 1 && 
                            thoughtIndex === filteredThoughts[date].length - 1;
              
              return (
                <div 
                  key={thought.id}
                  ref={isLast ? lastThoughtRef : undefined}
                >
                  <ThoughtItem thought={thought} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {loading && (
        <div ref={loadingRef} className="py-6 text-center modern-text">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-600"></div>
        </div>
      )}
      
      {!loading && !hasMore && sortedDates.length > 0 && (
        <div className="py-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="date-label px-4 py-2 rounded-full">
                End
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* 底部空隙 */}
      <div className="pb-6 sm:pb-8"></div>
    </div>
  );
} 