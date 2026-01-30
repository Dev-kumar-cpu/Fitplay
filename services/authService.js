// User Authentication Service
import { auth, db } from '../config/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const getCurrentUser = async () => {
  try {
    if (!auth) return null;
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user || null);
      });
    });
  } catch (error) {
    console.warn('Auth service warning:', error);
    return null;
  }
};
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date(),
      totalPoints: 0,
      workoutCount: 0,
      badges: [],
      streak: 0,
      totalMinutes: 0,
      profileImage: null,
    });

    return {
      success: true,
      user: user,
      uid: user.uid,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      uid: userCredential.user.uid,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Current User
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({ uid: user.uid, email: user.email });
      } else {
        resolve(null);
      }
    }, reject);
  });
};

// Get User Profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
