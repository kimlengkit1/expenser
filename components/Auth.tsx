import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import {router} from 'expo-router';


// const supabase = createClient(
//   'https://fwjbiqwejzeecsraqqsg.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amJpcXdlanplZWNzcmFxcXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzgwOTMsImV4cCI6MjA0Njc1NDA5M30.ZW8tHCeuPbhYn7cMHMaVaAbMKa6Jvau2IXRS82ZM4v8'
// );

// export default function Login() {
//   // const navigate = useNavigate();
//   supabase.auth.onAuthStateChange(async (event, session) => {
//     if (event === 'SIGNED_IN') { 
//       const user = session?.user;

//       if (user?.app_metadata?.provider === null) {
//         console.log('New user signed up:', user);
//         // Optional: navigate to a welcome or onboarding page
//         router.push("/");
//         // navigate("/");
//       } else {
//         console.log('User signed in:', user);
//         router.push("/");
//         // navigate("/");
//       }
//     } else if (event === 'SIGNED_OUT') {
//       console.log('User signed out');
//       // navigate("/login");
//     }
//   });

//   return (
//     <Auth
//       supabaseClient={supabase}
//       appearance={{ theme: ThemeSupa }}
//       theme="light"
//       providers={[]}
//       localization={{
//         variables: {
//           sign_up: {
//             email_label: 'Email Address',
//             password_label: 'Create a Password',
//             button_label: 'Sign Up',
//           },
//           sign_in: {
//             button_label: 'Sign In',
//           },
//         },
//       }}
//     />
//   );
// }
