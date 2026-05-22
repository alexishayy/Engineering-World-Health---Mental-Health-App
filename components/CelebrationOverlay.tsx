import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PARTICLE_COUNT = 18;
const EMOJIS = ["🎉", "✨", "🌟", "🎊", "💫", "⭐"];

type Props = {
  visible: boolean;
  onDone: () => void;
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function CelebrationOverlay({ visible, onDone }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.7)).current;

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        r: new Animated.Value(0),
        o: new Animated.Value(0),
        s: new Animated.Value(0.5),
        emoji: EMOJIS[randInt(0, EMOJIS.length - 1)],
      })),
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const { width, height } = Dimensions.get("window");
    const maxDist = Math.max(width, height) * 0.55;

    fade.setValue(0);
    cardScale.setValue(0.7);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();

    particles.forEach((p, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.3;
      const dist = randInt(Math.floor(maxDist * 0.5), Math.floor(maxDist));
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
          duration: 1100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: dy,
          duration: 1100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.r, {
          toValue: randInt(-360, 360),
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(p.s, {
            toValue: 1.1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(p.s, {
            toValue: 0.6,
            duration: 920,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.o, {
          toValue: 0,
          duration: 1100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });

    const t = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start(() => {
        onDone();
      });
    }, 1700);

    return () => clearTimeout(t);
    // We intentionally re-trigger only when `visible` flips true; particle
    // animations are owned by this effect run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.overlay, { opacity: fade }]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => {
          Animated.timing(fade, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDone());
        }}
      />
      <View pointerEvents="none" style={styles.center}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <Text style={styles.cardEmoji}>🎉</Text>
          <Text style={styles.cardTitle}>Streak +1!</Text>
          <Text style={styles.cardSubtitle}>All 3 challenges done.</Text>
        </Animated.View>

        {particles.map((p, idx) => (
          <Animated.Text
            key={idx}
            style={[
              styles.particle,
              {
                opacity: p.o,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.s },
                  {
                    rotate: p.r.interpolate({
                      inputRange: [-360, 360],
                      outputRange: ["-360deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            {p.emoji}
          </Animated.Text>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
    zIndex: 999,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1B1B1B",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  particle: {
    position: "absolute",
    fontSize: 28,
  },
});
