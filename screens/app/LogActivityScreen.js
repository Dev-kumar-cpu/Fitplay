// Log Activity Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { logActivity, activityTypes } from '../services/activityService';
import { calculateCalories, formatTime } from '../utils/helpers';

export const LogActivityScreen = ({ navigation }) => {
  const { user } = useApp();
  const [selectedType, setSelectedType] = useState('running');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showActivityTypePicker, setShowActivityTypePicker] = useState(false);

  const handleLogActivity = async () => {
    if (!duration || isNaN(parseInt(duration))) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration in minutes');
      return;
    }

    setLoading(true);
    try {
      const durationMin = parseInt(duration);
      const caloriesBurned = calculateCalories(selectedType, durationMin);

      const activityData = {
        type: selectedType,
        duration: durationMin,
        distance: distance ? parseFloat(distance) : null,
        intensity,
        notes,
        caloriesBurned,
        timestamp: formatTime(new Date()),
      };

      const result = await logActivity(user.uid, activityData);

      if (result.success) {
        Alert.alert(
          'Activity Logged! ✅',
          `${activityTypes[selectedType]?.label}\n${durationMin} minutes\n${caloriesBurned} calories burned`,
          [
            {
              text: 'OK',
              onPress: () => {
                setDuration('');
                setDistance('');
                setIntensity('medium');
                setNotes('');
                setSelectedType('running');
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const ActivityTypeButton = ({ type, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        selectedType === type && styles.typeButtonSelected,
      ]}
      onPress={() => setSelectedType(type)}
    >
      <Text style={styles.typeEmoji}>{icon}</Text>
      <Text style={[styles.typeLabel, selectedType === type && styles.typeLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Log Activity ➕</Text>
        <Text style={styles.headerSubtitle}>Record your workout</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Activity Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Type</Text>
          <View style={styles.typeButtonsContainer}>
            {Object.entries(activityTypes).map(([key, value]) => (
              <ActivityTypeButton
                key={key}
                type={key}
                label={value.label}
                icon={value.icon}
              />
            ))}
          </View>
        </View>

        {/* Duration Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Duration (minutes) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 30"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
            editable={!loading}
          />
        </View>

        {/* Distance Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Distance (km)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5.2"
            keyboardType="decimal-pad"
            value={distance}
            onChangeText={setDistance}
            editable={!loading}
          />
        </View>

        {/* Intensity Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Intensity</Text>
          <View style={styles.intensityContainer}>
            {['light', 'medium', 'high'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.intensityButton,
                  intensity === level && styles.intensityButtonSelected,
                ]}
                onPress={() => setIntensity(level)}
              >
                <Text
                  style={[
                    styles.intensityText,
                    intensity === level && styles.intensityTextSelected,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="How did you feel? Any observations?"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            editable={!loading}
          />
        </View>

        {/* Calories Preview */}
        {duration && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Estimated Calories</Text>
            <Text style={styles.previewValue}>
              {calculateCalories(selectedType, parseInt(duration))} kcal
            </Text>
          </View>
        )}

        {/* Log Button */}
        <TouchableOpacity
          style={[styles.logButton, loading && styles.buttonDisabled]}
          onPress={handleLogActivity}
          disabled={loading || !duration}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logButtonText}>Log Activity</Text>
          )}
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 5,
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    width: '30%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  typeButtonSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: '#667eea',
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  intensityButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  intensityButtonSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  intensityTextSelected: {
    color: '#fff',
  },
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
  },
  previewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  logButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 30,
  },
});
