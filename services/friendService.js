import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc, 
  getDocs, 
  query, 
  where,
  or,
  and,
  serverTimestamp,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Collections
const FRIENDS_COLLECTION = 'friends';
const FRIEND_REQUESTS_COLLECTION = 'friend_requests';
const ACTIVITY_FEED_COLLECTION = 'activity_feed';

// Send friend request
export const sendFriendRequest = async (senderId, receiverId, senderName) => {
  try {
    // Check if already friends or request exists
    const existingRequest = await checkFriendRequest(senderId, receiverId);
    if (existingRequest) {
      return { success: false, error: 'Friend request already exists' };
    }

    const friendRequest = {
      senderId,
      receiverId,
      senderName: senderName || 'User',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, FRIEND_REQUESTS_COLLECTION), friendRequest);
    return { success: true, data: { id: docRef.id, ...friendRequest } };
  } catch (error) {
    console.error('Error sending friend request:', error);
    return { success: false, error: error.message };
  }
};

// Check if friend request exists
export const checkFriendRequest = async (senderId, receiverId) => {
  try {
    const q = query(
      collection(db, FRIEND_REQUESTS_COLLECTION),
      where('senderId', '==', senderId),
      where('receiverId', '==', receiverId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
};

// Get incoming friend requests
export const getIncomingRequests = async (userId) => {
  try {
    const q = query(
      collection(db, FRIEND_REQUESTS_COLLECTION),
      where('receiverId', '==', userId),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error('Error getting friend requests:', error);
    return { success: false, error: error.message };
  }
};

// Get outgoing friend requests
export const getOutgoingRequests = async (userId) => {
  try {
    const q = query(
      collection(db, FRIEND_REQUESTS_COLLECTION),
      where('senderId', '==', userId),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error('Error getting outgoing requests:', error);
    return { success: false, error: error.message };
  }
};

// Accept friend request
export const acceptFriendRequest = async (requestId, userId) => {
  try {
    // Get request details
    const requestDoc = await getDoc(doc(db, FRIEND_REQUESTS_COLLECTION, requestId));
    if (!requestDoc.exists()) {
      return { success: false, error: 'Request not found' };
    }
    
    const requestData = requestDoc.data();
    
    // Update request status
    await updateDoc(doc(db, FRIEND_REQUESTS_COLLECTION, requestId), {
      status: 'accepted',
      respondedAt: serverTimestamp(),
    });

    // Add each other as friends
    await addDoc(collection(db, FRIENDS_COLLECTION), {
      userId: requestData.senderId,
      friendId: requestData.receiverId,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, FRIENDS_COLLECTION), {
      userId: requestData.receiverId,
      friendId: requestData.senderId,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return { success: false, error: error.message };
  }
};

// Reject friend request
export const rejectFriendRequest = async (requestId) => {
  try {
    await updateDoc(doc(db, FRIEND_REQUESTS_COLLECTION, requestId), {
      status: 'rejected',
      respondedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return { success: false, error: error.message };
  }
};

// Get friends list
export const getFriends = async (userId) => {
  try {
    const q = query(
      collection(db, FRIENDS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    const friends = [];
    for (const docSnap of snapshot.docs) {
      const friendData = docSnap.data();
      // Get friend profile
      const friendProfile = await getDoc(doc(db, 'users', friendData.friendId));
      if (friendProfile.exists()) {
        friends.push({
          id: friendProfile.id,
          ...friendProfile.data(),
          friendSince: friendData.createdAt,
        });
      }
    }

    return { success: true, data: friends };
  } catch (error) {
    console.error('Error getting friends:', error);
    return { success: false, error: error.message };
  }
};

// Remove friend
export const removeFriend = async (userId, friendId) => {
  try {
    // Find and delete both friendship documents
    const q1 = query(
      collection(db, FRIENDS_COLLECTION),
      where('userId', '==', userId),
      where('friendId', '==', friendId)
    );
    const snapshot1 = await getDocs(q1);
    snapshot1.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    const q2 = query(
      collection(db, FRIENDS_COLLECTION),
      where('userId', '==', friendId),
      where('friendId', '==', userId)
    );
    const snapshot2 = await getDocs(q2);
    snapshot2.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing friend:', error);
    return { success: false, error: error.message };
  }
};

// Search users (by email or display name)
export const searchUsers = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - in production, consider Algolia or similar
    const allUsers = [];
    const snapshot = await getDocs(collection(db, 'users'));
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const emailMatch = userData.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = userData.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (emailMatch || nameMatch) {
        // Don't include sensitive data
        allUsers.push({
          id: doc.id,
          displayName: userData.displayName,
          email: userData.email,
          totalPoints: userData.totalPoints,
          level: userData.level,
        });
      }
    });

    return { success: true, data: allUsers.slice(0, 20) }; // Limit results
  } catch (error) {
    console.error('Error searching users:', error);
    return { success: false, error: error.message };
  }
};

// Post to activity feed
export const postToFeed = async (userId, activityData) => {
  try {
    const post = {
      userId,
      type: activityData.type || 'workout',
      activityType: activityData.activityType,
      duration: activityData.duration,
      points: activityData.points,
      message: activityData.message || '',
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, ACTIVITY_FEED_COLLECTION), post);
    return { success: true, data: { id: docRef.id, ...post } };
  } catch (error) {
    console.error('Error posting to feed:', error);
    return { success: false, error: error.message };
  }
};

// Get activity feed
export const getActivityFeed = async (userId, friendIds = []) => {
  try {
    if (friendIds.length === 0) {
      return { success: true, data: [] };
    }

    const q = query(
      collection(db, ACTIVITY_FEED_COLLECTION),
      where('userId', 'in', friendIds.slice(0, 10))
    );
    const snapshot = await getDocs(q);
    
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    // Sort by date (newest first)
    posts.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error('Error getting activity feed:', error);
    return { success: false, error: error.message };
  }
};

// Like a post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, ACTIVITY_FEED_COLLECTION, postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error liking post:', error);
    return { success: false, error: error.message };
  }
};

// Unlike a post
export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, ACTIVITY_FEED_COLLECTION, postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error unliking post:', error);
    return { success: false, error: error.message };
  }
};

// Add comment to post
export const commentOnPost = async (postId, userId, userName, comment) => {
  try {
    const postRef = doc(db, ACTIVITY_FEED_COLLECTION, postId);
    const newComment = {
      id: Date.now().toString(),
      userId,
      userName,
      comment,
      createdAt: new Date().toISOString(),
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });
    
    return { success: true, data: newComment };
  } catch (error) {
    console.error('Error commenting on post:', error);
    return { success: false, error: error.message };
  }
};
