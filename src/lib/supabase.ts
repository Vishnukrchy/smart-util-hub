import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = "https://baihpabnxkijbltikygg.supabase.co"; // Updated URL with double 'g'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Function to test database connection
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key present:', !!supabaseAnonKey);
    
    // Test the connection
    const { data, error } = await supabase
      .from('rooms')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Unexpected error during database test:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
};

// Test connection on startup
testDatabaseConnection().then(success => {
  if (success) {
    console.log('Supabase connection is working properly');
  } else {
    console.error('Failed to connect to Supabase. Please check your configuration.');
  }
});
