// Utility Functions
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateCalories = (activityType, duration) => {
  const caloriesPerMinute = {
    running: 12,
    walking: 5,
    cycling: 10,
    strength: 8,
    yoga: 4,
    cardio: 11,
    swimming: 10,
    sports: 9,
  };

  return (caloriesPerMinute[activityType] || 5) * duration;
};

export const getStreakStatus = (lastWorkout) => {
  if (!lastWorkout) return { streak: 0, status: 'Start your streak!' };

  const last = new Date(lastWorkout);
  const today = new Date();
  const diffTime = today - last;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { streak: 1, status: 'You worked out today!' };
  } else if (diffDays === 1) {
    return { streak: 1, status: 'Keep it going!' };
  } else {
    return { streak: 0, status: 'Streak broken. Start again!' };
  }
};

export const getLevelFromPoints = (points) => {
  if (points < 500) return { level: 1, name: 'Beginner', color: '#4CAF50' };
  if (points < 1500) return { level: 2, name: 'Amateur', color: '#2196F3' };
  if (points < 3000) return { level: 3, name: 'Athlete', color: '#FF9800' };
  if (points < 5000) return { level: 4, name: 'Champion', color: '#F44336' };
  return { level: 5, name: 'Legend', color: '#FFD700' };
};

export const getProgressPercentage = (current, target) => {
  return Math.min(Math.round((current / target) * 100), 100);
};

export const getMotivationalMessage = (points) => {
  const messages = {
    low: [
      "Let's get started! 🚀",
      'Every step counts! 💪',
      'You got this! 🔥',
    ],
    mid: [
      'Great progress! 🎯',
      'Keep pushing! 💯',
      'You are on fire! 🔥',
    ],
    high: [
      "You're unstoppable! 🏆",
      'Absolutely crushing it! 🎊',
      'Legend status achieved! 👑',
    ],
  };

  let category = 'low';
  if (points >= 1500) category = 'high';
  else if (points >= 500) category = 'mid';

  return messages[category][Math.floor(Math.random() * 3)];
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
