import type { Thought } from './supabase';

export type { Thought };

export interface ThoughtWithNumber extends Thought {
  number: number; // UI display number (not stored in DB)
}

export type DateString = string; // YYYY-MM-DD format

export interface ThoughtsByDate {
  [date: DateString]: ThoughtWithNumber[];
} 