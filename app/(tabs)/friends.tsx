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
  // A. Congratulations from friends
  { emoji: "👏", text: "Maya cheered you on!" },
  { emoji: "🎉", text: "Leo congratulated you on your streak!" },
  { emoji: "💌", text: "Ava sent you encouragement!" },
  // B. Daily challenge reminder
  {
    emoji: "📅",
    text: `You have ${REMAINING_DAILY_CHALLENGES} challenge${
      REMAINING_DAILY_CHALLENGES === 1 ? "" : "s"
    } left today!`,
  },
  // C. Mindfulness / well-being fun facts
  { emoji: "🌿", text: "Taking 3 deep breaths can help lower stress." },
  { emoji: "🚶", text: "A short walk can improve your mood." },
  { emoji: "✨", text: "Writing down one good thing can build gratitude." },
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
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    const id = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANNOUNCEMENT_FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (cancelled || !finished) return;
        setAnnounceIdx((i) => (i + 1) % ANNOUNCEMENTS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANNOUNCEMENT_FADE_MS,
          useNativeDriver: true,
        }).start();
      });
    }, ANNOUNCEMENT_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fadeAnim]);

  const announcement = ANNOUNCEMENTS[announceIdx];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        {/* 0: Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Friends</Text>
            <Text style={styles.subtitle}>See what your friends are up to</Text>
          </View>
          <ProfileAvatarButton size={42} />
        </View>

        {/* 1: Horizontal friends row */}
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
                <Avatar initial={f.initial} color={f.color} size={64} />
                <View style={styles.streakPill}>
                  <Text style={styles.streakPillText}>🔥{f.streak}</Text>
                </View>
              </View>
              <Text style={styles.friendName} numberOfLines={1}>
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 2: Sticky announcement */}
        <View style={styles.announcementWrap}>
          <Animated.View
            style={[styles.announcementCard, { opacity: fadeAnim }]}
          >
            <Text style={styles.announcementEmoji}>{announcement.emoji}</Text>
            <Text style={styles.announcementText} numberOfLines={2}>
              {announcement.text}
            </Text>
          </Animated.View>
        </View>

        {/* 3: Section label */}
        <Text style={styles.sectionLabel}>Recent activity</Text>

        {/* 4+: Feed cards */}
        {FEED.map((item) => {
          const isCheered = cheered.has(item.id);
          return (
            <View key={item.id} style={styles.feedCard}>
              <View style={styles.feedTop}>
                <Avatar
                  initial={item.initial}
                  color={item.avatarColor}
                  size={48}
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
                  style={[styles.cheerText, isCheered && styles.cheerTextActive]}
                >
                  {isCheered ? "👏 Cheered!" : "👏 Cheer"}
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
    backgroundColor: "#FBF7EF",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 18,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1B1B1B",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#777",
    marginTop: 2,
  },

  // Horizontal friends row
  friendsRow: {
    paddingVertical: 4,
    paddingRight: 8,
    gap: 14,
  },
  friendChip: {
    alignItems: "center",
    width: 76,
  },
  friendAvatarWrap: {
    width: 64,
    height: 64,
  },
  friendName: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#1B1B1B",
    maxWidth: 72,
    textAlign: "center",
  },
  streakPill: {
    position: "absolute",
    bottom: -4,
    right: -6,
    backgroundColor: "#FFC800",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#FBF7EF",
  },
  streakPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  // Avatar
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "white",
    fontWeight: "900",
  },

  // Sticky announcement
  announcementWrap: {
    // Negate the scrollContent horizontal padding so the sticky bg fills
    // the full screen width and nothing scrolls visibly behind it.
    marginHorizontal: -18,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#FBF7EF",
  },
  announcementCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1CB0F6",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#0A6E9F",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  announcementEmoji: {
    fontSize: 22,
  },
  announcementText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "white",
    lineHeight: 18,
  },

  // Section label
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9A9A9A",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 4,
    marginBottom: 10,
  },

  // Feed cards
  feedCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    lineHeight: 19,
  },
  feedName: {
    fontWeight: "800",
    color: "#1B1B1B",
  },
  feedActivity: {
    fontWeight: "500",
    color: "#444",
  },
  feedTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9A9A9A",
    marginTop: 3,
  },
  cheerButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
  },
  cheerButtonActive: {
    borderColor: "#58CC02",
    backgroundColor: "#EAF8DD",
  },
  cheerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1B1B1B",
  },
  cheerTextActive: {
    color: "#3A8A02",
  },
});
