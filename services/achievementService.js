import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Workout count achievements
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    description: 'Complete your first workout',
    icon: '🌱',
    requirement: 1,
    type: 'workout_count',
    points: 50,
    rarity: 'common',
  },
  consistent: {
    id: 'consistent',
    name: 'Consistent',
    description: 'Complete 5 workouts',
    icon: '🌿',
    requirement: 5,
    type: 'workout_count',
    points: 100,
    rarity: 'common',
  },
  dedicated: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Complete 20 workouts',
    icon: '🌳',
    requirement: 20,
    type: 'workout_count',
    points: 250,
    rarity: 'uncommon',
  },
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    description: 'Complete 50 workouts',
    icon: '⚔️',
    requirement: 50,
    type: 'workout_count',
    points: 500,
    rarity: 'rare',
  },
  legendary: {
    id: 'legendary',
    name: 'Legendary',
    description: 'Complete 100 workouts',
    icon: '👑',
    requirement: 100,
    type: 'workout_count',
    points: 1000,
    rarity: 'epic',
  },
  
  // Points achievements
  pointMaster: {
    id: 'pointMaster',
    name: 'Point Master',
    description: 'Earn 5000 points',
    icon: '⭐',
    requirement: 5000,
    type: 'points',
    points: 200,
    rarity: 'rare',
  },
  superStar: {
    id: 'superStar',
    name: 'Super Star',
    description: 'Earn 10000 points',
    icon: '🌟',
    requirement: 10000,
    type: 'points',
    points: 500,
    rarity: 'epic',
  },
  champion: {
    id: 'champion',
    name: 'Champion',
    description: 'Earn 25000 points',
    icon: '🏆',
    requirement: 25000,
    type: 'points',
    points: 1000,
    rarity: 'legendary',
  },
  
  // Streak achievements
  streakStarter: {
    id: 'streakStarter',
    name: 'Streak Starter',
    description: 'Achieve a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    points: 75,
    rarity: 'common',
  },
  onFire: {
    id: 'onFire',
    name: 'On Fire',
    description: 'Achieve a 7-day streak',
    icon: '💥',
    requirement: 7,
    type: 'streak',
    points: 150,
    rarity: 'uncommon',
  },
  unstoppable: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Achieve a 30-day streak',
    icon: '🚀',
    requirement: 30,
    type: 'streak',
    points: 500,
    rarity: 'rare',
  },
  streakMaster: {
    id: 'streakMaster',
    name: 'Streak Master',
    description: 'Achieve a 100-day streak',
    icon: '🌈',
    requirement: 100,
    type: 'streak',
    points: 2000,
    rarity: 'legendary',
  },
  
  // Time-based achievements
  earlyBird: {
    id: 'earlyBird',
    name: 'Early Bird',
    description: 'Log a workout before 7 AM',
    icon: '🌅',
    requirement: 1,
    type: 'early_workout',
    points: 50,
    rarity: 'common',
  },
  nightOwl: {
    id: 'nightOwl',
    name: 'Night Owl',
    description: 'Log a workout after 10 PM',
    icon: '🦉',
    requirement: 1,
    type: 'late_workout',
    points: 50,
    rarity: 'common',
  },
  
  // Activity type achievements
  marathonRunner: {
    id: 'marathonRunner',
    name: 'Marathon Runner',
    description: 'Run 100 km total',
    icon: '🏃',
    requirement: 100,
    type: 'distance',
    activityType: 'running',
    points: 300,
    rarity: 'rare',
  },
  cyclist: {
    id: 'cyclist',
    name: 'Cyclist',
    description: 'Cycle 200 km total',
    icon: '🚴',
    requirement: 200,
    type: 'distance',
    activityType: 'cycling',
    points: 300,
    rarity: 'rare',
  },
  swimmer: {
    id: 'swimmer',
    name: 'Swimmer',
    description: 'Swim 50 km total',
    icon: '🏊',
    requirement: 50,
    type: 'distance',
    activityType: 'swimming',
    points: 300,
    rarity: 'rare',
  },
  yogi: {
    id: 'yogi',
    name: 'Yogi',
    description: 'Complete 25 yoga sessions',
    icon: '🧘',
    requirement: 25,
    type: 'activity_count',
    activityType: 'yoga',
    points: 200,
    rarity: 'uncommon',
  },
  weightLifter: {
    id: 'weightLifter',
    name: 'Weight Lifter',
    description: 'Complete 50 strength workouts',
    icon: '🏋️',
    requirement: 50,
    type: 'activity_count',
    activityType: 'strength',
    points: 300,
    rarity: 'rare',
  },
  cardioKing: {
    id: 'cardioKing',
    name: 'Cardio King',
    description: 'Complete 50 cardio sessions',
    icon: '❤️',
    requirement: 50,
    type: 'activity_count',
    activityType: 'cardio',
    points: 300,
    rarity: 'rare',
  },
  
  // Social achievements
  socialButterfly: {
    id: 'socialButterfly',
    name: 'Social Butterfly',
    description: 'Add 5 friends',
    icon: '🦋',
    requirement: 5,
    type: 'friends',
    points: 100,
    rarity: 'uncommon',
  },
  competitor: {
    id: 'competitor',
    name: 'Competitor',
    description: 'Join 3 challenges',
    icon: '🎯',
    requirement: 3,
    type: 'challenges',
    points: 150,
    rarity: 'uncommon',
  },
  
  // Duration achievements
  hourWarrior: {
    id: 'hourWarrior',
    name: 'Hour Warrior',
    description: 'Exercise for 60 minutes in one session',
    icon: '⏱️',
    requirement: 60,
    type: 'single_duration',
    points: 100,
    rarity: 'uncommon',
  },
  ironMan: {
    id: 'ironMan',
    name: 'Iron Man',
    description: 'Exercise for 120 minutes in one session',
    icon: '🦾',
    requirement: 120,
    type: 'single_duration',
    points: 250,
    rarity: 'rare',
  },
  
  // Milestone achievements
  weekWarrior: {
    id: 'weekWarrior',
    name: 'Week Warrior',
    description: 'Work out every day for a week',
    icon: '📅',
    requirement: 7,
    type: 'weekly_streak',
    points: 200,
    rarity: 'uncommon',
  },
  monthMaster: {
    id: 'monthMaster',
    name: 'Month Master',
    description: 'Work out every day for a month',
    icon: '🗓️',
    requirement: 30,
    type: 'monthly_streak',
    points: 1000,
    rarity: 'epic',
  },
};

