/**
 * ============================================================================
 * theme.js - Theme Configuration for Light and Dark Modes
 * ============================================================================
 * 
 * This file defines the color schemes and theme configurations for both
 * light and dark modes in the FitPlay app. It provides consistent styling
 * across the entire application.
 * 
 * Theme Structure:
 * - Primary colors (brand colors)
 * - Background colors
 * - Text colors
 * - Status colors (success, error, warning, info)
 * - UI element colors
 * - Feature-specific colors (points, streaks, workouts, etc.)
 * 
 * Usage:
 *   Import themes: import { lightTheme, darkTheme } from '../utils/theme';
 *   Use colors: const { colors } = useTheme(); colors.primary
 */

// ============================================================================
// LIGHT THEME
// ============================================================================

/**
 * lightTheme - Color palette for light mode
 * Used when isDarkMode is false
 * Optimized for daytime/ambient light viewing
 */
export const lightTheme = {
  // Theme mode identifier
  mode: 'light',
  
  /**
   * colors - Complete color palette for light theme
   * All colors are in hex format for consistency
   */
  colors: {
    // -----------------------------------------------------------------------
    // PRIMARY COLORS - Brand/Accent colors
    // -----------------------------------------------------------------------
    
    /** Primary brand color - main action color */
    primary: '#667eea',
    
    /** Darker primary shade for gradients and depth */
    primaryDark: '#764ba2',
    
    /** Secondary accent color for variety */
    secondary: '#f093fb',
    
    // -----------------------------------------------------------------------
    // BACKGROUND COLORS
    // -----------------------------------------------------------------------
    
    /** Main screen background */
    background: '#f5f5f5',
    
    /** Card and surface backgrounds */
    surface: '#ffffff',
    
    /** Card-specific backgrounds (alternative to surface) */
    card: '#ffffff',
    
    // -----------------------------------------------------------------------
    // TEXT COLORS
    // -----------------------------------------------------------------------
    
    /** Primary text color for main content */
    text: '#333333',
    
    /** Secondary text for subtitles and less important content */
    textSecondary: '#666666',
    
    /** Muted text for hints and placeholders */
    textMuted: '#999999',
    
    /** Text color for dark backgrounds (inverted) */
    textInverse: '#ffffff',
    
    // -----------------------------------------------------------------------
    // STATUS COLORS - Feedback and state indicators
    // -----------------------------------------------------------------------
    
    /** Success state - positive actions, completed tasks */
    success: '#4CAF50',
    
    /** Error state - failed actions, warnings */
    error: '#f44336',
    
    /** Warning state - caution, attention needed */
    warning: '#ff9800',
    
    /** Info state - neutral information */
    info: '#2196F3',
    
    // -----------------------------------------------------------------------
    // UI ELEMENT COLORS
    // -----------------------------------------------------------------------
    
    /** Border color for inputs and dividers */
    border: '#e0e0e0',
    
    /** Divider color for separators */
    divider: '#eeeeee',
    
    /** Shadow color for elevation effects */
    shadow: '#000000',
    
    // -----------------------------------------------------------------------
    // GRADIENT COLORS
    // -----------------------------------------------------------------------
    
    /** Starting color for gradient backgrounds */
    gradientStart: '#667eea',
    
    /** Ending color for gradient backgrounds */
    gradientEnd: '#764ba2',
    
    // -----------------------------------------------------------------------
    // TAB BAR COLORS - Bottom navigation
    // -----------------------------------------------------------------------
    
    /** Active tab icon/label color */
    tabBarActive: '#667eea',
    
    /** Inactive tab icon/label color */
    tabBarInactive: '#999999',
    
    /** Tab bar background color */
    tabBarBackground: '#ffffff',
    
    // -----------------------------------------------------------------------
    // STATS CARD ACCENTS - Gamification elements
    // -----------------------------------------------------------------------
    
    /** Points/rewards color (gold) */
    points: '#FFD700',
    
    /** Streak/fire color (orange) */
    streak: '#FF6B35',
    
    /** Workout/success color (green) */
    workouts: '#4CAF50',
    
    /** Level/progress color (purple) */
    level: '#667eea',
  },
};

// ============================================================================
// DARK THEME
// ============================================================================

/**
 * darkTheme - Color palette for dark mode
 * Used when isDarkMode is true
 * Optimized for low-light viewing and reduced eye strain
 */
