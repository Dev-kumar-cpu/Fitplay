// Activity Tracking Service
import { db } from '../config/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';

// Log Activity
export const logActivity = async (userId, activityData) => {
  try {
    const activity = {
      ...activityData,
      userId,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'activities'), activity);
    return {
      success: true,
      id: docRef.id,
      activity,
    };
  } catch (error) {
    console.error('Error logging activity:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get Today's Activities
export const getTodayActivities = async (userId) => {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching today activities:', error);
    return [];
  }
};

// Get All User Activities
export const getUserActivities = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

// Calculate Weekly Stats
export const getWeeklyStats = async (userId) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      where('createdAt', '>=', sevenDaysAgo),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map((doc) => doc.data());

    const totalDuration = activities.reduce((sum, act) => sum + (act.duration || 0), 0);
    const totalCalories = activities.reduce((sum, act) => sum + (act.caloriesBurned || 0), 0);
    const totalPoints = activities.reduce((sum, act) => sum + (act.points || 0), 0);

    return {
      totalDuration,
      totalCalories,
      totalPoints,
      workoutCount: activities.length,
      activities,
    };
  } catch (error) {
    console.error('Error calculating weekly stats:', error);
    return {
      totalDuration: 0,
      totalCalories: 0,
      totalPoints: 0,
      workoutCount: 0,
      activities: [],
    };
  }
};

// Activity Types for Display
export const activityTypes = {
  running: { label: 'Running', icon: '🏃', color: '#FF5722' },
  walking: { label: 'Walking', icon: '🚶', color: '#8BC34A' },
  cycling: { label: 'Cycling', icon: '🚴', color: '#2196F3' },
  strength: { label: 'Strength', icon: '💪', color: '#9C27B0' },
  yoga: { label: 'Yoga', icon: '🧘', color: '#FF69B4' },
  cardio: { label: 'Cardio', icon: '🤸', color: '#FFC107' },
  swimming: { label: 'Swimming', icon: '🏊', color: '#00BCD4' },
  sports: { label: 'Sports', icon: '⚽', color: '#607D8B' },
};
