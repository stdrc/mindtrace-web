import { useUserProfile } from '../../contexts/UserProfileContext';

interface DaysSinceBirthProps {
  date: string; // YYYY-MM-DD format
  className?: string;
  fallbackToDate?: boolean;
}

export default function DaysSinceBirth({ 
  date, 
  className = '', 
  fallbackToDate = true 
}: DaysSinceBirthProps) {
  const { profile } = useUserProfile();

  const getDaysSinceBirthForDate = (dateString: string): number | null => {
    if (!profile?.birth_date) return null;
    
    const birthDate = new Date(profile.birth_date);
    const targetDate = new Date(dateString);
    
    // Reset time to avoid timezone issues
    birthDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays + 1 : null; // +1 because birth day is day 1
  };

  const daysSinceBirth = getDaysSinceBirthForDate(date);
  
  // Show days since birth if available, otherwise show date (if fallback enabled)
  const displayValue = daysSinceBirth 
    ? daysSinceBirth.toString() 
    : (fallbackToDate ? date : null);

  if (!displayValue) return null;

  return (
    <span className={className}>
      {displayValue}
    </span>
  );
}