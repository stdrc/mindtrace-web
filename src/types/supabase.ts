export interface Thought {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      thoughts: {
        Row: Thought;
        Insert: Omit<Thought, 'id' | 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Thought, 'id'>>;
      };
    };
  };
} 