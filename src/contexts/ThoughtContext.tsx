import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThoughtsByDate } from '../types/thought';
import { useAuth } from './AuthContext';
import { thoughtService } from '../services/thoughtService';
import { useThoughtState } from '../hooks/useThoughtState';

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

export function ThoughtProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const {
    thoughts,
    loading,
    error,
    hasMore,
    lastLoadedDate,
    setThoughts,
    setLoading,
    setError,
    setHasMore,
    setLastLoadedDate,
    addThoughtToState,
    updateThoughtInState,
    deleteThoughtFromState,
    toggleThoughtHiddenInState,
    mergeThoughts,
    reset
  } = useThoughtState();
  
  // 防止重复加载的标志
  const [hasLoaded, setHasLoaded] = useState(false);
  


  // Load initial thoughts - only when user changes
  useEffect(() => {
    // 重置加载状态当用户改变时
    if (user?.id) {
      setHasLoaded(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!user) {
        if (mounted) {
          reset();
          setLoading(false);
          setHasLoaded(false);
        }
        return;
      }
      
      // 如果已经加载过了，就不再加载
      if (hasLoaded) {
        console.log('Data already loaded, skipping...');
        return;
      }
      
      console.log('Starting to load data for user:', user.id);
      
      if (mounted) {
        setLoading(true);
        setError(null);
      }
      
      try {
        const result = await thoughtService.loadInitialThoughts(user.id);
        if (mounted && result) {
          setThoughts(result.thoughts);
          setHasMore(result.hasMore);
          setLastLoadedDate(result.lastLoadedDate);
          setHasLoaded(true);
          console.log('Data loaded successfully');
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load thoughts');
          console.error('Failed to load data:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [user?.id, hasLoaded]); // 依赖user.id和hasLoaded

  const loadMoreThoughts = async () => {
    if (!user || !hasMore || !lastLoadedDate) return;
    
    setLoading(true);
    
    try {
      const result = await thoughtService.loadMoreThoughts(user.id, lastLoadedDate);
      if (result) {
        if (result.thoughts && Object.keys(result.thoughts).length > 0) {
          mergeThoughts(result.thoughts);
        }
        setHasMore(result.hasMore);
        if (result.lastLoadedDate) {
          setLastLoadedDate(result.lastLoadedDate);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more thoughts');
    } finally {
      setLoading(false);
    }
  };

  const addThought = async (content: string, date: string, hidden: boolean = false) => {
    if (!user) return;
    
    try {
      const data = await thoughtService.addThought(user.id, content, date, hidden);
      if (data) {
        addThoughtToState(data, date);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add thought');
      throw err;
    }
  };

  const updateThought = async (id: string, content: string) => {
    if (!user) return;
    
    try {
      await thoughtService.updateThought(user.id, id, content);
      updateThoughtInState(id, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update thought');
      throw err;
    }
  };

  const deleteThought = async (id: string) => {
    if (!user) return;
    
    try {
      await thoughtService.deleteThought(user.id, id);
      deleteThoughtFromState(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete thought');
      throw err;
    }
  };

  const toggleThoughtHidden = async (id: string) => {
    if (!user) return;
    
    try {
      // Find the current thought to get its current hidden state
      let currentHidden = false;
      for (const date of Object.keys(thoughts)) {
        const found = thoughts[date].find(t => t.id === id);
        if (found) {
          currentHidden = found.hidden;
          break;
        }
      }
      
      await thoughtService.toggleThoughtHidden(user.id, id, currentHidden);
      toggleThoughtHiddenInState(id, !currentHidden);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle thought visibility');
      throw err;
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