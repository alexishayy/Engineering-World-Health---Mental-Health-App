import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/auth/useAuth";
import { db } from "../../src/firebase/firebaseConfig";
import {
  FriendSummary,
  UserDocument,
  acceptFriendRequest,
  declineFriendRequest,
  sendCheerToFriend,
  removeFriend,
  getTimeAgo,
} from "../../src/db/users";
import { doc, onSnapshot } from "firebase/firestore";
import { useStreak } from "../../context/StreakContext";

const STORAGE_KEY_ANNOUNCEMENTS_DATE = "friends_announcements_last_shown_date";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Using Firestore's `FriendSummary` type for friends from the server.

type Announcement = {
  emoji: string;
  text: string;
};

const TOTAL_DAILY_CHALLENGES = 3;
const COMPLETED_DAILY_CHALLENGES = 1;
const REMAINING_DAILY_CHALLENGES =
  TOTAL_DAILY_CHALLENGES - COMPLETED_DAILY_CHALLENGES;

const ANNOUNCEMENT_INTERVAL_MS = 4000;
const ANNOUNCEMENT_FADE_MS = 350;

function Avatar({
  initial,
  color,
  size = 48,
}: {
  initial: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.avatarInitial, { fontSize: size * 0.42 }]}>
        {initial}
      </Text>
    </View>
  );
}

function getAvatarInitial(name: string) {
  return name?.trim()?.[0]?.toUpperCase() ?? "?";
}

function getAvatarColor(name: string) {
  const colors = [
    "#FF9600",
    "#1CB0F6",
    "#CE82FF",
    "#58CC02",
    "#FF4B4B",
    "#FFC800",
  ];
  return colors[(name?.trim()?.charCodeAt(0) ?? 65) % colors.length];
}

