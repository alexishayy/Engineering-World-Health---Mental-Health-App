import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  topBar: "#4B6176", // blue-gray strip
  background: "#FFFFFF",

  card: "#F3F1F0",   // warm soft gray
  border: "#5B5B5B", // consistent outline
  text: "#111111",

  buttonBg: "#D9D9D9",
  bottomNav: "#D9D9D9",
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeftCircle} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar} />

            <View style={styles.nameBlock}>
              <Text style={styles.name}>Name</Text>
              <Text style={styles.username}>@username</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>145</Text>
              <Text style={styles.statLabel}>Tasks completed</Text>
            </View>
          </View>
        </View>

        {/* Segmented buttons */}
        <View style={styles.segmentWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.segmentButton,
              styles.segmentLeft,
              pressed && styles.segmentPressed,
            ]}
          >
            <Text style={styles.segmentText}>Scrapbook</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.segmentButton,
              styles.segmentMiddle,
              pressed && styles.segmentPressed,
            ]}
          >
            <Text style={styles.segmentText}>Settings</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.segmentButton,
              styles.segmentRight,
              pressed && styles.segmentPressed,
            ]}
          >
            <Text style={styles.segmentText}>Goals</Text>
          </Pressable>
        </View>

        {/* Big lower card */}
        <View style={styles.bigCard} />
      </ScrollView>

      {/* Bottom nav placeholder (remove if you already have a real tab bar) */}
      <View style={styles.bottomNav} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Top bar */
  topBar: {
    height: 70,
    backgroundColor: COLORS.topBar,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  topLeftCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.background,
  },

  /* Main content */
  content: {
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 30,
    gap: 22,
  },

  /* Profile card */
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nameBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "500",
    color: COLORS.text,
  },
  username: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "400",
    color: COLORS.text,
  },

  /* Stats */
  statsRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
  },
  statBox: {
    flex: 1,
    height: 110,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "400",
    color: COLORS.text,
  },
  statLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.text,
  },

  /* Segmented buttons */
  segmentWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.buttonBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentText: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.text,
  },
  segmentLeft: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  segmentMiddle: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  segmentRight: {},

  /* Press effect */
  segmentPressed: {
    opacity: 0.55,
  },

  /* Big card */
  bigCard: {
    height: 220,
    backgroundColor: COLORS.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /* Bottom nav placeholder */
  bottomNav: {
    height: 70,
    backgroundColor: COLORS.bottomNav,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});