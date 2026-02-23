// Friends Screen - Social features
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getFriends, getIncomingRequests, getOutgoingRequests, searchUsers, acceptFriendRequest, rejectFriendRequest, removeFriend } from '../../services/friendService';

const FriendCard = ({ friend, onRemove, colors }) => {
  return (
    <View style={[styles.friendCard, { backgroundColor: colors.card }]}>
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>
          {friend.displayName?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: colors.text }]}>{friend.displayName}</Text>
        <Text style={[styles.friendStats, { color: colors.textSecondary }]}>
          Level {friend.level || 1} • {friend.totalPoints || 0} pts
        </Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const RequestCard = ({ request, onAccept, onReject, colors }) => {
  return (
    <View style={[styles.requestCard, { backgroundColor: colors.card }]}>
      <View style={styles.requestAvatar}>
        <Text style={styles.avatarText}>
          {request.senderName?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <View style={styles.requestInfo}>
        <Text style={[styles.requestName, { color: colors.text }]}>{request.senderName}</Text>
        <Text style={[styles.requestTime, { color: colors.textSecondary }]}>
          Wants to be your friend
        </Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity onPress={onAccept} style={[styles.acceptButton, { backgroundColor: colors.success }]}>
          <Text style={styles.actionIcon}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReject} style={[styles.rejectButton, { backgroundColor: colors.error }]}>
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const FriendsScreen = ({ navigation }) => {
  const { user, userProfile } = useApp();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [friendsResult, incomingResult, outgoingResult] = await Promise.all([
        getFriends(user.uid),
        getIncomingRequests(user.uid),
        getOutgoingRequests(user.uid),
      ]);

      if (friendsResult.success) setFriends(friendsResult.data);
      if (incomingResult.success) setIncomingRequests(incomingResult.data);
      if (outgoingResult.success) setOutgoingRequests(outgoingResult.data);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const result = await searchUsers(query);
    if (result.success) {
      // Filter out current user and existing friends
      const friendIds = friends.map(f => f.id);
      const filtered = result.data.filter(u => 
        u.id !== user.uid && !friendIds.includes(u.id)
      );
      setSearchResults(filtered);
    }
  };

  const handleSendRequest = (result) => {
    Alert.alert('Friend Request Sent', `You sent a friend request to ${result.data.displayName}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    loadData();
  };

  const handleAccept = async (requestId) => {
    const result = await acceptFriendRequest(requestId, user.uid);
    if (result.success) {
      Alert.alert('Success', 'Friend added!');
      loadData();
    }
  };

  const handleReject = async (requestId) => {
    const result = await rejectFriendRequest(requestId);
    if (result.success) {
      setIncomingRequests(incomingRequests.filter(r => r.id !== requestId));
    }
  };

  const handleRemove = (friend) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: async () => {
          await removeFriend(user.uid, friend.id);
          loadData();
        }},
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>👥 Friends</Text>
        <Text style={styles.headerSubtitle}>{friends.length} friends</Text>
      </LinearGradient>

      {/* Search Button */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setShowSearch(true)}
          style={[styles.searchButton, { backgroundColor: colors.card }]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={[styles.searchText, { color: colors.textSecondary }]}>
            Search for friends...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Friend Requests */}
      {incomingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Friend Requests ({incomingRequests.length})
          </Text>
          {incomingRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={() => handleAccept(request.id)}
              onReject={() => handleReject(request.id)}
              colors={colors}
            />
          ))}
        </View>
      )}

      {/* Friends List */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Friends</Text>
        {friends.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>👫</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>No friends yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Search for friends to connect!
            </Text>
          </View>
        ) : (
          friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onRemove={() => handleRemove(friend)}
              colors={colors}
            />
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Challenges')}
          >
            <Text style={styles.quickActionIcon}>🏅</Text>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Challenges</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={styles.quickActionIcon}>🏆</Text>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />

      {/* Search Modal */}
      <Modal visible={showSearch} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Find Friends</Text>
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Search by name or email..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <ScrollView style={styles.resultsList}>
              {searchResults.map((result) => (
                <View key={result.id} style={[styles.resultCard, { backgroundColor: colors.card }]}>
                  <View style={styles.resultAvatar}>
                    <Text style={styles.avatarText}>
                      {result.displayName?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultName, { color: colors.text }]}>{result.displayName}</Text>
                    <Text style={[styles.resultStats, { color: colors.textSecondary }]}>
                      Level {result.level || 1} • {result.totalPoints || 0} pts
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchText: {
    fontSize: 16,
    color: '#666',
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 15,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  friendStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 10,
  },
  removeIcon: {
    fontSize: 16,
    color: '#f44336',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f093fb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 15,
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  requestTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomPadding: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIcon: {
    fontSize: 20,
    color: '#666',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultsList: {
    maxHeight: 400,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  resultStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default FriendsScreen;