export default function FriendsScreen() {
  const { user } = useAuth();
  const [announceIdx, setAnnounceIdx] = useState(0);
  const [announcementsVisible, setAnnouncementsVisible] = useState<
    boolean | null
  >(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const outlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user) {
      setUserDoc(null);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserDoc(snapshot.data() as UserDocument);
      } else {
        setUserDoc(null);
      }
    });

    return unsubscribe;
  }, [user]);

  const { streak } = useStreak();
  const incomingRequests = useMemo(
    () => userDoc?.incomingFriendRequests ?? [],
    [userDoc?.incomingFriendRequests]
  );
  // Deduplicate friends by id to avoid duplicate cards if DB contains duplicates
  const friendCards: FriendSummary[] = Array.from(
    new Map((userDoc?.friends ?? []).map((f) => [f.id, f])).values()
  );
  const hasRealFriends = friendCards.length > 0;
  const recentCheers = userDoc?.recentCheers ?? [];

  const sortedCheers = [...recentCheers]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const announcementItems = useMemo(() => {
    const items: Announcement[] = [];

    const uniqueCheerers = Array.from(
      new Map(sortedCheers.map((cheer) => [cheer.cheererId, cheer.cheererName])).values()
    );

    if (uniqueCheerers.length > 0) {
      if (uniqueCheerers.length === 1) {
        items.push({
          emoji: "👏",
          text: `${uniqueCheerers[0]} cheered you on!`,
        });
      } else {
        const otherCount = uniqueCheerers.length - 1;
        items.push({
          emoji: "👏",
          text: `${uniqueCheerers[0]} and ${otherCount} other${
            otherCount === 1 ? "" : "s"
          } cheered you on!`,
        });
      }
    }

    if (incomingRequests.length > 0) {
      items.push({
        emoji: "💌",
        text:
          incomingRequests.length === 1
            ? `${incomingRequests[0].name} sent you a friend request.`
            : `${incomingRequests.length} people sent you friend requests.`,
      });
    }

    items.push({
      emoji: "📅",
      text: `You have ${REMAINING_DAILY_CHALLENGES} challenge${
        REMAINING_DAILY_CHALLENGES === 1 ? "" : "s"
      } left today!`,
    });

    items.push({
      emoji: "🔥",
      text: `Your streak is ${streak} day${streak === 1 ? "" : "s"} now.`,
    });

    return items;
  }, [incomingRequests, sortedCheers, streak]);

  const announcement =
    announcementItems.length > 0
      ? announcementItems[announceIdx % announcementItems.length]
      : null;

  const handleAccept = async (request: FriendSummary) => {
    if (!user || !userDoc) return;

    setProcessingRequests((prev) => new Set(prev).add(request.id));
    try {
      await acceptFriendRequest(
        {
          id: user.uid,
          name: userDoc.name,
          email: userDoc.email,
        },
        request
      );
    } catch (error: any) {
      Alert.alert(
        "Could not accept request",
        error?.message || "Please try again."
      );
    } finally {
      setProcessingRequests((prev) => {
        const next = new Set(prev);
        next.delete(request.id);
        return next;
      });
    }
  };

  const handleDecline = async (request: FriendSummary) => {
    if (!user) return;

    setProcessingRequests((prev) => new Set(prev).add(request.id));
    try {
      await declineFriendRequest(user.uid, request);
    } catch (error: any) {
      Alert.alert(
        "Could not decline request",
        error?.message || "Please try again."
      );
    } finally {
      setProcessingRequests((prev) => {
        const next = new Set(prev);
        next.delete(request.id);
        return next;
      });
    }
  };

  const handleSendCheer = async (friend: FriendSummary) => {
    if (!user || !userDoc) return;

    try {
      await sendCheerToFriend(user.uid, userDoc.name, friend.id);
      Alert.alert("Cheer sent", `You cheered ${friend.name}!`);
    } catch (error: any) {
      Alert.alert(
        "Could not send cheer",
        error?.message || "Please try again."
      );
    }
  };

  const handleRemoveFriend = async (friend: FriendSummary) => {
    if (!user || !userDoc) return;

    Alert.alert(
      "Remove friend",
      `Are you sure you want to remove ${friend.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFriend(
                {
                  id: user.uid,
                  name: userDoc.name,
                  email: userDoc.email,
                },
                friend
              );
              Alert.alert("Removed", `${friend.name} was removed.`);
            } catch (error: any) {
              Alert.alert(
                "Could not remove friend",
                error?.message || "Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const showFriendActions = (friend: FriendSummary) => {
    Alert.alert(friend.name, "What would you like to do?", [
      {
        text: "Send a cheer",
        onPress: () => handleSendCheer(friend),
      },
      {
        text: "Remove friend",
        style: "destructive",
        onPress: () => handleRemoveFriend(friend),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS_DATE).then((val) => {
      if (cancelled) return;
      setAnnouncementsVisible(val !== todayKey());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!announcementsVisible) return;

    let cancelled = false;
    const isLast =
      announcementItems.length > 0 &&
      announceIdx >= announcementItems.length - 1;

    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANNOUNCEMENT_FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (cancelled || !finished) return;

        if (isLast) {
          AsyncStorage.setItem(
            STORAGE_KEY_ANNOUNCEMENTS_DATE,
            todayKey()
          ).catch(() => {});
          setAnnouncementsVisible(false);
          return;
        }

        setAnnounceIdx((i) => i + 1);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANNOUNCEMENT_FADE_MS,
          useNativeDriver: true,
        }).start();
      });
    }, ANNOUNCEMENT_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
}, [announceIdx, fadeAnim, announcementsVisible, announcementItems.length]);

  useEffect(() => {
    if (!announcementsVisible) return;
    outlineAnim.setValue(0);

    Animated.sequence([
      Animated.timing(outlineAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(outlineAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(outlineAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(outlineAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(outlineAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(outlineAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) outlineAnim.setValue(0);
    });
  }, [announceIdx, outlineAnim, announcementsVisible]);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={announcementsVisible ? [2] : undefined}
      >
        <View style={styles.friendsSectionHeader}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <Text style={styles.sectionCaption}>Tap to view a friend</Text>
        </View>

        {incomingRequests.length > 0 ? (
          <View style={styles.requestsSection}>
            <Text style={styles.sectionTitle}>Friend requests</Text>
            <Text style={styles.sectionCaption}>
              Accept or decline requests from people who want to connect.
            </Text>
            {incomingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestTextWrap}>
                  <Text style={styles.requestName}>{request.name}</Text>
                  <Text style={styles.requestEmail}>{request.email}</Text>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={processingRequests.has(request.id)}
                    onPress={() => handleAccept(request)}
                    style={[styles.requestActionButton, styles.requestAccept]}
                  >
                    <Text style={styles.requestActionText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={processingRequests.has(request.id)}
                    onPress={() => handleDecline(request)}
                    style={[styles.requestActionButton, styles.requestDecline]}
                  >
                    <Text style={styles.requestActionText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.friendsRow}
        >
          {friendCards.map((friend: FriendSummary) => {
            const initial = getAvatarInitial(friend.name as string);
            const color = (friend as any).color
              ? (friend as any).color
              : getAvatarColor(friend.name as string);
            const streak = (friend as any).streak as number | undefined;

            return (
              <TouchableOpacity
                key={friend.id}
                activeOpacity={0.85}
                onPress={hasRealFriends ? () => showFriendActions(friend as FriendSummary) : undefined}
                disabled={!hasRealFriends}
                style={styles.friendChip}
              >
                <View style={styles.friendAvatarWrap}>
                  <Avatar initial={initial} color={color} size={62} />
                  {typeof streak === "number" ? (
                    <View style={styles.streakPill}>
                      <Image
                        source={require("../../assets/images/streak.png")}
                        style={{ width: 14, height: 14 }}
                      />
                      <Text style={styles.streakPillText}> {streak}</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.friendName} numberOfLines={1}>
                  {friend.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/add-friend")}
            style={[styles.friendChip, styles.addFriendChip]}
          >
            <View style={styles.friendAvatarWrap}>
              <View style={styles.addFriendAvatar}>
                <Text style={styles.addFriendPlus}>+</Text>
              </View>
            </View>

            <Text style={styles.friendName} numberOfLines={1}>
              Add friend
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {announcementsVisible && announcement ? (
          <View style={styles.announcementWrap}>
            <View style={styles.announcementCardWrap}>
              <Animated.View
                style={[styles.announcementCard, { opacity: fadeAnim }]}
              >
                <View style={styles.announcementIconBubble}>
                  <Text style={styles.announcementEmoji}>
                    {announcement.emoji}
                  </Text>
                </View>

                <View style={styles.announcementTextWrap}>
                  <Text style={styles.announcementLabel}>Announcement</Text>
                  <Text style={styles.announcementText} numberOfLines={2}>
                    {announcement.text}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[styles.announcementOutline, { opacity: outlineAnim }]}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.activityHeader}>
          <View style={styles.activityHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Recent activity</Text>
              <Text style={styles.sectionCaption}>
                {sortedCheers.length > 0
                  ? "Friends who cheered you"
                  : "No cheers yet"}
              </Text>
            </View>
          </View>
        </View>

        {sortedCheers.length > 0 ? (
          sortedCheers.map((cheer) => {
            const initial = getAvatarInitial(cheer.cheererName);
            const color = getAvatarColor(cheer.cheererName);

            return (
              <View
                key={`${cheer.cheererId}-${cheer.timestamp}`}
                style={styles.feedCard}
              >
                <View style={styles.feedTop}>
                  <Avatar initial={initial} color={color} size={50} />

                  <View style={styles.feedTextWrap}>
                    <Text style={styles.feedNameLine}>
                      <Text style={styles.feedName}>{cheer.cheererName}</Text>
                      <Text style={styles.feedActivity}> Cheered you!</Text>
                    </Text>

                    <Text style={styles.feedTime}>
                      {getTimeAgo(cheer.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
          ) : (
          <Text style={styles.emptyActivityText}>
            No cheers yet. Your friends can cheer you from their profiles.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e7eff0",
  },

  topBar: {
    height: 72,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  topBarTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#1B1B1B",
    letterSpacing: -0.4,
  },
  topBarSubtitle: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#5f5f5f",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 34,
  },

  friendsSectionHeader: {
    marginBottom: 10,
  },
  activityHeader: {
    marginTop: 4,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#678067",
  },
  sectionCaption: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: "#9a9696",
  },

  friendsRow: {
    paddingBottom: 18,
    paddingRight: 10,
    gap: 12,
  },
  friendChip: {
    width: 92,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  addFriendChip: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#95bdde",
    backgroundColor: "#f4f9fb",
  },
  addFriendAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#a3cef1",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  addFriendPlus: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: -2,
  },
  friendAvatarWrap: {
    width: 68,
    height: 72,
    alignItems: "center",
  },
  friendName: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "900",
    color: "#1B1B1B",
    maxWidth: 76,
    textAlign: "center",
  },
  streakPill: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#C9C2B6",
  },
  streakPillText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1B1B1B",
  },

  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },
  avatarInitial: {
    color: "white",
    fontWeight: "900",
  },

  requestsSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d2dde0",
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eef3f4",
  },
  requestTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  requestName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1B1B1B",
  },
  requestEmail: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b6b6b",
  },
  requestActions: {
    flexDirection: "row",
    gap: 10,
  },
  requestActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  requestAccept: {
    backgroundColor: "#58CC02",
  },
  requestDecline: {
    backgroundColor: "#FF4B4B",
  },
  requestActionText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },

  announcementWrap: {
    marginHorizontal: -18,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#e7eff0",
  },
  announcementCardWrap: {
    position: "relative",
  },
  announcementCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#a3cef1",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  announcementOutline: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#b5e48c",
  },
  announcementIconBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FBF7EF",
    borderWidth: 1,
    borderColor: "#C9C2B6",
    alignItems: "center",
    justifyContent: "center",
  },
  announcementEmoji: {
    fontSize: 22,
  },
  announcementTextWrap: {
    flex: 1,
  },
  announcementLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#95bdde",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  announcementText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1B1B1B",
    lineHeight: 19,
  },

  feedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  feedTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  feedTextWrap: {
    flex: 1,
  },
  feedNameLine: {
    fontSize: 14,
    color: "#1B1B1B",
    lineHeight: 20,
  },
  feedName: {
    fontWeight: "900",
    color: "#1B1B1B",
  },
  feedActivity: {
    fontWeight: "600",
    color: "#5f5f5f",
  },
  feedTime: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9a9696",
    marginTop: 4,
  },

  cheerButton: {
    alignSelf: "flex-start",
    marginTop: 13,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#95bdde",
    backgroundColor: "#a3cef1",
  },
  cheerButtonActive: {
    borderColor: "#678067",
    backgroundColor: "#b5e48c",
  },
  cheerText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#ffffff",
  },
  cheerTextActive: {
    color: "#1B1B1B",
  },

  activityHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  emptyActivityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888888",
    textAlign: "center",
    marginVertical: 20,
    marginHorizontal: 20,
    lineHeight: 20,
  },
});