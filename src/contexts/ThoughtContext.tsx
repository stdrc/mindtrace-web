import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Thought, ThoughtWithNumber, ThoughtsByDate } from '../types/thought';
import { useAuth } from './AuthContext';

interface ThoughtContextType {
  thoughts: ThoughtsByDate;
  loading: boolean;
  error: string | null;
  addThought: (content: string, date: string, hidden?: boolean) => Promise<void>;
  updateThought: (id: string, content: string) => Promise<void>;
  deleteThought: (id: string) => Promise<void>;
  toggleThoughtHidden: (id: string) => Promise<void>;
  loadMoreThoughts: () => Promise<void>;
  hasMore: boolean;
}

const ThoughtContext = createContext<ThoughtContextType | undefined>(undefined);

const PAGE_SIZE = 20;

export function ThoughtProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [thoughts, setThoughts] = useState<ThoughtsByDate>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Load initial thoughts
  useEffect(() => {
    if (user) {
      loadThoughts();
    } else {
      setThoughts({});
      setLoading(false);
    }
  }, [user]);

  // Group thoughts by date and add number
  const processThoughts = (thoughts: Thought[]): ThoughtsByDate => {
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
    
    // Sort each group by created_at desc (latest first) but assign numbers in creation order
    Object.keys(grouped).forEach(date => {
      // First sort by creation time (asc) to assign proper sequential numbers
      const sortedForNumbering = [...grouped[date]].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      // Assign numbers based on creation order
      sortedForNumbering.forEach((thought, index) => {
        thought.number = index + 1;
      });
      
      // Then sort by created_at desc for display
      grouped[date].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    
    return grouped;
  };

  const loadThoughts = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1);
      
      if (error) throw error;
      
      setThoughts(processThoughts(data));
      setHasMore(data.length === PAGE_SIZE);
      setPage(1);
    } catch (err) {
      setError('Failed to load thoughts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreThoughts = async () => {
    if (!user || !hasMore) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      
      if (error) throw error;
      
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      
      const newThoughts = { ...thoughts };
      const processedData = processThoughts(data);
      
      // Merge the new thoughts with existing thoughts
      Object.keys(processedData).forEach(date => {
        if (newThoughts[date]) {
          // If we already have thoughts for this date, append and renumber
          const existingThoughts = newThoughts[date];
          const combinedThoughts = [...existingThoughts, ...processedData[date]];
          
          // First sort by creation time (asc) to assign proper sequential numbers
          const sortedForNumbering = [...combinedThoughts].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          
          // Assign numbers based on creation order
          sortedForNumbering.forEach((thought, index) => {
            thought.number = index + 1;
          });
          
          // Then sort by created_at desc for display
          combinedThoughts.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          newThoughts[date] = combinedThoughts;
        } else {
          // If this is a new date, just add it
          newThoughts[date] = processedData[date];
        }
      });
      
      setThoughts(newThoughts);
      setHasMore(data.length === PAGE_SIZE);
      setPage(page + 1);
    } catch (err) {
      setError('Failed to load more thoughts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addThought = async (content: string, date: string, hidden: boolean = false) => {
    if (!user) return;
    
    try {
      const newThought = {
        user_id: user.id,
        content,
        date,
        hidden,
      };
      
      const { data, error } = await supabase
        .from('thoughts')
        .insert(newThought)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const newThoughts = { ...thoughts };
      
      if (!newThoughts[date]) {
        newThoughts[date] = [];
      }
      
      const thoughtWithNumber: ThoughtWithNumber = {
        ...data,
        number: 1 // Will be recalculated after sorting
      };
      
      newThoughts[date].push(thoughtWithNumber);
      
      // First sort by creation time (asc) to assign proper sequential numbers
      const sortedForNumbering = [...newThoughts[date]].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      // Assign numbers based on creation order
      sortedForNumbering.forEach((thought, index) => {
        thought.number = index + 1;
      });
      
      // Then sort desc (latest first) for display
      newThoughts[date].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setThoughts(newThoughts);
    } catch (err) {
      setError('Failed to add thought');
      console.error(err);
    }
  };

  const updateThought = async (id: string, content: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('thoughts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const newThoughts = { ...thoughts };
      
      // Find and update the thought
      Object.keys(newThoughts).forEach(date => {
        const index = newThoughts[date].findIndex(t => t.id === id);
        if (index !== -1) {
          newThoughts[date][index].content = content;
          newThoughts[date][index].updated_at = new Date().toISOString();
        }
      });
      
      setThoughts(newThoughts);
    } catch (err) {
      setError('Failed to update thought');
      console.error(err);
    }
  };

  const deleteThought = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const newThoughts = { ...thoughts };
      let dateToDelete: string | null = null;
      
      // Find and remove the thought, then renumber
      Object.keys(newThoughts).forEach(date => {
        const index = newThoughts[date].findIndex(t => t.id === id);
        if (index !== -1) {
          // Remove the thought
          newThoughts[date].splice(index, 1);
          
          // Renumber the remaining thoughts based on creation order
          const sortedForNumbering = [...newThoughts[date]].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          
          sortedForNumbering.forEach((thought, i) => {
            thought.number = i + 1;
          });
          
          // If this date has no more thoughts, mark it for deletion
          if (newThoughts[date].length === 0) {
            dateToDelete = date;
          }
        }
      });
      
      // Remove empty dates
      if (dateToDelete) {
        delete newThoughts[dateToDelete];
      }
      
      setThoughts(newThoughts);
    } catch (err) {
      setError('Failed to delete thought');
      console.error(err);
    }
  };

  const toggleThoughtHidden = async (id: string) => {
    if (!user) return;
    
    try {
      // First find the current thought to get its current hidden state
      let currentThought: ThoughtWithNumber | undefined;
      for (const date of Object.keys(thoughts)) {
        const found = thoughts[date].find(t => t.id === id);
        if (found) {
          currentThought = found;
          break;
        }
      }

      if (!currentThought) {
        throw new Error('Thought not found');
      }

      const newHiddenState = !currentThought.hidden;
      
      const { error } = await supabase
        .from('thoughts')
        .update({ hidden: newHiddenState, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const newThoughts = { ...thoughts };
      
      // Find and update the thought
      Object.keys(newThoughts).forEach(date => {
        const index = newThoughts[date].findIndex(t => t.id === id);
        if (index !== -1) {
          const thought = newThoughts[date][index] as ThoughtWithNumber;
          thought.hidden = newHiddenState;
          thought.updated_at = new Date().toISOString();
        }
      });
      
      setThoughts(newThoughts);
    } catch (err) {
      setError('Failed to toggle thought visibility');
      console.error(err);
    }
  };

  const value = {
    thoughts,
    loading,
    error,
    addThought,
    updateThought,
    deleteThought,
    toggleThoughtHidden,
    loadMoreThoughts,
    hasMore,
  };

  return (
    <ThoughtContext.Provider value={value}>
      {children}
    </ThoughtContext.Provider>
  );
}

export function useThoughts() {
  const context = useContext(ThoughtContext);
  if (context === undefined) {
    throw new Error('useThoughts must be used within a ThoughtProvider');
  }
  return context;
} 