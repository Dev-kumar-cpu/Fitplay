# FitPlay API Reference & Developer Guide

## Quick Reference

### Authentication Service (`services/authService.js`)

#### `registerUser(email, password, displayName)`

Create a new user account.

**Parameters:**

- `email` (string): User's email address
- `password` (string): User's password (min 6 chars)
- `displayName` (string): User's display name

**Returns:**

```javascript
{
  success: boolean,
  user: FirebaseUser,
  uid: string,
  error: string  // Only if success is false
}
```

**Example:**

```javascript
const result = await registerUser(
  "user@example.com",
  "password123",
  "John Doe",
);
if (result.success) {
  console.log("User created:", result.uid);
}
```

---

#### `loginUser(email, password)`

Authenticate an existing user.

**Parameters:**

- `email` (string): User's email
- `password` (string): User's password

**Returns:**

```javascript
{
  success: boolean,
  user: FirebaseUser,
  uid: string,
  error: string
}
```

---

#### `logoutUser()`

End the current user session.

**Returns:**

```javascript
{
  success: boolean,
  error: string
}
```

---

#### `getCurrentUser()`

Get the currently authenticated user.

**Returns:**

```javascript
{
  uid: string,
  email: string
}
// or null if not authenticated
```

---

#### `getUserProfile(uid)`

Fetch a user's profile data.

**Parameters:**

- `uid` (string): User ID

**Returns:**

```javascript
{
  success: boolean,
  data: {
    email: string,
    displayName: string,
    totalPoints: number,
    workoutCount: number,
    badges: number[],
    // ... other fields
  },
  error: string
}
```

---

### Gamification Service (`services/gamificationService.js`)

#### `completeQuest(userId, questId, durationMinutes)`

Mark a quest as completed and award points.

**Parameters:**

- `userId` (string): User's ID
- `questId` (number): Quest ID (1-5)
- `durationMinutes` (number): Actual duration spent

**Returns:**

```javascript
{
  success: boolean,
  pointsEarned: number,
  totalPoints: number
}
```

**Example:**

```javascript
const result = await completeQuest(userId, 1, 35);
console.log(`Earned ${result.pointsEarned} points!`);
```

---

#### `checkAndAwardBadges(userId)`

Check and award new badges based on achievements.

**Parameters:**

- `userId` (string): User's ID

**Returns:**

```javascript
[
  {
    id: number,
    name: string,
    description: string,
    requirement: number,
    color: string,
  },
  // Array of newly awarded badges
];
```

---

#### `getLeaderboard(limit)`

Fetch top users by points.

**Parameters:**

- `limit` (number, default: 10): Number of top users to fetch

**Returns:**

```javascript
[
  {
    id: string,
    displayName: string,
    totalPoints: number,
    badges: number[],
    // ... other user data
  }
  // Sorted by totalPoints (descending)
]
```

---

#### `getUserStats(userId)`

Get comprehensive user statistics.

**Parameters:**

- `userId` (string): User's ID

**Returns:**

```javascript
{
  totalPoints: number,
  workoutCount: number,
  totalMinutes: number,
  badges: number[],
  streak: number
}
```

---

#### Quest Constants

```javascript
dailyQuests = [
  {
    id: 1,
    title: "Morning Jog",
    description: "Complete a 5 km jog",
    points: 50,
    duration: 30,
    activityType: "running",
  },
  // ... 4 more quests
];
```

---

#### Badge Definitions

```javascript
badgesConfig = [
  {
    id: 1,
    name: "Beginner",
    description: "Complete first workout",
    requirement: 1,
    color: "#4CAF50",
  },
  // ... 5 more badges
];
```

---

### Activity Service (`services/activityService.js`)

#### `logActivity(userId, activityData)`

Record a new fitness activity.

**Parameters:**

- `userId` (string): User's ID
- `activityData` (object):
  ```javascript
  {
    type: string,           // Activity type
    duration: number,       // Minutes
    distance: number,       // Kilometers (optional)
    intensity: string,      // 'light' | 'medium' | 'high'
    notes: string,         // Optional notes
    caloriesBurned: number // Calculated
  }
  ```

**Returns:**

```javascript
{
  success: boolean,
  id: string,
  activity: object,
  error: string
}
```

---

#### `getTodayActivities(userId)`

Get all activities logged today.

**Parameters:**

- `userId` (string): User's ID

**Returns:**

```javascript
[
  {
    id: string,
    type: string,
    duration: number,
    caloriesBurned: number,
    createdAt: Timestamp,
    // ... other fields
  },
];
```

---

#### `getUserActivities(userId, limitCount)`

Get user's activity history.

**Parameters:**

- `userId` (string): User's ID
- `limitCount` (number, default: 50): Number of activities to fetch

**Returns:**

```javascript
[
  // Same structure as getTodayActivities
  // Sorted by createdAt (descending)
];
```

---

#### `getWeeklyStats(userId)`

Get statistics for the past 7 days.

**Parameters:**

- `userId` (string): User's ID

**Returns:**

```javascript
{
  totalDuration: number,    // Total minutes
  totalCalories: number,    // Total calories burned
  totalPoints: number,      // Total points earned
  workoutCount: number,     // Number of activities
  activities: array         // Detailed activity list
}
```

---

#### Activity Types

