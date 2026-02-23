// Profile Screen - User Profile and Settings
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  RefreshControl,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { logoutUser } from '../../services/authService';
import { getLevel, BADGES, LEVELS, formatNumber } from '../../utils/helpers';
import { getLevelColor } from '../../utils/helpers';

export const ProfileScreen = ({ navigation }) => {
  const { user, userProfile, setIsLoggedIn } = useApp();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (result.success) {
              setIsLoggedIn(false);
            } else {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const level = userProfile ? getLevel(userProfile.totalPoints || 0) : { level: 1, name: 'Beginner' };
  const levelColor = getLevelColor(level.level);
  const userBadges = userProfile?.badges || [];
  const points = userProfile?.totalPoints || 0;
  const workoutCount = userProfile?.workoutCount || 0;
  const totalMinutes = userProfile?.totalMinutes || 0;
  const streak = userProfile?.streak || 0;

  const getLevelProgress = () => {
    if (level.level >= 5) return 100;
    const currentLevel = LEVELS.find(l => l.level === level.level);
    const nextLevel = LEVELS.find(l => l.level === level.level + 1);
    if (!currentLevel || !nextLevel) return 0;
    
    const pointsInLevel = points - currentLevel.minPoints;
    const pointsNeeded = nextLevel.minPoints - currentLevel.minPoints;
    return Math.round((pointsInLevel / pointsNeeded) * 100);
  };

  const levelProgress = getLevelProgress();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: levelColor }]}>
            <Text style={styles.avatarText}>
              {userProfile?.displayName?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.displayName}>{userProfile?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          {/* Level Badge */}
          <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
            <Text style={styles.levelText}>Level {level.level}</Text>
            <Text style={styles.levelName}>{level.name}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Level Progress */}
      <View style={styles.levelProgressContainer}>
        <View style={styles.levelProgressHeader}>
          <Text style={styles.levelProgressLabel}>Progress to Level {level.level + 1}</Text>
          <Text style={styles.levelProgressPercent}>{levelProgress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${levelProgress}%`, backgroundColor: levelColor }]} />
        </View>
        <Text style={styles.pointsToNextLevel}>
          {level.level < 5 ? `${LEVELS[level.level]?.minPoints - points + 1 || 0} points to next level` : 'Maximum level reached!'}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(points)}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{workoutCount}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Badges ({userBadges.length}/{BADGES.length})</Text>
        <View style={styles.badgesGrid}>
          {BADGES.map((badge) => {
            const earned = userBadges.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badgeItem, !earned && styles.badgeLocked]}>
                <Text style={styles.badgeIcon}>{earned ? badge.icon : '🔒'}</Text>
                <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🎨</Text>
          <Text style={styles.menuText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#667eea' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>About</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  levelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  levelName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  levelProgressContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -20,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelProgressLabel: {
    fontSize: 14,
    color: '#666',
  },
  levelProgressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  pointsToNextLevel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: 10,
  },
  statItem: {
    width: '50%',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeItem: {
    width: '33.33%',
    alignItems: 'center',
    padding: 10,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#999',
  },
  badgeDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});
