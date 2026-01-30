// Profile Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getUserStats, badgesConfig } from '../services/gamificationService';
import { logoutUser } from '../services/authService';
import { formatDuration, getLevelFromPoints } from '../utils/helpers';

export const ProfileScreen = ({ navigation }) => {
  const { user, userProfile, setIsLoggedIn, setUser } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.uid) return;
      try {
        const userStats = await getUserStats(user.uid);
        setStats(userStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.uid]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          const result = await logoutUser();
          if (result.success) {
            setIsLoggedIn(false);
            setUser(null);
          } else {
            Alert.alert('Error', result.error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  const level = getLevelFromPoints(stats?.totalPoints || 0);
  const userBadges = stats?.badges || [];
  const badgesList = badgesConfig.filter((b) => userBadges.includes(b.id));

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.displayName}>{userProfile?.displayName || 'Athlete'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Level and Stats Overview */}
      <View style={styles.levelContainer}>
        <LinearGradient colors={[level.color, level.color + '99']} style={styles.levelCard}>
          <Text style={styles.levelLabel}>Current Level</Text>
          <Text style={styles.levelNumber}>{level.level}</Text>
          <Text style={styles.levelName}>{level.name}</Text>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Points</Text>
          <Text style={styles.statValue}>{stats?.totalPoints || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Workouts</Text>
          <Text style={styles.statValue}>{stats?.workoutCount || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Time</Text>
          <Text style={styles.statValue}>{formatDuration(stats?.totalMinutes || 0)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{stats?.streak || 0}</Text>
        </View>
      </View>

      {/* Achievements/Badges */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>🏆 Achievements ({badgesList.length})</Text>
        {badgesList.length > 0 ? (
          <View style={styles.badgesContainer}>
            {badgesList.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                  <Text style={styles.badgeEmoji}>🎖️</Text>
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noBadgesText}>
            Complete workouts to unlock achievements!
          </Text>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>⚙️ Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Edit Profile</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Preferences</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>About FitPlay</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer} />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatar: {
    fontSize: 40,
  },
  headerInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  levelContainer: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  levelCard: {
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
  levelLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  levelNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  levelName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginBottom: 20,
    gap: 10,
  },
  statBox: {
    width: '48%',
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
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#667eea',
  },
  achievementsContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  badgeDesc: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  noBadgesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  settingsContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  settingItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    height: 30,
  },
});
