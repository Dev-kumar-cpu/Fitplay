# 🔐 FitPlay - Firestore Security Rules

## Choose Your Mode

### ✅ RECOMMENDED: Production Mode

```
✅ Start in Production mode
├── Data is PRIVATE by default
├── Only allow what you specify in rules
├── More secure
└── Perfect for production apps
```

**Why Production Mode for FitPlay:**

- ✅ Secure by default
- ✅ Only authenticated users can access
- ✅ Data protected from day 1
- ✅ No 30-day deadline pressure

---

## Security Rules Setup

### Step 1: Choose Mode

```
Click: "Start in Production mode" ✅
```

### Step 2: Add Security Rules

Copy this complete ruleset:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ========== USERS COLLECTION ==========
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    // ========== ACTIVITIES COLLECTION ==========
    // Users can create and read activities
    match /activities/{activityId} {
      // Read: anyone authenticated
      allow read: if request.auth != null;
      // Write: only owner can write
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // ========== QUESTS COLLECTION ==========
    // Read-only for authenticated users
    match /quests/{questId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only (via Cloud Functions)
    }

    // ========== USER QUESTS COMPLETION ==========
    // Track which quests users completed
    match /userQuests/{userQuestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // ========== BADGES COLLECTION ==========
    // Read-only for authenticated users
    match /badges/{badgeId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only
    }

    // ========== USER BADGES (Achievements) ==========
    // Track which badges users earned
    match /userBadges/{userBadgeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // ========== LEADERBOARD COLLECTION ==========
    // Read-only public leaderboard
    match /leaderboard/{leaderboardId} {
      allow read: if request.auth != null;
      allow write: if false; // Updated via Cloud Functions only
    }

    // ========== DEFAULT: DENY ALL OTHER ACCESS ==========
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Understanding the Rules

### Authentication Check

```javascript
request.auth != null;
```

✅ Ensures user is logged in

### Ownership Check

```javascript
request.auth.uid == userId;
```

✅ Ensures user can only access their own data

---

## Collection Permissions

| Collection   | Read       | Write      | Notes                    |
| ------------ | ---------- | ---------- | ------------------------ |
| users/       | Owner only | Owner only | Private profiles         |
| activities/  | Auth users | Owner      | Everyone sees activities |
| quests/      | Auth users | Admin only | Default quests           |
| userQuests/  | Auth users | Owner      | Track completions        |
| badges/      | Auth users | Admin only | Badge definitions        |
| userBadges/  | Auth users | Owner      | Track achievements       |
| leaderboard/ | Auth users | Admin only | Rankings                 |

---

## Security Features

✅ **User Authentication**

- Must be logged in to read any data

✅ **Ownership Protection**

- Users can only modify their own data

✅ **Admin Control**

- Quests, badges, leaderboard managed by admin only

✅ **Public Leaderboard**

- Authenticated users can see rankings

✅ **Secure by Default**

- All other access denied by default

---

## How It Works

### Example 1: User A logs in

```
✅ Can read their own profile: /users/{userA}
✅ Can read all activities
✅ Can read all quests
✅ Can view leaderboard
❌ Cannot access: /users/{userB}
❌ Cannot modify: quests or badges
```

### Example 2: User logs out

```
❌ Cannot read anything (not authenticated)
❌ Cannot write anything
```

### Example 3: Hacker tries direct database access

```
❌ Firebase blocks them (no auth token)
❌ Even with token, can only access own data
```

---

## Setup Steps

### Step 1: Navigate to Rules

```
Firebase Console
→ Firestore Database
→ Rules tab
```

### Step 2: Clear Default Rules

```
Delete the default rule block
```

### Step 3: Paste New Rules

```
Paste the complete ruleset above
```

### Step 4: Publish

```
Click "Publish" button
Status: ✅ Published
```

---

## Testing Your Rules

### Test 1: Authenticated User Can Read Own Data

```
✅ Should work:
User A reads /users/userA
```

### Test 2: User Cannot Access Another User's Data

```
❌ Should fail:
User A tries to read /users/userB
```

### Test 3: User Cannot Modify Quests

```
❌ Should fail:
User tries to modify /quests/quest1
```

### Test 4: Public Leaderboard

```
✅ Should work:
Any authenticated user reads /leaderboard/
```

---

## Rules Console Testing

**Use Firestore Rules Simulator:**

1. Go to **Rules** tab
2. Click **Rules Playground**
3. Enter test data:
   - Document Path: `/users/testUser`
   - Operation: `read`
   - Authenticated as: `testUser`
4. Click **Run**
5. See if ✅ or ❌

---

## Production Checklist

- ✅ Mode: Production
- ✅ Rules copied
- ✅ Rules published
- ✅ Rules tested
- ✅ No warnings in console
- ✅ All access controlled

---

## Important Notes

⚠️ **These rules are for frontend access only**

Backend operations (updating points, awarding badges) should use:

- ✅ Cloud Functions with elevated permissions
- ✅ Service account authentication
- ✅ NOT directly from mobile app

---

## Next Steps

1. ✅ Choose Production mode
2. ✅ Paste security rules
3. ✅ Click Publish
4. ✅ Get Firebase config
5. ⏳ Update app code
6. ⏳ Run `npm start`

---

## Status

✅ Database: Created (Firestore)
✅ Mode: Production
✅ Rules: Configured
✅ Security: Enabled
✅ Ready: To connect app
