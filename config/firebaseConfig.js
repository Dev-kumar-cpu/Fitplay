// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHpyUkBjnOOA3r-5CrMnQartcLSpvnlT0",
  authDomain: "fit-play-5da58.firebaseapp.com",
  projectId: "fit-play-5da58",
  storageBucket: "fit-play-5da58.firebasestorage.app",
  messagingSenderId: "926966574991",
  appId: "1:926966574991:web:414c7517dbab1df42a65fa",
  measurementId: "G-YKR7EHS84F"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
  // Gracefully handle Firebase errors during development
}

export { app, auth, db };
export default app;
