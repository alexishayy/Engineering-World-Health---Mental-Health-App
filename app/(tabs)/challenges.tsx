import React, { useMemo, useState } from "react";
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

type Task = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: number;
};

export default function ChallengesScreen() {
  // ✅ In the future, load these from your backend / storage
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Take a 15 minute walk",
      category: "Physical",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "t2",
      title: "Drink a full bottle of water",
      category: "Physical",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "t3",
      title: "Text one friend",
      category: "Social",
      completed: false,
      createdAt: Date.now(),
    },
  ]);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // progress (optional but useful for your bar)
  const { completedCount, totalCount, progressPct } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completedCount: completed, totalCount: total, progressPct: pct };
  }, [tasks]);

  function openAddTask() {
    setNewTitle("");
    setNewCategory("");
    setIsModalOpen(true);
  }

  function closeAddTask() {
    setIsModalOpen(false);
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function addTask() {
    const title = newTitle.trim();
    const category = newCategory.trim() || "General";

    if (!title) return;

    const task: Task = {
      id: String(Date.now()), // ✅ replace with uuid later if you want
      title,
      category,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [task, ...prev]); // adds to top
    closeAddTask();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.avatarDot} />
        <View style={styles.streakPill}>
          <Image
            source={require('../../assets/images/streak.png')}
            style={{width: 25, height: 25}}
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
          <Text style={styles.todayTitle}>Today’s tasks:</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          <Text style={styles.progressMeta}>
            {completedCount}/{totalCount} completed
          </Text>
        </View>

        {/* Date (you can replace with real date later) */}
        <Text style={styles.dateText}>Friday, Feb 6th</Text>

        {/* Task cards */}
        {tasks.map((t) => (
          <View key={t.id} style={styles.taskCard}>
            <Pressable
              onPress={() => toggleTask(t.id)}
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
              <Text style={[styles.taskTitle, t.completed && styles.taskTitleDone]}>
                {t.title}
              </Text>
              <Text style={styles.taskSubtitle}>Category: {t.category}</Text>
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

      {/* ✅ Add Task Modal (popup) */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeAddTask}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeAddTask}>
          {/* stop click-through */}
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
            <TextInput
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="e.g., Physical"
              placeholderTextColor="#6B7280"
              style={styles.modalInput}
            />

            <View style={styles.modalRow}>
              <Pressable style={styles.modalBtnGhost} onPress={closeAddTask}>
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalBtnPrimary,
                  !newTitle.trim() && { opacity: 0.5 },
                ]}
                onPress={addTask}
                disabled={!newTitle.trim()}
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
  // Whole screen background (cream)
  screen: {
    flex: 1,
    backgroundColor: "#e7eff0",
  },

  // Dark top bar
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
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: "#b5e48c",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#588157",
    marginBottom: 12,
  },
  progressTrack: {
    height: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b5e48c",
    backgroundColor: "#F7FAFD",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#b5e48c",
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
    borderColor: "#b5e48c",
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
    borderColor: "#b0c4b1",
    backgroundColor: "#f8f5f1",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCheckCircleDone: {
    backgroundColor: "#b5e48c",
    borderColor: "#92b772",
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
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#588157",
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  taskSubtitle: {
    fontSize: 13,
    fontWeight: "600",
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