// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDemoKey1234567890',
  authDomain: 'fitplay-app.firebaseapp.com',
  projectId: 'fitplay-demo',
  storageBucket: 'fitplay-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdefg123456',
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
