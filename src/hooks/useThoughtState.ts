import { useState, useCallback } from 'react';
import type { ThoughtWithNumber, ThoughtsByDate } from '../types/thought';
import { assignThoughtNumbers } from '../utils/thoughtUtils';

export interface ThoughtState {
  thoughts: ThoughtsByDate;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastLoadedDate: string | null;
}

export interface ThoughtStateActions {
  setThoughts: (thoughts: ThoughtsByDate) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setLastLoadedDate: (date: string | null) => void;
  addThoughtToState: (thought: Record<string, unknown>, date: string) => void;
  updateThoughtInState: (id: string, content: string) => void;
  deleteThoughtFromState: (id: string) => void;
  toggleThoughtHiddenInState: (id: string, newHiddenState: boolean) => void;
  mergeThoughts: (newThoughts: ThoughtsByDate) => void;
  reset: () => void;
}

const initialState: ThoughtState = {
  thoughts: {},
  loading: true,
  error: null,
  hasMore: true,
  lastLoadedDate: null
};

export function useThoughtState(): ThoughtState & ThoughtStateActions {
  const [state, setState] = useState<ThoughtState>(initialState);

  const setThoughts = useCallback((thoughts: ThoughtsByDate) => {
    setState(prev => ({ ...prev, thoughts }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    setState(prev => ({ ...prev, hasMore }));
  }, []);

  const setLastLoadedDate = useCallback((lastLoadedDate: string | null) => {
    setState(prev => ({ ...prev, lastLoadedDate }));
  }, []);

  const addThoughtToState = useCallback((thought: Record<string, unknown>, date: string) => {
    setState(prev => {
      const newThoughts = { ...prev.thoughts };
      
      if (!newThoughts[date]) {
        newThoughts[date] = [];
      }
      
      // Check if this thought already exists (prevent duplicates)
      const exists = newThoughts[date].some(t => t.id === thought.id);
      if (exists) {
        console.log('Thought already exists, skipping duplicate add');
        return prev;
      }
      
      const thoughtWithNumber: ThoughtWithNumber = {
        ...(thought as unknown as ThoughtWithNumber),
        number: 1 // Will be recalculated after sorting
      };
      
      newThoughts[date].push(thoughtWithNumber);
      assignThoughtNumbers(newThoughts[date]);
      
      return { ...prev, thoughts: newThoughts };
    });
  }, []);

  const updateThoughtInState = useCallback((id: string, content: string) => {
    setState(prev => {
      const newThoughts = { ...prev.thoughts };
      
      // Find and update the thought
      Object.keys(newThoughts).forEach(date => {
        const index = newThoughts[date].findIndex(t => t.id === id);
        if (index !== -1) {
          newThoughts[date][index].content = content;
          newThoughts[date][index].updated_at = new Date().toISOString();
        }
      });
      
      return { ...prev, thoughts: newThoughts };
    });
  }, []);

  const deleteThoughtFromState = useCallback((id: string) => {
    setState(prev => {
      const newThoughts = { ...prev.thoughts };
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
      
      return { ...prev, thoughts: newThoughts };
    });
  }, []);

  const toggleThoughtHiddenInState = useCallback((id: string, newHiddenState: boolean) => {
    setState(prev => {
      const newThoughts = { ...prev.thoughts };
      
      // Find and update the thought
      Object.keys(newThoughts).forEach(date => {
        const index = newThoughts[date].findIndex(t => t.id === id);
        if (index !== -1) {
          const thought = newThoughts[date][index] as ThoughtWithNumber;
          thought.hidden = newHiddenState;
          thought.updated_at = new Date().toISOString();
        }
      });
      
      return { ...prev, thoughts: newThoughts };
    });
  }, []);

  const mergeThoughts = useCallback((newThoughts: ThoughtsByDate) => {
    setState(prev => ({
      ...prev,
      thoughts: { ...prev.thoughts, ...newThoughts }
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
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
  };
}