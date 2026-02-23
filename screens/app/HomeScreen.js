/**
 * HomeScreen.js - Main Dashboard Screen
 * 
 * This is the primary landing screen of the FitPlay mobile app after user login.
 * It serves as a central hub displaying:
 * - User profile summary (points, level, streak)
 * - Today's activity progress (minutes, calories, activities count)
 * - Quick action buttons for common tasks
 * - Recent workout activities list
 * 
 * The screen supports pull-to-refresh to update data from Firebase Firestore.
 * 
 * @module screens/app/HomeScreen
 * @requires React
 * @requires expo-linear-gradient
 * @requires context/AppContext - Global user state
 * @requires context/ThemeContext - Theme colors
 * @requires services/activityService - Activity data fetching
 * @requires utils/helpers - Formatting utilities
 */

// React library for creating React components
import React, { useState, useEffect } from 'react';
// React Native UI components for building the interface
import { 
  View,           // Container for layout
  Text,           // Text display component
  StyleSheet,     // CSS-like styling
  ScrollView,     // Scrollable container
  TouchableOpacity, // Touchable button component
  RefreshControl, // Pull-to-refresh component
  Alert           // Alert dialogs
} from 'react-native';
// Expo library for gradient backgrounds
import { LinearGradient } from 'expo-linear-gradient';
// Custom hook for accessing global app context (user, profile)
import { useApp } from '../../context/AppContext';
// Custom hook for accessing theme context (colors, dark mode)
import { useTheme } from '../../context/ThemeContext';
// Service functions for fetching activity data from Firestore
import { getUserActivities, getTodayActivities } from '../../services/activityService';
// Helper functions for formatting data
import { getLevel, getMotivationalMessage, formatDuration, formatNumber } from '../../utils/helpers';
// Function to get color based on user level
import { getLevelColor } from '../../utils/helpers';

/**
 * HomeScreen Component
 * Main dashboard showing user stats, today's activity progress, and quick actions
 * 
 * @param {object} navigation - React Navigation object for screen navigation
 *                            Used to navigate between screens (LogActivity, Quests, etc.)
 * @returns {JSX.Element} The rendered HomeScreen component with:
 *                        - Header with greeting and motivational message
 *                        - Stats cards (points, level, streak, workouts)
 *                        - Today's progress summary
 *                        - Quick action buttons
 *                        - Recent activities list
 */
