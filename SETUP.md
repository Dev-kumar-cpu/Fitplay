# FitPlay Project Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore Database
5. Update `config/firebaseConfig.js` with your credentials

### 3. Run the Application

**Development (Local)**

```bash
npm start
```

**Android**

```bash
npm run android
```

**iOS**

```bash
npm run ios
```

**Web**

```bash
npm run web
```

## Project Structure Overview

### `/config` - Configuration Files

- `firebaseConfig.js` - Firebase setup and credentials

### `/context` - State Management

- `AppContext.js` - Global app state (user, profile, login status)

### `/navigation` - App Navigation

- `RootNavigator.js` - Navigation structure and routing

### `/screens` - UI Screens

- `auth/` - Login and registration screens
- `app/` - Main app screens (Home, Quests, Leaderboard, Profile, LogActivity)

### `/services` - Business Logic

- `authService.js` - User authentication operations
- `gamificationService.js` - Quests, badges, points, leaderboard
- `activityService.js` - Activity logging and tracking

### `/utils` - Helper Functions

- `helpers.js` - Utility functions (formatting, calculations, validation)

## Key Files to Modify

### 1. Firebase Configuration

**File:** `config/firebaseConfig.js`

Replace placeholder values with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 2. Customize Daily Quests

**File:** `services/gamificationService.js`

Edit the `dailyQuests` array to add/modify daily challenges.

### 3. Adjust Badge Requirements

**File:** `services/gamificationService.js`

Modify the `badgesConfig` array to change badge unlock conditions.

## Features Implemented

✅ User Authentication (Register/Login)
✅ Daily Fitness Quests
✅ Point and Badge System
✅ Leaderboard
✅ Activity Logging
✅ Progress Tracking
✅ User Profile Management
✅ Gamification Mechanics

## Environment Variables

Create a `.env` file (optional) if needed:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
```

## Testing the App

### Test Account

- Email: test@fitplay.com
- Password: Test123!

### Test Flows

1. **Registration**: Create a new account
2. **Dashboard**: View stats and level
3. **Complete Quest**: Log a daily quest
4. **View Leaderboard**: See top performers
5. **Log Activity**: Manually track a workout
6. **View Profile**: Check achievements

## Troubleshooting

### Firebase Connection Issues

- Verify credentials in `firebaseConfig.js`
- Check Firebase project permissions
- Ensure Firestore is enabled

### Build Errors

- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start -c`

### Performance Optimization

- Implement pagination for leaderboard
- Cache user stats locally
- Optimize image loading
- Minimize re-renders using React.memo

## Deployment

### To Publish with Expo

```bash
expo publish
```

### To Build APK/IPA

```bash
expo build:android
expo build:ios
```

## Next Steps

1. Set up Firebase project
2. Configure authentication
3. Test user registration
4. Implement push notifications
5. Deploy to app stores

## Support & Documentation

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org)

---

**Last Updated:** January 28, 2026
