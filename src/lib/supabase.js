import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fjwafcrcbnrnzqfrldsl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqd2FmY3JjYm5ybnpxZnJsZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDIyNTAsImV4cCI6MjA2ODIxODI1MH0.4Wnhb50fdn8zcSReXjwttAcy4Prd8mxx4qjajDxjbkI';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;