// Leaderboard Screen - Rankings and Competition
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { getLeaderboard, getUserRank } from '../../services/gamificationService';
import { formatNumber, getLevelColor } from '../../utils/helpers';

export const LeaderboardScreen = ({ navigation }) => {
  const { user } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      // Get leaderboard data
      const result = await getLeaderboard(50);
      if (result.success) {
        setLeaderboard(result.data);
      }

      // Get current user's rank
      if (user) {
        const rankResult = await getUserRank(user.uid);
        if (rankResult.success) {
          setUserRank(rankResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const renderTopThree = () => {
    if (leaderboard.length < 3) return null;

    const topThree = leaderboard.slice(0, 3);
    
    return (
      <View style={styles.topThreeContainer}>
        {/* Second Place */}
        <View style={[styles.topThreeItem, styles.secondPlace]}>
          <View style={styles.medalContainer}>
            <Text style={styles.medal}>🥈</Text>
          </View>
          <View style={[styles.avatar, styles.avatarSecond]}>
            <Text style={styles.avatarText}>
              {topThree[1].displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.topThreeName} numberOfLines={1}>
            {topThree[1].displayName}
          </Text>
          <Text style={styles.topThreePoints}>
            {formatNumber(topThree[1].totalPoints)} pts
          </Text>
        </View>

        {/* First Place */}
        <View style={[styles.topThreeItem, styles.firstPlace]}>
          <View style={styles.crownContainer}>
            <Text style={styles.crown}>👑</Text>
          </View>
          <View style={[styles.avatar, styles.avatarFirst]}>
            <Text style={styles.avatarText}>
              {topThree[0].displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.topThreeName} numberOfLines={1}>
            {topThree[0].displayName}
          </Text>
          <Text style={styles.topThreePoints}>
            {formatNumber(topThree[0].totalPoints)} pts
          </Text>
        </View>

        {/* Third Place */}
        <View style={[styles.topThreeItem, styles.thirdPlace]}>
          <View style={styles.medalContainer}>
            <Text style={styles.medal}>🥉</Text>
          </View>
          <View style={[styles.avatar, styles.avatarThird]}>
            <Text style={styles.avatarText}>
              {topThree[2].displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.topThreeName} numberOfLines={1}>
            {topThree[2].displayName}
          </Text>
          <Text style={styles.topThreePoints}>
            {formatNumber(topThree[2].totalPoints)} pts
          </Text>
        </View>
      </View>
    );
  };

  const renderLeaderboardItem = ({ item, index }) => {
    if (index < 3) return null; // Top 3 rendered separately

    const isCurrentUser = user && item.uid === user.uid;
    const levelColor = getLevelColor(item.level);

    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{item.rank}</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: levelColor + '30' }]}>
          <Text style={[styles.avatarText, { color: levelColor }]}>
            {item.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
            {item.displayName}
            {isCurrentUser && ' (You)'}
          </Text>
          <Text style={styles.userStats}>
            {item.workoutCount} workouts • Level {item.level}
          </Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{formatNumber(item.totalPoints)}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Compete with other fitness enthusiasts!</Text>
        
        {userRank && (
          <View style={styles.yourRankContainer}>
            <Text style={styles.yourRankLabel}>Your Rank</Text>
            <Text style={styles.yourRank}>#{userRank}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Top Three */}
      {renderTopThree()}

      {/* Leaderboard List */}
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No users on the leaderboard yet</Text>
            <Text style={styles.emptySubtext}>Be the first to start earning points!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
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
  yourRankContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  yourRankLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  yourRank: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },
  topThreeItem: {
    alignItems: 'center',
    flex: 1,
  },
  secondPlace: {
    marginRight: -10,
    marginBottom: 20,
  },
  firstPlace: {
    marginBottom: 0,
    zIndex: 1,
  },
  thirdPlace: {
    marginLeft: -10,
    marginBottom: 20,
  },
  crownContainer: {
    marginBottom: -10,
    zIndex: 2,
  },
  crown: {
    fontSize: 28,
  },
  medalContainer: {
    marginBottom: -5,
  },
  medal: {
    fontSize: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarFirst: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarSecond: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C0C0C0',
  },
  avatarThird: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CD7F32',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  topThreeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  topThreePoints: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    padding: 15,
    paddingTop: 10,
  },
  leaderboardItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentUserItem: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  currentUserName: {
    color: '#4CAF50',
  },
  userStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
});
