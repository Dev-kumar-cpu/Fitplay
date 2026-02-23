/**
 * ============================================================================
 * AppContext.js - Global Application State Management
 * ============================================================================
 * 
 * This file provides the global application context for the FitPlay app.
 * It manages user authentication state, user profile data, and loading states
 * throughout the application. This context is used by all child components
 * to access shared application state.
 * 
 * Features:
 * - User authentication state management
 * - User profile data fetching and caching
 * - Automatic auth state listening
 * - Default profile creation for new users
 * 
 * Dependencies:
 * - React Context API
 * - authService for Firebase authentication
 * 
 * Usage:
 *   Import useApp hook: import { useApp } from '../context/AppContext';
 *   Access user: const { user, userProfile, isLoggedIn } = useApp();
 */

// ============================================================================
// IMPORTS
// ============================================================================

// React hooks for context creation and state management
import React, { createContext, useState, useEffect } from 'react';

// Firebase authentication and Firestore service functions
import { 
  getCurrentUser,           // Get currently authenticated user
  getUserProfile,           // Fetch user profile from Firestore
  authStateObserver         // Listen for authentication state changes
} from '../services/authService';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * AppContext - Creates a React Context for global app state
 * This context provides authentication and user profile data to all child components
 */
export const AppContext = createContext();

/**
 * AppProvider - Main provider component that wraps the application
 * 
 * This component:
 * - Manages user authentication state
 * - Fetches and caches user profile data
 * - Listens for auth state changes (login/logout)
 * - Creates default profiles for new users
 * 
 * @param {React.ReactNode} children - Child components that will have access to context
 * @returns {JSX.Element} Provider component with context value
 */
export const AppProvider = ({ children }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  
  /**
   * user - Current authenticated Firebase user object
   * null if no user is logged in
   */
  const [user, setUser] = useState(null);
  
  /**
   * userProfile - User's profile data from Firestore
   * Contains points, badges, streak, level, workoutCount, etc.
   */
  const [userProfile, setUserProfile] = useState(null);
  
  /**
   * loading - Initial loading state
   * true while checking for existing user session
   * Used to show splash/loading screen
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * isLoggedIn - Boolean indicating if user is authenticated
   * Derived from user state, used for navigation decisions
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ============================================================================
  // USER PROFILE FUNCTIONS
  // ============================================================================

  /**
   * loadUserProfile - Fetches user profile from Firestore or creates default
   * 
   * This function:
   * 1. Sets the Firebase user object in state
   * 2. Attempts to fetch profile from Firestore
   * 3. Creates default profile if none exists
   * 
   * @param {Object} firebaseUser - Firebase user object from authentication
   * @returns {Promise<void>}
   */
  const loadUserProfile = async (firebaseUser) => {
    try {
      // Set Firebase user and logged in status
      setUser(firebaseUser);
      setIsLoggedIn(true);
      
      // Attempt to fetch user profile from Firestore
      const profile = await getUserProfile(firebaseUser.uid);
      
      if (profile.success) {
        // Profile found - use it
        setUserProfile(profile.data);
      } else {
        // Profile not found - create default profile for new user
        // This handles the case where user exists in Auth but not in Firestore
        setUserProfile({
          uid: firebaseUser.uid,                    // Unique user ID
          email: firebaseUser.email,               // User's email
          displayName: firebaseUser.displayName ||  // Display name or fallback to email prefix
                     firebaseUser.email.split('@')[0],
          totalPoints: 0,                           // Starting points (gamification)
          workoutCount: 0,                          // Total workouts completed
          badges: [],                               // Empty badges array
          streak: 0,                               // Current streak days
          totalMinutes: 0,                          // Total workout minutes
          level: 1,                                 // Starting level (1-5)
          profileImage: null                       // No profile image initially
        });
      }
    } catch (error) {
      // Log any errors during profile loading
      console.error('Error loading profile:', error);
    } finally {
      // Always set loading to false when done (success or error)
      setLoading(false);
    }
  };

  // ============================================================================
  // AUTHENTICATION INITIALIZATION
  // ============================================================================

  /**
   * useEffect - Initial user check on app start
   * 
   * Runs once on component mount to:
   * 1. Check if user is already logged in
   * 2. Load user profile if logged in
   * 3. Set loading to false when done
   */
  useEffect(() => {
    /**
     * checkUser - Async function to check current user session
     * Determines if user has active Firebase auth session
     */
    const checkUser = async () => {
      try {
        // Get current authenticated user (null if not logged in)
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          // User is logged in - load their profile
          await loadUserProfile(currentUser);
        } else {
          // No user logged in - just stop loading
          setLoading(false);
        }
      } catch (error) {
        // Handle errors in user check
        console.error('Error checking user:', error);
        setLoading(false);
      }
    };

    // Execute the user check
    checkUser();

    // ---------------------------------------------------------------------
    // AUTH STATE OBSERVER - Listen for login/logout events
    // ---------------------------------------------------------------------
    /**
     * unsubscribe - Cleanup function to remove auth listener
     * Called when component unmounts to prevent memory leaks
     */
    const unsubscribe = authStateObserver((firebaseUser) => {
      if (firebaseUser) {
        // User logged in - load their profile
        loadUserProfile(firebaseUser);
      } else {
        // User logged out - reset all state
        setUser(null);
        setUserProfile(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    // Cleanup: unsubscribe from auth listener on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array = run once on mount

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  /**
   * value - Context value object provided to all child components
   * Contains all state and setter functions
   */
  const value = {
    user,                  // Firebase user object
    userProfile,           // Firestore user profile data
    loading,               // Initial loading state
    isLoggedIn,            // Authentication status
    setUser,               // Function to manually set user
    setUserProfile,       // Function to manually set profile
    setIsLoggedIn,        // Function to manually set login status
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  /**
   * AppContext.Provider - Wraps child components with context value
   * All children can now access the context value via useApp hook
   */
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * useApp - Custom hook to access AppContext in functional components
 * 
 * This hook provides easy access to the global app state without needing
 * to import createContext and useContext separately.
 * 
 * @returns {Object} Context value containing user, profile, and state functions
 * @throws {Error} If used outside of AppProvider wrapper
 * 
 * @example
 * // Inside a component:
 * const { user, userProfile, isLoggedIn } = useApp();
 */
export const useApp = () => {
  // Use React's useContext to get the context value
  const context = React.useContext(AppContext);
  
  // Throw error if hook is used outside of AppProvider
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  
  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export context for advanced use cases (consumers, etc.)
export default AppContext;
