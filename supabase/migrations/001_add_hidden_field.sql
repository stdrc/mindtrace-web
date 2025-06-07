-- Migration 001: Add hidden field to thoughts table
-- Date: 2024-12-19
-- Description: Add boolean hidden field to support hiding thoughts from normal view

-- Add the hidden column with default value false and NOT NULL constraint
ALTER TABLE public.thoughts 
ADD COLUMN hidden BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance when filtering by hidden status
CREATE INDEX IF NOT EXISTS idx_thoughts_user_hidden 
  ON public.thoughts(user_id, hidden);

-- Add comment to document the field
COMMENT ON COLUMN public.thoughts.hidden IS 'Whether this thought is hidden from normal view. Default: false';

-- Rollback instructions (DO NOT RUN unless rolling back):
-- DROP INDEX IF EXISTS idx_thoughts_user_hidden;
-- ALTER TABLE public.thoughts DROP COLUMN IF EXISTS hidden; 