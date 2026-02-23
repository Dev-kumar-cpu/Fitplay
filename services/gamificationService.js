/**
 * ============================================================================
 * gamificationService.js - Gamification System Service
 * ============================================================================
 * 
 * This file handles all gamification features for the FitPlay app including:
 * - Daily quests and quest completion
 * - Achievement badges
 * - Points and leveling system
 * - Leaderboard rankings
 * 
 * The gamification system motivates users through:
 * - Points earned for completing activities and quests
 * - Levels (1-5) based on total points
 * - Badges for specific achievements
 * - Daily quests for ongoing engagement
 * - Leaderboards for social competition
 * 
 * Dependencies:
 * - Firebase Firestore
 * - config/firebaseConfig.js
 * 
 * Usage:
 *   Import: import { completeQuest, getLeaderboard, getLevel } from '../services/gamificationService';
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Firebase Firestore functions
import { 
  collection,           // Reference to Firestore collection
  doc,                 // Reference to specific document
  updateDoc,          // Update document
  increment,           // Atomic increment operation
  getDoc,             // Get single document
  setDoc,             // Create document
  serverTimestamp,    // Server-side timestamp
  query,              // Create query
  orderBy,            // Sort results
  limit,              // Limit results
  getDocs            // Get multiple documents
} from 'firebase/firestore';

// Firebase configuration
import { db } from '../config/firebaseConfig';

// ============================================================================
// QUEST DEFINITIONS
// ============================================================================

/**
 * DAILY_QUESTS - Available daily quests
 * 
 * Daily quests reset each day and provide bonus points for completing
 * specific workout goals. Each quest has:
 * - id: Unique identifier
 * - title: Quest display name
 * - description: What user needs to do
 * - points: Points awarded on completion
 * - duration: Required duration in minutes (null = any duration)
 * - activityType: Specific activity type required (null = any)
 * - icon: Emoji icon for UI
 */
export const DAILY_QUESTS = [
  {
    id: 1,
    title: 'Morning Jumpstart',
    description: 'Complete a 15-minute workout',
    points: 40,
    duration: 15,
    activityType: null,  // Any activity type
    icon: '🌅'
  },
  {
    id: 2,
    title: 'Cardio Champion',
    description: 'Complete 30 minutes of cardio',
    points: 60,
    duration: 30,
    activityType: 'cardio',  // Must be cardio activity
    icon: '💪'
  },
  {
    id: 3,
    title: 'Strength Seeker',
    description: 'Complete a 20-minute strength workout',
    points: 50,
    duration: 20,
    activityType: 'strength',  // Must be strength activity
    icon: '🏋️'
  },
  {
    id: 4,
    title: 'Zen Master',
    description: 'Complete a 25-minute yoga session',
    points: 45,
    duration: 25,
    activityType: 'yoga',  // Must be yoga activity
    icon: '🧘'
  },
  {
    id: 5,
    title: 'Endurance Elite',
    description: 'Complete 45 minutes of any activity',
    points: 75,
    duration: 45,
    activityType: null,  // Any activity type
    icon: '🏆'
  }
];

// ============================================================================
// BADGE DEFINITIONS
// ============================================================================

/**
 * BADGES - Achievement badges users can earn
 * 
 * Badges are awarded for completing specific milestones:
 * - id: Unique identifier
 * - name: Badge display name
 * - description: How to earn the badge
 * - icon: Emoji icon
 * - requirement: Number needed to earn
 * - type: Type of requirement ('workouts' or 'points')
 */
export const BADGES = [
  { id: 'beginner', name: 'Beginner', description: 'Complete your first workout', icon: '🌱', requirement: 1, type: 'workouts' },
  { id: 'consistent', name: 'Consistent', description: 'Complete 5 workouts', icon: '⭐', requirement: 5, type: 'workouts' },
  { id: 'dedicated', name: 'Dedicated', description: 'Complete 20 workouts', icon: '🔥', requirement: 20, type: 'workouts' },
  { id: 'warrior', name: 'Warrior', description: 'Complete 50 workouts', icon: '⚔️', requirement: 50, type: 'workouts' },
  { id: 'legendary', name: 'Legendary', description: 'Complete 100 workouts', icon: '👑', requirement: 100, type: 'workouts' },
  { id: 'point_master', name: 'Point Master', description: 'Earn 5000 points', icon: '💎', requirement: 5000, type: 'points' }
];

// ============================================================================
// LEVEL DEFINITIONS
// ============================================================================

/**
 * LEVELS - User level definitions with point thresholds
 * 
 * Users progress through levels by earning points:
 * - Level 1 (Beginner): 0-499 points
 * - Level 2 (Amateur): 500-1499 points
 * - Level 3 (Athlete): 1500-2999 points
 * - Level 4 (Champion): 3000-4999 points
 * - Level 5 (Legend): 5000+ points
 */
export const LEVELS = [
  { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 499 },
  { level: 2, name: 'Amateur', minPoints: 500, maxPoints: 1499 },
  { level: 3, name: 'Athlete', minPoints: 1500, maxPoints: 2999 },
  { level: 4, name: 'Champion', minPoints: 3000, maxPoints: 4999 },
  { level: 5, name: 'Legend', minPoints: 5000, maxPoints: Infinity }
];