```javascript
activityTypes = {
  running: { label: "Running", icon: "🏃", color: "#FF5722" },
  walking: { label: "Walking", icon: "🚶", color: "#8BC34A" },
  cycling: { label: "Cycling", icon: "🚴", color: "#2196F3" },
  strength: { label: "Strength", icon: "💪", color: "#9C27B0" },
  yoga: { label: "Yoga", icon: "🧘", color: "#FF69B4" },
  cardio: { label: "Cardio", icon: "🤸", color: "#FFC107" },
  swimming: { label: "Swimming", icon: "🏊", color: "#00BCD4" },
  sports: { label: "Sports", icon: "⚽", color: "#607D8B" },
};
```

---

### Utility Functions (`utils/helpers.js`)

#### `formatDuration(minutes)`

Format minutes into readable duration.

**Parameters:**

- `minutes` (number): Duration in minutes

**Returns:** string (e.g., "30m" or "1h 30m")

---

#### `calculateCalories(activityType, duration)`

Estimate calories burned.

**Parameters:**

- `activityType` (string): Type of activity
- `duration` (number): Duration in minutes

**Returns:** number (calories burned)

---

#### `getLevelFromPoints(points)`

Get user level based on points.

**Parameters:**

- `points` (number): Total points

**Returns:**

```javascript
{
  level: number,     // 1-5
  name: string,      // 'Beginner', 'Champion', etc.
  color: string      // Hex color code
}
```

---

#### `getMotivationalMessage(points)`

Get a random motivational message based on progress.

**Parameters:**

- `points` (number): User's total points

**Returns:** string (motivational message)

---

#### `validateEmail(email)`

Validate email format.

**Parameters:**

- `email` (string): Email to validate

**Returns:** boolean

---

#### `validatePassword(password)`

Validate password strength.

**Parameters:**

- `password` (string): Password to validate

**Returns:** boolean (min 6 characters)

---

## Context API Reference

### `AppContext` (`context/AppContext.js`)

**Available Context Values:**

```javascript
{
  user: { uid, email },           // Current user
  userProfile: { displayName, email, totalPoints, ... },
  loading: boolean,               // Loading state
  isLoggedIn: boolean,           // Authentication state
  setUser: Function,             // Update user
  setUserProfile: Function,      // Update profile
  setIsLoggedIn: Function        // Update login state
}
```

**Usage:**

```javascript
import { useApp } from "../context/AppContext";

function MyComponent() {
  const { user, isLoggedIn, setIsLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return <Dashboard userId={user.uid} />;
}
```

---

## Screen Navigation

### Navigation Hierarchy

```
RootNavigator
├── Auth Stack (when not logged in)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── App Stack (when logged in)
    ├── AppTabs (Bottom Tab Navigator)
    │   ├── Home → HomeScreen
    │   ├── Quests → QuestsScreen
    │   ├── Leaderboard → LeaderboardScreen
    │   └── Profile → ProfileScreen
    │
    └── LogActivity (Modal)
```

### Navigation Usage

```javascript
// Navigate within tabs
navigation.navigate("Quests");

// Navigate to modal screen
navigation.navigate("LogActivity");

// Navigate to auth
navigation.reset({
  index: 0,
  routes: [{ name: "Auth" }],
});
```

---

## Error Handling

### Common Error Scenarios

**Authentication Errors:**

```javascript
// Invalid email format
"Please enter a valid email address";

// Weak password
"Password must be at least 6 characters";

// User not found
"User not found";

// Invalid credentials
"Email or password is incorrect";
```

**Data Errors:**

```javascript
// Network failure
"Failed to load [data]";

// Invalid input
"Please enter a valid [field]";

// Database error
"Failed to save activity";
```

---

## Performance Optimization Tips

1. **Memoize Components**

   ```javascript
   export const MyScreen = React.memo(({ data }) => {
     // Component code
   });
   ```

2. **Lazy Load Data**

   ```javascript
   const [data, setData] = useState(null);
   useEffect(() => {
     loadData(); // Load on component mount
   }, []);
   ```

3. **Pagination for Lists**

   ```javascript
   const [limit, setLimit] = useState(10);
   const activities = await getActivities(userId, limit);
   ```

4. **Cache User Data**
   ```javascript
   const [userProfile, setUserProfile] = useState(null);
   // Fetch only when needed
   ```

---

## Testing Guide

### Test Cases

**Authentication:**

- ✅ Register with valid email and password
- ✅ Register with invalid email format
- ✅ Register with weak password
- ✅ Login with correct credentials
- ✅ Login with incorrect password
- ✅ Logout successfully

**Gamification:**

- ✅ Complete a quest and earn points
- ✅ Check badge award logic
- ✅ Verify leaderboard ranking
- ✅ Confirm level progression

**Activities:**

- ✅ Log different activity types
- ✅ Verify calorie calculation
- ✅ Test weekly stats
- ✅ View activity history

---

## Troubleshooting

### Common Issues

**Firebase Connection Failed**

- Check credentials in `firebaseConfig.js`
- Verify internet connection
- Ensure Firestore is enabled

**App Crashes on Navigation**

- Check screen component exports
- Verify navigation parameters
- Check for null context usage

**Data Not Persisting**

- Verify Firestore rules
- Check user authentication state
- Review database structure

---

## Version History

- **v1.0.0** (Jan 28, 2026) - Initial release

---

**Last Updated:** January 28, 2026  
**Maintained by:** Development Team
