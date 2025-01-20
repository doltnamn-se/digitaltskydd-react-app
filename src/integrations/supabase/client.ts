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
      storage: localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-client',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Add better error handling and logging for fetch failures
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    console.log('Fetch request:', {
      url: args[0],
      options: args[1]
    });
    const response = await originalFetch(...args);
    if (!response.ok) {
      console.error('Fetch response not OK:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Initialize Supabase client and verify connection
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error initializing Supabase client:', error);
    } else {
      console.log('Supabase client initialized successfully with URL:', SUPABASE_URL);
      if (data.session) {
        console.log('Active session found');
        // Test the profiles table access
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        
        if (profileError) {
          console.error('Error testing profiles access:', profileError);
        } else {
          console.log('Successfully tested profiles access');
        }
      } else {
        console.log('No active session');
      }
    }
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
})();