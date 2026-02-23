/**
 * ============================================================================
 * workoutService.js - Custom Workout Management Service
 * ============================================================================
 * 
 * This file handles all custom workout operations for the FitPlay app,
 * including CRUD operations and workout templates.
 * 
 * Features:
 * - Create custom workouts
 * - Retrieve user's workouts
 * - Update existing workouts
 * - Delete workouts
 * - Pre-built workout templates
 * - Save templates as custom workouts
 * 
 * Dependencies:
 * - Firebase Firestore
 * - config/firebaseConfig.js
 * 
 * Usage:
 *   Import: import { createWorkout, getUserWorkouts } from '../services/workoutService';
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Firebase Firestore functions
import { 
  collection,           // Reference to Firestore collection
  doc,                 // Reference to specific document
  addDoc,              // Add new document
  updateDoc,          // Update document
  deleteDoc,          // Delete document
  getDoc,             // Get single document
  getDocs,            // Get multiple documents
  query,              // Create query
  where,              // Query condition
  serverTimestamp     // Server-side timestamp
} from 'firebase/firestore';

// Firebase configuration
import { db } from '../config/firebaseConfig';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * WORKOUTS_COLLECTION - Firestore collection name for workouts
 */
const WORKOUTS_COLLECTION = 'workouts';

// ============================================================================
// WORKOUT TEMPLATES
// ============================================================================

/**
 * workoutTemplates - Pre-built workout templates
 * 
 * These are ready-to-use workouts that users can start with or save
 * as their own custom workouts. Each template includes:
 * - id: Unique identifier
 * - name: Workout name
 * - description: Description of the workout
 * - exercises: Array of exercises with duration/reps
 * - totalDuration: Total workout time in minutes
 * - category: Workout category (cardio, strength, yoga, hiit)
 * - difficulty: Difficulty level (beginner, intermediate, advanced)
 */
export const workoutTemplates = [
  {
    id: 'template_1',
    name: 'Quick Morning Workout',
    description: 'A quick 15-minute workout to start your day',
    exercises: [
      { name: 'Jumping Jacks', duration: 60, reps: null },
      { name: 'High Knees', duration: 45, reps: null },
      { name: 'Burpees', duration: 30, reps: 10 },
      { name: 'Mountain Climbers', duration: 45, reps: null },
      { name: 'Jump Squats', duration: 30, reps: 15 },
    ],
    totalDuration: 15,
    category: 'cardio',
    difficulty: 'beginner',
  },
  {
    id: 'template_2',
    name: 'Full Body Strength',
    description: '45-minute full body strength training',
    exercises: [
      { name: 'Push-ups', duration: null, reps: 15 },
      { name: 'Squats', duration: null, reps: 20 },
      { name: 'Lunges', duration: null, reps: 12 },
      { name: 'Plank', duration: 60, reps: null },
      { name: 'Dumbbell Rows', duration: null, reps: 12 },
      { name: 'Shoulder Press', duration: null, reps: 10 },
      { name: 'Bicep Curls', duration: null, reps: 12 },
      { name: 'Deadlifts', duration: null, reps: 10 },
    ],
    totalDuration: 45,
    category: 'strength',
    difficulty: 'intermediate',
  },
  {
    id: 'template_3',
    name: 'Yoga Flow',
    description: '30-minute yoga session for flexibility',
    exercises: [
      { name: 'Sun Salutation', duration: 300, reps: null },
      { name: 'Downward Dog', duration: 60, reps: null },
      { name: 'Warrior Pose', duration: 60, reps: null },
      { name: 'Tree Pose', duration: 60, reps: null },
      { name: 'Child\'s Pose', duration: 120, reps: null },
      { name: 'Cobra Stretch', duration: 60, reps: null },
      { name: 'Cat-Cow', duration: 60, reps: null },
      { name: 'Corpse Pose', duration: 300, reps: null },
    ],
    totalDuration: 30,
    category: 'yoga',
    difficulty: 'beginner',
  },
  {
    id: 'template_4',
    name: 'HIIT Cardio',
    description: '20-minute high intensity interval training',
    exercises: [
      { name: 'Warm-up Jog', duration: 120, reps: null },
      { name: 'Sprint', duration: 30, reps: null },
      { name: 'Rest', duration: 30, reps: null },
      { name: 'Sprint', duration: 30, reps: null },
      { name: 'Rest', duration: 30, reps: null },
      { name: 'Burpees', duration: 30, reps: null },
      { name: 'Rest', duration: 30, reps: null },
      { name: 'Jump Squats', duration: 30, reps: null },
      { name: 'Rest', duration: 30, reps: null },
      { name: 'Mountain Climbers', duration: 30, reps: null },
      { name: 'Cool Down Walk', duration: 180, reps: null },
    ],
    totalDuration: 20,
    category: 'hiit',
    difficulty: 'advanced',
  },
  {
    id: 'template_5',
    name: 'Core Strength',
    description: '15-minute core focused workout',
    exercises: [
      { name: 'Plank', duration: 60, reps: null },
      { name: 'Crunches', duration: null, reps: 20 },
      { name: 'Russian Twists', duration: null, reps: 20 },
      { name: 'Leg Raises', duration: null, reps: 15 },
      { name: 'Bicycle Crunches', duration: null, reps: 20 },
      { name: 'Mountain Climbers', duration: 45, reps: null },
      { name: 'Dead Bug', duration: null, reps: 12 },
      { name: 'Side Plank', duration: 30, reps: null },
    ],
    totalDuration: 15,
    category: 'strength',
    difficulty: 'intermediate',
  },
];

