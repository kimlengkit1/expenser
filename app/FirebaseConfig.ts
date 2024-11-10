import { initializeApp } from '@react-native-firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyBHZFFgouc4GDxhqoantd-jI5OvkMTYPTs",
    authDomain: "expenser-3f0b3.firebaseapp.com",
    projectId: "expenser-3f0b3",
    storageBucket: "expenser-3f0b3.firebasestorage.app",
    messagingSenderId: "1072306644873",
    appId: "1:1072306644873:web:1d0a827f71c5064b3e2358",
    measurementId: "G-YH3EFM8SQ0"
  };
  
  // Initialize Firebase
  export const FIREBASE_APP = initializeApp(firebaseConfig);