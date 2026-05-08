import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";
const background = require( "../../assets/images/background.jpeg");

const GOALS = [
  { id: 1, title: "Take your shoes off and put your feet in grass for at least 3 minutes", subtitle: "Nature", done: true },
  { id: 2, title: "Go birding and try to find your state bird", subtitle: "Nature", done: true },
  { id: 3, title: "Think of your hottest take. Make a piece of art bsed on it that obscures its meaning", subtitle: "Art", done: true },
];

export default function HomeScreen() {
  const [currentBg, setCurrentBg] = useState(background);
  const [nextBg, setNextBg] = useState(background);
  const [goals, setGoals] = useState(GOALS);
  const [TimeRanges, setTimer] = useState(6 * 3600 + 23 * 60 + 46);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const goalsLeft = goals.filter((g) => !g.done).length;

   return (
    <View style={{ flex: 1 }}>
      <Image source={currentBg} style={styles.backgroundImg} />
      <Animated.Image
        source={nextBg}
        style={[styles.backgroundImg, { opacity: fadeAnim }]}
      />

      <SafeAreaView style={styles.screen} edges={["top"]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <ProfileAvatarButton size={32} />
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 Streak: 12</Text>
          </View>
        </View>

        {/* Bottom Sheet Style Panel */}
        <View style={styles.panel}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Adventuring</Text>
              <Text style={styles.statusTimer}>back in {formatTimer(TimeRanges)}</Text>
            </View>
            <View style={styles.statusAvatarRow}>
              <View style={styles.heartIcon}>
                <Text>🤍</Text>
              </View>
              <View style={styles.avatarTrack}>
                <View style={styles.avatarDot} />
              </View>
              <View style={styles.questionBubble}>
                <Text style={styles.questionText}>?</Text>
              </View>
            </View>
          </View>

          {/* Goals Header */}
          <View style={styles.goalsHeader}>
            <Text style={styles.goalsHeaderText}>
              📅 {goalsLeft} goals left for today!
            </Text>
            <View style={styles.goalsHeaderIcons}>
              <Text style={{ marginRight: 8 }}>≡</Text>
              <Text>👥</Text>
            </View>
          </View>

          {/* Goals List */}
          <View>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalEmoji}>
                  <Text style={{ fontSize: 24 }}>
                    {goal.id === 1 ? "😊" : goal.id === 2 ? "🦒" : goal.id === 3 ? "💧" : "🚶"}
                  </Text>
                </View>
                <View style={styles.goalText}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                </View>
                <View style={styles.goalRight}>
                </View>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
   backgroundImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    resizeMode: "cover",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },
  topBar: {
    height: 64,
    backgroundColor: "transparent",
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
  streakPill: {
    borderWidth: 1,
    borderColor: "#C9C2B6",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  streakText: { fontSize: 14, fontWeight: "700", color: "#1B1B1B" },

  body: {
    flex: 1,
  },

  panel: {
    flex: 1,
    marginTop: "auto",
    backgroundColor: "#cad6c3",
    opacity: 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "55%",
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusLabel: { fontWeight: "700", fontSize: 14, color: "#1B1B1B" },
  statusTimer: { fontSize: 13, color: "#888" },
  statusAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heartIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    justifyContent: "center",
  },
  questionBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: { fontWeight: "700", color: "#888" },

  // Goals Header
  goalsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  goalsHeaderText: { fontSize: 13, fontWeight: "600", color: "#444" },
  goalsHeaderIcons: { flexDirection: "row", alignItems: "center" },

  // Goal Cards
  goalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  goalEmoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  goalText: { flex: 1 },
  goalTitle: { fontSize: 14, fontWeight: "700", color: "#1B1B1B" },
  goalSubtitle: { fontSize: 12, color: "#888", marginTop: 2 },
  goalRight: { alignItems: "center", gap: 4 },
  goalHearts: { fontSize: 12, color: "#888" },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxDone: {
    backgroundColor: "#A0C878",
    borderColor: "#A0C878",
  },
  checkMark: { color: "white", fontWeight: "700", fontSize: 16 },
});
