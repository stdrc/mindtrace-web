import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { ThoughtWithNumber, ThoughtsByDate } from '../types/thought';
import { useAuth } from './AuthContext';
import { processThoughts, assignThoughtNumbers, mergeAndProcessThoughts } from '../utils/thoughtUtils';

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
      
      setThoughts(prevThoughts => mergeAndProcessThoughts(prevThoughts, data));
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
      setThoughts(prevThoughts => {
        const newThoughts = { ...prevThoughts };
        
        if (!newThoughts[date]) {
          newThoughts[date] = [];
        }
        
        const thoughtWithNumber: ThoughtWithNumber = {
          ...data,
          number: 1 // Will be recalculated after sorting
        };
        
        newThoughts[date].push(thoughtWithNumber);
        assignThoughtNumbers(newThoughts[date]);
        
        return newThoughts;
      });
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
      setThoughts(prevThoughts => {
        const newThoughts = { ...prevThoughts };
        
        // Find and update the thought
        Object.keys(newThoughts).forEach(date => {
          const index = newThoughts[date].findIndex(t => t.id === id);
          if (index !== -1) {
            newThoughts[date][index].content = content;
            newThoughts[date][index].updated_at = new Date().toISOString();
          }
        });
        
        return newThoughts;
      });
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
      setThoughts(prevThoughts => {
        const newThoughts = { ...prevThoughts };
        let dateToDelete: string | null = null;
        
        // Find and remove the thought, then renumber
        Object.keys(newThoughts).forEach(date => {
          const index = newThoughts[date].findIndex(t => t.id === id);
          if (index !== -1) {
            // Remove the thought
            newThoughts[date].splice(index, 1);
            
            // Renumber the remaining thoughts
            if (newThoughts[date].length > 0) {
              assignThoughtNumbers(newThoughts[date]);
            } else {
              // If this date has no more thoughts, mark it for deletion
              dateToDelete = date;
            }
          }
        });
        
        // Remove empty dates
        if (dateToDelete) {
          delete newThoughts[dateToDelete];
        }
        
        return newThoughts;
      });
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
      setThoughts(prevThoughts => {
        const newThoughts = { ...prevThoughts };
        
        // Find and update the thought
        Object.keys(newThoughts).forEach(date => {
          const index = newThoughts[date].findIndex(t => t.id === id);
          if (index !== -1) {
            const thought = newThoughts[date][index] as ThoughtWithNumber;
            thought.hidden = newHiddenState;
            thought.updated_at = new Date().toISOString();
          }
        });
        
        return newThoughts;
      });
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