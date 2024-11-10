// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


// import { useState, useEffect } from 'react'
// import { supabase } from '../../lib/supabase'
// import Auth from '../../components/Auth'
// import Account from '../../components/Account'
// import { View } from 'react-native'
// import { Session } from '@supabase/supabase-js'

// export default function Login() {
//   const [session, setSession] = useState<Session | null>(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, [])

//   return (
//     <View>
//       {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
//     </View>
//   )
// }

// export default function Login() {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);

//   const handleLogin = () => {
//     if (!email || !password) {
//       setError('Both email and password are required.');
//       return;
//     }
//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }
//     setError(null);
//     // Simulate login logic
//     alert(`Logging in with:\nEmail: ${email}\nPassword: ${password}`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       {error && <Text style={styles.error}>{error}</Text>}
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//   },
//   button: {
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
// });

// import { useState, useEffect } from 'react'
// import { supabase } from '../../lib/supabase'
// import Auth from '../../components/Auth'
// import Account from '../../components/Account'
// import { View } from 'react-native'
// import { Session } from '@supabase/supabase-js'

// export default function Login() {
//   const [session, setSession] = useState<Session | null>(null)

//   return (
//     <View>
//       {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
//     </View>
//   )
//}

import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import {router} from 'expo-router';


const supabase = createClient(
  'https://fwjbiqwejzeecsraqqsg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amJpcXdlanplZWNzcmFxcXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzgwOTMsImV4cCI6MjA0Njc1NDA5M30.ZW8tHCeuPbhYn7cMHMaVaAbMKa6Jvau2IXRS82ZM4v8'
);

export default function Login() {
  // const navigate = useNavigate();
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') { 
      const user = session?.user;

      if (user?.app_metadata?.provider === null) {
        console.log('New user signed up:', user);
        // Optional: navigate to a welcome or onboarding page
        router.push("/logged-in");
        // navigate("/");
      } else {
        console.log('User signed in:', user);
        router.push("/logged-in");
        // navigate("/");
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      // navigate("/login");
    }
  });

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="light"
      providers={[]}
      localization={{
        variables: {
          sign_up: {
            email_label: 'Email Address',
            password_label: 'Create a Password',
            button_label: 'Sign Up',
          },
          sign_in: {
            button_label: 'Sign In',
          },
        },
      }}
    />
  );
}
