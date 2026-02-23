// Quests Screen - Daily Fitness Challenges
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { getDailyQuests, completeQuest, getQuestStatus } from '../../services/gamificationService';
import { formatDuration, formatNumber } from '../../utils/helpers';

export const QuestsScreen = ({ navigation }) => {
  const { user, userProfile } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [quests, setQuests] = useState([]);
  const [completedQuestIds, setCompletedQuestIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuests = async () => {
    if (!user) return;

    try {
      // Get available quests
      const availableQuests = getDailyQuests();
      setQuests(availableQuests);

      // Get quest completion status
      const statusResult = await getQuestStatus(user.uid);
      if (statusResult.success) {
        setCompletedQuestIds(statusResult.data.completedQuests);
      }
    } catch (error) {
      console.error('Error loading quests:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuests();
    setRefreshing(false);
  };

  useEffect(() => {
    loadQuests();
  }, [user]);

  const handleCompleteQuest = async (questId) => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await completeQuest(user.uid, questId);
      
      if (result.success) {
        // Add completed quest ID
        setCompletedQuestIds(prev => [...prev, questId]);

        // Show success message
        const { pointsEarned, newBadges } = result.data;
        let message = `🎉 Quest Completed!\n\n+${pointsEarned} points earned!`;
        
        if (newBadges && newBadges.length > 0) {
          const badgeNames = newBadges.map(b => b.name).join(', ');
          message += `\n\n🏆 New Badge(s): ${badgeNames}`;
        }

        Alert.alert('Congratulations!', message);
      } else {
        Alert.alert('Error', result.error || 'Could not complete quest');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = completedQuestIds.length;
  const totalPoints = quests.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = quests
    .filter(q => completedQuestIds.includes(q.id))
    .reduce((sum, q) => sum + q.points, 0);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🎯 Daily Quests</Text>
        <Text style={styles.headerSubtitle}>Complete challenges to earn points!</Text>
        
        {/* Progress Summary */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedCount / quests.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {completedCount}/{quests.length} Completed
          </Text>
        </View>

        <View style={styles.pointsContainer}>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsValue}>{earnedPoints}</Text>
            <Text style={styles.pointsLabel}>Earned</Text>
          </View>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsValue}>{totalPoints - earnedPoints}</Text>
            <Text style={styles.pointsLabel}>Remaining</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quest List */}
      <View style={styles.questList}>
        {quests.map((quest) => {
          const isCompleted = completedQuestIds.includes(quest.id);
          
          return (
            <View 
              key={quest.id} 
              style={[styles.questCard, isCompleted && styles.questCardCompleted]}
            >
              <View style={styles.questHeader}>
                <View style={styles.questIconContainer}>
                  <Text style={styles.questIcon}>{quest.icon}</Text>
                </View>
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDescription}>{quest.description}</Text>
                </View>
                <View style={[styles.questPoints, isCompleted && styles.questPointsCompleted]}>
                  <Text style={[styles.questPointsText, isCompleted && styles.questPointsTextCompleted]}>
                    +{quest.points}
                  </Text>
                </View>
              </View>

              <View style={styles.questDetails}>
                <View style={styles.questDetail}>
                  <Text style={styles.questDetailLabel}>Duration</Text>
                  <Text style={styles.questDetailValue}>{formatDuration(quest.duration)}</Text>
                </View>
                {quest.activityType && (
                  <View style={styles.questDetail}>
                    <Text style={styles.questDetailLabel}>Type</Text>
                    <Text style={styles.questDetailValue}>
                      {quest.activityType.charAt(0).toUpperCase() + quest.activityType.slice(1)}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.completeButton,
                  isCompleted && styles.completeButtonCompleted
                ]}
                onPress={() => !isCompleted && handleCompleteQuest(quest.id)}
                disabled={isCompleted || loading}
              >
                <LinearGradient
                  colors={isCompleted ? ['#4CAF50', '#45a049'] : ['#667eea', '#764ba2']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.completeButtonText}>
                    {isCompleted ? '✓ Completed' : 'Complete Quest'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Quest Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Complete all quests daily for maximum points</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Quests reset at midnight - don't miss out!</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Combine quests with your regular workouts</Text>
        </View>
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
    paddingBottom: 25,
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
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pointsCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    minWidth: 100,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  questList: {
    padding: 20,
  },
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questCardCompleted: {
    backgroundColor: '#f0fff0',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questIcon: {
    fontSize: 26,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  questDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  questPoints: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  questPointsCompleted: {
    backgroundColor: '#4CAF50',
  },
  questPointsText: {
    color: '#ff9800',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questPointsTextCompleted: {
    color: '#fff',
  },
  questDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  questDetail: {
    flex: 1,
  },
  questDetailLabel: {
    fontSize: 12,
    color: '#999',
  },
  questDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  completeButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  completeButtonCompleted: {
    opacity: 0.7,
  },
  buttonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
  },
  bottomPadding: {
    height: 20,
  },
});
