/**
 * ============================================================================
 * helpers.js - Utility Helper Functions
 * ============================================================================
 * 
 * This file contains various utility functions used throughout the FitPlay
 * application for formatting, validation, and common operations.
 * 
 * Categories:
 * - Date/Time formatting
 * - Number formatting
 * - Activity type helpers
 * - Validation functions
 * - UI helper functions
 * 
 * Dependencies:
 * - date-fns: For date manipulation and formatting
 * 
 * Usage:
 *   Import functions: import { formatDate, formatDuration } from '../utils/helpers';
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Date manipulation and formatting library
import { 
  format,                    // Format date to specific string
  formatDistanceToNow,      // Format as relative time (e.g., "2 hours ago")
  isToday,                 // Check if date is today
  isYesterday             // Check if date is yesterday
} from 'date-fns';

// ============================================================================
// DATE/TIME FORMATTING FUNCTIONS
// ============================================================================

/**
 * formatDate - Format a timestamp to a human-readable date string
 * 
 * Handles various timestamp formats:
 * - Firebase Timestamp objects (has toDate() method)
 * - JavaScript Date objects
 * - ISO strings or epoch numbers
 * 
 * Special handling:
 * - Returns "Today" for today's date
 * - Returns "Yesterday" for yesterday's date
 * - Returns formatted date (e.g., "Jan 15, 2024") for older dates
 * 
 * @param {Object|string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate(new Date())           // "Today"
 * formatDate(yesterday)           // "Yesterday"
 * formatDate(firebaseTimestamp)   // "Jan 15, 2024"
 */
export const formatDate = (timestamp) => {
  // Return empty string for null/undefined
  if (!timestamp) return '';
  
  let date;
  
  // Convert different timestamp formats to Date object
  if (timestamp.toDate) {
    // Firebase Timestamp object - use toDate() method
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    // JavaScript Date object - use directly
    date = timestamp;
  } else {
    // ISO string or epoch number - create new Date
    date = new Date(timestamp);
  }

  // Check for special cases: Today and Yesterday
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  // Default: Format as "Jan 15, 2024"
  return format(date, 'MMM d, yyyy');
};

/**
 * formatTime - Format a timestamp to time string
 * 
 * Converts timestamp to 12-hour format with AM/PM
 * Example: "3:30 PM"
 * 
 * @param {Object|string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted time string
 * 
 * @example
 * formatTime(new Date())  // "3:30 PM"
 */
export const formatTime = (timestamp) => {
  // Return empty string for null/undefined
  if (!timestamp) return '';
  
  let date;
  
  // Convert different timestamp formats to Date object
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  // Format as "3:30 PM"
  return format(date, 'h:mm a');
};

/**
 * formatRelativeTime - Format timestamp as relative time
 * 
 * Shows how long ago something happened:
 * - "2 hours ago"
 * - "3 days ago"
 * - "just now"
 * 
 * @param {Object|string|number|Date} timestamp - The timestamp to format
 * @returns {string} Relative time string
 * 
 * @example
 * formatRelativeTime(new Date())              // "just now"
 * formatRelativeTime(hoursAgo)                // "2 hours ago"
 */
export const formatRelativeTime = (timestamp) => {
  // Return empty string for null/undefined
  if (!timestamp) return '';
  
  let date;
  
  // Convert different timestamp formats to Date object
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  // Format as relative time (e.g., "2 hours ago")
  return formatDistanceToNow(date, { addSuffix: true });
};

// ============================================================================
// NUMBER/DURATION FORMATTING FUNCTIONS
// ============================================================================

/**
 * formatDuration - Format workout duration in minutes to readable string
 * 
 * Converts minutes to human-readable format:
 * - Under 60 mins: "45 min"
 * - Exactly X hours: "2 hr"
 * - Hours and minutes: "2 hr 30 min"
 * 
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 * 
 * @example
 * formatDuration(30)     // "30 min"
 * formatDuration(60)     // "1 hr"
 * formatDuration(90)     // "1 hr 30 min"
 */