export const darkTheme = {
  // Theme mode identifier
  mode: 'dark',
  
  /**
   * colors - Complete color palette for dark theme
   * Uses darker variants for backgrounds to reduce eye strain
   */
  colors: {
    // -----------------------------------------------------------------------
    // PRIMARY COLORS - Same as light for brand consistency
    // -----------------------------------------------------------------------
    
    /** Primary brand color - main action color */
    primary: '#667eea',
    
    /** Darker primary shade for gradients and depth */
    primaryDark: '#764ba2',
    
    /** Secondary accent color for variety */
    secondary: '#f093fb',
    
    // -----------------------------------------------------------------------
    // BACKGROUND COLORS - Darker variants
    // -----------------------------------------------------------------------
    
    /** Main screen background - dark gray */
    background: '#121212',
    
    /** Card and surface backgrounds - slightly lighter */
    surface: '#1e1e1e',
    
    /** Card-specific backgrounds */
    card: '#2d2d2d',
    
    // -----------------------------------------------------------------------
    // TEXT COLORS - Inverted for dark backgrounds
    // -----------------------------------------------------------------------
    
    /** Primary text color - white for contrast */
    text: '#ffffff',
    
    /** Secondary text - lighter gray */
    textSecondary: '#b0b0b0',
    
    /** Muted text - medium gray */
    textMuted: '#808080',
    
    /** Text color for light backgrounds */
    textInverse: '#333333',
    
    // -----------------------------------------------------------------------
    // STATUS COLORS - Same as light for consistency
    // -----------------------------------------------------------------------
    
    /** Success state - positive actions */
    success: '#4CAF50',
    
    /** Error state - failed actions */
    error: '#f44336',
    
    /** Warning state - caution */
    warning: '#ff9800',
    
    /** Info state - neutral information */
    info: '#2196F3',
    
    // -----------------------------------------------------------------------
    // UI ELEMENT COLORS - Darker variants
    // -----------------------------------------------------------------------
    
    /** Border color for inputs - lighter gray */
    border: '#3d3d3d',
    
    /** Divider color - dark gray */
    divider: '#2d2d2d',
    
    /** Shadow color - still black */
    shadow: '#000000',
    
    // -----------------------------------------------------------------------
    // GRADIENT COLORS - Same as light for brand consistency
    // -----------------------------------------------------------------------
    
    /** Starting color for gradient backgrounds */
    gradientStart: '#667eea',
    
    /** Ending color for gradient backgrounds */
    gradientEnd: '#764ba2',
    
    // -----------------------------------------------------------------------
    // TAB BAR COLORS - Dark variants
    // -----------------------------------------------------------------------
    
    /** Active tab icon/label color */
    tabBarActive: '#667eea',
    
    /** Inactive tab icon/label color - darker gray */
    tabBarInactive: '#808080',
    
    /** Tab bar background color - dark surface */
    tabBarBackground: '#1e1e1e',
    
    // -----------------------------------------------------------------------
    // STATS CARD ACCENTS - Same as light for gamification consistency
    // -----------------------------------------------------------------------
    
    /** Points/rewards color (gold) */
    points: '#FFD700',
    
    /** Streak/fire color (orange) */
    streak: '#FF6B35',
    
    /** Workout/success color (green) */
    workouts: '#4CAF50',
    
    /** Level/progress color (purple) */
    level: '#667eea',
  },
};

// ============================================================================
// THEME HELPER FUNCTIONS
// ============================================================================

/**
 * getTheme - Get theme object based on mode string
 * 
 * @param {string} mode - Theme mode ('dark' or 'light')
 * @returns {Object} Theme object with colors and mode
 * 
 * @example
 * const theme = getTheme('dark');
 * // Returns darkTheme object
 */
export const getTheme = (mode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * getLevelColor - Get color associated with user level
 * 
 * Each level has a unique color representing achievement:
 * - Level 1 (Beginner): Gray
 * - Level 2 (Amateur): Green
 * - Level 3 (Athlete): Blue
 * - Level 4 (Champion): Purple
 * - Level 5 (Legend): Gold
 * 
 * @param {number} level - User's current level (1-5)
 * @returns {string} Hex color code for the level
 */
export const getLevelColor = (level) => {
  // Color mapping for each level
  const colors = {
    1: '#808080', // Beginner - Gray
    2: '#4CAF50', // Amateur - Green
    3: '#2196F3', // Athlete - Blue
    4: '#9C27B0', // Champion - Purple
    5: '#FFD700', // Legend - Gold
  };
  
  // Return matching color or default to gray for invalid levels
  return colors[level] || '#808080';
};

/**
 * getBadgeColor - Get color associated with achievement badge
 * 
 * Each badge type has a unique color:
 * - beginner: Green
 * - consistent: Blue
 * - dedicated: Purple
 * - warrior: Orange
 * - legendary: Gold
 * - pointMaster: Pink
 * - earlyBird: Cyan
 * - nightOwl: Indigo
 * - And more...
 * 
 * @param {string}
 badge - Badge identifier * @returns {string} Hex color code for the badge
 */
export const getBadgeColor = (badge) => {
  // Color mapping for each badge type
  const colors = {
    // Basic badges
    beginner: '#4CAF50',
    consistent: '#2196F3',
    dedicated: '#9C27B0',
    warrior: '#FF6B35',
    legendary: '#FFD700',
    pointMaster: '#E91E63',
    
    // Time-based badges
    earlyBird: '#00BCD4',
    nightOwl: '#3F51B5',
    streakMaster: '#FF5722',
    socialButterfly: '#E91E63',
    champion: '#FFD700',
    
    // Activity badges
    ironMan: '#607D8B',
    marathonRunner: '#795548',
    swimmer: '#00BCD4',
    cyclist: '#8BC34A',
    yogi: '#9C27B0',
    weightLifter: '#f44336',
    cardioKing: '#FF9800',
    
    // Streak badges
    weekWarrior: '#4CAF50',
    monthMaster: '#2196F3',
    yearChampion: '#9C27B0',
  };
  
  // Return matching color or default to gray for unknown badges
  return colors[badge] || '#808080';
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export themes for use in ThemeContext
export default {
  lightTheme,
  darkTheme,
  getTheme,
  getLevelColor,
  getBadgeColor,
};
