export interface Thought {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  hidden: boolean;
  created_at: string;
  updated_at: string;
} 