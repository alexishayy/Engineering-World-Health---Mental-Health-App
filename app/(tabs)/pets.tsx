import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";

type Slot = {
  id: string;
  locked: boolean;
};

type Gift =
  | { type: "PAWS"; amount: number }
  | { type: "STREAK_FREEZE"; amount: 1 }
  | { type: "XP_BOOST"; hours: number };

const STORAGE_KEY_LAST_CLAIM = "pets_free_gift_last_claim_timestamp";
const COOLDOWN_MS = 30000; // ✅ demo mode: 30 seconds

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollGift(): Gift {
  const roll = randInt(1, 3);
  if (roll === 1) return { type: "PAWS", amount: randInt(1, 10) };
  if (roll === 2) return { type: "STREAK_FREEZE", amount: 1 };
  return { type: "XP_BOOST", hours: randInt(1, 24) };
}

function formatSeconds(s: number) {
  const sec = Math.max(0, Math.ceil(s));
  return `${sec}s`;
}

export default function PetsScreen() {
  const TOTAL_SLOTS = 9;
  const [unlockedCount] = useState(4);
  const [selectedId, setSelectedId] = useState("1");

  // Gift logic/state
  const [giftOpen, setGiftOpen] = useState(false);
  const [gift, setGift] = useState<Gift | null>(null);

  const [loadingClaimState, setLoadingClaimState] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Animations
  const modalScale = useRef(new Animated.Value(0.95)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const shakeX = useRef(new Animated.Value(0)).current;

  const burstScale = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;

  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Confetti particles
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        r: new Animated.Value(0),
        o: new Animated.Value(0),
        s: new Animated.Value(0.5),
      })),
    [],
  );

  // ✅ 30s cooldown check on mount (and auto re-enable with countdown)
  useEffect(() => {
    const startCooldown = (remainingMs: number) => {
      // clear any old timers
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

  // slots
  const slots: Slot[] = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
      const id = String(i + 1);
      return { id, locked: i >= unlockedCount };
    });
  }, [TOTAL_SLOTS, unlockedCount]);

  // --- grid sizing ---
  const { width } = useWindowDimensions();
  const COLUMNS = 3;
  const GAP = 12;
  const GRID_CARD_PADDING = 14;
  const SCREEN_PADDING = 18;

  const gridInnerWidth =
    width - SCREEN_PADDING * 2 - GRID_CARD_PADDING * 2 - 1.5 * 2;
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

  async function openGift() {
    if (loadingClaimState) return;

    if (claimed) {
      playShake();
      return;
    }

    const g = rollGift();
    setGift(g);
    setGiftOpen(true);
    requestAnimationFrame(playModalOpenAnim);
  }

  async function claimGift() {
    if (!gift) return;

    // ✅ demo cooldown starts now
    const now = Date.now();
    await AsyncStorage.setItem(STORAGE_KEY_LAST_CLAIM, String(now));

    // start cooldown timers + countdown
    const remainingMs = COOLDOWN_MS;

    // clear old timers
    if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
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

    // 🎉 animation + close
    playBurst();
    setTimeout(() => {
      setGiftOpen(false);
      setGift(null);
    }, 700);
  }

  const giftTitle =
    gift?.type === "PAWS"
      ? "Paws Reward!"
      : gift?.type === "STREAK_FREEZE"
        ? "Streak Freeze!"
        : "XP Booster!";

  const giftBody =
    gift?.type === "PAWS"
      ? `You got +${gift.amount} paws 🐾`
      : gift?.type === "STREAK_FREEZE"
        ? `You got 1 streak freeze ❄️`
        : gift?.type === "XP_BOOST"
          ? `You got an XP booster for ${gift.hours} hour${gift.hours === 1 ? "" : "s"} ⚡`
          : "";

  const giftIconName =
    gift?.type === "PAWS"
      ? "paw"
      : gift?.type === "STREAK_FREEZE"
        ? "snowflake"
        : "lightning-bolt";

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <ProfileAvatarButton size={32} />
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 Streak : 12</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Pets Unlocked:</Text>
          <Text style={styles.sectionCount}>
            {unlockedCount}/{TOTAL_SLOTS}
          </Text>
        </View>

        {/* Grid */}
        <View style={styles.gridCard}>
          <View style={styles.grid}>
            {slots.map((slot, idx) => {
              const isSelected = slot.id === selectedId;

              return (
                <Pressable
                  key={slot.id}
                  onPress={() => {
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

        {/* Free Gift Button */}
        <View style={styles.giftWrapper}>
          <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
            <Pressable
              style={[styles.giftBtn, claimed && styles.giftBtnDisabled]}
              onPress={openGift}
            >
              <MaterialCommunityIcons
                name="gift"
                size={22}
                color="black"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.giftBtnText}>
                {claimed
                  ? `Free Gift (Cooldown ${formatSeconds(secondsLeft)})`
                  : "Free Gift"}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* Gift Popup */}
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
                name={giftIconName as any}
                size={38}
                color="black"
                style={{ marginBottom: 6 }}
              />
              <Text style={styles.modalTitle}>{giftTitle}</Text>
              <Text style={styles.modalBody}>{giftBody}</Text>

              {/* Burst center */}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.burstWrap,
                  { opacity: burstOpacity, transform: [{ scale: burstScale }] },
                ]}
              >
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={42}
                  color="black"
                />
              </Animated.View>

              {/* Confetti particles */}
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

  content: { flex: 1, padding: 18 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: { fontSize: 28, fontWeight: "900" },
  sectionCount: { fontSize: 28, fontWeight: "900" },

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

  giftWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  giftBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderWidth: 1.8,
    borderColor: BORDER,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 26,
  },

  giftBtnDisabled: {
    opacity: 0.75,
  },

  giftBtnText: {
    fontSize: 16,
    fontWeight: "900",
  },

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 18,
  },

  modalCard: {
    backgroundColor: CARD,
    borderWidth: 1.8,
    borderColor: BORDER,
    borderRadius: 18,
    overflow: "hidden",
  },

  modalTop: {
    padding: 18,
    alignItems: "center",
    minHeight: 190,
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },

  modalBody: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  claimBtn: {
    borderTopWidth: 1.5,
    borderTopColor: BORDER,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF3F8",
  },

  claimBtnText: {
    fontSize: 18,
    fontWeight: "900",
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
