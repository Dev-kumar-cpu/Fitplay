# 🎮 FitPlay Web App - Complete Navigation Guide

## Navigation Structure

The web app now features 7 main pages accessible from the navigation bar at the top:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏠 Home │ 🎯 Quests │ 📝 Log │ 📸 Media │ 🏆 Rank │ 👤 Profile │ 🔐 Login │
└─────────────────────────────────────────────────────────────────┘
```

## Page Details

### 1. 🏠 Home (`/`)

**Dashboard & Overview**

- Personalized greeting: "Welcome back, Athlete! 💪"
- Motivational messages based on points
- Quick stats display:
  - Total points earned
  - Current level & level name
  - Global rank (#12)
  - Workout count (28)
- Weekly progress bar (60% complete)
- Activity breakdown by type:
  - 🏃 Running: 8 min
  - 💪 Strength: 120 min
  - 🧘 Yoga: 40 min
- Action buttons: "Log Activity", "View Quests"
- Preview of 3 available quests with start buttons

### 2. 🎯 Quests (`/quests`)

**Daily Challenges & Rewards**

- Header: "Daily Quests" with encouragement message
- 5 quest cards in grid layout:
  - Large activity emoji icon
  - Quest title & description
  - Points reward badge (+50pts, +75pts, etc.)
  - Duration goal (⏱️ Goal: XX minutes)
  - Start/Done button (toggles after completion)
- Completion modal:
  - Input for duration spent
  - Point reward display
  - Success animation with 🎉 emoji
  - 1.5 second delay before closing

**Available Quests:**

1. ⏃ Morning Jog (30 min, 50 pts)
2. 💪 Strength Training (45 min, 75 pts)
3. 🧘 Evening Yoga (20 min, 40 pts)
4. ❤️ Cardio Burst (20 min, 60 pts)
5. 🚶 10K Steps (daily, 35 pts)

### 3. 📝 Log (`/log`)

**Activity Logging with Video**

- Header: "Log Your Workout"
- Activity type selector (7 buttons with emoji):
  - 🏃 Running
  - 🚶 Walking
  - 💪 Strength
  - 🧘 Yoga
  - ❤️ Cardio
  - 🚴 Cycling
  - 🏊 Swimming
- Form fields:
  - Duration (minutes) - Required
  - Distance (km) - Optional
  - Calories burned - Optional
  - Notes (textarea) - Optional
- **Video upload input** (accept="video/\*")
- Video preview when selected
- File size display
- Submit button: "Start Workout"
- Success confirmation modal
- Reset button to clear form

### 4. 📸 Media (`/media`)

**Video Gallery & Management**

- Header: "Media Gallery - View and manage your workout videos"
- Upload section:
  - Dashed border drop zone
  - "Upload Your Workout Video" label
  - Click or drag-and-drop to upload
  - "Choose Video" button
- Your Videos section (when videos exist):
  - Count badge: "Your Videos (N)"
  - Grid gallery with video cards:
    - 🎬 Icon
    - Filename (truncated)
    - File size (MB)
    - Upload date
    - Delete button (red)
  - Selected video preview:
    - Full video player with controls
    - Metadata display (name, size, upload date)
- Empty state message if no videos

### 5. 🏆 Rank (`/leaderboard`)

**Global Rankings & Competition**

- Header: "Global Rankings - Compete with athletes worldwide"
- Your Rank card:
  - Medal emoji (🥇 🥈 🥉 or #N)
  - "Your Rank #12"
  - Styled with brand gradient background
- Leaderboard table (rows for each user):
  - Rank medal (🥇 for 1st, 🥈 for 2nd, 🥉 for 3rd)
  - User avatar (40x40px, generated)
  - User info:
    - Display name
    - Level & level name (e.g., "Level 2 • Amateur")
  - Points display (right-aligned, large text)
  - Current user row highlighted with gradient background

**Sample Leaderboard:**

1. 🥇 Sarah (2500 pts, Level 5)
2. 🥈 Mike (2250 pts, Level 4)
3. 🥉 Emma (2100 pts, Level 4)
4. #4 You (1200 pts, Level 2) - **HIGHLIGHTED**
   5-7. Other users...

### 6. 👤 Profile (`/profile`)

**User Stats & Achievements**

- Header section with gradient background:
  - User avatar (80x80px)
  - Display name: "Athlete"
  - Level status: "Level 2 • Amateur"
  - Progress bar to next level
  - Progress text: "1200 / 2500 points to next level"
- Statistics grid (4 cards):
  - 35 Workouts
  - 19 hours 50 minutes Total Time
  - 3 Day Streak 🔥
  - 2 Badges
- Achievements section:
  - "Achievements & Badges" heading
  - Earned badges with:
    - Large emoji icon
    - Badge name
    - Description
    - Color-coded border
- All Available Badges section:
  - Complete 6-badge grid
  - Earned: full color
  - Locked: grayscale + "Locked" label

**Badges:**

- ⭐ Beginner: "Complete your first workout"
- 🌟 Consistent: "Maintain 3-day workout streak"
- ✨ Dedicated: "Complete 10 workouts"
- 💥 Warrior: "Earn 500 quest points"
- 👑 Legendary: "Reach Level 3"
- 💎 Point Master: "Earn 1000 points"

### 7. 🔐 Login (`/login`)

**Authentication Form**

- Header: "Welcome to FitPlay!"
- Toggle button: "Sign up" ⇄ "Log in"
- Form fields (depending on mode):
  - Email (required) - text input
  - Password (required) - password input
  - Display Name (signup only) - text input
- Submit button: "Login" or "Create Account"
- Success message display (1.5 seconds):
  - ✅ emoji
  - "Login successful!"
  - "Redirecting to home..."
- Styled with gradient header

## Navigation Features

### Smart Navigation

- All links active and functional
- Responsive design (adapts to mobile/tablet/desktop)
- Current page indicator available
- Logo/home link in navigation

### URL Structure

- `/` - Home
- `/quests` - Daily Quests
- `/log` - Log Activity
- `/media` - Media Gallery
- `/leaderboard` - Leaderboard
- `/profile` - Profile
- `/login` - Login

## User Journey Examples

### New User Journey

1. Visit `/login` → Create account
2. Redirected to `/` (Home)
3. View daily `/quests`
4. Click "Log Activity" → `/log`
5. Upload first workout video → `/media`
6. Check progress → `/profile`
7. Compare rank → `/leaderboard`

### Daily User Journey

1. Open `/` (Home) - see motivational message
2. Complete quests on `/quests` page
3. Log workout on `/log` (with optional video)
4. Check `/leaderboard` for global ranking
5. View badges/progress on `/profile`
6. Browse videos on `/media`

### Social/Competitive Journey

1. Check `/leaderboard` for rankings
2. See how close to next rank
3. View profile stats on `/profile`
4. Complete more quests for points
5. Log more activities to climb ranks

## Responsive Design

All pages are fully responsive:

- **Desktop** (1200px+): Full layout, side-by-side cards
- **Tablet** (768-1199px): Stack layout, adaptive grids
- **Mobile** (320-767px): Single column, touch-friendly buttons

## Styling System

### Color Scheme

- **Primary Gradient**: `#667eea` → `#764ba2` (Purple/Indigo)
- **Text**: Dark gray (#333) for dark mode friendly
- **Accents**:
  - Green (#4CAF50) for badges
  - Blue (#2196F3) for information
  - Orange (#FF9800) for warnings
  - Red (#F44336) for actions

### Typography

- **Headers** (h1, h2): Bold, 24px-32px
- **Body**: Regular, 14px-16px
- **Labels**: Small, 12px-13px

### Components

- Cards: White background, subtle shadows
- Buttons: Gradient fill, hover effects
- Inputs: Border-based, focus states
- Badges: Color-coded, rounded corners
- Modals: Centered, overlay background

## Keyboard Navigation

All interactive elements are keyboard accessible:

- Tab through navigation links
- Enter to activate buttons
- Arrow keys in form inputs
- Escape to close modals

## Future Navigation Enhancements

1. **Breadcrumbs** - Show current page hierarchy
2. **Mobile Menu** - Hamburger menu for small screens
3. **User Dropdown** - Account settings from navbar
4. **Notifications** - Bell icon with unread count
5. **Search** - Quick search for quests/users
6. **Dark Mode Toggle** - Theme switcher in navbar
7. **Analytics** - View charts and trends

---

**Version**: 2.0  
**Last Updated**: January 30, 2026  
**Status**: ✅ Production Ready with Media Features
