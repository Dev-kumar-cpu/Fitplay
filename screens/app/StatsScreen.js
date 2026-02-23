// Stats Screen - Advanced statistics and progress visualization
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserActivities } from '../../services/activityService';
import { getLevel, formatDuration, formatNumber } from '../../utils/helpers';

// Chart component (simple bar chart without external library)
const SimpleBarChart = ({ data, title, color }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <View style={chartStyles.container}>
      <Text style={chartStyles.title}>{title}</Text>
      <View style={chartStyles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={chartStyles.barWrapper}>
            <View style={chartStyles.barContainer}>
              <View 
                style={[
                  chartStyles.bar, 
                  { 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color 
                  }
                ]} 
              />
            </View>
            <Text style={chartStyles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const chartStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    width: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
});

// Pie Chart Component (simple version)
const SimplePieChart = ({ data, title }) => {
  const colors = ['#667eea', '#f093fb', '#4CAF50', '#FF9800', '#f44336', '#00BCD4'];
  let total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <View style={pieStyles.container}>
      <Text style={pieStyles.title}>{title}</Text>
      <View style={pieStyles.content}>
        <View style={pieStyles.legend}>
          {data.map((item, index) => (
            <View key={index} style={pieStyles.legendItem}>
              <View style={[pieStyles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
              <Text style={pieStyles.legendText}>{item.label}</Text>
              <Text style={pieStyles.legendValue}>
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const pieStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
});

// Personal Records Component
const PersonalRecords = ({ records }) => {
  const { colors } = useTheme();
  
  return (
    <View style={recordStyles.container}>
      <Text style={[recordStyles.title, { color: colors.text }]}>Personal Records 🏆</Text>
      <View style={recordStyles.grid}>
        {records.map((record, index) => (
          <View key={index} style={[recordStyles.card, { backgroundColor: colors.card }]}>
            <Text style={recordStyles.icon}>{record.icon}</Text>
            <Text style={[recordStyles.value, { color: colors.primary }]}>{record.value}</Text>
            <Text style={[recordStyles.label, { color: colors.textSecondary }]}>{record.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const recordStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export const StatsScreen = ({ navigation }) => {
  const { user, userProfile } = useApp();
  const { theme, isDarkMode, colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activityBreakdown, setActivityBreakdown] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);

  const loadData = async () => {
    if (!user) return;

    try {
      const result = await getUserActivities(user.uid, 100);
      if (result.success) {
        setActivities(result.data);
        processData(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const processData = (activities) => {
    // Process weekly data (last 7 days)
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekly = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = weekDays[date.getDay()];
      
      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.createdAt?.seconds * 1000 || Date.now());
        return activityDate.toDateString() === date.toDateString();
      });
      
      const totalMinutes = dayActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
      weekly.push({ label: dayName, value: totalMinutes });
    }
    setWeeklyData(weekly);

    // Process monthly data (last 4 weeks)
    const monthly = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekActivities = activities.filter(a => {
        const activityDate = new Date(a.createdAt?.seconds * 1000 || Date.now());
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
      
      const totalMinutes = weekActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
      monthly.push({ label: `Week ${4 - i}`, value: totalMinutes });
    }
    setMonthlyData(monthly);

    // Process activity type breakdown
    const breakdown = {};
    activities.forEach(a => {
      const type = a.type || 'other';
      breakdown[type] = (breakdown[type] || 0) + (a.duration || 0);
    });
    
    const breakdownArray = Object.entries(breakdown).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })).sort((a, b) => b.value - a.value);
    setActivityBreakdown(breakdownArray);

    // Calculate personal records
    const records = [
      { icon: '⏱️', value: Math.max(...activities.map(a => a.duration || 0)), label: 'Longest Workout (min)' },
      { icon: '🔥', value: userProfile?.streak || 0, label: 'Current Streak' },
      { icon: '💪', value: activities.length, label: 'Total Workouts' },
      { icon: '⚡', value: Math.max(...activities.map(a => a.caloriesBurned || 0)), label: 'Most Calories' },
      { icon: '📅', value: activities.filter(a => {
        const activityDate = new Date(a.createdAt?.seconds * 1000 || Date.now());
        return activityDate.toDateString() === today.toDateString();
      }).length, label: "Today's Workouts" },
      { icon: '⭐', value: userProfile?.totalPoints || 0, label: 'Total Points' },
    ];
    setPersonalRecords(records);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalMinutes = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalCalories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  const avgDuration = activities.length > 0 ? Math.round(totalMinutes / activities.length) : 0;

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
        <Text style={styles.headerTitle}>📊 Your Stats</Text>
        <Text style={styles.headerSubtitle}>Track your progress</Text>
      </LinearGradient>

      {/* Overview Cards */}
      <View style={styles.overviewContainer}>
        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.overviewValue, { color: colors.primary }]}>{formatNumber(totalMinutes)}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Total Minutes</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.overviewValue, { color: colors.success }]}>{formatNumber(totalCalories)}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Calories Burned</Text>
          </View>
        </View>
        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.overviewValue, { color: '#FF9800' }]}>{avgDuration}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Avg Duration</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.overviewValue, { color: '#9C27B0' }]}>{activities.length}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Workouts</Text>
          </View>
        </View>
      </View>

      {/* Weekly Activity Chart */}
      <View style={styles.section}>
        <SimpleBarChart 
          data={weeklyData} 
          title="This Week's Activity" 
          color={colors.primary}
        />
      </View>

      {/* Monthly Progress Chart */}
      <View style={styles.section}>
        <SimpleBarChart 
          data={monthlyData} 
          title="Monthly Progress" 
          color="#4CAF50"
        />
      </View>

      {/* Activity Breakdown */}
      <View style={styles.section}>
        <SimplePieChart 
          data={activityBreakdown} 
          title="Activity Breakdown"
        />
      </View>

      {/* Personal Records */}
      <View style={styles.section}>
        <PersonalRecords records={personalRecords} />
      </View>

      {/* Achievements Summary */}
      <View style={styles.section}>
        <View style={[styles.achievementsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements Summary</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🥇</Text>
              <Text style={[styles.achievementValue, { color: colors.primary }]}>
                {userProfile?.badges?.length || 0}
              </Text>
              <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Badges</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>⭐</Text>
              <Text style={[styles.achievementValue, { color: '#FFD700' }]}>
                {userProfile?.totalPoints || 0}
              </Text>
              <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Points</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={[styles.achievementValue, { color: '#FF6B35' }]}>
                {userProfile?.streak || 0}
              </Text>
              <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Streak</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={[styles.achievementValue, { color: '#9C27B0' }]}>
                {getLevel(userProfile?.totalPoints || 0).level}
              </Text>
              <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Level</Text>
            </View>
          </View>
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
  overviewContainer: {
    paddingHorizontal: 15,
    marginTop: -20,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  achievementsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bottomPadding: {
    height: 30,
  },
});

export default StatsScreen;
