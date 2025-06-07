-- Create the thoughts table
CREATE TABLE IF NOT EXISTS public.thoughts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own thoughts
CREATE POLICY "Users can only view their own thoughts" 
  ON public.thoughts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own thoughts
CREATE POLICY "Users can insert their own thoughts" 
  ON public.thoughts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own thoughts
CREATE POLICY "Users can update their own thoughts" 
  ON public.thoughts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own thoughts
CREATE POLICY "Users can delete their own thoughts" 
  ON public.thoughts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_thoughts_user_date 
  ON public.thoughts(user_id, date);

CREATE INDEX IF NOT EXISTS idx_thoughts_user_created 
  ON public.thoughts(user_id, created_at);

-- Add function to update updated_at on updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_thoughts_updated_at
BEFORE UPDATE ON public.thoughts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column(); 