export const formatDuration = (minutes) => {
  // Handle invalid input
  if (!minutes || minutes < 0) return '0 min';
  
  // Less than 1 hour - show minutes only
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  // Calculate hours and remaining minutes
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  // Exactly on the hour - show hours only
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  // Hours and minutes - show both
  return `${hours} hr ${mins} min`;
};

/**
 * formatDistance - Format distance in kilometers
 * 
 * Converts km to readable format:
 * - Under 1 km: Shows in meters (e.g., "500 m")
 * - 1 km or more: Shows with 2 decimal places (e.g., "2.50 km")
 * 
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance string
 * 
 * @example
 * formatDistance(0.5)    // "500 m"
 * formatDistance(1)      // "1.00 km"
 * formatDistance(2.567)  // "2.57 km"
 */
export const formatDistance = (km) => {
  // Handle invalid input
  if (!km || km < 0) return '0 km';
  
  // Under 1 km - convert to meters
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  
  // 1 km or more - show with 2 decimal places
  return `${km.toFixed(2)} km`;
};

/**
 * formatCalories - Format calories number with thousand separators
 * 
 * Makes large numbers more readable:
 * - 500 -> "500"
 * - 1500 -> "1,500"
 * - 10000 -> "10,000"
 * 
 * @param {number} calories - Number of calories
 * @returns {string} Formatted number string
 * 
 * @example
 * formatCalories(500)     // "500"
 * formatCalories(1500)    // "1,500"
 */
export const formatCalories = (calories) => {
  // Handle invalid input
  if (!calories || calories < 0) return '0';
  
  // Format with thousand separators
  return calories.toLocaleString();
};

/**
 * formatNumber - Format large numbers with K/M suffixes
 * 
 * Abbreviates large numbers:
 * - Under 1000: "500"
 * - 1000-999999: "1.5K", "10.2K"
 * - 1M or more: "1.2M"
 * 
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 * 
 * @example
 * formatNumber(500)       // "500"
 * formatNumber(1500)     // "1.5K"
 * formatNumber(10000)    // "10.0K"
 * formatNumber(1500000)  // "1.5M"
 */
export const formatNumber = (num) => {
  // Handle invalid input
  if (!num || num < 0) return '0';
  
  // 1 million or more - show with M suffix
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  // 1000 or more - show with K suffix
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  // Under 1000 - show as-is
  return num.toString();
};

// ============================================================================
// ACTIVITY TYPE HELPER FUNCTIONS
// ============================================================================

/**
 * getActivityIcon - Get emoji icon for activity type
 * 
 * Maps activity type IDs to emoji icons for display in UI
 * 
 * @param {string} type - Activity type identifier
 * @returns {string} Emoji icon for the activity
 * 
 * @example
 * getActivityIcon('running')  // "🏃"
 * getActivityIcon('yoga')    // "🧘"
 * getActivityIcon('unknown')  // "💪"
 */
export const getActivityIcon = (type) => {
  // Icon mapping for each activity type
  const icons = {
    running: '🏃',
    walking: '🚶',
    cycling: '🚴',
    strength: '🏋️',
    yoga: '🧘',
    cardio: '❤️',
    swimming: '🏊',
    sports: '⚽'
  };
  
  // Return matching icon or default to muscle emoji
  return icons[type] || '💪';
};

/**
 * getIntensityColor - Get color for workout intensity level
 * 
 * Maps intensity levels to color codes:
 * - light: Green (easy)
 * - medium: Orange (moderate)
 * - high: Red (intense)
 * 
 * @param {string} intensity - Intensity level identifier
 * @returns {string} Hex color code
 * 
 * @example
 * getIntensityColor('light')   // "#4CAF50"
 * getIntensityColor('medium')  // "#FF9800"
 * getIntensityColor('high')    // "#F44336"
 */
export const getIntensityColor = (intensity) => {
  // Color mapping for intensity levels
  const colors = {
    light: '#4CAF50',   // Green - easy
    medium: '#FF9800',  // Orange - moderate
    high: '#F44336'     // Red - intense
  };
  
  // Return matching color or default gray
  return colors[intensity] || '#999';
};

