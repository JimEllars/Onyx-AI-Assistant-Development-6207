import { createClient } from '@supabase/supabase-js';

// These are dummy values that will work for our demo
const SUPABASE_URL = 'https://dummy-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtaWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.dummy-token-for-demo';

// Create a Supabase client that won't actually make real API calls
const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Not found' } })
      }),
      limit: async () => ({ data: [], error: null })
    }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null })
  })
};

// Use the mock client to prevent actual API calls
const supabase = mockSupabase;

export default supabase;