// ============================================================================
// CREATE FUNCTIONS
// ============================================================================

/**
 * createWorkout - Create a new custom workout
 * 
 * @param {string} userId - User's unique ID
 * @param {Object} workoutData - Workout details
 * @param {string} workoutData.name - Workout name (required)
 * @param {string} [workoutData.description] - Workout description
 * @param {Array} [workoutData.exercises] - Array of exercises
 * @param {string} [workoutData.category] - Workout category
 * @param {string} [workoutData.difficulty] - Difficulty level
 * @param {number} [workoutData.totalDuration] - Total duration in minutes
 * @returns {Promise<Object>} Result with success status and workout data
 * 
 * @example
 * const result = await createWorkout('user123', {
 *   name: 'My Workout',
 *   description: 'Custom workout',
 *   exercises: [{ name: 'Push-ups', reps: 10 }],
 *   category: 'strength',
 *   difficulty: 'beginner',
 *   totalDuration: 20
 * });
 */
export const createWorkout = async (userId, workoutData) => {
  try {
    // Build workout object
    const workout = {
      userId,                                    // Link to user
      name: workoutData.name,                   // Required: workout name
      description: workoutData.description || '', // Optional description
      exercises: workoutData.exercises || [],   // Exercise array
      category: workoutData.category || 'custom', // Category or 'custom'
      difficulty: workoutData.difficulty || 'beginner', // Difficulty level
      totalDuration: workoutData.totalDuration || 0, // Total minutes
      isTemplate: false,                         // Mark as custom workout
      createdAt: serverTimestamp(),             // Creation timestamp
      updatedAt: serverTimestamp(),             // Update timestamp
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), workout);
    
    // Return success with workout data including new ID
    return { 
      success: true, 
      data: { 
        id: docRef.id, 
        ...workout 
      } 
    };
  } catch (error) {
    console.error('Error creating workout:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// READ FUNCTIONS
// ============================================================================

/**
 * getUserWorkouts - Get all custom workouts for a user
 * 
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Result with workouts array
 * 
 * @example
 * const result = await getUserWorkouts('user123');
 * if (result.success) {
 *   console.log('Workouts:', result.data);
 * }
 */
export const getUserWorkouts = async (userId) => {
  try {
    // Query: get all workouts for this user
    const q = query(
      collection(db, WORKOUTS_COLLECTION), 
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const workouts = [];
    
    // Convert Firestore documents to objects
    querySnapshot.forEach((doc) => {
      workouts.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });

    return { success: true, data: workouts };
  } catch (error) {
    console.error('Error getting user workouts:', error);
    return { success: false, error: error.message };
  }
};

/**
 * getWorkoutById - Get a specific workout by ID
 * 
 * @param {string} workoutId - Workout's unique ID
 * @returns {Promise<Object>} Result with workout data
 * 
 * @example
 * const result = await getWorkoutById('workout123');
 * if (result.success) {
 *   console.log('Workout:', result.data.name);
 * }
 */
export const getWorkoutById = async (workoutId) => {
  try {
    const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { 
          id: docSnap.id, 
          ...docSnap.data() 
        } 
      };
    }
    
    // Workout not found
    return { success: false, error: 'Workout not found' };
  } catch (error) {
    console.error('Error getting workout:', error);
    return { success: false, error: error.message };
  }
};

/**
 * getExercisesForWorkout - Get exercises for a specific workout
 * 
 * @param {string} workoutId - Workout's unique ID
 * @returns {Promise<Object>} Result with exercises array
 * 
 * @example
 * const result = await getExercisesForWorkout('workout123');
 * if (result.success) {
 *   console.log('Exercises:', result.data);
 * }
 */
export const getExercisesForWorkout = async (workoutId) => {
  try {
    const result = await getWorkoutById(workoutId);
    
    if (result.success) {
      return { 
        success: true, 
        data: result.data.exercises || [] 
      };
    }
    
    return { success: false, error: 'Workout not found' };
  } catch (error) {
    console.error('Error getting exercises:', error);
    return { success: false, error: error.message };
  }
};

/**
 * getWorkoutTemplates - Get all available workout templates
 * 
 * @returns {Object} Result with templates array
 * 
 * @example
 * const result = getWorkoutTemplates();
 * console.log('Templates:', result.data);
 */
export const getWorkoutTemplates = () => {
  return { success: true, data: workoutTemplates };
};

// ============================================================================
// UPDATE FUNCTIONS
// ============================================================================

/**
 * updateWorkout - Update an existing workout
 * 
 * @param {string} workoutId - Workout's unique ID
 * @param {Object} workoutData - Fields to update
 * @returns {Promise<Object>} Result with success status
 * 
 * @example
 * const result = await updateWorkout('workout123', {
 *   name: 'Updated Name',
 *   description: 'Updated description'
 * });
 */
export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
    
    // Update with new data and updated timestamp
    await updateDoc(docRef, {
      ...workoutData,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating workout:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// DELETE FUNCTIONS
// ============================================================================

/**
 * deleteWorkout - Delete a workout
 * 
 * @param {string} workoutId - Workout's unique ID
 * @returns {Promise<Object>} Result with success status
 * 
 * @example
 * const result = await deleteWorkout('workout123');
 * if (result.success) {
 *   console.log('Workout deleted');
 * }
 */
export const deleteWorkout = async (workoutId) => {
  try {
    const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting workout:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// TEMPLATE FUNCTIONS
// ============================================================================

/**
 * saveTemplateAsWorkout - Save a template as user's custom workout
 * 
 * Copies a pre-built template to the user's custom workouts.
 * 
 * @param {string} userId - User's unique ID
 * @param {Object} template - Template object to save
 * @returns {Promise<Object>} Result with new workout data
 * 
 * @example
 * const result = await saveTemplateAsWorkout('user123', template);
 */
export const saveTemplateAsWorkout = async (userId, template) => {
  try {
    // Build workout from template
    const workout = {
      userId,
      name: template.name,
      description: template.description,
      exercises: template.exercises,
      category: template.category,
      difficulty: template.difficulty,
      totalDuration: template.totalDuration,
      isTemplate: true,                   // Mark as saved from template
      templateId: template.id,            // Reference to original template
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), workout);
    
    return { 
      success: true, 
      data: { 
        id: docRef.id, 
        ...workout 
      } 
    };
  } catch (error) {
    console.error('Error saving template:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export all constants and functions
export default {
  workoutTemplates,
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  saveTemplateAsWorkout,
  getWorkoutTemplates,
  getExercisesForWorkout,
};