/**
 * getLevelColor - Get color for user level number
 * 
 * Maps level numbers to achievement colors:
 * - 1 (Beginner): Light Green
 * - 2 (Amateur): Light Blue
 * - 3 (Athlete): Purple
 * - 4 (Champion): Orange
 * - 5 (Legend): Gold
 * 
 * @param {number} level - User's level (1-5)
 * @returns {string} Hex color code
 * 
 * @example
 * getLevelColor(1)  // "#8BC34A"
 * getLevelColor(3)  // "#9C27B0"
 * getLevelColor(5)  // "#FFD700"
 */
export const getLevelColor = (level) => {
  // Color mapping for each level
  const colors = {
    1: '#8BC34A',  // Beginner - Light Green
    2: '#03A9F4',  // Amateur - Light Blue
    3: '#9C27B0',  // Athlete - Purple
    4: '#FF9800',  // Champion - Orange
    5: '#FFD700'   // Legend - Gold
  };
  
  // Return matching color or default green
  return colors[level] || '#8BC34A';
};

/**
 * getLevel - Get level object from points
 * 
 * Calculates user level based on total points:
 * - 0-499: Level 1 (Beginner)
 * - 500-1499: Level 2 (Amateur)
 * - 1500-2999: Level 3 (Athlete)
 * - 3000-4999: Level 4 (Champion)
 * - 5000+: Level 5 (Legend)
 * 
 * @param {number} points - User's total points
 * @returns {Object} Level object with level number and name
 * 
 * @example
 * getLevel(0)      // { level: 1, name: 'Beginner' }
 * getLevel(500)    // { level: 2, name: 'Amateur' }
 * getLevel(5000)   // { level: 5, name: 'Legend' }
 */
export const getLevel = (points) => {
  // Check points against thresholds (highest first)
  if (points >= 5000) return { level: 5, name: 'Legend' };
  if (points >= 3000) return { level: 4, name: 'Champion' };
  if (points >= 1500) return { level: 3, name: 'Athlete' };
  if (points >= 500) return { level: 2, name: 'Amateur' };
  
  // Default to beginner for 0-499
  return { level: 1, name: 'Beginner' };
};

/**
 * getLevelName - Get level name from level number
 * 
 * @param {number} level - Level number (1-5)
 * @returns {string} Level name
 * 
 * @example
 * getLevelName(1)  // "Beginner"
 * getLevelName(5)  // "Legend"
 */
export const getLevelName = (level) => {
  // Name mapping for each level
  const names = {
    1: 'Beginner',
    2: 'Amateur',
    3: 'Athlete',
    4: 'Champion',
    5: 'Legend'
  };
  
  // Return matching name or default to Beginner
  return names[level] || 'Beginner';
};

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * LEVELS - Level definitions with point ranges
 * 
 * Each level has:
 * - level: Level number (1-5)
 * - name: Display name
 * - minPoints: Minimum points for this level
 * - maxPoints: Maximum points for this level (Infinity for max level)
 */
export const LEVELS = [
  { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 499 },
  { level: 2, name: 'Amateur', minPoints: 500, maxPoints: 1499 },
  { level: 3, name: 'Athlete', minPoints: 1500, maxPoints: 2999 },
  { level: 4, name: 'Champion', minPoints: 3000, maxPoints: 4999 },
  { level: 5, name: 'Legend', minPoints: 5000, maxPoints: Infinity }
];

/**
 * BADGES - Achievement badge definitions
 * 
 * Each badge has:
 * - id: Unique identifier
 * - name: Display name
 * - description: User-friendly description
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
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * validateEmail - Validate email format
 * 
 * Checks if a string is a valid email format:
 * - Contains @ symbol
 * - Has characters before and after @
 * - Has a domain with dot
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 * 
 * @example
 * validateEmail('user@example.com')  // true
 * validateEmail('invalid')         // false
 * validateEmail('no@domain')        // false
 */
