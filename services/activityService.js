/**
 * ============================================================================
 * activityService.js - Activity/Workout Logging Service
 * ============================================================================
 * 
 * This file handles all activity and workout logging operations for the
 * FitPlay app using Firebase Firestore.
 * 
 * Features:
 * - Log new workouts/activities
 * - Retrieve user's activity history
 * - Get today's activities
 * - Calculate workout streaks
 * - Activity type definitions
 * - Intensity level calculations
 * 
 * Dependencies:
 * - Firebase Firestore
 * - config/firebaseConfig.js
 * 
 * Usage:
 *   Import functions: import { logActivity, getUserActivities } from '../services/activityService';
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Firebase Firestore functions
import { 
  collection,           // Reference to Firestore collection
  addDoc,              // Add new document
  query,               // Create Firestore query
  where,               // Query condition
  orderBy,             // Sort results
  limit,               // Limit results
  getDocs,             // Get multiple documents
  doc,                 // Reference to specific document
  updateDoc,           // Update document
  increment,            // Atomic increment
  serverTimestamp     // Server-side timestamp
} from 'firebase/firestore';

// Firebase configuration
import { db } from '../config/firebaseConfig';

// ============================================================================
// ACTIVITY TYPE DEFINITIONS
// ============================================================================

/**
 * ACTIVITY_TYPES - Available activity types in the app
 * 
 * Each activity type has:
 * - id: Unique identifier for storage
 * - name: Display name
 * - icon: Emoji icon for UI
 */
export const ACTIVITY_TYPES = [
  { id: 'running', name: 'Running', icon: '🏃' },
  { id: 'walking', name: 'Walking', icon: '🚶' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'strength', name: 'Strength Training', icon: '🏋️' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'cardio', name: 'Cardio', icon: '❤️' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'sports', name: 'Sports', icon: '⚽' }
];

// ============================================================================
// INTENSITY LEVEL DEFINITIONS
// ============================================================================

/**
 * INTENSITY_LEVELS - Available intensity levels
 * 
 * Each level affects calorie calculation:
 * - light: Base calories (multiplier: 1)
 * - medium: 1.5x calories
 * - high: 2x calories
 */
export const INTENSITY_LEVELS = [
  { id: 'light', name: 'Light', caloriesMultiplier: 1 },
  { id: 'medium', name: 'Medium', caloriesMultiplier: 1.5 },
  { id: 'high', name: 'High', caloriesMultiplier: 2 }
];

// ============================================================================
// ACTIVITY LOGGING FUNCTIONS
// ============================================================================

/**
 * logActivity - Log a new workout/activity
 * 
 * This function:
 * 1. Creates an activity record in Firestore
 * 2. Calculates calories burned based on duration and intensity
 * 3. Updates user stats (workout count, total minutes)
 * 
 * @param {string} userId - User's unique ID
 * @param {Object} activityData - Activity details
 * @param {string} activityData.type - Activity type (e.g., 'running')
 * @param {number} activityData.duration - Duration in minutes
 * @param {number} [activityData.distance] - Distance in km (optional)
 * @param {string} activityData.intensity - Intensity level ('light', 'medium', 'high')
 * @param {string} [activityData.notes] - Optional notes about the activity
 * @returns {Promise<Object>} Result object with success status and activity data
 * 
 * @example
 * const result = await logActivity('user123', {
 *   type: 'running',
 *   duration: 30,
 *   distance: 5,
 *   intensity: 'medium',
 *   notes: 'Great morning run!'
 * });
 */