// ============================================================================
// LEVEL HELPER FUNCTIONS
// ============================================================================

/**
 * getLevel - Get user's current level based on points
 * 
 * @param {number} points - User's total points
 * @returns {Object} Level object with level number, name, and point range
 * 
 * @example
 * const level = getLevel(1500);
 * // Returns: { level: 3, name: 'Athlete', minPoints: 1500, maxPoints: 2999 }
 */
export const getLevel = (points) => {
  // Iterate from highest level to lowest
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    // Return first level where user has enough points
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  // Default to first level if none match
  return LEVELS[0];
};

/**
 * getLevelProgress - Calculate progress to next level
 * 
 * @param {number} points - User's total points
 * @returns {Object} Progress info with current points, next level points, and percentage
 * 
 * @example
 * const progress = getLevelProgress(200);
 * // Returns: { current: 200, next: 500, progress: 40 }
 */
export const getLevelProgress = (points) => {
  const currentLevel = getLevel(points);
  const levelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  
  // Already at max level
  if (levelIndex === LEVELS.length - 1) {
    return { 
      current: points, 
      next: currentLevel.maxPoints, 
      progress: 100 
    };
  }
  
  // Calculate progress to next level
  const nextLevel = LEVELS[levelIndex + 1];
  const pointsInLevel = points - currentLevel.minPoints;
  const pointsNeeded = nextLevel.minPoints - currentLevel.minPoints;
  const progress = Math.round((pointsInLevel / pointsNeeded) * 100);
  
  return {
    current: points,
    next: nextLevel.minPoints,
    progress: Math.min(progress, 100)
  };
};

// ============================================================================
// QUEST FUNCTIONS
// ============================================================================

/**
 * getDailyQuests - Get all available daily quests
 * 
 * @returns {Array} Array of quest objects
 * 
 * @example
 * const quests = getDailyQuests();
 * // Returns: [{ id: 1, title: 'Morning Jumpstart', ... }, ...]
 */
export const getDailyQuests = () => {
  return DAILY_QUESTS;
};

/**
 * getQuestStatus - Get user's quest completion status
 * 
 * Checks which quests the user has completed today and their total points.
 * 
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Result with completed quest IDs and points
 * 
 * @example
 * const status = await getQuestStatus('user123');
 * // Returns: { success: true, data: { completedQuests: [1, 2], totalPointsEarned: 100 } }
 */
