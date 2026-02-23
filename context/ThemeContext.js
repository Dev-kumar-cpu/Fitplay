/**
 * ============================================================================
 * ThemeContext.js - Dark/Light Theme Management
 * ============================================================================
 * 
 * This file provides theme management functionality for the FitPlay app.
 * It enables dark and light mode switching with persistent user preferences
 * stored in AsyncStorage.
 * 
 * Features:
 * - Dark/Light theme switching
 * - Persistent theme preference (survives app restarts)
 * - Theme-aware color palettes
 * - Smooth theme transitions
 * 
 * Dependencies:
 * - React Context API
 * - AsyncStorage for persistence
 * - utils/theme for theme definitions
 * 
 * Usage:
 *   Import useTheme hook: import { useTheme } from '../context/ThemeContext';
 *   Access theme: const { isDarkMode, colors, theme } = useTheme();
 */

// ============================================================================
// IMPORTS
// ============================================================================

// React hooks for context creation, state management, and callbacks
import React, { createContext, useState, useEffect, useCallback } from 'react';

// AsyncStorage for persisting theme preference across app restarts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme color definitions for light and dark modes
import { lightTheme, darkTheme } from '../utils/theme';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * THEME_STORAGE_KEY - Key used to store theme preference in AsyncStorage
 * The value stored will be either 'dark' or 'light'
 */
const THEME_STORAGE_KEY = '@fitplay_theme';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * ThemeContext - Creates a React Context for theme management
 * This context provides theme state and toggle functions to all child components
 */
export const ThemeContext = createContext();

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

/**
 * ThemeProvider - Provider component that manages theme state
 * 
 * This component:
 * - Loads saved theme preference on mount
 * - Provides theme switching functionality
 * - Persists user preference to AsyncStorage
 * - Supplies theme colors to all child components
 * 
 * @param {React.ReactNode} children - Child components that will have access to theme
 * @returns {JSX.Element} Provider component with theme context value
 */
export const ThemeProvider = ({ children }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  
  /**
   * isDarkMode - Boolean indicating current theme mode
   * true = dark mode, false = light mode
   * Default: false (light mode)
   */
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  /**
   * isLoading - Loading state while reading saved preference
   * true during initial theme load from storage
   */
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================================
  // THEME PREFERENCE FUNCTIONS
  // ============================================================================

  /**
   * loadThemePreference - Loads saved theme preference from AsyncStorage
   * 
   * This function:
   * 1. Attempts to read saved theme from AsyncStorage
   * 2. Updates isDarkMode state based on saved value
   * 3. Handles errors gracefully
   * 4. Always sets isLoading to false when complete
   * 
   * @returns {Promise<void>}
   */
  const loadThemePreference = async () => {
    try {
      // Try to get saved theme from AsyncStorage
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      // If a theme was saved, update state
      if (savedTheme !== null) {
        // Convert 'dark' string to boolean
        setIsDarkMode(savedTheme === 'dark');
      }
      // If null, use default (light mode - isDarkMode = false)
    } catch (error) {
      // Log errors but don't break the app
      console.error('Error loading theme preference:', error);
    } finally {
      // Always stop loading, whether successful or not
      setIsLoading(false);
    }
  };

  // ============================================================================
  // THEME TOGGLE FUNCTION
  // ============================================================================

  /**
   * toggleTheme - Callback to toggle between dark and light mode
   * 
   * This function:
   * 1. Inverts the current theme mode
   * 2. Updates state immediately for instant feedback
   * 3. Persists new preference to AsyncStorage
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // In a component:
   * const { toggleTheme } = useTheme();
   * <Button onPress={toggleTheme}>Toggle Theme</Button>
   */
  const toggleTheme = useCallback(async () => {
    try {
      // Toggle the theme mode
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      
      // Save preference to AsyncStorage
      // Convert boolean to string for storage
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      // Log errors but don't break the app
      console.error('Error saving theme preference:', error);
    }
  }, [isDarkMode]); // Recreate function when isDarkMode changes

  // ============================================================================
  // SET SPECIFIC THEME
  // ============================================================================

  /**
   * setTheme - Callback to set a specific theme mode
   * 
   * Similar to toggleTheme but sets an exact theme instead of toggling.
   * Useful for settings screens where users can explicitly choose.
   * 
   * @param {boolean} dark - true for dark mode, false for light mode
   * @returns {Promise<void>}
   * 
   * @example
   * // In a component:
   * const { setTheme } = useTheme();
   * <Button onPress={() => setTheme(true)}>Enable Dark Mode</Button>
   */
  const setTheme = useCallback(async (dark) => {
    try {
      // Set the theme mode
      setIsDarkMode(dark);
      
      // Save preference to AsyncStorage
      await AsyncStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch (error) {
      // Log errors but don't break the app
      console.error('Error saving theme preference:', error);
    }
  }, []); // Empty deps = stable function reference

  // ============================================================================
  // THEME SELECTION
  // ============================================================================

  /**
   * theme - Current theme object based on isDarkMode state
   * Contains all colors, mode, and theme-specific values
   * 
   * @example
   * // Accessing theme properties:
   * const { theme } = useTheme();
   * theme.colors.primary    // Primary brand color
   * theme.colors.background // Background color
   * theme.mode             // 'dark' or 'light'
   */
  const theme = isDarkMode ? darkTheme : lightTheme;

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  /**
   * value - Context value object provided to all child components
   * Contains theme state, colors, and control functions
   */
  const value = {
    isDarkMode,           // Current theme mode (boolean)
    isLoading,           // Loading state while reading preference
    theme,               // Full theme object with all colors
    toggleTheme,         // Function to toggle between themes
    setTheme,            // Function to set specific theme
    colors: theme.colors, // Shortcut to just the colors object
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  /**
   * ThemeContext.Provider - Wraps child components with theme context
   * All children can now access theme via useTheme hook
   */
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * useTheme - Custom hook to access ThemeContext in functional components
 * 
 * This hook provides easy access to theme state and functions without needing
 * to import createContext and useContext separately.
 * 
 * @returns {Object} Context value containing theme state and functions
 * @throws {Error} If used outside of ThemeProvider wrapper
 * 
 * @example
 * // Inside a component:
 * const { isDarkMode, colors, toggleTheme } = useTheme();
 * 
 * // Using colors:
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 * </View>
 * 
 * // Toggling theme:
 * <Button onPress={toggleTheme} title="Toggle Dark Mode" />
 */
export const useTheme = () => {
  // Use React's useContext to get the context value
  const context = React.useContext(ThemeContext);
  
  // Throw error if hook is used outside of ThemeProvider
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export context for advanced use cases
export default ThemeContext;
