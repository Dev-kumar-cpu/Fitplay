// Import React library for creating React components
import React from 'react';
// Import StatusBar component from expo-status-bar for controlling the status bar appearance
import { StatusBar } from 'expo-status-bar';
// Import AppProvider - provides global app state (user, profile, etc.) to all child components
import { AppProvider } from './context/AppContext';
// Import ThemeProvider - provides theme context (dark/light mode) to all child components
// Import useTheme hook for accessing theme values within components
import { ThemeProvider, useTheme } from './context/ThemeContext';
// Import RootNavigator - main navigation component that handles auth flow and app screens
import { RootNavigator } from './navigation/RootNavigator';

/**
 * AppContent - Inner component that consumes theme context
 * This component is rendered inside both ThemeProvider and AppProvider
 * to ensure it has access to both theme and app state
 */
const AppContent = () => {
  // Extract isDarkMode from theme context to determine status bar style
  const { isDarkMode } = useTheme();
  
  return (
    <>
      {/* 
        StatusBar - Controls the appearance of the device's status bar
        style prop: 'light' makes text/icons white (works in both dark/light mode for this app)
      */}
      <StatusBar style={isDarkMode ? 'light' : 'light'} />
      
      {/* RootNavigator - Handles all navigation between screens based on auth state */}
      <RootNavigator />
    </>
  );
};

/**
 * Main App Component
 * Entry point of the Fit Play application
 * Wraps the app with necessary providers for theme and app state
 */
export default function App() {
  return (
    // ThemeProvider - Provides dark/light theme context throughout the app
    <ThemeProvider>
      {/* AppProvider - Provides authentication state and user profile to all components */}
      <AppProvider>
        {/* AppContent - Main app content that uses both providers */}
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