export const getQuestStatus = async (userId) => {
  try {
    // Get user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    // Check if user exists
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const completedQuests = userData.completedQuests || [];
    
    // Get today's date as string for comparison
    const today = new Date().toISOString().split('T')[0];
    
    // Filter to find today's completed quests
    const todayCompleted = completedQuests.filter(q => q.date === today);
    
    return { 
      success: true, 
      data: {
        completedQuests: todayCompleted.map(q => q.questId),  // Just quest IDs
        totalPointsEarned: userData.totalPoints || 0
      }
    };
  } catch (error) {
    console.error('Error getting quest status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * completeQuest - Mark a quest as completed and award points
 * 
 * This function:
 * 1. Validates the quest exists and isn't already completed today
 * 2. Adds quest to user's completed quests
 * 3. Awards points to user
 * 4. Checks for level ups
 * 5. Checks for new badges
 * 
 * @param {string} userId - User's unique ID
 * @param {number} questId - ID of quest to complete
 * @returns {Promise<Object>} Result with points earned, new level, and new badges
 * 
 * @example
 * const result = await completeQuest('user123', 1);
 * if (result.success) {
 *   console.log('Earned:', result.data.pointsEarned, 'points');
 * }
 */
export const completeQuest = async (userId, questId) => {
  try {
    // Find quest in definitions
    const quest = DAILY_QUESTS.find(q => q.id === questId);
    
    // Validate quest exists
    if (!quest) {
      return { success: false, error: 'Quest not found' };
    }

    // Get user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    // Validate user exists
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if quest already completed today
    const completedQuests = userData.completedQuests || [];
    const alreadyCompleted = completedQuests.some(
      q => q.questId === questId && q.date === today
    );
    
    // Prevent double completion
    if (alreadyCompleted) {
      return { success: false, error: 'Quest already completed today' };
    }

    // -----------------------------------------------------------------------
    // Add quest to completed quests
    // -----------------------------------------------------------------------
    const newCompletedQuests = [
      ...completedQuests,
      { questId, date: today, points: quest.points }
    ];

    // Calculate new total points
    const newTotalPoints = (userData.totalPoints || 0) + quest.points;
    
    // Check for level up
    const newLevel = getLevel(newTotalPoints);

    // -----------------------------------------------------------------------
    // Update user document
    // -----------------------------------------------------------------------
    await updateDoc(userRef, {
      totalPoints: newTotalPoints,
      level: newLevel.level,
      completedQuests: newCompletedQuests
    });

    // Check for new badges earned
    const newBadges = await checkAndAwardBadges(userId, userData, newTotalPoints);

    // Return success with details
    return { 
      success: true, 
      data: { 
        pointsEarned: quest.points,
        newLevel,
        newBadges
      }
    };
  } catch (error) {
    console.error('Error completing quest:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// BADGE FUNCTIONS
// ============================================================================

/**
 * checkAndAwardBadges - Check and award any newly earned badges
 * 
 * Compares user's stats against badge requirements and awards any
 * badges the user hasn't earned yet.
 * 
 * @param {string} userId - User's unique ID
 * @param {Object} userData - Current user data
 * @param {number} totalPoints - User's total points
 * @returns {Promise<Array>} Array of newly earned badges
 * 
 * @example
 * const newBadges = await checkAndAwardBadges('user123', userData, 1000);
 * // Returns: [{ id: 'consistent', name: 'Consistent', ... }]
 */
export const checkAndAwardBadges = async (userId, userData, totalPoints) => {
  // Get current badges (avoid mutation)
  const currentBadges = userData.badges || [];
  const newBadges = [];

  // Check each badge
  for (const badge of BADGES) {
    // Skip if already earned
    if (currentBadges.includes(badge.id)) continue;

    let earned = false;
    
    // Check based on badge type
    if (badge.type === 'workouts' && (userData.workoutCount || 0) >= badge.requirement) {
      earned = true;
    } else if (badge.type === 'points' && totalPoints >= badge.requirement) {
      earned = true;
    }

    // Award badge if earned
    if (earned) {
      newBadges.push(badge);
      currentBadges.push(badge.id);
    }
  }

  // Update user's badges if any new ones earned
  if (newBadges.length > 0) {
    await updateDoc(doc(db, 'users', userId), {
      badges: currentBadges
    });
  }

  return newBadges;
};

// ============================================================================
// LEADERBOARD FUNCTIONS
// ============================================================================

/**
 * getLeaderboard - Get top users by points
 * 
 * Retrieves all users sorted by total points (highest first).
 * 
 * @param {number} [limitCount=50] - Maximum number of users to return
 * @returns {Promise<Object>} Result with leaderboard array
 * 
 * @example
 * const result = await getLeaderboard(10);
 * if (result.success) {
 *   console.log('Top user:', result.data[0].displayName);
 * }
 */
export const getLeaderboard = async (limitCount = 50) => {
  try {
    // Get all users from Firestore
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    
    // Convert to user objects with relevant fields
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        displayName: data.displayName || 'Unknown',
        totalPoints: data.totalPoints || 0,
        workoutCount: data.workoutCount || 0,
        level: data.level || 1,
        profileImage: data.profileImage || null
      });
    });

    // Sort by points descending
    users.sort((a, b) => b.totalPoints - a.totalPoints);

    // Add rank and limit results
    const leaderboard = users.slice(0, limitCount).map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return { success: true, data: leaderboard };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * getUserRank - Get a specific user's rank on leaderboard
 * 
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} Result with user's rank (null if not found)
 * 
 * @example
 * const result = await getUserRank('user123');
 * if (result.success && result.data) {
 *   console.log('Your rank:', result.data);
 * }
 */
export const getUserRank = async (userId) => {
  try {
    // Get top 100 users
    const leaderboardResult = await getLeaderboard(100);
    if (!leaderboardResult.success) {
      return leaderboardResult;
    }

    // Find user's position
    const userEntry = leaderboardResult.data.find(u => u.uid === userId);
    
    if (userEntry) {
      return { success: true, data: userEntry.rank };
    }

    // User not in top 100
    return { success: true, data: null };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// POINTS FUNCTIONS
// ============================================================================

/**
 * awardActivityPoints - Award points for completing an activity
 * 
 * Awards 1 point per minute of activity, plus checks for level ups
 * and new badges.
 * 
 * @param {string} userId - User's unique ID
 * @param {number} duration - Activity duration in minutes
 * @returns {Promise<Object>} Result with points earned, new level, and badges
 * 
 * @example
 * const result = await awardActivityPoints('user123', 30);
 * // Awards 30 points
 */
export const awardActivityPoints = async (userId, duration) => {
  try {
    // Calculate points (1 point per minute)
    const points = duration;
    
    // Get user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    // Validate user exists
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    
    // Calculate new totals
    const newTotalPoints = (userData.totalPoints || 0) + points;
    const newLevel = getLevel(newTotalPoints);

    // Update user points and level
    await updateDoc(userRef, {
      totalPoints: newTotalPoints,
      level: newLevel.level
    });

    // Check for new badges
    const newBadges = await checkAndAwardBadges(userId, userData, newTotalPoints);

    // Return success with details
    return { 
      success: true, 
      data: { 
        pointsEarned: points,
        newLevel,
        newBadges
      }
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export all constants and functions
export default {
  DAILY_QUESTS,
  BADGES,
  LEVELS,
  getLevel,
  getLevelProgress,
  getDailyQuests,
  getQuestStatus,
  completeQuest,
  checkAndAwardBadges,
  getLeaderboard,
  getUserRank,
  awardActivityPoints,
};
