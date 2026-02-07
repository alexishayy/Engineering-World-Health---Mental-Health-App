import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChallengesScreen() {
  const tasks = [
    { title: "Take a 15 minute walk", category: "Physical" },
    { title: "Take a 15 minute walk", category: "Physical" },
    { title: "Take a 15 minute walk", category: "Physical" },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.avatarDot} />
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 Streak : 12</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* "Today's tasks" card */}
        <View style={styles.todayCard}>
          <Text style={styles.todayTitle}>Today’s tasks:</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>Friday, Feb 6th</Text>

        {/* Task cards */}
        {tasks.map((t, idx) => (
          <View key={idx} style={styles.taskCard}>
            <View style={styles.taskCheckCircle} />
            <View style={styles.taskTextWrap}>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <Text style={styles.taskSubtitle}>Category: {t.category}</Text>
            </View>
          </View>
        ))}

        {/* Add Task button */}
        <View style={styles.addButtonWrap}>
          {/* shadow/base */}
          <View style={styles.addButtonShadow} />

          {/* top face */}
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { transform: [{ translateY: 6 }] },
            ]}
            onPress={() => {}}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Whole screen background (cream)
  screen: {
    flex: 1,
    backgroundColor: "#F6F2E6",
  },

  // Dark top bar
  topBar: {
    height: 64,
    backgroundColor: "#3E5870",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  avatarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
  },
  streakPill: {
    borderWidth: 1,
    borderColor: "#C9C2B6",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  // "Today's tasks" card
  todayCard: {
    backgroundColor: "#EAF0F6",
    borderWidth: 1,
    borderColor: "#B7C1CC",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "#1B1B1B",
    marginBottom: 12,
  },
  progressTrack: {
    height: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9AA6B2",
    backgroundColor: "#F7FAFD",
    overflow: "hidden",
  },
  // ~30% filled like your screenshot
  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "#3E5870",
    borderRadius: 10,
  },

  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 14,
  },

  // Task card
  taskCard: {
    backgroundColor: "#EAF0F6",
    borderWidth: 1,
    borderColor: "#B7C1CC",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  taskCheckCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#9AA6B2",
    backgroundColor: "#F6F2E6",
    marginRight: 14,
  },
  taskTextWrap: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },

  // Add button
  addButtonWrap: {
    position: "relative",
    marginTop: 10,
  },

  addButtonShadow: {
    position: "absolute",
    top: 6, // depth
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#2E4256", // darker base
    borderRadius: 16,
  },

  // your existing addButton stays mostly same — just remove marginTop from it
  addButton: {
    backgroundColor: "#3E5870",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2E4256",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  // Bottom pill
  bottomPill: {
    marginTop: 18,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF0F6",
    borderWidth: 1,
    borderColor: "#B7C1CC",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  bottomPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  bottomPillArrow: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1B1B1B",
    marginTop: -1,
  },
});
