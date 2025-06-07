export interface Thought {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThoughtWithNumber extends Thought {
  number: number; // UI display number (not stored in DB)
}

export type DateString = string; // YYYY-MM-DD format

export interface ThoughtsByDate {
  [date: DateString]: ThoughtWithNumber[];
} 