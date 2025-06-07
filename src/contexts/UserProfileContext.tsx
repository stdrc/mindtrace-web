import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types/userProfile';
import { useAuth } from './AuthContext';

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (birthDate: string | null) => Promise<void>;
  getDaysSinceBirth: () => number | null;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      setProfile(data || null);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (birthDate: string | null) => {
    if (!user) return;
    
    setError(null);
    
    try {
      if (profile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('user_profiles')
          .update({ birth_date: birthDate, updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        setProfile(data);
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            birth_date: birthDate,
          })
          .select()
          .single();
        
        if (error) throw error;
        setProfile(data);
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
      throw err;
    }
  };

  const getDaysSinceBirth = (): number | null => {
    if (!profile?.birth_date) return null;
    
    const birthDate = new Date(profile.birth_date);
    const today = new Date();
    
    // Reset time to avoid timezone issues
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays + 1 : null; // +1 because birth day is day 1
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    getDaysSinceBirth,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
} 