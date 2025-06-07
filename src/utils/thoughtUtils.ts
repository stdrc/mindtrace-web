import type { Thought, ThoughtWithNumber, ThoughtsByDate } from '../types/thought';

/**
 * Process thoughts by grouping them by date and adding sequential numbers
 */
export function processThoughts(thoughts: Thought[]): ThoughtsByDate {
  const grouped: ThoughtsByDate = {};
  
  // Group by date
  thoughts.forEach(thought => {
    if (!grouped[thought.date]) {
      grouped[thought.date] = [];
    }
    grouped[thought.date].push({
      ...thought,
      number: 0, // Temporary placeholder
    });
  });
  
  // Sort each group and assign numbers
  Object.keys(grouped).forEach(date => {
    assignThoughtNumbers(grouped[date]);
  });
  
  return grouped;
}

/**
 * Assign sequential numbers to thoughts based on creation order, then sort for display
 */
export function assignThoughtNumbers(thoughts: ThoughtWithNumber[]): void {
  // First sort by creation time (asc) to assign proper sequential numbers
  const sortedForNumbering = [...thoughts].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  // Assign numbers based on creation order
  sortedForNumbering.forEach((thought, index) => {
    thought.number = index + 1;
  });
  
  // Then sort by created_at desc for display (latest first)
  thoughts.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Merge new thoughts with existing thoughts and renumber
 */
export function mergeAndProcessThoughts(
  existingThoughts: ThoughtsByDate, 
  newThoughts: Thought[]
): ThoughtsByDate {
  const result = { ...existingThoughts };
  const processedNew = processThoughts(newThoughts);
  
  // Merge the new thoughts with existing thoughts
  Object.keys(processedNew).forEach(date => {
    if (result[date]) {
      // If we already have thoughts for this date, combine and renumber
      const combined = [...result[date], ...processedNew[date]];
      assignThoughtNumbers(combined);
      result[date] = combined;
    } else {
      // If this is a new date, just add it
      result[date] = processedNew[date];
    }
  });
  
  return result;
} 