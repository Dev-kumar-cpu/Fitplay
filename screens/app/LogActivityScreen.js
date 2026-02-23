// Log Activity Screen - Workout Logging
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { logActivity, ACTIVITY_TYPES, INTENSITY_LEVELS } from '../../services/activityService';
import { awardActivityPoints } from '../../services/gamificationService';
import { getActivityIcon, getIntensityColor } from '../../utils/helpers';

export const LogActivityScreen = ({ navigation }) => {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedType, setSelectedType] = useState(null);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('medium');
  const [notes, setNotes] = useState('');

  const handleLogActivity = async () => {
    if (!user) return;

    // Validation
    if (!selectedType) {
      Alert.alert('Error', 'Please select an activity type');
      return;
    }

    const durationNum = parseInt(duration);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    setLoading(true);
    try {
      // Log the activity
      const activityResult = await logActivity(user.uid, {
        type: selectedType,
        duration: durationNum,
        distance: distance ? parseFloat(distance) : 0,
        intensity: selectedIntensity,
        notes
      });

      if (activityResult.success) {
        // Award points for the activity
        const pointsResult = await awardActivityPoints(user.uid, durationNum);
        
        let message = `🎉 Activity logged successfully!\n\n`;
        message += `+${durationNum} points earned!`;
        
        if (pointsResult.success && pointsResult.data.newBadges?.length > 0) {
          const newBadges = pointsResult.data.newBadges;
          message += `\n\n🏆 New Badge(s): ${newBadges.map(b => b.name).join(', ')}`;
        }

        Alert.alert('Great Job!', message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', activityResult.error || 'Failed to log activity');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Activity</Text>
        <Text style={styles.headerSubtitle}>Record your workout</Text>
      </LinearGradient>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Activity Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Activity</Text>
          <View style={styles.activityGrid}>
            {ACTIVITY_TYPES.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityItem,
                  selectedType === activity.id && styles.activityItemSelected
                ]}
                onPress={() => setSelectedType(activity.id)}
              >
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <Text style={[
                  styles.activityName,
                  selectedType === activity.id && styles.activityNameSelected
                ]}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Distance Input (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance (km) - Optional</Text>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
            placeholder="Enter distance"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Intensity Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intensity</Text>
          <View style={styles.intensityContainer}>
            {INTENSITY_LEVELS.map((intensity) => (
              <TouchableOpacity
                key={intensity.id}
                style={[
                  styles.intensityButton,
                  selectedIntensity === intensity.id && {
                    backgroundColor: getIntensityColor(intensity.id),
                    borderColor: getIntensityColor(intensity.id)
                  }
                ]}
                onPress={() => setSelectedIntensity(intensity.id)}
              >
                <Text style={[
                  styles.intensityText,
                  selectedIntensity === intensity.id && styles.intensityTextSelected
                ]}>
                  {intensity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes - Optional</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="How did it go? Any observations?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Points Preview */}
        <View style={styles.pointsPreview}>
          <Text style={styles.pointsPreviewText}>
            You'll earn: <Text style={styles.pointsValue}>{duration || 0}</Text> points
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleLogActivity}
          disabled={loading}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.submitGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Log Activity</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
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
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  activityItem: {
    width: '25%',
    padding: 5,
  },
  activityItemSelected: {},
  activityInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityIcon: {
    fontSize: 28,
    marginBottom: 5,
    textAlign: 'center',
  },
  activityName: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  activityNameSelected: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  intensityTextSelected: {
    color: '#fff',
  },
  pointsPreview: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsPreviewText: {
    fontSize: 16,
    color: '#333',
  },
  pointsValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 20,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitGradient: {
    padding: 18,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});
