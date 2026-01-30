// Home Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getUserStats, getLeaderboard } from '../services/gamificationService';
import { formatDuration, getLevelFromPoints, getMotivationalMessage } from '../utils/helpers';

export const HomeScreen = ({ navigation }) => {
  const { user, userProfile } = useApp();
  const [stats, setStats] = useState(null);
  const [leaderboardRank, setLeaderboardRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const userStats = await getUserStats(user.uid);
      setStats(userStats);

      const leaderboard = await getLeaderboard();
      const rank = leaderboard.findIndex((u) => u.id === user.uid) + 1;
      setLeaderboardRank(rank > 0 ? rank : leaderboard.length + 1);
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  const level = getLevelFromPoints(stats?.totalPoints || 0);
  const motivationalMessage = getMotivationalMessage(stats?.totalPoints || 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {userProfile?.displayName || 'Athlete'}!</Text>
        <Text style={styles.motivational}>{motivationalMessage}</Text>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* Level Card */}
        <LinearGradient
          colors={[level.color, level.color + '99']}
          style={styles.statCard}
        >
          <Text style={styles.cardLabel}>LEVEL</Text>
          <Text style={styles.cardValue}>{level.level}</Text>
          <Text style={styles.cardName}>{level.name}</Text>
        </LinearGradient>

        {/* Points Card */}
        <LinearGradient
          colors={['#FF6B6B', '#FF5252']}
          style={styles.statCard}
        >
          <Text style={styles.cardLabel}>POINTS</Text>
          <Text style={styles.cardValue}>{stats?.totalPoints || 0}</Text>
          <Text style={styles.cardName}>Total Points</Text>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsContainer}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>{stats?.workoutCount || 0}</Text>
          <Text style={styles.quickStatLabel}>Workouts</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>{formatDuration(stats?.totalMinutes || 0)}</Text>
          <Text style={styles.quickStatLabel}>Total Time</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>#{leaderboardRank}</Text>
          <Text style={styles.quickStatLabel}>Rank</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Quests')}
        >
          <Text style={styles.actionButtonEmoji}>🎯</Text>
          <Text style={styles.actionButtonText}>Daily Quests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('LogActivity')}
        >
          <Text style={styles.actionButtonEmoji}>➕</Text>
          <Text style={styles.actionButtonText}>Log Activity</Text>
        </TouchableOpacity>
      </View>

      {/* Badges Section */}
      {stats?.badges && stats.badges.length > 0 && (
        <View style={styles.badgesContainer}>
          <Text style={styles.sectionTitle}>🏆 Badges ({stats.badges.length})</Text>
          <View style={styles.badgesGrid}>
            {stats.badges.slice(0, 6).map((badge, index) => (
              <View key={index} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>🎖️</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Navigation Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={styles.link}>View Leaderboard →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.link}>View Profile →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  motivational: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: -20,
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  cardName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  quickStat: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  badgesContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  linksContainer: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  link: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    paddingVertical: 10,
  },
});
