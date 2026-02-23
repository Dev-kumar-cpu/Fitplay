// Custom Workouts Screen - View and manage custom workouts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserWorkouts, getWorkoutTemplates, saveTemplateAsWorkout, deleteWorkout } from '../../services/workoutService';

const WorkoutCard = ({ workout, onPress, onDelete, colors }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      cardio: '🏃',
      strength: '💪',
      yoga: '🧘',
      hiit: '⚡',
      custom: '🎯',
    };
    return icons[category] || '🎯';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#f44336',
    };
    return colors[difficulty] || '#4CAF50';
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.workoutCard, { backgroundColor: colors.card }]}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutIcon}>{getCategoryIcon(workout.category)}</Text>
        <View style={styles.workoutInfo}>
          <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
          <Text style={[styles.workoutDescription, { color: colors.textSecondary }]}>
            {workout.description}
          </Text>
        </View>
      </View>
      <View style={styles.workoutFooter}>
        <View style={styles.workoutStats}>
          <Text style={[styles.workoutStat, { color: colors.textSecondary }]}>
            ⏱️ {workout.totalDuration} min
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(workout.difficulty) }]}>
            <Text style={styles.difficultyText}>{workout.difficulty}</Text>
          </View>
        </View>
        {workout.isTemplate !== true && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const CustomWorkoutsScreen = ({ navigation }) => {
  const { user } = useApp();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [workoutsResult, templatesResult] = await Promise.all([
        getUserWorkouts(user.uid),
        getWorkoutTemplates(),
      ]);

      if (workoutsResult.success) {
        setMyWorkouts(workoutsResult.data);
      }

      if (templatesResult.success) {
        setTemplates(templatesResult.data);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDeleteWorkout = (workout) => {
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete "${workout.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteWorkout(workout.id);
            if (result.success) {
              setMyWorkouts(myWorkouts.filter(w => w.id !== workout.id));
            }
          },
        },
      ]
    );
  };

  const handleSaveTemplate = async (template) => {
    const result = await saveTemplateAsWorkout(user.uid, template);
    if (result.success) {
      Alert.alert('Success', 'Workout added to your list!');
      loadData();
    }
  };

  const handleWorkoutPress = (workout) => {
    // Navigate to workout detail or start workout
    Alert.alert(
      workout.name,
      `${workout.description}\n\nDuration: ${workout.totalDuration} minutes\nExercises: ${workout.exercises?.length || 0}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Start Workout',
          onPress: () => {
            // Navigate to log activity with workout
            navigation.navigate('LogActivity', { workout });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>💪 Custom Workouts</Text>
        <Text style={styles.headerSubtitle}>Create and manage your workouts</Text>
      </LinearGradient>

      {/* My Workouts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Workouts</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateWorkout')}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.addButtonText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {myWorkouts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>No custom workouts yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Create your first workout or use a template
            </Text>
          </View>
        ) : (
          myWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={() => handleWorkoutPress(workout)}
              onDelete={() => handleDeleteWorkout(workout)}
              colors={colors}
            />
          ))
        )}
      </View>

      {/* Templates Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setShowTemplates(!showTemplates)}
          style={[styles.sectionHeader, styles.templatesHeader]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout Templates</Text>
          <Text style={[styles.expandIcon, { color: colors.primary }]}>
            {showTemplates ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>

        {showTemplates && (
          <View>
            {templates.map((template) => (
              <WorkoutCard
                key={template.id}
                workout={template}
                onPress={() => handleWorkoutPress(template)}
                onDelete={() => handleSaveTemplate(template)}
                colors={colors}
              />
            ))}
            <Text style={[styles.templateHint, { color: colors.textSecondary }]}>
              Tap 🗑️ on a template to add it to your workouts
            </Text>
          </View>
        )}
      </View>

      {/* Quick Start Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Start</Text>
        <View style={styles.quickStartGrid}>
          <TouchableOpacity
            style={[styles.quickStartCard, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('LogActivity')}
          >
            <Text style={styles.quickStartIcon}>🏃</Text>
            <Text style={[styles.quickStartText, { color: colors.text }]}>Log Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickStartCard, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Quests')}
          >
            <Text style={styles.quickStartIcon}>🎯</Text>
            <Text style={[styles.quickStartText, { color: colors.text }]}>Daily Quests</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  templatesHeader: {
    marginBottom: 0,
  },
  expandIcon: {
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  workoutDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 5,
  },
  deleteIcon: {
    fontSize: 20,
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
    textAlign: 'center',
  },
  templateHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  quickStartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStartCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  quickStartIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickStartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomPadding: {
    height: 30,
  },
});

export default CustomWorkoutsScreen;
