// Leaderboard Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getLeaderboard } from '../services/gamificationService';
import { getLevelFromPoints } from '../utils/helpers';

const LeaderboardRow = ({ rank, user, isCurrentUser }) => {
  const level = getLevelFromPoints(user.totalPoints || 0);

  return (
    <View style={[styles.leaderboardRow, isCurrentUser && styles.currentUserRow]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, isCurrentUser && styles.currentUserRank]}>
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
          {user.displayName || 'Anonymous'}
        </Text>
        <Text style={styles.userLevel}>{level.name} • Level {level.level}</Text>
      </View>

      <View style={styles.pointsContainer}>
        <Text style={[styles.points, isCurrentUser && styles.currentUserPoints]}>
          {user.totalPoints || 0}
        </Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </View>
  );
};

export const LeaderboardScreen = () => {
  const { user } = useApp();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboard(50);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      Alert.alert('Error', 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  }, [loadLeaderboard]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard 🏆</Text>
        <Text style={styles.headerSubtitle}>Top performers this week</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {leaderboard.map((userData, index) => (
          <LeaderboardRow
            key={userData.id}
            rank={index + 1}
            user={userData}
            isCurrentUser={userData.id === user?.uid}
          />
        ))}
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
  leaderboardRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserRow: {
    backgroundColor: '#f0f4ff',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  rankContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  currentUserRank: {
    color: '#667eea',
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentUserName: {
    fontWeight: 'bold',
  },
  userLevel: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  currentUserPoints: {
    color: '#667eea',
  },
  pointsLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});
