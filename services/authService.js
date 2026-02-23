/**
 * ============================================================================
 * authService.js - Firebase Authentication Service
 * ============================================================================
 * 
 * This file handles all authentication operations for the FitPlay app
 * using Firebase Authentication and Firestore.
 * 
 * Features:
 * - User registration with email/password
 * - User login
 * - User logout
 * - User profile creation and retrieval
 * - Authentication state observation
 * 
 * Dependencies:
 * - Firebase Authentication (Firebase Auth)
 * - Firebase Firestore (Firebase DB)
 * - config/firebaseConfig.js
 * 
 * Usage:
 *   Import functions: import { registerUser, loginUser } from '../services/authService';
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Firebase Authentication functions
import { 
  createUserWithEmailAndPassword,  // Create new user with email/password
  signInWithEmailAndPassword,       // Sign in existing user
  signOut,                         // Sign out current user
  onAuthStateChanged,              // Listen for auth state changes
  updateProfile                   // Update user display name
} from 'firebase/auth';

// Firebase Firestore functions
import { 
  doc,              // Reference to a document
  setDoc,          // Create/update document
  getDoc,          // Get single document
  serverTimestamp, // Server-side timestamp
  getDocs,         // Get multiple documents
  collection,      // Reference to collection
  query,           // Create query
  where            // Query condition
} from 'firebase/firestore';

// Firebase configuration
import { auth, db } from '../config/firebaseConfig';

// ============================================================================
// REGISTRATION FUNCTIONS
// ============================================================================

/**
 * registerUser - Register a new user with email and password
 * 
 * This function:
 * 1. Creates a new Firebase Auth user
 * 2. Updates their display name
 * 3. Creates a user profile in Firestore
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} Result object with success status and data/error
 * 
 * @example
 * const result = await registerUser('user@example.com', 'password123', 'John');
 * if (result.success) {
 *   console.log('User registered:', result.data.user.uid);
 * }
 */
