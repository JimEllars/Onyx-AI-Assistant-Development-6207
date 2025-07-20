-- Create action history table
CREATE TABLE IF NOT EXISTS action_history_ax7y2k (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_id UUID,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  result TEXT
);

-- Enable RLS
ALTER TABLE action_history_ax7y2k ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own action history" 
  ON action_history_ax7y2k 
  FOR SELECT 
  USING (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can insert their own action history" 
  ON action_history_ax7y2k 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can update their own action history" 
  ON action_history_ax7y2k 
  FOR UPDATE 
  USING (user_id = auth.uid() OR user_id = 'demo-user-id');

-- Create index for faster lookups
CREATE INDEX idx_action_history_user_id ON action_history_ax7y2k(user_id);
CREATE INDEX idx_action_history_action_id ON action_history_ax7y2k(action_id);
CREATE INDEX idx_action_history_status ON action_history_ax7y2k(status);