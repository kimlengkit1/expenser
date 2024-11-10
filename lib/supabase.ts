import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fwjbiqwejzeecsraqqsg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amJpcXdlanplZWNzcmFxcXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzgwOTMsImV4cCI6MjA0Njc1NDA5M30.ZW8tHCeuPbhYn7cMHMaVaAbMKa6Jvau2IXRS82ZM4v8";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})