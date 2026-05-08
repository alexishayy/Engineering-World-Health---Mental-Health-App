import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Asset } from "expo-asset";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";
const background = require( "../../assets/images/background.jpeg");

const GOALS = [
  { id: 1, title: "Take your shoes off and put your feet in grass for at least 3 minutes", subtitle: "Nature", done: true },
  { id: 2, title: "Go birding and try to find your state bird", subtitle: "Nature", done: true },
  { id: 3, title: "Think of your hottest take. Make a piece of art bsed on it that obscures its meaning", subtitle: "Art", done: true },
];
import { PetState, usePets } from "../../context/PetsContext";

const PET_SIZE = 88;
const WALK_SPEED_PX_PER_SEC = 45;
const FRAME_MS = 100;

function WalkingPet({
  pet,
  bounds,
}: {
  pet: PetState;
  bounds: { w: number; h: number };
}) {
  const maxX = Math.max(1, bounds.w - PET_SIZE);
  const maxY = Math.max(1, bounds.h - PET_SIZE);

  const xRef = useRef(Math.random() * maxX);
  const yRef = useRef(Math.random() * maxY);

  const xAnim = useRef(new Animated.Value(xRef.current)).current;
  const yAnim = useRef(new Animated.Value(yRef.current)).current;

  const [frame, setFrame] = useState(0);
  const [facingLeft, setFacingLeft] = useState(false);

  // Alternate walking frame
  useEffect(() => {
    const id = setInterval(
      () => setFrame((f) => (f + 1) % pet.walkingFrames.length),
      FRAME_MS
    );
    return () => clearInterval(id);
  }, [pet.walkingFrames.length]);

  // Wander loop
  useEffect(() => {
    let cancelled = false;
    let pauseId: ReturnType<typeof setTimeout> | null = null;
    let anim: Animated.CompositeAnimation | null = null;

    const pickAndMove = () => {
      if (cancelled) return;

      const targetX = Math.random() * maxX;
      const targetY = Math.random() * maxY;
      const dist = Math.hypot(
        targetX - xRef.current,
        targetY - yRef.current
      );
      const duration = Math.max(
        700,
        (dist / WALK_SPEED_PX_PER_SEC) * 1000
      );

      setFacingLeft(targetX < xRef.current);

      anim = Animated.parallel([
        Animated.timing(xAnim, {
          toValue: targetX,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(yAnim, {
          toValue: targetY,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]);

      anim.start(({ finished }) => {
        xRef.current = targetX;
        yRef.current = targetY;
        if (finished && !cancelled) {
          const pause = 300 + Math.random() * 1200;
          pauseId = setTimeout(pickAndMove, pause);
        }
      });
    };

    pickAndMove();

    return () => {
      cancelled = true;
      if (pauseId) clearTimeout(pauseId);
      anim?.stop();
    };
  }, [maxX, maxY, xAnim, yAnim]);

  return (
    <Animated.View
      style={[
        styles.walkingPet,
        {
          transform: [
            { translateX: xAnim },
            { translateY: yAnim },
            { scaleX: facingLeft ? -1 : 1 },
          ],
        },
      ]}
    >
      <ExpoImage
        source={pet.walkingFrames[frame]}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={0}
        style={styles.walkingPetImage}
      />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [goals, setGoals] = useState(GOALS);
  const [TimeRanges, setTimer] = useState(6 * 3600 + 23 * 60 + 46);

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

  const { pets } = usePets();
  const unlockedPets = pets.filter((p) => p.unlocked);

  const [spritesReady, setSpritesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const modules = unlockedPets.flatMap((p) => p.walkingFrames);
    Asset.loadAsync(modules)
      .then(() => {
        if (!cancelled) setSpritesReady(true);
      })
      .catch(() => {
        if (!cancelled) setSpritesReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [unlockedPets.length]);

  const [playBounds, setPlayBounds] = useState<{ w: number; h: number } | null>(
    null
  );

  const onPlayAreaLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (
      !playBounds ||
      Math.abs(playBounds.w - width) > 1 ||
      Math.abs(playBounds.h - height) > 1
    ) {
      setPlayBounds({ w: width, h: height });
    }
  };

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const goalsLeft = goals.filter((g) => !g.done).length;

  return (
    <View style={{ flex: 1 }}>
      <Image source={background} style={styles.backgroundImg} />

      <SafeAreaView style={styles.screen} edges={["top"]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <ProfileAvatarButton size={32} />
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 Streak: 12</Text>
          </View>
        </View>

        <View style={styles.playArea} onLayout={onPlayAreaLayout}>
          {playBounds && spritesReady
            ? unlockedPets.map((p) => (
                <WalkingPet key={p.id} pet={p} bounds={playBounds} />
              ))
            : null}
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

  playArea: {
    flex: 1,
    overflow: "hidden",
  },
  walkingPet: {
    position: "absolute",
    width: PET_SIZE,
    height: PET_SIZE,
    top: 0,
    left: 0,
  },
  walkingPetImage: {
    width: "100%",
    height: "100%",
  },

  panel: {
    backgroundColor: "#cad6c3",
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
