// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add your own Firebase configuration from your Firebase project console.
// This is the most important part!
const firebaseConfig = {
  apiKey: "AIzaSyBCMCg10qay0LtF_BaHNOkWClATDR4TDX4",
  authDomain: "vapedeliveryapp.firebaseapp.com",
  projectId: "vapedeliveryapp",
  storageBucket: "vapedeliveryapp.firebasestorage.app",
  messagingSenderId: "28662561974",
  appId: "1:28662561974:web:16a3b60369953bff49ba17",
  measurementId: "G-E3ZXQP0KGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services that your app will use
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

// Export the services so you can import them in other files
export { auth, db };
