// Create Workout Screen - Form to create custom workouts
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { createWorkout } from '../../services/workoutService';

const CATEGORIES = [
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
  { id: 'strength', name: 'Strength', icon: '💪' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'hiit', name: 'HIIT', icon: '⚡' },
  { id: 'custom', name: 'Custom', icon: '🎯' },
];

const DIFFICULTIES = [
  { id: 'beginner', name: 'Beginner', color: '#4CAF50' },
  { id: 'intermediate', name: 'Intermediate', color: '#FF9800' },
  { id: 'advanced', name: 'Advanced', color: '#f44336' },
];

const ExerciseInput = ({ exercise, index, onChange, onDelete, colors }) => {
  return (
    <View style={[styles.exerciseCard, { backgroundColor: colors.card }]}>
      <View style={styles.exerciseHeader}>
        <Text style={[styles.exerciseNumber, { color: colors.primary }]}>#{index + 1}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteExerciseBtn}>
          <Text style={styles.deleteExerciseIcon}>✕</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
        placeholder="Exercise name"
        placeholderTextColor={colors.textMuted}
        value={exercise.name}
        onChangeText={(text) => onChange(index, 'name', text)}
      />
      <View style={styles.exerciseDetails}>
        <View style={styles.detailInput}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Duration (sec)</Text>
          <TextInput
            style={[styles.smallInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={exercise.duration?.toString() || ''}
            onChangeText={(text) => onChange(index, 'duration', parseInt(text) || null)}
          />
        </View>
        <View style={styles.detailInput}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Reps</Text>
          <TextInput
            style={[styles.smallInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={exercise.reps?.toString() || ''}
            onChangeText={(text) => onChange(index, 'reps', parseInt(text) || null)}
          />
        </View>
      </View>
    </View>
  );
};

export const CreateWorkoutScreen = ({ navigation }) => {
  const { user } = useApp();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [difficulty, setDifficulty] = useState('beginner');
  const [exercises, setExercises] = useState([]);
  const [saving, setSaving] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, { name: '', duration: null, reps: null }]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const calculateTotalDuration = () => {
    const total = exercises.reduce((sum, ex) => {
      return sum + (ex.duration || 0);
    }, 0);
    return Math.ceil(total / 60); // Convert to minutes
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    const validExercises = exercises.filter(e => e.name.trim());
    if (validExercises.length === 0) {
      Alert.alert('Error', 'Please enter at least one exercise with a name');
      return;
    }

    setSaving(true);
    try {
      const workoutData = {
        name: name.trim(),
        description: description.trim(),
        category,
        difficulty,
        exercises: validExercises,
        totalDuration: calculateTotalDuration() || 10, // Minimum 10 minutes
      };

      const result = await createWorkout(user.uid, workoutData);
      
      if (result.success) {
        Alert.alert('Success', 'Workout created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create workout');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create workout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Workout</Text>
          <Text style={styles.headerSubtitle}>Build your custom workout</Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          {/* Workout Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Workout Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., Morning HIIT"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Describe your workout..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
            <View style={styles.optionsRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.optionButton,
                    { backgroundColor: colors.card },
                    category === cat.id && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.optionIcon}>{cat.icon}</Text>
                  <Text style={[styles.optionText, { color: colors.text }]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Difficulty</Text>
            <View style={styles.difficultyRow}>
              {DIFFICULTIES.map((diff) => (
                <TouchableOpacity
                  key={diff.id}
                  style={[
                    styles.difficultyButton,
                    { backgroundColor: colors.card },
                    difficulty === diff.id && { borderColor: diff.color, borderWidth: 2, backgroundColor: diff.color + '20' },
                  ]}
                  onPress={() => setDifficulty(diff.id)}
                >
                  <Text style={[styles.difficultyText, { color: difficulty === diff.id ? diff.color : colors.text }]}>
                    {diff.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Exercises */}
          <View style={styles.inputGroup}>
            <View style={styles.exercisesHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Exercises</Text>
              <TouchableOpacity onPress={addExercise} style={[styles.addExerciseBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.addExerciseText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {exercises.length === 0 ? (
              <View style={[styles.emptyExercises, { backgroundColor: colors.card }]}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No exercises added yet. Tap "+ Add" to add exercises.
                </Text>
              </View>
            ) : (
              exercises.map((exercise, index) => (
                <ExerciseInput
                  key={index}
                  exercise={exercise}
                  index={index}
                  onChange={updateExercise}
                  onDelete={() => removeExercise(index)}
                  colors={colors}
                />
              ))
            )}
          </View>

          {/* Duration Summary */}
          <View style={[styles.durationCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.durationLabel, { color: colors.textSecondary }]}>Estimated Duration</Text>
            <Text style={[styles.durationValue, { color: colors.primary }]}>
              {calculateTotalDuration() || 0} minutes
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.saveGradient}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Create Workout'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  backButton: {
    marginBottom: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
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
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 8,
    fontWeight: '600',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addExerciseBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addExerciseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyExercises: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  deleteExerciseBtn: {
    padding: 5,
  },
  deleteExerciseIcon: {
    fontSize: 18,
    color: '#f44336',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  smallInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  durationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  durationLabel: {
    fontSize: 14,
    color: '#666',
  },
  durationValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 5,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveGradient: {
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});

export default CreateWorkoutScreen;
