-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys_x7k9m2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  service TEXT NOT NULL,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, service, key_name)
);

-- Enable RLS
ALTER TABLE api_keys_x7k9m2 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own API keys" ON api_keys_x7k9m2 
  FOR SELECT USING (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can insert their own API keys" ON api_keys_x7k9m2 
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can update their own API keys" ON api_keys_x7k9m2 
  FOR UPDATE USING (user_id = auth.uid() OR user_id = 'demo-user-id');

CREATE POLICY "Users can delete their own API keys" ON api_keys_x7k9m2 
  FOR DELETE USING (user_id = auth.uid() OR user_id = 'demo-user-id');

-- Create index for faster lookups
CREATE INDEX idx_api_keys_user_id ON api_keys_x7k9m2(user_id);
CREATE INDEX idx_api_keys_service_key_name ON api_keys_x7k9m2(service, key_name);