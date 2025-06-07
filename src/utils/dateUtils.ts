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
 * Calculate life days from birth date to target date
 * Returns null if birthDate is not provided or date is before birth
 */
export function calculateLifeDays(dateString: string, birthDate: string | null): number | null {
  if (!birthDate) {
    return null;
  }
  
  const targetDate = new Date(dateString);
  const birth = new Date(birthDate);
  
  // Reset time to avoid timezone issues
  targetDate.setHours(0, 0, 0, 0);
  birth.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - birth.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return null;
  }
  
  return diffDays + 1; // +1 because birth day is day 1
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