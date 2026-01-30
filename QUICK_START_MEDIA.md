# 🚀 Quick Start - FitPlay Web App with Media Support

## ⚡ Get Started in 30 Seconds

### 1. Open the App

```
http://localhost:5173
```

### 2. Explore Pages (Click Navigation Links)

- 🏠 **Home**: Dashboard with stats and quests
- 🎯 **Quests**: Daily challenges (click Start to try completion)
- 📝 **Log**: Log workouts - try uploading a video!
- 📸 **Media**: Video gallery - upload and manage videos
- 🏆 **Rank**: Global leaderboard with rankings
- 👤 **Profile**: Your profile with level and badges
- 🔐 **Login**: Login/signup form

## 📸 Try Video Upload (The New Feature!)

### Steps:

1. Click **📸 Media** button in top navigation
2. Click "Choose Video" or drag a video file
3. Video appears in gallery below
4. Click video to preview with playback controls
5. Click "Delete" to remove

**Or try in LogActivity page:**

1. Click **📝 Log** button
2. Select activity type (e.g., 🏃 Running)
3. Enter duration (e.g., 30)
4. Click "Choose Video" to attach
5. Click "Start Workout" to submit
6. See 🎉 success animation!

## 👤 New Feature: User Avatars

Visit any of these pages to see dynamically generated avatars:

### Profile Page (👤)

- Large avatar at the top (80px)
- Shows your initials
- Purple gradient background

### Leaderboard Page (🏆)

- Small avatars next to each user (40px)
- Generated from user names
- Hover to see full name

## 🏆 New Feature: Enhanced Visuals

### Activity Icons (🏃💪🧘)

Appear on these pages:

- **Home**: Activity breakdown section
- **Quests**: Each quest card
- **LogActivity**: Activity type selector (large emoji buttons)

### Badge System

Visit **👤 Profile** to see:

- ⭐ Earned badges (unlocked)
- 🌟 Locked badges (grayscale)
- Color-coded borders
- Detailed descriptions

### Medal Rankings (🥇🥈🥉)

Visit **🏆 Rank** to see:

- 🥇 1st place user
- 🥈 2nd place user
- 🥉 3rd place user
- Your rank highlighted with special color

## 🎬 Video Upload Details

### Supported Formats

- MP4, WebM, MOV, AVI
- Any format your browser supports
- Max file size limited by browser memory

### Features

✅ Drag and drop support  
✅ Click to select files  
✅ File size display  
✅ Upload date tracking  
✅ Video preview with controls  
✅ Delete functionality  
✅ Gallery grid view

### Storage Note

Videos are stored in browser memory - they'll clear when you refresh the page. For persistent storage, we'll integrate Firebase Cloud Storage soon!

## 📊 Data Displayed

All pages show **mock data** for demonstration:

### Home Stats

- 1200 points earned
- Level 2 (Amateur)
- Rank #12 globally
- 28 workouts completed

### Quest Completion

- 5 daily quests available
- Click "Start" to see completion modal
- Enter duration to "complete"
- See point reward display

### Leaderboard

- 7 top global users
- Your rank highlighted
- Medal system for top 3
- Level information per user

### Profile

- 35 workouts
- 19 hours 50 minutes trained
- 3-day streak 🔥
- 2 badges earned
- 4 more badges locked

## 🎨 Design Features

### Colors

- **Purple Gradient**: `#667eea` → `#764ba2`
- **Green Accents**: Beginner badge
- **Blue Accents**: Consistent badge
- **Orange Accents**: Dedicated badge
- **Red Accents**: Warrior badge
- **Gold Accents**: Legendary badge

### Responsive Design

Works on:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1200px+)

Try resizing your browser to see adaptive layout!

## ⌨️ Keyboard Navigation

- **Tab**: Move between links/buttons
- **Enter**: Activate buttons
- **Escape**: Close modals/dialogs
- **Arrow Keys**: Form navigation

## 🔗 URL Routes

| Page          | URL            |
| ------------- | -------------- |
| Home          | `/`            |
| Quests        | `/quests`      |
| Log Activity  | `/log`         |
| Media Gallery | `/media`       |
| Leaderboard   | `/leaderboard` |
| Profile       | `/profile`     |
| Login         | `/login`       |

## 🎯 Things to Try

### 1. Complete a Quest

- Go to **🎯 Quests**
- Click "Start" on any quest
- Enter a duration (e.g., 30)
- See success animation

### 2. Upload a Video

- Go to **📸 Media**
- Click "Choose Video" (or drag one)
- See file info displayed
- Click to preview
- Delete to remove

### 3. Check Your Progress

- Go to **👤 Profile**
- See level bar (1200/2500 pts)
- View earned badges
- See all available badges

### 4. View Rankings

- Go to **🏆 Rank**
- See global leaderboard
- Medal indicators for top 3
- Your rank highlighted

### 5. Log Workout

- Go to **📝 Log**
- Select activity type
- Enter duration
- Attach video (optional)
- See success message

## 💾 Data Persistence

**Current Status**: ❌ Not persistent (demo mode)

- Refresh page → data resets
- Use mock data for testing
- Ready for Firebase integration

**Coming Soon**: ✅ Firebase Cloud Storage

- Videos saved to cloud
- User data in Firestore
- Real authentication
- Cross-device sync

## 🚀 Next Steps

### To Integrate Firebase:

1. Create Firebase project
2. Add real credentials to `config/firebaseConfig.js`
3. Update services to use real API calls
4. Deploy to production domain

### To Use Real Videos:

1. Install Firebase Storage SDK
2. Update `LogActivity.jsx` to upload to cloud
3. Create video processing pipeline
4. Display videos from cloud URLs

## 📞 Troubleshooting

**Page won't load?**

- Check if server is running: `npm run dev`
- Try clearing browser cache
- Check browser console for errors (F12)

**Videos disappear after refresh?**

- Videos stored in browser memory only
- Expected behavior - not a bug
- Will be fixed with Firebase integration

**Avatars not showing?**

- Check internet connection
- Service uses ui-avatars.com (external)
- Try refreshing page

**Styling looks wrong?**

- Clear browser cache (Ctrl+Shift+Delete)
- Try different browser
- Check if CSS loaded (inspect styles in DevTools)

## 📚 Documentation

For more details, see:

- **IMPLEMENTATION_SUMMARY.md** - Complete feature list
- **NAVIGATION_GUIDE.md** - Detailed page descriptions
- **MEDIA_FEATURES.md** - Media support guide
- **README.md** - Project overview

## ✅ Checklist

Before deploying to production:

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile browser
- [ ] Verify all links work
- [ ] Upload and preview video
- [ ] Check profile avatars load
- [ ] View all badge icons
- [ ] Complete a quest
- [ ] Verify responsive layout

---

**Ready to explore?** Open http://localhost:5173 and start using FitPlay! 🎉

**Questions?** Check the other documentation files or review the source code in `web/src/`

**Want to contribute?** The code is ready for new features - add Firebase, real images, or advanced analytics!
