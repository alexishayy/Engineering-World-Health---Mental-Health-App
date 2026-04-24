import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";

type Difficulty = "easy" | "medium" | "hard";

const CATEGORIES = [
  "Movement",
  "Nature",
  "Art",
  "Journaling",
  "Social",
  "Cooking/Baking",
] as const;
type Category = (typeof CATEGORIES)[number];

type DailyTask = {
  id: string;
  title: string;
  description?: string;
  categories: Category[];
  difficulty: Difficulty;
  estimatedTime: string;
};

type CustomTask = {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
};

const EASY_TASKS: DailyTask[] = [
  {
    id: "e1",
    title: "Compliment a stranger",
    description:
      "Complimenting a stranger acts as a small form of exposure therapy, easing anxiety while boosting your mood!",
    categories: ["Social"],
    difficulty: "easy",
    estimatedTime: "~2 min",
  },
  {
    id: "e2",
    title:
      "Take your shoes off and put your feet in grass for at least 3 minutes",
    description: "Walking barefoot might actually heal you!",
    categories: ["Nature"],
    difficulty: "easy",
    estimatedTime: "~5 min",
  },
  {
    id: "e3",
    title: "Do 5 star jumps",
    description:
      "Jumping triggers the release of endorphins, sparking a cascade of positive, feel-good emotions!",
    categories: ["Movement"],
    difficulty: "easy",
    estimatedTime: "~1 min",
  },
  {
    id: "e4",
    title:
      'Do a short meditation like "When Progress Feels Too Slow: 7 Minute Meditation for Self-Compassion"',
    categories: ["Journaling"],
    difficulty: "easy",
    estimatedTime: "~7 min",
  },
  {
    id: "e5",
    title: "Try to find an interestingly shaped cloud",
    description: "Cloudgazing can be so fun!",
    categories: ["Nature"],
    difficulty: "easy",
    estimatedTime: "~5 min",
  },
  {
    id: "e6",
    title:
      "Wear your socks inside out (or do something else small scale you've never done before)",
    categories: ["Social"],
    difficulty: "easy",
    estimatedTime: "~1 min",
  },
];

const MEDIUM_TASKS: DailyTask[] = [
  {
    id: "m1",
    title: "Go on a walk",
    description:
      "Walking as little as 1k steps a day can decrease depression by 10%!",
    categories: ["Movement", "Nature"],
    difficulty: "medium",
    estimatedTime: "~15 min",
  },
  {
    id: "m2",
    title: "Go birding and try to find your state bird",
    description:
      "Brief exposure to natural outdoor environments is linked to better memory and attention compared to time spent in busy urban outdoor settings.",
    categories: ["Nature"],
    difficulty: "medium",
    estimatedTime: "~30 min",
  },
  {
    id: "m3",
    title: "Take a fun personality quiz",
    categories: ["Social"],
    difficulty: "medium",
    estimatedTime: "~15 min",
  },
  {
    id: "m4",
    title:
      "Reflect on a key part of your identity. What makes you proud to be x (for example your ethnicity, religion, gender, etc.)?",
    description:
      "Writing short essays about personal important identities/values every few months can improve self esteem throughout the year!",
    categories: ["Journaling"],
    difficulty: "medium",
    estimatedTime: "~20 min",
  },
  {
    id: "m5",
    title: "Do a crossword puzzle (try ucsdguardian.org/games)",
    categories: ["Journaling"],
    difficulty: "medium",
    estimatedTime: "~20 min",
  },
  {
    id: "m6",
    title: "Try to hold crow pose for 5 seconds",
    categories: ["Movement"],
    difficulty: "medium",
    estimatedTime: "~10 min",
  },
];

const HARD_TASKS: DailyTask[] = [
  {
    id: "h1",
    title: "Try plogging: go on a jog (or any speed) and pick up trash",
    description:
      'Plogging is a word formed by blending the Swedish phrase plocka upp ("pick up") with the English word "jogging."',
    categories: ["Movement", "Nature"],
    difficulty: "hard",
    estimatedTime: "~30 min",
  },
  {
    id: "h2",
    title:
      "Think of your hottest take. Make a piece of art (drawing, painting, song, anything!) based on it that obscures its meaning.",
    categories: ["Art"],
    difficulty: "hard",
    estimatedTime: "~45 min",
  },
];