export const registerUser = async (email, password, displayName) => {
  try {
    // -----------------------------------------------------------------------
    // Step 1: Create Firebase Auth user
    // -----------------------------------------------------------------------
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // -----------------------------------------------------------------------
    // Step 2: Update user profile with display name
    // -----------------------------------------------------------------------
    await updateProfile(user, { displayName });

    // -----------------------------------------------------------------------
    // Step 3: Create user profile in Firestore
    // -----------------------------------------------------------------------
    const userProfile = {
      uid: user.uid,                    // Unique user ID from Firebase Auth
      email: user.email,               // User's email
      displayName: displayName ||     // Display name or fallback to email prefix
                  email.split('@')[0],
      createdAt: serverTimestamp(),    // Server timestamp of account creation
      totalPoints: 0,                   // Initial gamification points
      workoutCount: 0,                // Total workouts completed
      badges: [],                      // Empty badges array
      streak: 0,                       // Current streak days
      totalMinutes: 0,                 // Total workout minutes
      level: 1,                         // Starting level
      profileImage: null,              // No profile image initially
      completedQuests: []              // Empty completed quests
    };

    // Save user profile to Firestore 'users' collection
    await setDoc(doc(db, 'users', user.uid), userProfile);

    // Return success with user and profile data
    return { 
      success: true, 
      data: { 
        user,           // Firebase user object
        profile: userProfile  // Created profile
      } 
    };
  } catch (error) {
    // Log error for debugging
    console.error('Registration error:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

// ============================================================================
// LOGIN FUNCTIONS
// ============================================================================

/**
 * loginUser - Authenticate an existing user
 * 
 * This function:
 * 1. Validates credentials with Firebase Auth
 * 2. Checks if user profile exists in Firestore
 * 3. Creates default profile if none exists
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Result object with success status and data/error
 * 
 * @example
 * const result = await loginUser('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('User logged in:', result.data.uid);
 * }
 */
export const loginUser = async (email, password) => {
  try {
    // -----------------------------------------------------------------------
    // Step 1: Authenticate with Firebase
    // -----------------------------------------------------------------------
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // -----------------------------------------------------------------------
    // Step 2: Check for existing Firestore profile
    // -----------------------------------------------------------------------
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    // -----------------------------------------------------------------------
    // Step 3: Create default profile if not found
    // -----------------------------------------------------------------------
    if (!userDoc.exists()) {
      // Create default profile for existing Auth user without Firestore profile
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 
                     email.split('@')[0],
        createdAt: serverTimestamp(),
        totalPoints: 0,
        workoutCount: 0,
        badges: [],
        streak: 0,
        totalMinutes: 0,
        level: 1,
        profileImage: null,
        completedQuests: []
      };
      
      // Save default profile to Firestore
      await setDoc(userRef, userProfile);
      
      // Return success with flag indicating profile was created
      return { 
        success: true, 
        data: user, 
        profileCreated: true 
      };
    }
    
    // Profile already exists - return success
    return { 
      success: true, 
      data: user, 
      profileCreated: false 
    };
  } catch (error) {
    // Log error for debugging
    console.error('Login error:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

// ============================================================================
// LOGOUT FUNCTIONS
// ============================================================================

/**
 * logoutUser - Sign out the current user
 * 
 * This function signs out the user from Firebase Authentication.
 * It does not modify any Firestore data.
 * 
 * @returns {Promise<Object>} Result object with success status and error (if any)
 * 
 * @example
 * const result = await logoutUser();
 * if (result.success) {
 *   console.log('User logged out');
 * }
 */
export const logoutUser = async () => {
  try {
    // Sign out from Firebase Auth
    await signOut(auth);
    
    // Return success
    return { success: true };
  } catch (error) {
    // Log error for debugging
    console.error('Logout error:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

// ============================================================================
// USER DATA FUNCTIONS
// ============================================================================

/**
 * getCurrentUser - Get the currently authenticated user
 * 
 * Returns the current user from Firebase Auth if signed in,
 * or null if no user is signed in.
 * 
 * @returns {Object|null} Firebase user object or null
 * 
 * @example
 * const user = getCurrentUser();
 * if (user) {
 *   console.log('Current user:', user.uid);
 * }
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * getUserProfile - Fetch user profile from Firestore
 * 
 * Retrieves the user profile document from the 'users' collection
 * using the user's unique ID.
 * 
 * @param {string} uid - User's unique ID
 * @returns {Promise<Object>} Result object with success status and profile data
 * 
 * @example
 * const result = await getUserProfile('user123');
 * if (result.success) {
 *   console.log('User points:', result.data.totalPoints);
 * }
 */
export const getUserProfile = async (uid) => {
  try {
    // Fetch document from Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    // Check if document exists
    if (userDoc.exists()) {
      return { 
        success: true, 
        data: userDoc.data() 
      };
    }
    
    // Document not found
    return { 
      success: false, 
      error: 'User profile not found' 
    };
  } catch (error) {
    // Log error for debugging
    console.error('Error getting user profile:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

// ============================================================================
// AUTH STATE OBSERVER
// ============================================================================

/**
 * authStateObserver - Listen for authentication state changes
 * 
 * This function sets up a listener that fires whenever the user's
 * authentication state changes (login, logout, token refresh, etc.).
 * 
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function to remove the listener
 * 
 * @example
 * const unsubscribe = authStateObserver((user) => {
 *   if (user) {
 *     console.log('User logged in:', user.uid);
 *   } else {
 *     console.log('User logged out');
 *   }
 * });
 * 
 * // Later, to stop listening:
 * unsubscribe();
 */
export const authStateObserver = (callback) => {
  // Set up Firebase Auth state listener
  return onAuthStateChanged(auth, callback);
};

// ============================================================================
// ADDITIONAL HELPER FUNCTIONS
// ============================================================================

/**
 * updateUserProfile - Update user profile in Firestore
 * 
 * Updates specific fields in the user's Firestore document.
 * 
 * @param {string} uid - User's unique ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object>} Result object with success status
 * 
 * @example
 * await updateUserProfile('user123', { totalPoints: 100 });
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * getAllUsers - Get all users from Firestore
 * 
 * Useful for admin features or leaderboards.
 * Note: Use with caution - can be slow with many users.
 * 
 * @returns {Promise<Object>} Result object with success status and users array
 */
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    
    return { success: true, data: users };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export all functions for use in other files
export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  authStateObserver,
  updateUserProfile,
  getAllUsers,
};
