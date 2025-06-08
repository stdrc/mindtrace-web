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

const DAYS_PER_LOAD = 2; // 每次加载2天的数据

export function ThoughtProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [thoughts, setThoughts] = useState<ThoughtsByDate>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastLoadedDate, setLastLoadedDate] = useState<string | null>(null);

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
      // 获取用户最近的日期，然后按日期分批加载
      const { data: recentDates, error: dateError } = await supabase
        .from('thoughts')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100); // 获取最近100个记录的日期来找到不同的日期
      
      if (dateError) throw dateError;
      
      if (recentDates.length === 0) {
        setThoughts({});
        setHasMore(false);
        setLastLoadedDate(null);
        return;
      }
      
      // 获取去重的日期，按日期降序排列
      const uniqueDates = [...new Set(recentDates.map(item => item.date))].sort((a, b) => b.localeCompare(a));
      
      // 取前 DAYS_PER_LOAD 天的数据
      const datesToLoad = uniqueDates.slice(0, DAYS_PER_LOAD);
      
      if (datesToLoad.length === 0) {
        setThoughts({});
        setHasMore(false);
        setLastLoadedDate(null);
        return;
      }
      
      // 加载这些日期的所有 thoughts
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id)
        .in('date', datesToLoad)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setThoughts(processThoughts(data));
      setHasMore(uniqueDates.length > DAYS_PER_LOAD);
      setLastLoadedDate(datesToLoad[datesToLoad.length - 1]); // 记录最后加载的日期
    } catch (err) {
      setError('Failed to load thoughts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreThoughts = async () => {
    if (!user || !hasMore || !lastLoadedDate) return;
    
    setLoading(true);
    
    try {
      // 获取比 lastLoadedDate 更早的日期
      const { data: olderDates, error: dateError } = await supabase
        .from('thoughts')
        .select('date')
        .eq('user_id', user.id)
        .lt('date', lastLoadedDate)
        .order('date', { ascending: false })
        .limit(100); // 获取100个记录的日期来找到不同的日期
      
      if (dateError) throw dateError;
      
      if (olderDates.length === 0) {
        setHasMore(false);
        return;
      }
      
      // 获取去重的日期，按日期降序排列
      const uniqueDates = [...new Set(olderDates.map(item => item.date))].sort((a, b) => b.localeCompare(a));
      
      // 取前 DAYS_PER_LOAD 天的数据
      const datesToLoad = uniqueDates.slice(0, DAYS_PER_LOAD);
      
      if (datesToLoad.length === 0) {
        setHasMore(false);
        return;
      }
      
      // 加载这些日期的所有 thoughts
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id)
        .in('date', datesToLoad)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      
      setThoughts(prevThoughts => mergeAndProcessThoughts(prevThoughts, data));
      setHasMore(uniqueDates.length >= DAYS_PER_LOAD); // 如果这次加载的日期数量达到了 DAYS_PER_LOAD，说明可能还有更多
      setLastLoadedDate(datesToLoad[datesToLoad.length - 1]); // 更新最后加载的日期
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
        
        // Check if this thought already exists (防止重复添加)
        const exists = newThoughts[date].some(thought => thought.id === data.id);
        if (exists) {
          console.log('Thought already exists, skipping duplicate add');
          return prevThoughts;
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