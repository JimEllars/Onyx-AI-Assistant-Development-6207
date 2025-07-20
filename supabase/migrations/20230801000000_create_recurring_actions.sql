-- Create recurring actions table
CREATE TABLE IF NOT EXISTS recurring_actions_ax7y2k (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rrule TEXT NOT NULL,
  next_run TIMESTAMP WITH TIME ZONE NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE recurring_actions_ax7y2k ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own recurring actions" 
  ON recurring_actions_ax7y2k 
  FOR SELECT 
  USING (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can insert their own recurring actions" 
  ON recurring_actions_ax7y2k 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can update their own recurring actions" 
  ON recurring_actions_ax7y2k 
  FOR UPDATE 
  USING (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can delete their own recurring actions" 
  ON recurring_actions_ax7y2k 
  FOR DELETE 
  USING (user_id = auth.uid() OR user_id = 'demo-user-id');

-- Create index for faster lookups
CREATE INDEX idx_recurring_actions_next_run ON recurring_actions_ax7y2k(next_run);
CREATE INDEX idx_recurring_actions_user_id ON recurring_actions_ax7y2k(user_id);