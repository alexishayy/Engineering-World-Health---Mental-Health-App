import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";
import { REQUIRED_EMOJIS, usePets } from "../../context/PetsContext";

type Reward = {
  gains: { petId: string; emoji: string }[];
  unlockedPetIds: string[];
};

const STORAGE_KEY_LAST_CLAIM = "pets_free_gift_last_claim_timestamp";
const COOLDOWN_MS = 30000;
const TOTAL_PETS = 3;
const COMING_SOON_SLOTS = 6;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatSeconds(s: number) {
  const sec = Math.max(0, Math.ceil(s));
  return `${sec}s`;
}

export default function PetsScreen() {
  const { pets, setPets } = usePets();

  const unlockedCount = pets.filter((p) => p.unlocked).length;
  const progressPct = Math.round((unlockedCount / TOTAL_PETS) * 100);

  // Gift state
  const [giftOpen, setGiftOpen] = useState(false);
  const [pendingReward, setPendingReward] = useState<Reward | null>(null);

  const [loadingClaimState, setLoadingClaimState] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Animations
  const modalScale = useRef(new Animated.Value(0.95)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const burstScale = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;

  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        r: new Animated.Value(0),
        o: new Animated.Value(0),
        s: new Animated.Value(0.5),
      })),
    []
  );

  useEffect(() => {
    const startCooldown = (remainingMs: number) => {
      if (cooldownIntervalRef.current)
        clearInterval(cooldownIntervalRef.current);
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);

      setClaimed(true);
      setSecondsLeft(Math.ceil(remainingMs / 1000));

      const startedAt = Date.now();
      cooldownIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const left = Math.max(0, remainingMs - elapsed);
        setSecondsLeft(Math.ceil(left / 1000));
      }, 200);

      cooldownTimeoutRef.current = setTimeout(() => {
        if (cooldownIntervalRef.current)
          clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
        cooldownTimeoutRef.current = null;
        setClaimed(false);
        setSecondsLeft(0);
      }, remainingMs);
    };

    const checkCooldown = async () => {
      try {
        const last = await AsyncStorage.getItem(STORAGE_KEY_LAST_CLAIM);
        if (!last) {
          setClaimed(false);
          setSecondsLeft(0);
          return;
        }
        const lastTime = Number(last);
        const now = Date.now();
        const elapsed = now - lastTime;
        if (elapsed >= COOLDOWN_MS) {
          setClaimed(false);
          setSecondsLeft(0);
        } else {
          startCooldown(COOLDOWN_MS - elapsed);
        }
      } finally {
        setLoadingClaimState(false);
      }
    };

    checkCooldown();

    return () => {
      if (cooldownIntervalRef.current)
        clearInterval(cooldownIntervalRef.current);
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    };
  }, []);

  // grid sizing
  const { width } = useWindowDimensions();
  const COLUMNS = 3;
  const GAP = 12;
  const GRID_CARD_PADDING = 14;
  const SCREEN_PADDING = 18;
  const gridInnerWidth =
    width - SCREEN_PADDING * 2 - GRID_CARD_PADDING * 2 - 2;
  const tileSize = (gridInnerWidth - GAP * (COLUMNS - 1)) / COLUMNS;

  function playModalOpenAnim() {
    modalScale.setValue(0.95);
    modalOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 170,
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function playShake() {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 5,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -5,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function playBurst() {
    burstScale.setValue(0.6);
    burstOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(burstOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(burstScale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();

    particles.forEach((p, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const dist = randInt(70, 120);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      p.x.setValue(0);
      p.y.setValue(0);
      p.r.setValue(0);
      p.o.setValue(1);
      p.s.setValue(0.7);

      Animated.parallel([
        Animated.timing(p.x, {
          toValue: dx,
          duration: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: dy,
          duration: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.r, {
          toValue: randInt(-220, 220),
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(p.s, {
            toValue: 1,
            duration: 140,
            useNativeDriver: true,
          }),
          Animated.timing(p.s, {
            toValue: 0.6,
            duration: 510,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.o, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });

    Animated.timing(burstOpacity, {
      toValue: 0,
      duration: 500,
      delay: 350,
      useNativeDriver: true,
    }).start();
  }

  function openGift() {
    if (loadingClaimState) return;

    if (claimed) {
      playShake();
      return;
    }

    // Roll for each locked pet: 50/50 chance to gain one emoji.
    const gains: { petId: string; emoji: string }[] = [];
    const unlockedPetIds: string[] = [];

    for (const p of pets) {
      if (p.unlocked) continue;
      if (Math.random() < 0.5) {
        gains.push({ petId: p.id, emoji: p.emoji });
        if (p.collected + 1 >= REQUIRED_EMOJIS) {
          unlockedPetIds.push(p.id);
        }
      }
    }

    setPendingReward({ gains, unlockedPetIds });
    setGiftOpen(true);
    requestAnimationFrame(playModalOpenAnim);
  }

  async function claimGift() {
    if (!pendingReward) return;

    // Apply reward to pet state
    setPets((prev) =>
      prev.map((p) => {
        const gainedCount = pendingReward.gains.filter(
          (g) => g.petId === p.id
        ).length;
        if (gainedCount === 0) return p;
        const nextCollected = Math.min(
          REQUIRED_EMOJIS,
          p.collected + gainedCount
        );
        return {
          ...p,
          collected: nextCollected,
          unlocked: p.unlocked || nextCollected >= REQUIRED_EMOJIS,
        };
      })
    );

    // Start cooldown
    const now = Date.now();
    await AsyncStorage.setItem(STORAGE_KEY_LAST_CLAIM, String(now));

    if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);

    setClaimed(true);
    setSecondsLeft(Math.ceil(COOLDOWN_MS / 1000));

    const startedAt = Date.now();
    cooldownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const left = Math.max(0, COOLDOWN_MS - elapsed);
      setSecondsLeft(Math.ceil(left / 1000));
    }, 200);

    cooldownTimeoutRef.current = setTimeout(() => {
      if (cooldownIntervalRef.current)
        clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
      cooldownTimeoutRef.current = null;
      setClaimed(false);
      setSecondsLeft(0);
    }, COOLDOWN_MS);

    playBurst();
    setTimeout(() => {
      setGiftOpen(false);
      setPendingReward(null);
    }, 700);
  }

  const anyGained = (pendingReward?.gains.length ?? 0) > 0;
  const anyUnlocked = (pendingReward?.unlockedPetIds.length ?? 0) > 0;
  const gainedEmojis = pendingReward?.gains.map((g) => g.emoji).join("  ") ?? "";

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
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pets Unlocked:</Text>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressPct}%` }]}
            />
          </View>

          <Text style={styles.progressMeta}>
            {unlockedCount}/{TOTAL_PETS} collected
          </Text>
        </View>

        {/* Grid */}
        <View style={styles.gridCard}>
          <View style={styles.grid}>
            {pets.map((p, idx) => {
              const isRightEdge = (idx + 1) % COLUMNS === 0;
              const pct = (p.collected / REQUIRED_EMOJIS) * 100;
              return (
                <View
                  key={p.id}
                  style={[
                    styles.slot,
                    {
                      width: tileSize,
                      height: tileSize,
                      marginRight: isRightEdge ? 0 : GAP,
                      marginBottom: GAP,
                    },
                  ]}
                >
                  <Image
                    source={p.image}
                    style={styles.slotImage}
                    resizeMode="cover"
                  />
                  {!p.unlocked && (
                    <>
                      <View style={styles.slotDim} />
                      <View style={styles.lockBadge}>
                        <MaterialCommunityIcons
                          name="lock"
                          size={14}
                          color="white"
                        />
                      </View>
                      <View style={styles.slotProgressOverlay}>
                        <Text style={styles.slotEmoji}>{p.emoji}</Text>
                        <View style={styles.slotProgressTrack}>
                          <View
                            style={[
                              styles.slotProgressFill,
                              { width: `${pct}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.slotProgressCount}>
                          {p.collected}/{REQUIRED_EMOJIS}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              );
            })}

            {Array.from({ length: COMING_SOON_SLOTS }, (_, i) => {
              const gridIdx = TOTAL_PETS + i;
              const isRightEdge = (gridIdx + 1) % COLUMNS === 0;
              return (
                <View
                  key={`soon-${i}`}
                  style={[
                    styles.slot,
                    styles.slotComingSoon,
                    {
                      width: tileSize,
                      height: tileSize,
                      marginRight: isRightEdge ? 0 : GAP,
                      marginBottom: GAP,
                    },
                  ]}
                >
                  <Text style={styles.comingSoonText}>Coming{"\n"}soon..</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Gift Button */}
        <Animated.View
          style={[
            styles.giftButtonWrap,
            { transform: [{ translateX: shakeX }] },
          ]}
        >
          <View style={styles.giftButtonShadow} />
          <Pressable
            style={({ pressed }) => [
              styles.giftButton,
              claimed && styles.giftButtonDisabled,
              pressed && !claimed && { transform: [{ translateY: 6 }] },
            ]}
            onPress={openGift}
          >
            <MaterialCommunityIcons
              name="gift"
              size={22}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.giftButtonText}>
              {claimed
                ? `Free Gift (Cooldown ${formatSeconds(secondsLeft)})`
                : "Free Gift"}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Gift modal */}
      <Modal
        visible={giftOpen}
        transparent
        animationType="none"
        onRequestClose={() => setGiftOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              { opacity: modalOpacity, transform: [{ scale: modalScale }] },
            ]}
          >
            <View style={styles.modalTop}>
              <MaterialCommunityIcons
                name="gift"
                size={38}
                color="#000000"
                style={{ marginBottom: 6 }}
              />
              <Text style={styles.modalTitle}>
                {anyGained ? "You got:" : "Better luck next time!"}
              </Text>
              {anyGained ? (
                <Text style={styles.modalEmojiRow}>{gainedEmojis}</Text>
              ) : (
                <Text style={styles.modalBody}>
                  No emojis this round — try again after the cooldown.
                </Text>
              )}
              {anyUnlocked ? (
                <Text style={styles.modalUnlockText}>
                  ✨ Pet unlocked! ✨
                </Text>
              ) : null}

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.burstWrap,
                  {
                    opacity: burstOpacity,
                    transform: [{ scale: burstScale }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={42}
                  color="#000000"
                />
              </Animated.View>

              <View pointerEvents="none" style={styles.particlesLayer}>
                {particles.map((p, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.particle,
                      {
                        opacity: p.o,
                        transform: [
                          { translateX: p.x },
                          { translateY: p.y },
                          {
                            rotate: p.r.interpolate({
                              inputRange: [-360, 360],
                              outputRange: ["-360deg", "360deg"],
                            }),
                          },
                          { scale: p.s },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <Pressable style={styles.claimBtn} onPress={claimGift}>
              <Text style={styles.claimBtnText}>Claim</Text>
            </Pressable>
          </Animated.View>
        </View>
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

  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
  },

  // Summary card
  summaryCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 12,
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

  // Grid card
  gridCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  slot: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  slotImage: {
    width: "100%",
    height: "100%",
  },
  slotDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  lockBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  slotProgressOverlay: {
    position: "absolute",
    left: 6,
    right: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  slotEmoji: {
    fontSize: 13,
  },
  slotProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#F7FAFD",
    overflow: "hidden",
  },
  slotProgressFill: {
    height: "100%",
    backgroundColor: "#000000",
  },
  slotProgressCount: {
    fontSize: 9,
    fontWeight: "800",
    color: "#000000",
    fontVariant: ["tabular-nums"],
  },

  slotComingSoon: {
    backgroundColor: "#f8f5f1",
    borderWidth: 1,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9a9696",
    textAlign: "center",
  },

  // Gift button (matches Add Task style)
  giftButtonWrap: {
    position: "relative",
    marginTop: 4,
  },
  giftButtonShadow: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#93b9d9",
    borderRadius: 16,
  },
  giftButton: {
    backgroundColor: "#a3cef1",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#95bdde",
  },
  giftButtonDisabled: {
    opacity: 0.75,
  },
  giftButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    backgroundColor: "#FBF7EF",
    borderWidth: 1,
    borderColor: "#C9C2B6",
    borderRadius: 18,
    overflow: "hidden",
  },
  modalTop: {
    padding: 18,
    alignItems: "center",
    minHeight: 200,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1B1B1B",
    marginBottom: 8,
    textAlign: "center",
  },
  modalEmojiRow: {
    fontSize: 34,
    letterSpacing: 4,
    textAlign: "center",
    marginVertical: 4,
  },
  modalBody: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9a9696",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  modalUnlockText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "900",
    color: "#1B1B1B",
    textAlign: "center",
  },

  claimBtn: {
    borderTopWidth: 1,
    borderTopColor: "#C9C2B6",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a3cef1",
  },
  claimBtnText: {
    fontSize: 18,
    fontWeight: "900",
    color: "white",
  },

  // burst + particles
  burstWrap: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -21,
    marginTop: -21,
  },
  particlesLayer: {
    position: "absolute",
    width: 1,
    height: 1,
    top: "50%",
    left: "50%",
  },
  particle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#000000",
  },
});
