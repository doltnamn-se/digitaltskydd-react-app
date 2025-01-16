import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://upfapfohwnkiugvebujh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZmFwZm9od25raXVndmVidWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4OTk1MjEsImV4cCI6MjA1MjQ3NTUyMX0.bph8bum09_ZYifznCYeksXeTsPQnn3m1TdWhbwfcvA0";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'supabase.auth.token',
      storage: window.localStorage,
      autoRefreshToken: true,
    }
  }
);