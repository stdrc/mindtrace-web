/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  return new Date().toLocaleDateString('en-CA'); // en-CA produces YYYY-MM-DD format
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString('en-CA');
}

/**
 * Format a date string to display format (e.g., "Jun 5, 2025")
 */
export function formatDateForDisplay(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Sorts dates from newest to oldest
 */
export function sortDatesDesc(dates: string[]): string[] {
  return [...dates].sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Sorts dates from oldest to newest
 */
export function sortDatesAsc(dates: string[]): string[] {
  return [...dates].sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Convert a date object to YYYY-MM-DD string
 */
export function dateToString(date: Date): string {
  return date.toLocaleDateString('en-CA');
} 