export const HomeScreen = ({ navigation }) => {
  // ============================================
  // CONTEXT HOOKS - Access global app state
  // ============================================
  
  // useApp hook provides access to:
  // - user: Current authenticated Firebase user object
  // - userProfile: User's profile data from Firestore (points, level, streak, etc.)
  const { user, userProfile } = useApp();
  
  // useTheme hook provides access to:
  // - colors: Theme color palette (primary, background, text, etc.)
  // - isDarkMode: Boolean for dark/light mode
  const { colors, isDarkMode } = useTheme();
  
  // ============================================
  // STATE MANAGEMENT - Component local state
  // ============================================
  
  // Refreshing state - tracks pull-to-refresh loading status
  // Set to true when user pulls down to refresh, false when complete
  const [refreshing, setRefreshing] = useState(false);
  
  // Today activities state - stores today's workout activities
  // Array of activity objects fetched from Firestore
  const [todayActivities, setTodayActivities] = useState([]);
  
  // Recent activities state - stores last 5 activities for display
  // Limited to 5 most recent workouts
  const [recentActivities, setRecentActivities] = useState([]);

  // ============================================
  // DATA LOADING FUNCTIONS
  // ============================================

  /**
   * loadData Function
   * Fetches user activities from Firebase Firestore database
   * Loads both today's activities and recent activities
   * Called on component mount and pull-to-refresh
   * 
   * @async
   * @returns {Promise<void>} Updates state with fetched activities
   */
  const loadData = async () => {
    // Exit early if no user is logged in
    if (!user) return;

    try {
      // Fetch today's activities - gets all activities logged today
      const todayResult = await getTodayActivities(user.uid);
      if (todayResult.success) {
        setTodayActivities(todayResult.data);
      }

      // Fetch recent activities - gets last 5 activities
      // limit(5) is passed to restrict to most recent 5
      const recentResult = await getUserActivities(user.uid, 5);
      if (recentResult.success) {
        setRecentActivities(recentResult.data);
      }
    } catch (error) {
      // Log error to console for debugging
      console.error('Error loading home data:', error);
    }
  };

  /**
   * onRefresh Function
   * Handler for pull-to-refresh action
   * Triggered when user pulls down on the scroll view
   * Sets refreshing state, reloads all data, then clears refreshing state
   * 
   * @async
   * @returns {Promise<void>} Triggers data reload and UI update
   */
  const onRefresh = async () => {
    setRefreshing(true);  // Show loading indicator
    await loadData();     // Fetch fresh data from Firestore
    setRefreshing(false); // Hide loading indicator
  };

  // ============================================
  // EFFECT HOOKS - Side effects on state change
  // ============================================
  
  /**
   * useEffect Hook
   * Loads data when component mounts or user object changes
   * Dependency array: [user] - re-runs when user logs in/out
   * Ensures data is loaded for the currently logged-in user
   */
  useEffect(() => {
    loadData();
  }, [user]);

  // ============================================
  // COMPUTED VALUES - Derived from state/props
  // ============================================
  
  // Calculate total minutes exercised today
  // Uses reduce to sum up duration of all today's activities
  // Default to 0 if activity has no duration
  const totalTodayMinutes = todayActivities.reduce(
    (sum, a) => sum + (a.duration || 0), 
    0
  );
  
  // Calculate total calories burned today
  // Sums caloriesBurned from all today's activities
  const totalTodayCalories = todayActivities.reduce(
    (sum, a) => sum + (a.caloriesBurned || 0), 
    0
  );
  
  // Get user's current level based on total points
  // getLevel function calculates level from points (e.g., 0-499 = Level 1)
  const level = userProfile 
    ? getLevel(userProfile.totalPoints || 0) 
    : { level: 1, name: 'Beginner' }; // Default for loading state
  
  // Get color for level badge display
  // Different colors for different levels (gray, green, blue, purple, gold)
  const levelColor = getLevelColor(level.level);
  
  // Get user's total accumulated points from profile
  const points = userProfile?.totalPoints || 0;
  
  // Get user's current streak (consecutive days of activity)
  const streak = userProfile?.streak || 0;
  
  // Get total number of workouts completed by user
  const workoutCount = userProfile?.workoutCount || 0;

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================

  /**
   * navigateToLogActivity Function
   * Handler for the "Log Activity" quick action button
   * Navigates user to the LogActivity screen where they can
   * record a new workout (running, cycling, yoga, etc.)
   */
  const navigateToLogActivity = () => {
    navigation.navigate('LogActivity');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
      }
    >
      {/* Header Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, {userProfile?.displayName || 'Champion'}! 👋</Text>
          <Text style={styles.motivation}>{getMotivationalMessage(streak)}</Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          {/* Points Card */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{formatNumber(points)}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>

          {/* Level Card */}
          <View style={[styles.statCard, { borderLeftColor: levelColor }]}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={[styles.statValue, { color: levelColor }]}>Level {level.level}</Text>
            <Text style={styles.statLabel}>{level.name}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {/* Streak Card */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          {/* Workouts Card */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>{workoutCount}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
        </View>
      </View>

      {/* Today's Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.todayCard}>
          <View style={styles.todayStat}>
            <Text style={styles.todayValue}>{totalTodayMinutes}</Text>
            <Text style={styles.todayLabel}>Minutes</Text>
          </View>
          <View style={styles.todayDivider} />
          <View style={styles.todayStat}>
            <Text style={styles.todayValue}>{totalTodayCalories}</Text>
            <Text style={styles.todayLabel}>Calories</Text>
          </View>
          <View style={styles.todayDivider} />
          <View style={styles.todayStat}>
            <Text style={styles.todayValue}>{todayActivities.length}</Text>
            <Text style={styles.todayLabel}>Activities</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToLogActivity}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.actionGradient}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Log Activity</Text>
              <Text style={styles.actionSubtitle}>Record your workout</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Quests')}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.actionGradient}
          >
            <Text style={styles.actionIcon}>🎯</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Daily Quests</Text>
              <Text style={styles.actionSubtitle}>Complete challenges</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {recentActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏃‍♂️</Text>
            <Text style={styles.emptyText}>No activities yet</Text>
            <Text style={styles.emptySubtext}>Start logging your workouts!</Text>
          </View>
        ) : (
          recentActivities.map((activity, index) => (
            <View key={activity.id || index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>
                  {activity.type === 'running' ? '🏃' : 
                   activity.type === 'walking' ? '🚶' : 
                   activity.type === 'cycling' ? '🚴' : 
                   activity.type === 'yoga' ? '🧘' : 
                   activity.type === 'swimming' ? '🏊' : '💪'}
                </Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityType}>
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </Text>
                <Text style={styles.activityDetails}>
                  {formatDuration(activity.duration)} • {activity.caloriesBurned} cal
                </Text>
              </View>
              <View style={styles.activityPoints}>
                <Text style={styles.pointsText}>+{activity.duration}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  motivation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 15,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  todayCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todayStat: {
    alignItems: 'center',
  },
  todayValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  todayLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  todayDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  actionButton: {
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  actionArrow: {
    fontSize: 24,
    color: '#fff',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  activityItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 22,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityPoints: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomPadding: {
    height: 20,
  },
});
