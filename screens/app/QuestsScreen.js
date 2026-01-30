// Quests Screen - Daily Challenges
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import {
  dailyQuests,
  completeQuest,
  checkAndAwardBadges,
} from '../services/gamificationService';

const QuestCard = ({ quest, onComplete }) => (
  <View style={styles.questCard}>
    <View style={styles.questHeader}>
      <Text style={styles.questTitle}>{quest.title}</Text>
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>+{quest.points}pts</Text>
      </View>
    </View>

    <Text style={styles.questDescription}>{quest.description}</Text>

    <View style={styles.questFooter}>
      <Text style={styles.questDuration}>⏱️ {quest.duration} min</Text>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => onComplete(quest)}
      >
        <Text style={styles.completeButtonText}>Complete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const QuestsScreen = () => {
  const { user } = useApp();
  const [completionModal, setCompletionModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [actualDuration, setActualDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestSelect = (quest) => {
    setSelectedQuest(quest);
    setActualDuration(quest.duration.toString());
    setCompletionModal(true);
  };

  const submitCompletion = async () => {
    if (!actualDuration || isNaN(parseInt(actualDuration))) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration');
      return;
    }

    setLoading(true);
    try {
      const result = await completeQuest(user.uid, selectedQuest.id, parseInt(actualDuration));
      
      if (result.success) {
        await checkAndAwardBadges(user.uid);
        Alert.alert(
          'Quest Completed! 🎉',
          `You earned ${result.pointsEarned} points!\nTotal: ${result.totalPoints}`,
          [{ text: 'OK', onPress: () => setCompletionModal(false) }]
        );
        setActualDuration('');
        setSelectedQuest(null);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Daily Quests 🎯</Text>
        <Text style={styles.headerSubtitle}>Complete quests to earn points</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        {dailyQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onComplete={handleQuestSelect}
          />
        ))}
      </ScrollView>

      {/* Completion Modal */}
      <Modal visible={completionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedQuest?.title}</Text>
            <Text style={styles.modalDescription}>
              {selectedQuest?.description}
            </Text>

            <Text style={styles.labelText}>How long did you exercise? (minutes)</Text>
            <TextInput
              style={styles.durationInput}
              placeholder="Enter duration"
              keyboardType="numeric"
              value={actualDuration}
              onChangeText={setActualDuration}
              editable={!loading}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setCompletionModal(false)}
                disabled={loading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSubmitButton, loading && styles.buttonDisabled]}
                onPress={submitCompletion}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questDuration: {
    fontSize: 13,
    color: '#999',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 35,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
