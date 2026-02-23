// Challenges Screen - View and participate in challenges
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
import { getUserChallenges, getActiveChallenges, joinChallenge, leaveChallenge, getChallengeTemplates, getChallengeLeaderboard } from '../../services/challengeService';

const ChallengeCard = ({ challenge, onJoin, onLeave, colors }) => {
  const getTypeIcon = (type) => {
    const icons = {
      distance: '🏃',
      streak: '🔥',
      calories: '🔥',
      variety: '🌟',
      early_workouts: '🌅',
      duration: '⏱️',
    };
    return icons[type] || '🏅';
  };

  return (
    <View style={[styles.challengeCard, { backgroundColor: colors.card }]}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeIcon}>{getTypeIcon(challenge.type)}</Text>
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: colors.text }]}>{challenge.title}</Text>
          <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
            {challenge.description}
          </Text>
        </View>
      </View>
      <View style={styles.challengeStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{challenge.duration}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{challenge.goal}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {challenge.type === 'distance' ? 'km' : challenge.type === 'calories' ? 'cal' : 'min'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{challenge.maxParticipants}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Max</Text>
        </View>
      </View>
      {challenge.userJoined ? (
        <TouchableOpacity
          onPress={onLeave}
          style={[styles.leaveButton, { backgroundColor: colors.error }]}
        >
          <Text style={styles.buttonText}>Leave Challenge</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onJoin}
          style={[styles.joinButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText}>Join Challenge</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MyChallengeCard = ({ challenge, colors }) => {
  const progress = challenge.userProgress || 0;
  const percentage = Math.min((progress / challenge.goal) * 100, 100);

  return (
    <View style={[styles.myChallengeCard, { backgroundColor: colors.card }]}>
      <View style={styles.myChallengeHeader}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.rankText}>#{challenge.userRank || '-'}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {progress} / {challenge.goal}
        </Text>
      </View>
      <Text style={[styles.daysLeft, { color: colors.textSecondary }]}>
        {challenge.duration} days remaining
      </Text>
    </View>
  );
};

export const ChallengesScreen = ({ navigation }) => {
  const { user, userProfile } = useApp();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [myChallenges, setMyChallenges] = useState([]);
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [myChallengesResult, activeResult, templatesResult] = await Promise.all([
        getUserChallenges(user.uid),
        getActiveChallenges(),
        getChallengeTemplates(),
      ]);

      if (myChallengesResult.success) {
        // Filter out completed challenges and add joined flag
        const myChalls = myChallengesResult.data.filter(c => c.status === 'active');
        setMyChallenges(myChalls);
        
        // Get IDs of joined challenges
        const joinedIds = myChalls.map(c => c.id);
        
        // Filter out joined challenges from available
        if (activeResult.success) {
          setAvailableChallenges(activeResult.data.filter(c => !joinedIds.includes(c.id)));
        }
      }

      if (templatesResult.success) {
        setTemplates(templatesResult.data);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
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

  const handleJoin = async (challengeId) => {
    const result = await joinChallenge(
      challengeId, 
      user.uid, 
      userProfile?.displayName || 'User'
    );
    
    if (result.success) {
      Alert.alert('Success', 'You joined the challenge!');
      loadData();
    }
  };

  const handleLeave = async (challengeId) => {
    Alert.alert(
      'Leave Challenge',
      'Are you sure you want to leave this challenge?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive', 
          onPress: async () => {
            await leaveChallenge(challengeId, user.uid);
            loadData();
          }
        },
      ]
    );
  };

  const handleCreateFromTemplate = async (templateId) => {
    Alert.alert(
      'Create Challenge',
      `Create a "${templateId}" challenge?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            Alert.alert('Success', 'Challenge created!');
            setShowTemplates(false);
            loadData();
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
        <Text style={styles.headerTitle}>🏅 Challenges</Text>
        <Text style={styles.headerSubtitle}>Compete with friends</Text>
      </LinearGradient>

      {/* My Active Challenges */}
      {myChallenges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Active Challenges</Text>
          {myChallenges.map((challenge) => (
            <MyChallengeCard
              key={challenge.id}
              challenge={challenge}
              colors={colors}
            />
          ))}
        </View>
      )}

      {/* Available Challenges */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Challenges</Text>
        
        {availableChallenges.length === 0 && myChallenges.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>🏅</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>No challenges available</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Create your own challenge from templates
            </Text>
          </View>
        ) : (
          availableChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={{ ...challenge, userJoined: false }}
              onJoin={() => handleJoin(challenge.id)}
              onLeave={() => handleLeave(challenge.id)}
              colors={colors}
            />
          ))
        )}
      </View>

      {/* Challenge Templates */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setShowTemplates(!showTemplates)}
          style={[styles.sectionHeader, styles.templatesHeader]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create New Challenge</Text>
          <Text style={[styles.expandIcon, { color: colors.primary }]}>
            {showTemplates ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>

        {showTemplates && (
          <View>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, { backgroundColor: colors.card }]}
                onPress={() => handleCreateFromTemplate(template.id)}
              >
                <Text style={styles.templateIcon}>{template.icon}</Text>
                <View style={styles.templateInfo}>
                  <Text style={[styles.templateTitle, { color: colors.text }]}>{template.title}</Text>
                  <Text style={[styles.templateDesc, { color: colors.textSecondary }]}>
                    {template.description}
                  </Text>
                </View>
                <Text style={[styles.templateArrow, { color: colors.primary }]}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Friends')}
          >
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Find Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={styles.quickActionIcon}>🏆</Text>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Rankings</Text>
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
    marginBottom: 15,
  },
  templatesHeader: {
    marginBottom: 0,
  },
  expandIcon: {
    fontSize: 14,
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  challengeIcon: {
    fontSize: 36,
    marginRight: 15,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  leaveButton: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  myChallengeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  myChallengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 60,
    textAlign: 'right',
  },
  daysLeft: {
    fontSize: 12,
    color: '#666',
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
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  templateIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  templateDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  templateArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomPadding: {
    height: 30,
  },
});

export default ChallengesScreen;
