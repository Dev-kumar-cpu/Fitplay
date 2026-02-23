# FitPlay - Gamified Fitness Tracking Mobile App

## Project Overview

FitPlay is a React Native mobile application designed to increase fitness app engagement by 50% through gamification. Users can log workouts, complete daily quests, earn points and badges, and compete on leaderboards.

## Project Structure

```
fitplay/
├── App.js                          # Main app entry point
├── app.json                        # Expo app configuration
├── package.json                    # Dependencies and scripts
│
├── config/
│   └── firebaseConfig.js          # Firebase configuration
│
├── context/
│   └── AppContext.js              # Global app state management
│
├── navigation/
│   └── RootNavigator.js           # Navigation setup
│
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js         # User login
│   │   └── RegisterScreen.js      # User registration
│   └── app/
│       ├── HomeScreen.js          # Dashboard with stats
│       ├── QuestsScreen.js        # Daily fitness quests
│       ├── LeaderboardScreen.js   # Compete with others
│       ├── ProfileScreen.js       # User profile
│       └── LogActivityScreen.js   # Log workouts
│
├── services/
│   ├── authService.js            # Firebase authentication
│   ├── gamificationService.js    # Quests, badges, points
│   └── activityService.js        # Activity logging and tracking
│
└── utils/
    └── helpers.js                # Utility functions
```

## Key Features

### 1. **User Authentication**

- Email/password registration and login
- Firebase authentication
- Secure user profile management

### 2. **Daily Quests**

- 5 pre-defined daily fitness challenges
- Point rewards (40-75 points)
- Activity duration tracking
- Quest completion logging

### 3. **Gamification System**

- **Points**: Earned through quest completion (0-75 per quest)
- **Badges**: 6 achievement badges
  - Beginner (1 workout)
  - Consistent (5 workouts)
  - Dedicated (20 workouts)
  - Warrior (50 workouts)
  - Legendary (100 workouts)
  - Point Master (5000 points)
- **Levels**: Based on total points
  - Level 1: Beginner (0-499 pts)
  - Level 2: Amateur (500-1499 pts)
  - Level 3: Athlete (1500-2999 pts)
  - Level 4: Champion (3000-4999 pts)
  - Level 5: Legend (5000+ pts)

### 4. **Activity Logging**

- Multiple activity types (running, walking, cycling, strength, yoga, cardio, swimming, sports)
- Duration and distance tracking
- Intensity levels (light, medium, high)
- Calorie estimation
- Notes and observations

### 5. **Leaderboard**

- Real-time ranking system
- Top 50 users displayed
- User rank and points comparison
- Motivational competition

### 6. **Progress Tracking**

- Total points
- Workout count
- Total minutes exercised
- Current level
- Earned badges
- Workout streak

## Technology Stack

**Frontend:**

- React Native
- Expo for cross-platform development
- React Navigation for routing
- Linear Gradient for UI polish
- AsyncStorage for local data caching

**Backend:**

- Firebase Authentication
- Firestore Database
- Real-time data synchronization

**Tools:**

- Date-fns for date manipulation
- Axios for API calls

## Installation & Setup

### Prerequisites

```
Node.js (v14 or higher)
npm or yarn
Expo CLI
```

### Steps

1. **Clone/Navigate to project**

   ```bash
   cd "d:\shaf\frnds\kiyas\top up\project\Fit Play"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Update `config/firebaseConfig.js` with your credentials

4. **Start the app**

   ```bash
   npm start
   ```

5. **Run on device/emulator**
   ```bash
   npm run android    # Android
   npm run ios        # iOS
   npm run web        # Web browser
   ```

## API/Data Models

### User Profile

```javascript
{
  email: string,
  displayName: string,
  createdAt: timestamp,
  totalPoints: number,
  workoutCount: number,
  badges: array,
  streak: number,
  totalMinutes: number,
  profileImage: string
}
```

### Activity Log

```javascript
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

### Quest

```javascript
{
  id: number,
  title: string,
  description: string,
  points: number,
  duration: number,
  activityType: string
}
```

## Expected Outcomes (Within 6 Weeks)

1. **40% increase in user engagement** through daily quests
2. **Higher retention rates** with streak tracking
3. **Community motivation** via leaderboard competition
4. **Habit formation** through consistent gamification rewards
5. **User satisfaction** with level progression and badges

## Project Timeline

- **Week 1**: Design & Setup
- **Week 2-3**: Core Development (Auth, DB, UI)
- **Week 4-5**: Gamification Features
- **Week 6**: Testing & Optimization
- **Week 7-12**: Deployment & Evaluation

## Developer Notes

- All Firebase rules configured for read/write access
- Mock data available for testing
- Scalable architecture for future features
- Comprehensive error handling throughout
- User-friendly UI with motivational messages

## Future Enhancements

- Wearable integration (Apple Watch, Fitbit)
- Social features (friend challenges, group competitions)
- Advanced analytics dashboard
- AI-powered workout recommendations
- Integration with fitness APIs (Strava, MyFitnessPal)
- Nutrition tracking
- Push notifications for daily reminders

## License

This project is part of a Bachelor's degree capstone project.

---

**Created:** January 28, 2026  
**Version:** 1.0.0  
**Status:** Ready for Development
