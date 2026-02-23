import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return { success: false, error: 'Permission denied' };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#667eea',
      });

      // Create channel for reminders
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Workout Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#667eea',
      });

      // Create channel for achievements
      await Notifications.setNotificationChannelAsync('achievements', {
        name: 'Achievements',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFD700',
      });

      // Create channel for quests
      await Notifications.setNotificationChannelAsync('quests', {
        name: 'Daily Quests',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return { success: false, error: error.message };
  }
};

// Schedule daily workout reminder
export const scheduleDailyReminder = async (hour = 8, minute = 0) => {
  try {
    // Cancel existing reminders first
    await cancelAllReminders();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 Time to Workout!',
        body: "Don't break your streak! Log your workout now.",
        data: { type: 'reminder' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return { success: false, error: error.message };
  }
};

// Schedule quest completion reminder
export const scheduleQuestReminder = async () => {
  try {
    // Send notification at 10 AM for daily quests
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Daily Quests Available!',
        body: 'New challenges are waiting for you. Complete them to earn points!',
        data: { type: 'quest' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 10,
        minute: 0,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error scheduling quest reminder:', error);
    return { success: false, error: error.message };
  }
};

// Show achievement notification
export const showAchievementNotification = async (badgeName, description) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Achievement Unlocked!',
        body: `You've earned: ${badgeName} - ${description}`,
        data: { type: 'achievement', badgeName },
        sound: true,
      },
      trigger: null, // Show immediately
    });

    return { success: true };
  } catch (error) {
    console.error('Error showing achievement notification:', error);
    return { success: false, error: error.message };
  }
};

// Show streak reminder (if user hasn't logged in for a day)
export const showStreakReminder = async (streakDays) => {
  try {
    await Notifications.scheduleNotificationAsync({
      title: '🔥 Keep Your Streak Alive!',
      body: `You have a ${streakDays}-day streak. Don't lose it!`,
      data: { type: 'streak', streakDays },
      sound: true,
      trigger: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error showing streak reminder:', error);
    return { success: false, error: error.message };
  }
};

// Show workout completed notification
export const showWorkoutCompletedNotification = async (activityType, duration, points) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Workout Complete!',
        body: `Great job! You earned ${points} points for your ${activityType} workout!`,
        data: { type: 'workout', activityType, duration, points },
        sound: true,
      },
      trigger: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error showing workout notification:', error);
    return { success: false, error: error.message };
  }
};

// Show level up notification
export const showLevelUpNotification = async (newLevel, levelName) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Level Up!',
        body: `Congratulations! You've reached Level ${newLevel}: ${levelName}!`,
        data: { type: 'levelUp', newLevel, levelName },
        sound: true,
      },
      trigger: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error showing level up notification:', error);
    return { success: false, error: error.message };
  }
};

// Show challenge notification
export const showChallengeNotification = async (challengeTitle, description) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏅 New Challenge!',
        body: `${challengeTitle}: ${description}`,
        data: { type: 'challenge', challengeTitle },
        sound: true,
      },
      trigger: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error showing challenge notification:', error);
    return { success: false, error: error.message };
  }
};

// Cancel all scheduled notifications
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return { success: true };
  } catch (error) {
    console.error('Error canceling reminders:', error);
    return { success: false, error: error.message };
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return { success: false, error: error.message };
  }
};

// Add notification response listener
export const addNotificationResponseListener = (handler) => {
  return Notifications.addNotificationResponseReceivedListener(handler);
};

// Add notification received listener
export const addNotificationReceivedListener = (handler) => {
  return Notifications.addNotificationReceivedListener(handler);
};

// Get badge count
export const getBadgeCount = async () => {
  try {
    const badgeCount = await Notifications.getBadgeAsync();
    return { success: true, data: badgeCount };
  } catch (error) {
    console.error('Error getting badge count:', error);
    return { success: false, error: error.message };
  }
};

// Set badge count
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeAsync(count);
    return { success: true };
  } catch (error) {
    console.error('Error setting badge count:', error);
    return { success: false, error: error.message };
  }
};
