// Supabase client for React Native mobile app
// Uses same configuration as web app

import { createClient } from '@supabase/supabase-js';

// Environment variables for React Native (via app.json or .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Check if environment variables are set
if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn('⚠️ EXPO_PUBLIC_SUPABASE_URL needs to be configured in app.json or .env');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
  console.warn('⚠️ EXPO_PUBLIC_SUPABASE_ANON_KEY needs to be configured in app.json or .env');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Export types for mobile app
export type { SupabaseClient } from '@supabase/supabase-js';

console.log('✅ Mobile Supabase client initialized');
