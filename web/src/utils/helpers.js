export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const getLevelFromPoints = (points) => {
  if (points < 500) return { level: 1, name: 'Beginner', color: '#4CAF50' };
  if (points < 1500) return { level: 2, name: 'Amateur', color: '#2196F3' };
  if (points < 3000) return { level: 3, name: 'Athlete', color: '#FF9800' };
  if (points < 5000) return { level: 4, name: 'Champion', color: '#F44336' };
  return { level: 5, name: 'Legend', color: '#FFD700' };
};

export const getMotivationalMessage = (points) => {
  const messages = {
    low: ["Let's get started! 🚀","Every step counts! 💪","You got this! 🔥"],
    mid: ['Great progress! 🎯','Keep pushing! 💯','You are on fire! 🔥'],
    high: ["You're unstoppable! 🏆","Absolutely crushing it! 🎊","Legend status achieved! 👑"]
  }
  let category = 'low'
  if (points >= 1500) category = 'high'
  else if (points >= 500) category = 'mid'
  return messages[category][Math.floor(Math.random() * 3)]
}
