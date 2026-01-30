import React from 'react'

// Asset service - manage images, icons, and videos

// Activity type icons (emoji based for now)
export const activityIcons = {
  running: '🏃',
  walking: '🚶',
  strength: '💪',
  yoga: '🧘',
  cardio: '❤️',
  cycling: '🚴',
  swimming: '🏊',
  sports: '⚽',
}

// Badge icons
export const badgeIcons = {
  1: '⭐', // Beginner
  2: '🌟', // Consistent
  3: '✨', // Dedicated
  4: '💥', // Warrior
  5: '👑', // Legendary
  6: '💎', // Point Master
}

// User avatars - using placeholder service
export const getAvatarUrl = (userId, name = 'User') => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  // Using UI Avatars service for dynamic avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=667eea&color=fff&size=128`
}

// Get quest image
export const getQuestImage = (activityType) => {
  const images = {
    running: '🏃‍♂️',
    walking: '🚶‍♀️',
    strength: '🏋️',
    yoga: '🧘‍♀️',
    cardio: '🚴‍♂️',
  }
  return images[activityType] || '💪'
}

// Get badge gradient colors
export const getBadgeGradient = (badgeId) => {
  const gradients = {
    1: 'linear-gradient(135deg, #4CAF50, #45a049)',
    2: 'linear-gradient(135deg, #2196F3, #0b7dda)',
    3: 'linear-gradient(135deg, #FF9800, #fb8c00)',
    4: 'linear-gradient(135deg, #F44336, #e53935)',
    5: 'linear-gradient(135deg, #FFD700, #fbc02d)',
    6: 'linear-gradient(135deg, #9C27B0, #8e24aa)',
  }
  return gradients[badgeId] || 'linear-gradient(135deg, #667eea, #764ba2)'
}

// SVG inline icons
export const SvgIcons = {
  trophy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2m-4-3V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1m4 3h6"></path>
    </svg>
  ),
  medal: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="13" r="6"></circle>
      <path d="M12 13V7m0 0H8m4 0h4"></path>
    </svg>
  ),
  play: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  video: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z"></path>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  ),
}
