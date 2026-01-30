# 📊 FitPlay - PostgreSQL Database Schema

## Overview

Auto-generated schema for Firebase Data Connect using PostgreSQL

---

## Tables

### 👤 User Table

```sql
type User @table {
  email: String!
  displayName: String!
  totalPoints: Int!
  level: Int!
  createdAt: Timestamp!
  photoUrl: String
  currentStreak: Int
}
```

**Purpose:** Stores user account information

- `email` - Unique identifier for login
- `displayName` - User's name (shown in leaderboard)
- `totalPoints` - Accumulated gamification points
- `level` - Current level (1-5)
- `currentStreak` - Consecutive days active
- `photoUrl` - Optional profile picture
- `createdAt` - Account creation date

---

### 🏃 Activity Table

```sql
type Activity @table {
  user: User!
  activityType: String!
  durationMinutes: Int!
  caloriesBurned: Int!
  activityDate: Date!
  createdAt: Timestamp!
  distanceKm: Float
}
```

**Purpose:** Logs all user fitness activities

- `user` - Foreign key to User
- `activityType` - Type of exercise (Running, Walking, Cycling, etc.)
- `durationMinutes` - How long the activity lasted
- `caloriesBurned` - Calculated calories burned
- `distanceKm` - Optional distance for tracking activities
- `activityDate` - When the activity occurred
- `createdAt` - When logged to system

**Activity Types:**

- Running (12 cal/min)
- Walking (5 cal/min)
- Cycling (10 cal/min)
- Strength (8 cal/min)
- Yoga (4 cal/min)
- Cardio (11 cal/min)
- Swimming (10 cal/min)
- Sports (9 cal/min)

---

### 🎯 Quest Table

```sql
type Quest @table {
  description: String!
  pointsAwarded: Int!
  questDate: Date!
  createdAt: Timestamp!
  activityTypeHint: String
}
```

**Purpose:** Defines daily quests and challenges

- `description` - Quest name and details
- `pointsAwarded` - Points user earns when completed
- `questDate` - Date quest is available
- `activityTypeHint` - Suggests which activity to do
- `createdAt` - When quest was created

**Default Quests:**

1. Morning Jog (50 pts) - Running
2. Strength Training (75 pts) - Strength
3. Yoga Session (40 pts) - Yoga
4. Cardio Blast (60 pts) - Cardio
5. Step Challenge (55 pts) - Walking

---

### 🔗 UserQuest Table (Junction)

```sql
type UserQuest @table(key: ["user", "quest"]) {
  user: User!
  quest: Quest!
  isCompleted: Boolean!
  completedAt: Timestamp!
}
```

**Purpose:** Tracks quest completion by users

- Composite primary key: user + quest
- `isCompleted` - Whether user finished the quest
- `completedAt` - Timestamp when quest was completed
- Prevents duplicate quest completions

---

### 🏆 Badge Table

```sql
type Badge @table {
  name: String!
  description: String!
  pointsThreshold: Int!
  createdAt: Timestamp!
}
```

**Purpose:** Defines achievement badges

- `name` - Badge name (e.g., "Beginner", "Consistent")
- `description` - What it means to earn this badge
- `pointsThreshold` - Points required to unlock
- `createdAt` - When badge was created

**Default Badges:**

1. **Beginner** (1+ quest) - First workout completed
2. **Consistent** (5+ quests) - Completed 5 workouts
3. **Athlete** (10+ quests) - Completed 10 workouts
4. **Champion** (25+ quests) - Completed 25 workouts
5. **Legend** (50+ quests) - Completed 50 workouts
6. **Master** (100+ quests) - Completed 100 workouts

---

### 🎖️ UserBadge Table (Junction)

```sql
type UserBadge @table(key: ["user", "badge"]) {
  user: User!
  badge: Badge!
  unlockedAt: Timestamp!
}
```

**Purpose:** Tracks badge unlocks by users

- Composite primary key: user + badge
- `unlockedAt` - When user earned the badge
- Prevents duplicate badges for same user

---

## Schema Relationships

```
User
├── Activity (1:many) - User has many activities
├── UserQuest (1:many) - User has many quest completions
└── UserBadge (1:many) - User has many badges

Quest
├── UserQuest (1:many) - Quest completed by many users
└── (daily quests)

Badge
└── UserBadge (1:many) - Badge earned by many users
```

---

## Key Features

✅ **Relational Design** - Proper foreign keys and relationships
✅ **Timestamps** - Track creation and completion times
✅ **Composite Keys** - Junction tables prevent duplicates
✅ **Type Safety** - Strong typing with required fields
✅ **Scalability** - Normalized database structure
✅ **Data Integrity** - Foreign key constraints

---

## Next Steps

1. **Deploy Schema** - Accept and deploy in Firebase Console
2. **Add Seed Data** - Insert default quests and badges
3. **Configure Security Rules** - Restrict user access
4. **Test Queries** - Verify all operations work
5. **Connect App** - Update services to use Data Connect

---

## Example Queries

### Get User Profile

```sql
SELECT email, displayName, totalPoints, level, currentStreak
FROM User
WHERE email = 'user@example.com'
```

### Get User's Activities

```sql
SELECT activityType, durationMinutes, caloriesBurned, activityDate
FROM Activity
WHERE user.email = 'user@example.com'
ORDER BY activityDate DESC
```

### Get User's Completed Quests

```sql
SELECT Quest.description, Quest.pointsAwarded, UserQuest.completedAt
FROM UserQuest
JOIN Quest ON UserQuest.quest = Quest.id
WHERE UserQuest.user.email = 'user@example.com'
AND UserQuest.isCompleted = true
```

### Get User's Badges

```sql
SELECT Badge.name, Badge.description, UserBadge.unlockedAt
FROM UserBadge
JOIN Badge ON UserBadge.badge = Badge.id
WHERE UserBadge.user.email = 'user@example.com'
ORDER BY UserBadge.unlockedAt DESC
```

### Get Leaderboard

```sql
SELECT displayName, totalPoints, level
FROM User
ORDER BY totalPoints DESC
LIMIT 50
```

---

## Status

✅ **Schema Generated** - Ready for deployment
⏳ **Next:** Deploy to PostgreSQL via Data Connect
⏳ **Then:** Update app services to connect
