import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Slot = {
  id: string;
  locked: boolean;
};

export default function PetsScreen() {
  // ✅ In the future, this is what you’ll load from your user profile / database
  const TOTAL_SLOTS = 28;
  const [unlockedCount, setUnlockedCount] = useState(4);

  // Optional: selection state (so you can show which pet is selected)
  const [selectedId, setSelectedId] = useState("1");

  // ✅ slots are derived from unlockedCount (single place to change lock/unlock rules)
  const slots: Slot[] = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
      const id = String(i + 1);
      return {
        id,
        locked: i >= unlockedCount,
      };
    });
  }, [TOTAL_SLOTS, unlockedCount]);

  // --- grid sizing (uniform on every phone) ---
  const { width } = useWindowDimensions();
  const COLUMNS = 4;
  const GAP = 12;
  const GRID_CARD_PADDING = 14;
  const SCREEN_PADDING = 18;

  const gridInnerWidth =
    width - SCREEN_PADDING * 2 - GRID_CARD_PADDING * 2 - 1.5 * 2;

  const tileSize = (gridInnerWidth - GAP * (COLUMNS - 1)) / COLUMNS;

  const boxesUnlocked = unlockedCount;
  const boxesTotal = TOTAL_SLOTS;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.avatarOuter} />
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 Streak : 12</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Characters:</Text>

        {/* GRID CONTAINER */}
        <View style={styles.gridCard}>
          <View style={styles.grid}>
            {slots.map((slot, idx) => {
              const isSelected = slot.id === selectedId;

              return (
                <Pressable
                  key={slot.id}
                  onPress={() => {
                    // If you want to prevent selecting locked ones, keep this guard:
                    if (slot.locked) return;
                    setSelectedId(slot.id);
                  }}
                  style={[
                    styles.slot,
                    {
                      width: tileSize,
                      height: tileSize,
                      marginRight: (idx + 1) % COLUMNS === 0 ? 0 : GAP,
                      marginBottom: GAP,
                      backgroundColor: slot.locked ? SLOT_LOCKED_BG : SLOT_BG,
                      opacity: slot.locked ? 0.65 : 1,
                    },
                    isSelected && styles.slotSelected,
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Pets Unlocked:</Text>

          <Text style={styles.progressCount}>
            {boxesUnlocked}/{boxesTotal}
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(boxesUnlocked / boxesTotal) * 100}%` },
              ]}
            />
          </View>

          {/* ✅ DEV ONLY: quick way to test locking/unlocking now
              Delete this block later, or hide behind a dev flag */}
          <View style={{ marginTop: 14, flexDirection: "row", gap: 10 }}>
            <Pressable
              style={styles.devBtn}
              onPress={() => setUnlockedCount((c) => Math.max(0, c - 1))}
            >
              <Text style={styles.devBtnText}>- Unlock</Text>
            </Pressable>

            <Pressable
              style={styles.devBtn}
              onPress={() => setUnlockedCount((c) => Math.min(TOTAL_SLOTS, c + 1))}
            >
              <Text style={styles.devBtnText}>+ Unlock</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BG = "#F6F2E7";
const TOP = "#3F5E77";
const CARD = "#FFFFFF";
const BORDER = "#000000";

const SLOT_BG = "#EAF1F7";
const SLOT_LOCKED_BG = "#a0a4a9f6";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },

  topBar: {
    backgroundColor: TOP,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  avatarOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: BORDER,
  },

  streakPill: {
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  streakText: { fontSize: 16, fontWeight: "700" },

  content: { padding: 18 },

  sectionTitle: { fontSize: 34, fontWeight: "900", marginBottom: 14 },

  gridCard: {
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 14,
  },

  grid: { flexDirection: "row", flexWrap: "wrap" },

  slot: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
  },

  slotSelected: {
    borderColor: BORDER,
    borderWidth: 2.5,
  },

  progressSection: { marginTop: 28 },

  progressLabel: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  progressCount: { fontSize: 32, fontWeight: "900", marginBottom: 10 },

  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#D4D4D4",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#60788B",
    borderRadius: 999,
  },

  // dev buttons
  devBtn: {
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  devBtnText: { fontWeight: "800" },
});