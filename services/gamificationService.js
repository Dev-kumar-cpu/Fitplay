// Gamification Service - Manages quests, rewards, badges, and points
import { db } from '../config/firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// Daily Quests
export const dailyQuests = [
  {
    id: 1,
    title: 'Morning Jog',
    description: 'Complete a 5 km jog',
    points: 50,
    duration: 30,
    activityType: 'running',
  },
  {
    id: 2,
    title: 'Strength Training',
    description: 'Complete 30 minutes of strength training',
    points: 75,
    duration: 30,
    activityType: 'strength',
  },
  {
    id: 3,
    title: 'Yoga Session',
    description: 'Complete a yoga session',
    points: 40,
    duration: 20,
    activityType: 'yoga',
  },
  {
    id: 4,
    title: 'Cardio Blast',
    description: 'Complete 20 minutes of cardio',
    points: 60,
    duration: 20,
    activityType: 'cardio',
  },
  {
    id: 5,
    title: 'Step Challenge',
    description: 'Walk 10,000 steps',
    points: 55,
    duration: 45,
    activityType: 'walking',
  },
];

// Badge Definitions
export const badgesConfig = [
  {
    id: 1,
    name: 'Beginner',
    description: 'Complete first workout',
    requirement: 1,
    color: '#4CAF50',
  },
  {
    id: 2,
    name: 'Consistent',
    description: 'Complete 5 workouts',
    requirement: 5,
    color: '#2196F3',
  },
  {
    id: 3,
    name: 'Dedicated',
    description: 'Complete 20 workouts',
    requirement: 20,
    color: '#FF9800',
  },
  {
    id: 4,
    name: 'Warrior',
    description: 'Complete 50 workouts',
    requirement: 50,
    color: '#F44336',
  },
  {
    id: 5,
    name: 'Legendary',
    description: 'Complete 100 workouts',
    requirement: 100,
    color: '#FFD700',
  },
  {
    id: 6,
    name: 'Point Master',
    description: 'Earn 5000 points',
    requirement: 5000,
    color: '#9C27B0',
  },
];

// Award Quest Completion
export const completeQuest = async (userId, questId, durationMinutes) => {
  try {
    const quest = dailyQuests.find((q) => q.id === questId);
    if (!quest) throw new Error('Quest not found');

    const userRef = doc(db, 'users', userId);
    
    // Add activity
    const activity = {
      questId,
      questTitle: quest.title,
      activityType: quest.activityType,
      points: quest.points,
      duration: durationMinutes,
      completedAt: new Date(),
    };

    await addDoc(collection(db, 'users', userId, 'activities'), activity);

    // Update user points and stats
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
    const userData = userDoc.docs[0]?.data() || {};

    await updateDoc(userRef, {
      totalPoints: (userData.totalPoints || 0) + quest.points,
      workoutCount: (userData.workoutCount || 0) + 1,
      lastWorkout: new Date(),
    });

    return {
      success: true,
      pointsEarned: quest.points,
      totalPoints: (userData.totalPoints || 0) + quest.points,
    };
  } catch (error) {
    console.error('Error completing quest:', error);
    throw error;
  }
};

// Check and Award Badges
export const checkAndAwardBadges = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const activitiesSnap = await getDocs(collection(db, 'users', userId, 'activities'));
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
    const userData = userDoc.docs[0]?.data() || {};

    const awardedBadges = [];

    for (const badgeConfig of badgesConfig) {
      const workoutCount = activitiesSnap.docs.length;
      const totalPoints = userData.totalPoints || 0;

      let qualified = false;
      if (badgeConfig.name === 'Point Master') {
        qualified = totalPoints >= badgeConfig.requirement;
      } else {
        qualified = workoutCount >= badgeConfig.requirement;
      }

      if (qualified && !userData.badges?.includes(badgeConfig.id)) {
        awardedBadges.push(badgeConfig);
      }
    }

    if (awardedBadges.length > 0) {
      await updateDoc(userRef, {
        badges: [
          ...(userData.badges || []),
          ...awardedBadges.map((b) => b.id),
        ],
      });
    }

    return awardedBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    throw error;
  }
};

// Get User Leaderboard
export const getLeaderboard = async (limit = 10) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('totalPoints', 'desc'),
      limit
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Get User Stats
export const getUserStats = async (userId) => {
  try {
    const activitiesSnap = await getDocs(collection(db, 'users', userId, 'activities'));
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
    const userData = userDoc.docs[0]?.data() || {};

    const totalMinutes = activitiesSnap.docs.reduce((sum, doc) => sum + (doc.data().duration || 0), 0);
    const totalPoints = userData.totalPoints || 0;
    const workoutCount = activitiesSnap.docs.length;

    return {
      totalPoints,
      workoutCount,
      totalMinutes,
      badges: userData.badges || [],
      streak: userData.streak || 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalPoints: 0,
      workoutCount: 0,
      totalMinutes: 0,
      badges: [],
      streak: 0,
    };
  }
};
