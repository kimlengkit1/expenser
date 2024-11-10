import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import {router} from 'expo-router';
import { Session } from '@supabase/supabase-js';
// import { Session } from '@supabase/gotrue-js/src/lib/types';


const supabase = createClient(
  'https://fwjbiqwejzeecsraqqsg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amJpcXdlanplZWNzcmFxcXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzgwOTMsImV4cCI6MjA0Njc1NDA5M30.ZW8tHCeuPbhYn7cMHMaVaAbMKa6Jvau2IXRS82ZM4v8'
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    router.push("/logged-in");
  }
}