import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { router } from 'expo-router';

import SecureDBGateway from "../../lib/localDB.ts";

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

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <View>
        <Image source={require('@/assets/images/expenserlogo.png')} style={styles.Logo} />
      </View>
      <Text style={styles.title}>Account Information</Text>
      <Text style={styles.emailText}>Email: {user.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleAuthentication}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App = () => {
  const [user, setUser] = useState(null); // Track user authentication state

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const u = {
          uid: user.uid,
          email: user.email,
        };
        SecureDBGateway.save(u); // Save user info in local DB
        setUser(user);
      } else {
        setUser(null);
        router.push('/login'); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log('User logged out successfully!');
        SecureDBGateway.delete();
        await signOut(auth);
        setUser(null);
        router.replace('/login');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        <Text style={styles.loadingText}>Loading account information...</Text>
      )}
    </ScrollView>
  );
};

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
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
