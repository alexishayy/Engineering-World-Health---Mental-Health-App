import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";

const STORAGE_KEY_ANNOUNCEMENTS_DATE = "friends_announcements_last_shown_date";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Friend = {
  id: string;
  name: string;
  initial: string;
  color: string;
  streak: number;
};

type FeedItem = {
  id: string;
  name: string;
  initial: string;
  avatarColor: string;
  activity: string;
  time: string;
};

type Announcement = {
  emoji: string;
  text: string;
};

const TOTAL_DAILY_CHALLENGES = 3;
const COMPLETED_DAILY_CHALLENGES = 1;
const REMAINING_DAILY_CHALLENGES =
  TOTAL_DAILY_CHALLENGES - COMPLETED_DAILY_CHALLENGES;

const FRIENDS: Friend[] = [
  { id: "1", name: "Maya", initial: "M", color: "#FF9600", streak: 12 },
  { id: "2", name: "Leo", initial: "L", color: "#1CB0F6", streak: 5 },
  { id: "3", name: "Ava", initial: "A", color: "#CE82FF", streak: 27 },
  { id: "4", name: "Noah", initial: "N", color: "#58CC02", streak: 3 },
  { id: "5", name: "Ivy", initial: "I", color: "#FF4B4B", streak: 14 },
  { id: "6", name: "Theo", initial: "T", color: "#FFC800", streak: 9 },
];

const FEED: FeedItem[] = [
  {
    id: "f1",
    name: "Maya",
    initial: "M",
    avatarColor: "#FF9600",
    activity: "completed a mindfulness challenge",
    time: "2m ago",
  },
  {
    id: "f2",
    name: "Leo",
    initial: "L",
    avatarColor: "#1CB0F6",
    activity: "reached a 5-day streak",
    time: "23m ago",
  },
  {
    id: "f3",
    name: "Ava",
    initial: "A",
    avatarColor: "#CE82FF",
    activity: "took care of their pet",
    time: "1h ago",
  },
  {
    id: "f4",
    name: "Noah",
    initial: "N",
    avatarColor: "#58CC02",
    activity: "finished today's check-in",
    time: "3h ago",
  },
  {
    id: "f5",
    name: "Ivy",
    initial: "I",
    avatarColor: "#FF4B4B",
    activity: "earned the Early Bird badge",
    time: "Yesterday",
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  { emoji: "👏", text: "Maya cheered you on!" },
  { emoji: "🎉", text: "Leo congratulated you on your streak!" },
  { emoji: "💌", text: "Ava sent you encouragement!" },
  {
    emoji: "📅",
    text: `You have ${REMAINING_DAILY_CHALLENGES} challenge${
      REMAINING_DAILY_CHALLENGES === 1 ? "" : "s"
    } left today!`,
  },
];

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

export default function FriendsScreen() {
  const [cheered, setCheered] = useState<Set<string>>(new Set());
  const [announceIdx, setAnnounceIdx] = useState(0);
  const [announcementsVisible, setAnnouncementsVisible] = useState<
    boolean | null
  >(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const outlineAnim = useRef(new Animated.Value(0)).current;

  const toggleCheer = (id: string) => {
    setCheered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
    const isLast = announceIdx >= ANNOUNCEMENTS.length - 1;

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
  }, [announceIdx, fadeAnim, announcementsVisible]);

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

  const announcement = ANNOUNCEMENTS[announceIdx];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>Friends</Text>
          <Text style={styles.topBarSubtitle}>Stay connected</Text>
        </View>

        <ProfileAvatarButton size={36} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={announcementsVisible ? [2] : undefined}
      >
        <View style={styles.friendsSectionHeader}>
          <Text style={styles.sectionTitle}>Friend streaks</Text>
          <Text style={styles.sectionCaption}>Tap to view a friend</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.friendsRow}
        >
          {FRIENDS.map((f) => (
            <TouchableOpacity
              key={f.id}
              activeOpacity={0.85}
              style={styles.friendChip}
            >
              <View style={styles.friendAvatarWrap}>
                <Avatar initial={f.initial} color={f.color} size={62} />
                <View style={styles.streakPill}>
                  <Text style={styles.streakPillText}>🔥 {f.streak}</Text>
                </View>
              </View>

              <Text style={styles.friendName} numberOfLines={1}>
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}

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
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Text style={styles.sectionCaption}>Send support with one tap</Text>
        </View>

        {FEED.map((item) => {
          const isCheered = cheered.has(item.id);

          return (
            <View key={item.id} style={styles.feedCard}>
              <View style={styles.feedTop}>
                <Avatar
                  initial={item.initial}
                  color={item.avatarColor}
                  size={50}
                />

                <View style={styles.feedTextWrap}>
                  <Text style={styles.feedNameLine}>
                    <Text style={styles.feedName}>{item.name}</Text>
                    <Text style={styles.feedActivity}> {item.activity}</Text>
                  </Text>

                  <Text style={styles.feedTime}>{item.time}</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => toggleCheer(item.id)}
                style={[
                  styles.cheerButton,
                  isCheered && styles.cheerButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.cheerText,
                    isCheered && styles.cheerTextActive,
                  ]}
                >
                  {isCheered ? "Cheered!" : "Cheer"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
    backgroundColor: "#a3cef1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#95bdde",
  },
  topBarTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -0.4,
  },
  topBarSubtitle: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
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
    borderWidth: 1,
    borderColor: "#b5e48c",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  addFriendChip: {
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
    borderWidth: 1,
    borderColor: "#b5e48c",
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
});