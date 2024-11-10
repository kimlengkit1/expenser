import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView ,Image, TouchableOpacity} from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import {router} from 'expo-router';


const firebaseConfig = {
    apiKey: "AIzaSyBHZFFgouc4GDxhqoantd-jI5OvkMTYPTs",
    authDomain: "expenser-3f0b3.firebaseapp.com",
    projectId: "expenser-3f0b3",
    storageBucket: "expenser-3f0b3.firebasestorage.app",
    messagingSenderId: "1072306644873",
    appId: "1:1072306644873:web:1d0a827f71c5064b3e2358",
    measurementId: "G-YH3EFM8SQ0"
  };

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
    return (
      <View style={styles.authContainer}>
      <View>
      <Image
        source={require('@/assets/images/expenserlogo.png')}
        style={styles.Logo}
      />
      </View>
       

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#4f4e4e"  // Set placeholder color here
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#4f4e4e"  // Set placeholder color here
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAuthentication} style={styles.authButton}>
          <Text style={styles.authButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
    );
  }
  
  
  const AuthenticatedScreen = ({ user, handleAuthentication }) => {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.emailText}>{user.email}</Text>
        <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
      </View>
    );
  };
  export default App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null); // Track user authentication state
    const [isLogin, setIsLogin] = useState(true);
  
    const auth = getAuth(app);
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          router.push('/');
        } else {
          setUser(null);
        }
      });
  
      return () => unsubscribe();
    }, [auth]);
  
    
    const handleAuthentication = async () => {
      try {
        if (user) {
          // If user is already authenticated, log out
          console.log('User logged out successfully!');
          await signOut(auth);
          setUser(null);
          router.replace('/login');
        } else {
          // Sign in or sign up
          if (isLogin) {
            // Sign in
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in successfully!');
            router.push('/');
          } else {
            // Sign up
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully!');
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Authentication error:', error.message);
      }
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          // Show user's email if user is authenticated
          <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
        ) : (
          // Show sign-in or sign-up form if user is not authenticated
          <AuthScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleAuthentication={handleAuthentication}
          />
        )}
      </ScrollView>
    );
  }
  const styles = StyleSheet.create({
   logoutButton: {
    backgroundColor: '#b84b4b',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
    authButton: {
      backgroundColor: '#6dba65', // Green color
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    authButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#121212',
    },
    authContainer: {
      width: '80%',
      maxWidth: 400,
      backgroundColor: '#1E1E1E',
      padding: 16,
      borderRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: 'center',
      color: 'white'
    },
    input: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 16,
      padding: 8,
      borderRadius: 4,
      color: 'white'
    },
    buttonContainer: {
      marginBottom: 16,
      backgroundcolor: 'white'
    },
    toggleText: {
      color: '#3498db',
      textAlign: 'center',
    },
    bottomContainer: {
      marginTop: 20,
    },
    emailText: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
      color: 'white',
    },
    Logo: {
      width: 125,
      height: 100,
      alignSelf: 'center',
      marginBottom: 16,
  },
  });