export const validateEmail = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * validatePassword - Validate password strength
 * 
 * Current validation:
 * - Minimum 6 characters
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with valid boolean and message
 * 
 * @example
 * validatePassword('123456')  // { valid: true, message: '' }
 * validatePassword('123')    // { valid: false, message: 'Password must be at least 6 characters' }
 */
export const validatePassword = (password) => {
  // Check if password exists and meets minimum length
  if (!password || password.length < 6) {
    return { 
      valid: false, 
      message: 'Password must be at least 6 characters' 
    };
  }
  
  // Password is valid
  return { valid: true, message: '' };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * generateId - Generate a random unique ID
 * 
 * Creates a random string ID using alphanumeric characters
 * Useful for generating client-side IDs before server assignment
 * 
 * @returns {string} Random unique ID
 * 
 * @example
 * generateId()  // "abc123xyz456"
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * debounce - Limit function execution rate
 * 
 * Delays function execution until after wait milliseconds
 * have passed since the last call. Useful for:
 * - Search input (wait for user to stop typing)
 * - Window resize events
 * - API calls on scroll
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before execution
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 * // searchFunction only called after 300ms of no typing
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    // Clear any existing timeout
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    // Set new timeout
    timeout = setTimeout(later, wait);
  };
};

/**
 * calculateProgress - Calculate progress percentage
 * 
 * Calculates what percentage current value is of target
 * Caps at 100% to prevent over-progress display
 * 
 * @param {number} current - Current value
 * @param {number} target - Target/goal value
 * @returns {number} Progress percentage (0-100)
 * 
 * @example
 * calculateProgress(50, 100)   // 50
 * calculateProgress(150, 100) // 100 (capped)
 * calculateProgress(0, 100)   // 0
 */
export const calculateProgress = (current, target) => {
  // Handle invalid target
  if (!target || target === 0) return 0;
  
  // Calculate percentage
  const progress = (current / target) * 100;
  
  // Return minimum of calculated or 100 (capped)
  return Math.min(Math.round(progress), 100);
};

/**
 * getMotivationalMessage - Get streak-based motivational message
 * 
 * Returns encouraging messages based on user's current streak:
 * - 0 days: Basic encouragement
 * - 1-2 days: Keep going
 * - 3-6 days: Consistency praise
 * - 7-13 days: Dedication recognition
 * - 14+ days: Unstoppable recognition
 * 
 * @param {number} streak - Current streak days
 * @returns {string} Motivational message with emoji
 * 
 * @example
 * getMotivationalMessage(0)   // "Every step counts! Keep going! 💪"
 * getMotivationalMessage(7)   // "Your dedication is inspiring! 🌟"
 */
export const getMotivationalMessage = (streak) => {
  // Array of motivational messages (index matches streak ranges)
  const messages = [
    "Every step counts! Keep going! 💪",
    "You're doing amazing! Stay strong! 🔥",
    "Consistency is key! Great job! ⭐",
    "Your dedication is inspiring! 🌟",
    "You're unstoppable! Keep pushing! 🏆"
  ];
  
  // Return message based on streak length
  if (streak === 0) return messages[0];
  if (streak < 3) return messages[1];
  if (streak < 7) return messages[2];
  if (streak < 14) return messages[3];
  return messages[4];
};

/**
 * sleep - Promise-based delay function
 * 
 * Creates a delay for async operations
 * Useful for testing or artificial delays
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Resolves after specified time
 * 
 * @example
 * await sleep(1000);  // Wait 1 second
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// EXPORTS
// ============================================================================

// All functions are exported individually above
// Additional default export for convenience
export default {
  formatDate,
  formatTime,
  formatRelativeTime,
  formatDuration,
  formatDistance,
  formatCalories,
  formatNumber,
  getActivityIcon,
  getIntensityColor,
  getLevelColor,
  getLevel,
  getLevelName,
  validateEmail,
  validatePassword,
  generateId,
  debounce,
  calculateProgress,
  getMotivationalMessage,
  sleep,
};