function getDayIndex(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diffMs = date.getTime() - startOfYear.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function formatCountdown(msRemaining: number) {
  const totalSec = Math.max(0, Math.floor(msRemaining / 1000));
  const hrs = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSec % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function formatToday(date: Date) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = date.getDate();
  const suffix = (() => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  })();
  return `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${d}${suffix}`;
}

export default function ChallengesScreen() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dayIdx = getDayIndex(now);

  const dailyTasks = useMemo(
    () => [
      EASY_TASKS[dayIdx % EASY_TASKS.length],
      MEDIUM_TASKS[dayIdx % MEDIUM_TASKS.length],
      HARD_TASKS[dayIdx % HARD_TASKS.length],
    ],
    [dayIdx]
  );

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [trackedDay, setTrackedDay] = useState(dayIdx);

  useEffect(() => {
    if (trackedDay !== dayIdx) {
      setCompletedMap({});
      setCustomTasks([]);
      setTrackedDay(dayIdx);
    }
  }, [dayIdx, trackedDay]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Category | null>(null);

  const countdown = useMemo(() => {
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return formatCountdown(midnight.getTime() - now.getTime());
  }, [now]);

  const { completedCount, totalCount, progressPct } = useMemo(() => {
    const dailyCompleted = dailyTasks.filter((t) => completedMap[t.id]).length;
    const customCompleted = customTasks.filter((t) => t.completed).length;
    const total = dailyTasks.length + customTasks.length;
    const completed = dailyCompleted + customCompleted;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completedCount: completed, totalCount: total, progressPct: pct };
  }, [dailyTasks, customTasks, completedMap]);

  function openAddTask() {
    setNewTitle("");
    setNewCategory(null);
    setIsModalOpen(true);
  }

  function closeAddTask() {
    setIsModalOpen(false);
  }

  function toggleDailyTask(id: string) {
    setCompletedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleCustomTask(id: string) {
    setCustomTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function addTask() {
    const title = newTitle.trim();
    if (!title || !newCategory) return;

    const task: CustomTask = {
      id: String(Date.now()),
      title,
      category: newCategory,
      completed: false,
      createdAt: Date.now(),
    };

    setCustomTasks((prev) => [task, ...prev]);
    closeAddTask();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <ProfileAvatarButton size={32} />
        <View style={styles.streakPill}>
          <Image
            source={require("../../assets/images/streak.png")}
            style={{ width: 25, height: 25 }}
          />
          <Text style={styles.streakText}> Streak : 12</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* "Today's tasks" card */}
        <View style={styles.todayCard}>
          <View style={styles.todayHeaderRow}>
            <Text style={styles.todayTitle}>Today’s tasks:</Text>
            <View style={styles.timerPill}>
              <Text style={styles.timerLabel}>New in</Text>
              <Text style={styles.timerText}>{countdown}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          <Text style={styles.progressMeta}>
            {completedCount}/{totalCount} completed
          </Text>
        </View>

        <Text style={styles.dateText}>{formatToday(now)}</Text>

        {/* Daily rotating tasks */}
        {dailyTasks.map((t) => {
          const done = !!completedMap[t.id];
          return (
            <View key={t.id} style={styles.taskCard}>
              <Pressable
                onPress={() => toggleDailyTask(t.id)}
                style={[
                  styles.taskCheckCircle,
                  done && styles.taskCheckCircleDone,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Mark task ${t.title} as ${
                  done ? "not completed" : "completed"
                }`}
              >
                {done ? <Text style={styles.checkMark}>✓</Text> : null}
              </Pressable>

              <View style={styles.taskTextWrap}>
                <View style={styles.taskHeaderRow}>
                  <Text
                    style={[styles.taskTitle, done && styles.taskTitleDone]}
                  >
                    {t.title}
                  </Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyBadgeText}>
                      {t.difficulty.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {t.description ? (
                  <Text style={styles.taskDescription}>{t.description}</Text>
                ) : null}

                <View style={styles.taskMetaRow}>
                  <Text style={styles.taskSubtitle}>
                    {t.categories.join(" · ")}
                  </Text>
                  <Text style={styles.taskTimeEstimate}>{t.estimatedTime}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* User-added tasks */}
        {customTasks.map((t) => (
          <View key={t.id} style={styles.taskCard}>
            <Pressable
              onPress={() => toggleCustomTask(t.id)}
              style={[
                styles.taskCheckCircle,
                t.completed && styles.taskCheckCircleDone,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Mark task ${t.title} as ${
                t.completed ? "not completed" : "completed"
              }`}
            >
              {t.completed ? <Text style={styles.checkMark}>✓</Text> : null}
            </Pressable>

            <View style={styles.taskTextWrap}>
              <Text
                style={[styles.taskTitle, t.completed && styles.taskTitleDone]}
              >
                {t.title}
              </Text>
              <Text style={styles.taskSubtitle}>{t.category}</Text>
            </View>
          </View>
        ))}

        {/* Add Task button */}
        <View style={styles.addButtonWrap}>
          <View style={styles.addButtonShadow} />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { transform: [{ translateY: 6 }] },
            ]}
            onPress={openAddTask}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeAddTask}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeAddTask}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>New Task</Text>

            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g., 10 minute stretch"
              placeholderTextColor="#6B7280"
              style={styles.modalInput}
            />

            <Text style={styles.modalLabel}>Category</Text>
            <View style={styles.categoryChipRow}>
              {CATEGORIES.map((c) => {
                const selected = newCategory === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setNewCategory(c)}
                    style={[
                      styles.categoryChip,
                      selected && styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalRow}>
              <Pressable style={styles.modalBtnGhost} onPress={closeAddTask}>
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalBtnPrimary,
                  (!newTitle.trim() || !newCategory) && { opacity: 0.5 },
                ]}
                onPress={addTask}
                disabled={!newTitle.trim() || !newCategory}
              >
                <Text style={styles.modalBtnPrimaryText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#494a4a",
  },

  topBar: {
    height: 64,
    backgroundColor: "#a3cef1",
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C9C2B6",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 10,
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
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  todayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000000",
    flexShrink: 1,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#F7FAFD",
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9a9696",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  timerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#000000",
    fontVariant: ["tabular-nums"],
  },
  progressTrack: {
    height: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#F7FAFD",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#000000",
    borderRadius: 10,
  },
  progressMeta: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#9a9696",
  },

  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9a9696",
    marginBottom: 14,
  },

  // Task card
  taskCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "##df2d2d",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  taskCheckCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#f8f5f1",
    marginRight: 14,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCheckCircleDone: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  checkMark: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginTop: -1,
  },

  taskTextWrap: {
    flex: 1,
  },
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    flexShrink: 1,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#F7FAFD",
    borderWidth: 1,
    borderColor: "#000000",
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  taskDescription: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9a9696",
    lineHeight: 16,
    marginBottom: 8,
  },
  taskMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  taskSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9a9696",
    flexShrink: 1,
  },
  taskTimeEstimate: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9a9696",
  },

  // Add button
  addButtonWrap: {
    position: "relative",
    marginTop: 10,
  },
  addButtonShadow: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#93b9d9",
    borderRadius: 16,
  },
  addButton: {
    backgroundColor: "#a3cef1",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#95bdde",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 18,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#FBF7EF",
    borderWidth: 1,
    borderColor: "#C9C2B6",
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1B1B1B",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 10,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#B7C1CC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  categoryChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#B7C1CC",
    backgroundColor: "white",
  },
  categoryChipSelected: {
    backgroundColor: "#3E5870",
    borderColor: "#2E4256",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  categoryChipTextSelected: {
    color: "white",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  modalBtnGhost: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B7C1CC",
    backgroundColor: "white",
  },
  modalBtnGhostText: {
    fontWeight: "900",
    color: "#1B1B1B",
  },
  modalBtnPrimary: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#3E5870",
    borderWidth: 1,
    borderColor: "#2E4256",
  },
  modalBtnPrimaryText: {
    fontWeight: "900",
    color: "white",
  },
});
