import { supabase } from '../lib/supabase';
import type { ThoughtsByDate } from '../types/thought';
import { processThoughts } from '../utils/thoughtUtils';
import { PAGINATION, ERROR_MESSAGES } from '../constants';

export interface ThoughtService {
  loadInitialThoughts: (userId: string) => Promise<{
    thoughts: ThoughtsByDate;
    hasMore: boolean;
    lastLoadedDate: string | null;
  }>;
  loadMoreThoughts: (userId: string, lastLoadedDate: string) => Promise<{
    thoughts: ThoughtsByDate;
    hasMore: boolean;
    lastLoadedDate: string | null;
  }>;
  addThought: (userId: string, content: string, date: string, hidden?: boolean) => Promise<Record<string, unknown>>;
  updateThought: (userId: string, id: string, content: string) => Promise<void>;
  deleteThought: (userId: string, id: string) => Promise<void>;
  toggleThoughtHidden: (userId: string, id: string, currentHidden: boolean) => Promise<void>;
}

export const thoughtService: ThoughtService = {
  async loadInitialThoughts(userId: string) {
    console.log('Loading initial thoughts for user:', userId);
    
    try {
      // Get recent dates for pagination
      const { data: recentDates, error: dateError } = await supabase
        .from('thoughts')
        .select('date')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(100);
      
      if (dateError) {
        console.error('Date query error:', dateError);
        throw dateError;
      }
      
      if (recentDates.length === 0) {
        return {
          thoughts: {},
          hasMore: false,
          lastLoadedDate: null
        };
      }
      
      // Get unique dates, sorted descending
      const uniqueDates = [...new Set(recentDates.map(item => item.date))].sort((a, b) => b.localeCompare(a));
      
      // Load first batch of days
      const datesToLoad = uniqueDates.slice(0, PAGINATION.DAYS_PER_LOAD);
      
      if (datesToLoad.length === 0) {
        return {
          thoughts: {},
          hasMore: false,
          lastLoadedDate: null
        };
      }
      
      // Load thoughts for these dates
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', userId)
        .in('date', datesToLoad)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        thoughts: processThoughts(data),
        hasMore: uniqueDates.length > PAGINATION.DAYS_PER_LOAD,
        lastLoadedDate: datesToLoad[datesToLoad.length - 1]
      };
    } catch (error) {
      console.error('Load initial thoughts error:', error);
      throw new Error(ERROR_MESSAGES.LOAD_THOUGHTS_FAILED);
    }
  },

  async loadMoreThoughts(userId: string, lastLoadedDate: string) {
    try {
      // Get older dates
      const { data: olderDates, error: dateError } = await supabase
        .from('thoughts')
        .select('date')
        .eq('user_id', userId)
        .lt('date', lastLoadedDate)
        .order('date', { ascending: false })
        .limit(100);
      
      if (dateError) throw dateError;
      
      if (olderDates.length === 0) {
        return {
          thoughts: {},
          hasMore: false,
          lastLoadedDate: null
        };
      }
      
      // Get unique dates, sorted descending
      const uniqueDates = [...new Set(olderDates.map(item => item.date))].sort((a, b) => b.localeCompare(a));
      
      // Load next batch of days
      const datesToLoad = uniqueDates.slice(0, PAGINATION.DAYS_PER_LOAD);
      
      if (datesToLoad.length === 0) {
        return {
          thoughts: {},
          hasMore: false,
          lastLoadedDate: null
        };
      }
      
      // Load thoughts for these dates
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', userId)
        .in('date', datesToLoad)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data.length === 0) {
        return {
          thoughts: {},
          hasMore: false,
          lastLoadedDate: null
        };
      }
      
      return {
        thoughts: processThoughts(data),
        hasMore: uniqueDates.length >= PAGINATION.DAYS_PER_LOAD,
        lastLoadedDate: datesToLoad[datesToLoad.length - 1]
      };
    } catch (error) {
      console.error('Load more thoughts error:', error);
      throw new Error(ERROR_MESSAGES.LOAD_THOUGHTS_FAILED);
    }
  },

  async addThought(userId: string, content: string, date: string, hidden: boolean = false) {
    try {
      const newThought = {
        user_id: userId,
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
      
      return data;
    } catch (error) {
      console.error('Add thought error:', error);
      throw new Error(ERROR_MESSAGES.ADD_THOUGHT_FAILED);
    }
  },

  async updateThought(userId: string, id: string, content: string) {
    try {
      const { error } = await supabase
        .from('thoughts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Update thought error:', error);
      throw new Error(ERROR_MESSAGES.UPDATE_THOUGHT_FAILED);
    }
  },

  async deleteThought(userId: string, id: string) {
    try {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Delete thought error:', error);
      throw new Error(ERROR_MESSAGES.DELETE_THOUGHT_FAILED);
    }
  },

  async toggleThoughtHidden(userId: string, id: string, currentHidden: boolean) {
    try {
      const newHiddenState = !currentHidden;
      
      const { error } = await supabase
        .from('thoughts')
        .update({ hidden: newHiddenState, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Toggle thought hidden error:', error);
      throw new Error(ERROR_MESSAGES.TOGGLE_HIDDEN_FAILED);
    }
  }
};