export const logActivity = async (userId, activityData) => {
  try {
    // Extract activity data
    const { type, duration, distance, intensity, notes } = activityData;
    
    // -----------------------------------------------------------------------
    // Calculate calories burned
    // -----------------------------------------------------------------------
    // Formula: duration * 5 * intensity multiplier
    // Base rate: 5 calories per minute
    const intensityMultiplier = 
      INTENSITY_LEVELS.find(i => i.id === intensity)?.caloriesMultiplier || 1;
    const caloriesBurned = Math.round(duration * 5 * intensityMultiplier);

    // Create activity object
    const activity = {
      userId,                              // Link activity to user
      type,                                // Activity type
      duration,                           // Duration in minutes
      distance: distance || 0,            // Distance in km (default 0)
      intensity,                           // Intensity level
      caloriesBurned,                     // Calculated calories
      notes: notes || '',                 // Notes (default empty)
      createdAt: serverTimestamp()         // Server timestamp
    };

    // Save activity to Firestore 'activities' collection
    const docRef = await addDoc(collection(db, 'activities'), activity);

    // -----------------------------------------------------------------------
    // Update user stats
    // -----------------------------------------------------------------------
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      workoutCount: increment(1),          // Increment workout count by 1
      totalMinutes: increment(duration)   // Add duration to total minutes
    });

    // Return success with activity data (including new document ID)
    return { 
      success: true, 
      data: { 
        id: docRef.id, 
        ...activity 
      } 
    };
  } catch (error) {
    // Log error for debugging
    console.error('Error logging activity:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

// ============================================================================
// ACTIVITY RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * getUserActivities - Get activity history for a user
 * 
 * Retrieves all activities for a user, sorted by date (newest first).
 * Uses a simple query without complex indexing.
 * 
 * @param {string} userId - User's unique ID
 * @param {number} [limitCount=50] - Maximum number of activities to return
 * @returns {Promise<Object>} Result object with success status and activities array
 * 
 * @example
 * const result = await getUserActivities('user123', 20);
 * if (result.success) {
 *   console.log('Activities:', result.data);
 * }
 */
export const getUserActivities = async (userId, limitCount = 50) => {
  try {
    // Create query: get activities for user, limited to limitCount results
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),  // Filter by user
      limit(limitCount)                // Limit results
    );

    // Execute query
    const querySnapshot = await getDocs(q);
    const activities = [];
    
    // Convert Firestore documents to objects
    querySnapshot.forEach((doc) => {
      activities.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });

    // -----------------------------------------------------------------------
    // Sort by date in memory (newest first)
    // -----------------------------------------------------------------------
    activities.sort((a, b) => {
      // Handle null timestamps
      if (a.createdAt && b.createdAt) {
        // Convert Firestore timestamps to Date and compare
        return b.createdAt.toDate() - a.createdAt.toDate();
      }
      return 0;
    });

    // Return success with activities array
    return { 
      success: true, 
      data: activities 
    };
  } catch (error) {
    // Log error for debugging
    console.error('Error getting activities:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

/**
 * getTodayActivities - Get activities completed today
 * 
 * Retrieves all activities logged by the user today.
 * Useful for daily progress tracking.
 * 
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Result object with success status and today's activities
 * 
 * @example
 * const result = await getTodayActivities('user123');
 * if (result.success) {
 *   console.log("Today's workouts:", result.data.length);
 * }
 */
export const getTodayActivities = async (userId) => {
  try {
    // Get all user activities
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId)
    );

    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Get today's date with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activities = [];
    
    // Filter activities in memory to only include today's
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        const activityDate = data.createdAt.toDate();
        activityDate.setHours(0, 0, 0, 0);
        
        // Include if activity date is today or later
        if (activityDate.getTime() >= today.getTime()) {
          activities.push({ 
            id: doc.id, 
            ...data 
          });
        }
      }
    });

    // Return success with today's activities
    return { 
      success: true, 
      data: activities 
    };
  } catch (error) {
    // Log error for debugging
    console.error('Error getting today activities:', error);
    
    // Return error to caller
    return { success: false, error: error.message };
  }
};

// ============================================================================
// STREAK CALCULATION
// ============================================================================

/**
 * calculateStreak - Calculate user's workout streak
 * 
 * Calculates the number of consecutive days the user has completed
 * at least one workout. This is a key gamification metric.
 * 
 * @param {string} userId - User's unique ID
 * @returns {Promise<number>} Streak days (0 if no activities or no streak)
 * 
 * @example
 * const streak = await calculateStreak('user123');
 * console.log('Current streak:', streak, 'days');
 */
export const calculateStreak = async (userId) => {
  try {
    // Get all user activities
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId)
    );

    // Execute query
    const querySnapshot = await getDocs(q);
    const activities = [];
    
    // Convert Firestore documents to objects
    querySnapshot.forEach((doc) => {
      activities.push(doc.data());
    });

    // No activities = 0 streak
    if (activities.length === 0) return 0;

    // -----------------------------------------------------------------------
    // Group activities by date (using Set for unique dates)
    // -----------------------------------------------------------------------
    const activityDates = new Set();
    activities.forEach(activity => {
      if (activity.createdAt) {
        const date = activity.createdAt.toDate();
        date.setHours(0, 0, 0, 0);
        // Store as ISO string for easy comparison
        activityDates.add(date.toISOString());
      }
    });

    // -----------------------------------------------------------------------
    // Count consecutive days from today backwards
    // -----------------------------------------------------------------------
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Loop while current date has activities
    while (activityDates.has(currentDate.toISOString())) {
      streak++;
      // Go back one day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    // Log error for debugging
    console.error('Error calculating streak:', error);
    
    // Return 0 on error
    return 0;
  }
};

// ============================================================================
// ADDITIONAL HELPER FUNCTIONS
// ============================================================================

/**
 * getActivityById - Get a specific activity by ID
 * 
 * @param {string} activityId - Activity's unique ID
 * @returns {Promise<Object>} Result object with activity data
 */
export const getActivityById = async (activityId) => {
  try {
    const activityDoc = await getDoc(doc(db, 'activities', activityId));
    
    if (activityDoc.exists()) {
      return { 
        success: true, 
        data: { id: activityDoc.id, ...activityDoc.data() } 
      };
    }
    
    return { success: false, error: 'Activity not found' };
  } catch (error) {
    console.error('Error getting activity:', error);
    return { success: false, error: error.message };
  }
};

/**
 * deleteActivity - Delete an activity
 * 
 * Note: This does NOT revert the user's stats (workoutCount, totalMinutes).
 * You'll need to handle that separately if needed.
 * 
 * @param {string} activityId - Activity's unique ID
 * @returns {Promise<Object>} Result object with success status
 */
export const deleteActivity = async (activityId) => {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export constants and functions
export default {
  ACTIVITY_TYPES,
  INTENSITY_LEVELS,
  logActivity,
  getUserActivities,
  getTodayActivities,
  calculateStreak,
  getActivityById,
  deleteActivity,
};
