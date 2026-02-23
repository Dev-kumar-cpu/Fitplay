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

const CHALLENGES_COLLECTION = 'challenges';
const CHALLENGE_PARTICIPANTS_COLLECTION = 'challenge_participants';

// Challenge templates
export const CHALLENGE_TEMPLATES = [
  {
    id: 'weekly_runner',
    title: 'Weekly Runner',
    description: 'Run the most distance this week',
    type: 'distance',
    activityType: 'running',
    duration: 7, // days
    goal: 20, // km
    icon: '🏃',
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Maintain the longest workout streak',
    type: 'streak',
    duration: 14, // days
    goal: 14, // consecutive days
    icon: '🔥',
  },
  {
    id: 'calorie_burner',
    title: 'Calorie Burner',
    description: 'Burn the most calories',
    type: 'calories',
    duration: 7, // days
    goal: 3000, // calories
    icon: '🔥',
  },
  {
    id: 'variety_challenge',
    title: 'Variety Champion',
    description: 'Try different workout types',
    type: 'variety',
    duration: 7, // days
    goal: 5, // different activities
    icon: '🌟',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete workouts before 7 AM',
    type: 'early_workouts',
    duration: 7, // days
    goal: 5, // workouts
    icon: '🌅',
  },
  {
    id: 'endurance_master',
    title: 'Endurance Master',
    description: 'Accumulate total workout time',
    type: 'duration',
    duration: 30, // days
    goal: 600, // minutes
    icon: '⏱️',
  },
];

// Create a new challenge
export const createChallenge = async (creatorId, creatorName, challengeData) => {
  try {
    const challenge = {
      creatorId,
      creatorName,
      title: challengeData.title,
      description: challengeData.description,
      type: challengeData.type,
      activityType: challengeData.activityType,
      startDate: serverTimestamp(),
      endDate: null, // Will be calculated
      duration: challengeData.duration,
      goal: challengeData.goal,
      isGroup: challengeData.isGroup || false,
      maxParticipants: challengeData.maxParticipants || 10,
      status: 'active',
    };

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + challengeData.duration);
    challenge.endDate = serverTimestamp(); // Store as timestamp

    const docRef = await addDoc(collection(db, CHALLENGES_COLLECTION), challenge);
    
    // Add creator as first participant
    await joinChallenge(docRef.id, creatorId, creatorName);

    return { success: true, data: { id: docRef.id, ...challenge } };
  } catch (error) {
    console.error('Error creating challenge:', error);
    return { success: false, error: error.message };
  }
};

// Join a challenge
export const joinChallenge = async (challengeId, userId, userName) => {
  try {
    const participant = {
      challengeId,
      userId,
      userName,
      progress: 0,
      completed: false,
      rank: 0,
      joinedAt: serverTimestamp(),
    };

    await addDoc(collection(db, CHALLENGE_PARTICIPANTS_COLLECTION), participant);
    return { success: true };
  } catch (error) {
    console.error('Error joining challenge:', error);
    return { success: false, error: error.message };
  }
};

// Leave a challenge
export const leaveChallenge = async (challengeId, userId) => {
  try {
    const q = query(
      collection(db, CHALLENGE_PARTICIPANTS_COLLECTION),
      where('challengeId', '==', challengeId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    snapshot.forEach(async (docRef) => {
      await deleteDoc(docRef.ref);
    });

    return { success: true };
  } catch (error) {
    console.error('Error leaving challenge:', error);
    return { success: false, error: error.message };
  }
};

// Get active challenges
export const getActiveChallenges = async () => {
  try {
    const q = query(
      collection(db, CHALLENGES_COLLECTION),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    
    const challenges = [];
    snapshot.forEach((doc) => {
      challenges.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: challenges };
  } catch (error) {
    console.error('Error getting challenges:', error);
    return { success: false, error: error.message };
  }
};

// Get user's challenges
export const getUserChallenges = async (userId) => {
  try {
    const q = query(
      collection(db, CHALLENGE_PARTICIPANTS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    const challenges = [];
    for (const docSnap of snapshot.docs) {
      const participantData = docSnap.data();
      const challengeDoc = await getDoc(doc(db, CHALLENGES_COLLECTION, participantData.challengeId));
      
      if (challengeDoc.exists()) {
        challenges.push({
          id: challengeDoc.id,
          ...challengeDoc.data(),
          userProgress: participantData.progress,
          userCompleted: participantData.completed,
          userRank: participantData.rank,
        });
      }
    }

    return { success: true, data: challenges };
  } catch (error) {
    console.error('Error getting user challenges:', error);
    return { success: false, error: error.message };
  }
};

// Get challenge leaderboard
export const getChallengeLeaderboard = async (challengeId) => {
  try {
    const q = query(
      collection(db, CHALLENGE_PARTICIPANTS_COLLECTION),
      where('challengeId', '==', challengeId)
    );
    const snapshot = await getDocs(q);
    
    const participants = [];
    for (const docSnap of snapshot.docs) {
      const participantData = docSnap.data();
      // Get user profile for additional info
      const userDoc = await getDoc(doc(db, 'users', participantData.userId));
      
      if (userDoc.exists()) {
        participants.push({
          id: docSnap.id,
          ...participantData,
          userData: userDoc.data(),
        });
      }
    }

    // Sort by progress (descending)
    participants.sort((a, b) => b.progress - a.progress);

    // Update ranks
    for (let i = 0; i < participants.length; i++) {
      await updateDoc(doc(db, CHALLENGE_PARTICIPANTS_COLLECTION, participants[i].id), {
        rank: i + 1,
      });
    }

    return { success: true, data: participants };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return { success: false, error: error.message };
  }
};

// Update challenge progress
export const updateChallengeProgress = async (challengeId, userId, progress) => {
  try {
    const q = query(
      collection(db, CHALLENGE_PARTICIPANTS_COLLECTION),
      where('challengeId', '==', challengeId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { progress });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: error.message };
  }
};

// Get challenge templates
export const getChallengeTemplates = () => {
  return { success: true, data: CHALLENGE_TEMPLATES };
};

// Create challenge from template
export const createChallengeFromTemplate = async (creatorId, creatorName, templateId) => {
  const template = CHALLENGE_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return { success: false, error: 'Template not found' };
  }

  return createChallenge(creatorId, creatorName, {
    title: template.title,
    description: template.description,
    type: template.type,
    activityType: template.activityType,
    duration: template.duration,
    goal: template.goal,
    isGroup: false,
  });
};

// Delete challenge (creator only)
export const deleteChallenge = async (challengeId, userId) => {
  try {
    const challengeDoc = await getDoc(doc(db, CHALLENGES_COLLECTION, challengeId));
    
    if (!challengeDoc.exists()) {
      return { success: false, error: 'Challenge not found' };
    }

    const challengeData = challengeDoc.data();
    if (challengeData.creatorId !== userId) {
      return { success: false, error: 'Only the creator can delete this challenge' };
    }

    // Delete all participants
    const participantsQuery = query(
      collection(db, CHALLENGE_PARTICIPANTS_COLLECTION),
      where('challengeId', '==', challengeId)
    );
    const participantsSnapshot = await getDocs(participantsQuery);
    participantsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Delete challenge
    await deleteDoc(doc(db, CHALLENGES_COLLECTION, challengeId));

    return { success: true };
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return { success: false, error: error.message };
  }
};
