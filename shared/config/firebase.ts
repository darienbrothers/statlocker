import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkFOcjU04aONSbQWUu_KRtXLrLOxmBU5E",
  authDomain: "the-statlocker.firebaseapp.com",
  databaseURL: "https://the-statlocker-default-rtdb.firebaseio.com",
  projectId: "the-statlocker",
  storageBucket: "the-statlocker.firebasestorage.app",
  messagingSenderId: "454030243479",
  appId: "1:454030243479:web:695cd340d53344486c1bd2",
  measurementId: "G-MB9QT3WPZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth - Firebase v9+ handles persistence automatically in React Native
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
