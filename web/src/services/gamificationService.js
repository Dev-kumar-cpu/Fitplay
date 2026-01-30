// Minimal gamification service (mock data for web prototype)
export const dailyQuests = [
  { id: 1, title: 'Morning Jog', description: 'Complete a 5 km jog', points: 50, duration: 30, activityType: 'running' },
  { id: 2, title: 'Strength Training', description: 'Complete 30 minutes of strength training', points: 75, duration: 30, activityType: 'strength' },
  { id: 3, title: 'Yoga Session', description: 'Complete a yoga session', points: 40, duration: 20, activityType: 'yoga' },
  { id: 4, title: 'Cardio Blast', description: 'Complete 20 minutes of cardio', points: 60, duration: 20, activityType: 'cardio' },
  { id: 5, title: 'Step Challenge', description: 'Walk 10,000 steps', points: 55, duration: 45, activityType: 'walking' },
]

export const badgesConfig = [
  { id: 1, name: 'Beginner', description: 'Complete first workout', requirement: 1, color: '#4CAF50' },
  { id: 2, name: 'Consistent', description: 'Complete 5 workouts', requirement: 5, color: '#2196F3' },
  { id: 3, name: 'Dedicated', description: 'Complete 20 workouts', requirement: 20, color: '#FF9800' },
  { id: 4, name: 'Warrior', description: 'Complete 50 workouts', requirement: 50, color: '#F44336' },
  { id: 5, name: 'Legendary', description: 'Complete 100 workouts', requirement: 100, color: '#FFD700' },
  { id: 6, name: 'Point Master', description: 'Earn 5000 points', requirement: 5000, color: '#9C27B0' },
]

export const getLeaderboard = async () => {
  // Replace with Firebase fetch later
  return [
    { id: 'u1', displayName: 'Alice', totalPoints: 2300 },
    { id: 'u2', displayName: 'Bob', totalPoints: 1800 },
    { id: 'u3', displayName: 'Carol', totalPoints: 1500 },
    { id: 'u4', displayName: 'David', totalPoints: 1200 },
    { id: 'u5', displayName: 'Eve', totalPoints: 950 },
    { id: 'u6', displayName: 'Frank', totalPoints: 800 },
    { id: 'user123', displayName: 'You', totalPoints: 1200 },
  ]
}

export const getUserStats = async (userId) => {
  // Mock stats
  return {
    totalPoints: 1200,
    workoutCount: 35,
    totalMinutes: 1230,
    badges: [1,2],
    streak: 3,
  }
}
