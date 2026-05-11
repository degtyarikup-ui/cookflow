import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if credentials are not provided so the app doesn't crash
const createMockClient = () => {
  console.warn("Supabase credentials missing. Running in local fallback mode.");
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => { throw new Error("Local mode active"); },
      signUp: async () => { throw new Error("Local mode active"); }
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({ eq: async () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ eq: async () => ({ data: null, error: null }) }) }),
      upsert: async () => ({ data: null, error: null })
    }),
    functions: {
      invoke: async () => { throw new Error("Local mode active"); }
    },
    isMock: true
  };
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();