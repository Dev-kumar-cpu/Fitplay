# 💰 FitPlay - FREE Setup Guide

## Overview

Complete setup using 100% FREE services - No credit card required!

---

## 🎯 Free Architecture

```
┌─────────────────────────────────────────┐
│         FitPlay Mobile App              │
│      (React Native + Expo)              │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────▼─────┐    ┌─────▼──────┐
   │ Firebase  │    │  Firestore │
   │   Auth    │    │  Database  │
   │  (FREE)   │    │  (FREE)    │
   └───────────┘    └────────────┘
```

---

## ✅ FREE Services

| Service       | Plan         | Limit                       | Cost |
| ------------- | ------------ | --------------------------- | ---- |
| Firebase Auth | Spark (FREE) | Unlimited users             | $0   |
| Firestore     | Spark (FREE) | 1GB storage, 100K reads/day | $0   |
| Expo          | FREE         | Build & test                | $0   |
| GitHub        | FREE         | Code hosting                | $0   |

**Total Cost: $0/month** ✅

---

## 🚀 Free Setup Instructions

### Step 1: Create Firebase Account

```
1. Go to https://console.firebase.google.com
2. Click "Create Project"
3. Enter project name: "Fit Play"
4. Select "Spark Plan" (FREE)
5. Click "Create"
```

**Why Spark Plan is Perfect:**

- ✅ Unlimited users
- ✅ 1GB Firestore storage (more than enough for your app)
- ✅ 100,000 read operations per day (plenty for testing)
- ✅ No credit card required
- ✅ Never charged

---

### Step 2: Enable Authentication (FREE)

```
1. In Firebase Console → Authentication
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable" → Click "Save"
5. Done! (No cost)
```

---

### Step 3: Create Firestore Database (FREE)

```
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Select "Start in production mode"
4. Choose region (default is fine)
5. Click "Create"
```

**Spark Plan Includes:**

- 1GB free storage
- 50,000 reads/day free
- 20,000 writes/day free
- 20,000 deletes/day free

---

### Step 4: Add Security Rules

Copy this to your Firestore Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow reading all activities
    match /activities/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Allow reading all quests
    match /quests/{document=**} {
      allow read: if request.auth != null;
    }

    // Allow reading leaderboard
    match /leaderboard/{document=**} {
      allow read: if request.auth != null;
    }

    // Allow reading badges
    match /badges/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Click "Publish"

---

### Step 5: Get Your Free Config

```
1. Go to Project Settings (⚙️)
2. Scroll to "Your apps"
3. Click "Web" icon
4. Copy the config
```

---

### Step 6: Update Your App

Create/Update `config/firebaseConfig.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fit-play-5da58.firebaseapp.com",
  projectId: "fit-play-5da58",
  storageBucket: "fit-play-5da58.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

### Step 7: Install Dependencies

```bash
cd "d:\shaf\frnds\kiyas\top up\project\Fit Play"
npm install
```

---

### Step 8: Start Testing

```bash
npm start
```

Then:

- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

---

## 💾 FREE Database Structure

Your Firestore collections:

```
Firestore
├── users/
│   ├── user1
│   │   ├── email: "test@fitplay.com"
│   │   ├── displayName: "Test User"
│   │   ├── totalPoints: 0
│   │   ├── level: 1
│   │   └── createdAt: timestamp
│   └── user2
│
├── activities/
│   ├── activity1
│   │   ├── userId: "user1"
│   │   ├── type: "Running"
│   │   ├── duration: 30
│   │   ├── calories: 360
│   │   └── date: timestamp
│   └── activity2
│
├── quests/
│   ├── quest1: { name: "Morning Jog", points: 50 }
│   ├── quest2: { name: "Strength Training", points: 75 }
│   └── ...
│
└── badges/
    ├── badge1: { name: "Beginner", threshold: 1 }
    ├── badge2: { name: "Consistent", threshold: 5 }
    └── ...
```

---

## 🎯 Usage Examples

### Create User (FREE)

```javascript
// Automatically free with Firebase Auth
const user = await createUserWithEmailAndPassword(auth, email, password);
```

### Save Activity (FREE - Firestore write)

```javascript
await addDoc(collection(db, "activities"), {
  userId: currentUser.uid,
  type: "Running",
  duration: 30,
  calories: 360,
  date: new Date(),
});
```

### Get Leaderboard (FREE - Firestore reads)

```javascript
const snapshot = await query(
  collection(db, "users"),
  orderBy("totalPoints", "desc"),
  limit(50),
);
```

---

## ✅ Spark Plan Limits Explained

### Daily Limits (Reset at UTC midnight)

```
📖 Read Operations:   100,000/day (usually use ~1,000)
✍️  Write Operations:  20,000/day (usually use ~500)
🗑️  Delete Operations: 20,000/day (usually use ~100)
```

### Storage

```
💾 Total Storage: 1GB (you'll use ~50MB)
📊 Collections: Unlimited
📝 Documents: Unlimited
```

### Connections

```
👥 Concurrent Users: Unlimited
🔑 API Requests: Unlimited
⏱️  Query Complexity: Unlimited
```

---

## 🚨 Will You Hit Limits?

**Typical Daily Usage:**

- 10 users registering: 10 writes
- 50 activities logged: 50 writes
- 100 home screen loads: 100 reads
- 50 leaderboard views: 50 reads
- **Total: ~300 operations/day** ✅

**Conclusion:** You'll use less than 1% of free limits! 🎉

---

## 💡 Cost Analysis

### Traditional Setup

- Firebase Auth: $0 (free tier)
- PostgreSQL: $15-50/month
- **Total: $15-50/month**

### Your FREE Setup

- Firebase Auth: $0 ✅
- Firestore: $0 ✅
- **Total: $0/month** 🎉

**Savings: $15-50/month = $180-600/year**

---

## 🎓 When to Upgrade (Optional)

You'd only need to pay if you hit these milestones:

```
📊 Trigger 1: Over 100,000 reads/day
   Upgrade Cost: $0.06 per 100K reads

📊 Trigger 2: Over 1GB storage
   Upgrade Cost: $0.18 per GB

📊 Trigger 3: Over 50,000 simultaneous connections
   Upgrade Cost: $1/GB bandwidth
```

**Reality:** None of these will happen during your Bachelor's project!

---

## ✅ Free Setup Checklist

- ✅ Firebase Account Created (FREE)
- ✅ Spark Plan Selected (FREE)
- ✅ Authentication Enabled (FREE)
- ✅ Firestore Database Created (FREE)
- ✅ Security Rules Added (FREE)
- ✅ Config Updated (FREE)
- ✅ Dependencies Installed (FREE)
- ✅ Ready to Test (FREE) 🎉

---

## 🚀 Next Steps

1. **Complete Setup** - Follow steps above
2. **Run App** - `npm start`
3. **Test Features** - Use TESTING_GUIDE.md
4. **Submit Project** - All FREE!

---

## 📞 Support

**Firebase Free Tier Support:**

- Documentation: https://firebase.google.com/docs
- Community: https://stackoverflow.com/questions/tagged/firebase
- Status: https://status.firebase.google.com

---

## 🎉 Conclusion

**Your FitPlay app is completely FREE:**

- ✅ No credit card
- ✅ No hidden costs
- ✅ Unlimited users
- ✅ Perfect for Bachelor's project
- ✅ Professional production-ready

**Let's build it! 🚀**