// Get all achievements
export const getAllAchievements = () => {
  return Object.values(ACHIEVEMENTS);
};

// Check and award achievements
export const checkAchievements = async (userId, userProfile, activities) => {
  const newAchievements = [];
  
  try {
    // Get user's existing badges
    const existingBadges = userProfile?.badges || [];
    
    // Check each achievement
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
      // Skip if already earned
      if (existingBadges.includes(key)) continue;
      
      let earned = false;
      
      switch (achievement.type) {
        case 'workout_count':
          earned = (userProfile?.workoutCount || 0) >= achievement.requirement;
          break;
          
        case 'points':
          earned = (userProfile?.totalPoints || 0) >= achievement.requirement;
          break;
          
        case 'streak':
          earned = (userProfile?.streak || 0) >= achievement.requirement;
          break;
          
        case 'activity_count':
          if (achievement.activityType) {
            const count = activities
              .filter(a => a.type === achievement.activityType)
              .length;
            earned = count >= achievement.requirement;
          }
          break;
          
        case 'distance':
          if (achievement.activityType) {
            const totalDistance = activities
              .filter(a => a.type === achievement.activityType)
              .reduce((sum, a) => sum + (a.distance || 0), 0);
            earned = totalDistance >= achievement.requirement;
          }
          break;
          
        case 'single_duration':
          const maxDuration = Math.max(...activities.map(a => a.duration || 0), 0);
          earned = maxDuration >= achievement.requirement;
          break;
          
        case 'early_workout':
        case 'late_workout':
          earned = activities.some(a => {
            const hour = new Date(a.createdAt?.seconds * 1000).getHours();
            if (achievement.type === 'early_workout') return hour < 7;
            if (achievement.type === 'late_workout') return hour >= 22;
            return false;
          });
          break;
      }
      
      if (earned) {
        newAchievements.push(achievement);
      }
    }
    
    return { success: true, data: newAchievements };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { success: false, error: error.message };
  }
};

// Get achievement by ID
export const getAchievementById = (id) => {
  return ACHIEVEMENTS[id] || null;
};

// Get achievement rarity color
export const getAchievementColor = (rarity) => {
  const colors = {
    common: '#808080',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FFD700',
  };
  return colors[rarity] || '#808080';
};

// Format achievement progress
export const getAchievementProgress = (achievement, userProfile, activities) => {
  let current = 0;
  let requirement = achievement.requirement;
  
  switch (achievement.type) {
    case 'workout_count':
      current = userProfile?.workoutCount || 0;
      break;
    case 'points':
      current = userProfile?.totalPoints || 0;
      break;
    case 'streak':
      current = userProfile?.streak || 0;
      break;
    case 'activity_count':
      if (achievement.activityType) {
        current = activities
          .filter(a => a.type === achievement.activityType)
          .length;
      }
      break;
    case 'distance':
      if (achievement.activityType) {
        current = activities
          .filter(a => a.type === achievement.activityType)
          .reduce((sum, a) => sum + (a.distance || 0), 0);
      }
      break;
    case 'single_duration':
      current = Math.max(...activities.map(a => a.duration || 0), 0);
      break;
  }
  
  const percentage = Math.min((current / requirement) * 100, 100);
  
  return {
    current,
    requirement,
    percentage,
    isComplete: current >= requirement,
  };
};
