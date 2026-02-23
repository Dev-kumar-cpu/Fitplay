# FitPlay - Complete Documentation

## Project Overview

FitPlay is a gamified fitness tracking mobile application built with React Native and Expo. The app helps users track their workouts, earn points, complete quests, and compete on leaderboards.

## Features

### Core Features

- **User Authentication** - Email/password registration and login via Firebase Auth
- **Activity Tracking** - Log various workout types (running, cycling, yoga, etc.)
- **Gamification System**
  - Points earned for completing activities
  - Levels (1-5): Beginner → Amateur → Athlete → Champion → Legend
  - Achievement badges for milestones
  - Daily quests with bonus rewards
- **Social Features**
  - Friends system
  - Challenges between users
  - Global leaderboards
- **Custom Workouts** - Create and save custom workout routines
- **Dark/Light Theme** - User-selectable theme preference

### Activity Types

- Running 🏃
- Walking 🚶
- Cycling 🚴
- Strength Training 🏋️
- Yoga 🧘
- Cardio ❤️
- Swimming 🏊
- Sports ⚽

### Intensity Levels

- Light (1x calories)
- Medium (1.5x calories)
- High (2x calories)

## Technical Stack

- **Framework**: React Native with Expo
- **Backend**: Firebase (Auth + Firestore)
- **Navigation**: React Navigation (Stack + Tab navigators)
- **State Management**: React Context API
- **Storage**: AsyncStorage for preferences

## Project Structure

```
FitPlay/
├── App.js                    # Main app entry point
├── config/
│   └── firebaseConfig.js    # Firebase configuration
├── context/
│   ├── AppContext.js        # Global app state (user, profile)
│   └── ThemeContext.js      # Theme management
├── navigation/
│   └── RootNavigator.js     # Main navigation setup
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   └── RegisterScreen.js
│   └── app/
│       ├── HomeScreen.js
│       ├── QuestsScreen.js
│       ├── LeaderboardScreen.js
│       ├── ProfileScreen.js
│       ├── LogActivityScreen.js
│       ├── StatsScreen.js
│       ├── CustomWorkoutsScreen.js
│       ├── CreateWorkoutScreen.js
│       ├── FriendsScreen.js
│       └── ChallengesScreen.js
├── services/
│   ├── authService.js       # Authentication
│   ├── activityService.js   # Activity logging
│   ├── gamificationService.js # Quests, badges, points
│   ├── workoutService.js   # Custom workouts
│   ├── achievementService.js
│   ├── friendService.js
│   ├── challengeService.js
│   └── notificationService.js
└── utils/
    ├── theme.js            # Theme definitions
    └── helpers.js          # Utility functions
```

## Database Schema (Firestore)

### Users Collection

```
javascript
{
  uid: string,
  email: string,
  displayName: string,
  createdAt: timestamp,
  totalPoints: number,
  workoutCount: number,
  badges: string[],
  streak: number,
  totalMinutes: number,
  level: number,
  profileImage: string | null,
  completedQuests: Array<{questId, date, points}>
}
```

### Activities Collection

```
javascript
{
  userId: string,
  type: string,
  duration: number,
  distance: number,
  intensity: string,
  caloriesBurned: number,
  notes: string,
  createdAt: timestamp
}
```

### Workouts Collection

```
javascript
{
  userId: string,
  name: string,
  description: string,
  exercises: Array,
  category: string,
  difficulty: string,
  totalDuration: number,
  isTemplate: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Level System

| Level | Name     | Points Required |
| ----- | -------- | --------------- |
| 1     | Beginner | 0 - 499         |
| 2     | Amateur  | 500 - 1,499     |
| 3     | Athlete  | 1,500 - 2,999   |
| 4     | Champion | 3,000 - 4,999   |
| 5     | Legend   | 5,000+          |

## Badges

- 🌱 Beginner - Complete 1 workout
- ⭐ Consistent - Complete 5 workouts
- 🔥 Dedicated - Complete 20 workouts
- ⚔️ Warrior - Complete 50 workouts
- 👑 Legendary - Complete 100 workouts
- 💎 Point Master - Earn 5,000 points

## Daily Quests

1. Morning Jumpstart - 15 min workout (40 pts)
2. Cardio Champion - 30 min cardio (60 pts)
3. Strength Seeker - 20 min strength (50 pts)
4. Zen Master - 25 min yoga (45 pts)
5. Endurance Elite - 45 min any activity (75 pts)

## API Reference

### Authentication

```
javascript
// Register new user
registerUser(email, password, displayName)

// Login user
loginUser(email, password)

// Logout user
logoutUser()

// Get current user
getCurrentUser()

// Get user profile
getUserProfile(uid)
```

### Activities

```
javascript
// Log activity
logActivity(userId, { type, duration, distance, intensity, notes })

// Get user activities
getUserActivities(userId, limitCount)

// Get today's activities
getTodayActivities(userId)

// Calculate streak
calculateStreak(userId)
```

### Gamification

```
javascript
// Get daily quests
getDailyQuests()

// Complete quest
completeQuest(userId, questId)

// Get leaderboard
getLeaderboard(limitCount)

// Award activity points
awardActivityPoints(userId, duration)
```

### Workouts

```
javascript
// Create workout
createWorkout(userId, workoutData)

// Get user workouts
getUserWorkouts(userId)

// Update workout
updateWorkout(workoutId, workoutData)

// Delete workout
deleteWorkout(workoutId)

// Save template as workout
saveTemplateAsWorkout(userId, template)
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:

```
bash
   npm install

```

3. Configure Firebase:
   - Create Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore
   - Download google-services.json for Android
4. Update `config/firebaseConfig.js` with your Firebase config
5. Run the app:

```
bash
   npx expo start

```

## Dependencies

- firebase
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- @react-native-async-storage/async-storage
- date-fns
- expo-status-bar

## Theme Colors

### Light Theme

- Primary: #667eea
- Background: #f5f5f5
- Surface: #ffffff
- Text: #333333

### Dark Theme

- Primary: #667eea
- Background: #121212
- Surface: #1e1e1e
- Text: #ffffff

## License

This project is for educational purposes.
