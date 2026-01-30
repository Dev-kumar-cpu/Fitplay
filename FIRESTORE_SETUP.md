# 🗄️ FitPlay - Firestore Database Setup

## Step-by-Step Database Creation

### Step 1️⃣: Select Edition

**Choose: STANDARD EDITION** ✅

```
✅ Standard Edition (RECOMMENDED FOR YOU)
├── Simple query engine
├── Automatic indexing
├── Free tier included
├── Supports core operations
└── Perfect for Bachelor's project

❌ Enterprise Edition
├── Advanced query engine
├── Self-managed indexing
├── Paid only
└── Not needed for your app
```

**Why Standard Edition:**

- ✅ Completely FREE
- ✅ Perfect for your app
- ✅ Automatic indexes
- ✅ No configuration needed

---

### Step 2️⃣: Database ID and Location

**Configure as follows:**

```
Database ID:
┌─────────────────────────────────┐
│ fit-play-db                     │
└─────────────────────────────────┘

Region/Location:
┌─────────────────────────────────┐
│ us-central1 (default)           │
│ (or closest to you)             │
└─────────────────────────────────┘
```

**Options:**

- `us-central1` - United States (recommended)
- `europe-west1` - Europe
- `asia-southeast1` - Asia
- Choose closest to your location for best performance

---

### Step 3️⃣: Configure

**Firestore Mode: Datastore Mode** ✅

```
Native Mode
├── Document IDs you control
├── Real-time capabilities
└── ✅ RECOMMENDED

Datastore Mode
├── Automatic ID generation
└── Legacy mode
```

**Select: Native Mode (Firestore)**

---

## Complete Setup Checklist

- ✅ Edition: Standard Edition
- ✅ Database ID: `fit-play-db`
- ✅ Location: `us-central1` (or your region)
- ✅ Mode: Native Mode (Firestore)

---

## After Creation

Once database is created, you'll see:

```
✅ Database Status: Active
✅ Collections: (empty - we'll add data)
✅ Rules: (configure security)
✅ Backups: Auto-enabled
```

---

## Next: Add Security Rules

Copy this to your Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Activities collection
    match /activities/{activityId} {
      allow read, write: if request.auth != null;
    }

    // Quests collection
    match /quests/{questId} {
      allow read: if request.auth != null;
    }

    // Leaderboard collection
    match /leaderboard/{document=**} {
      allow read: if request.auth != null;
    }

    // Badges collection
    match /badges/{badgeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish** ✅

---

## Database Structure Ready

Your Firestore will have these collections:

```
Firestore Database
├── users/
│   └── (user profiles)
├── activities/
│   └── (workout logs)
├── quests/
│   └── (daily challenges)
├── leaderboard/
│   └── (rankings)
└── badges/
    └── (achievements)
```

---

## Status

✅ Database ID: fit-play-db
✅ Edition: Standard (FREE)
✅ Mode: Native (Firestore)
✅ Location: us-central1
✅ Security Rules: Added
✅ Ready for data!

---

## Next Steps

1. ✅ Database created
2. ✅ Security rules added
3. ⏳ Get Firebase config
4. ⏳ Update app code
5. ⏳ Run `npm start`
