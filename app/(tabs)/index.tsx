import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";
import { PetState, usePets } from "../../context/PetsContext";

const dayBg = require("../../assets/images/dayBg.png");
const nightBg = require("../../assets/images/nightBg.png");
const sunsetBg = require("../../assets/images/sunset.jpg");

const backgroundImg = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return dayBg;
  if (hour >= 17 && hour < 21) return sunsetBg;
  return nightBg;
};

const PET_SIZE = 88;
const WALK_SPEED_PX_PER_SEC = 45;
const FRAME_MS = 280;

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
    const id = setInterval(() => setFrame((f) => (f + 1) % 2), FRAME_MS);
    return () => clearInterval(id);
  }, []);

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
    <Animated.Image
      source={pet.walkingFrames[frame]}
      resizeMode="contain"
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
    />
  );
}

export default function HomeScreen() {
  const [currentBg, setCurrentBg] = useState(backgroundImg());
  const [nextBg, setNextBg] = useState(backgroundImg());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { pets } = usePets();
  const unlockedPets = pets.filter((p) => p.unlocked);

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

  const fadeToNewBackground = (newImage: any) => {
    if (newImage === currentBg) return;

    setNextBg(newImage);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setCurrentBg(newImage);
      fadeAnim.setValue(0);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newImage = backgroundImg();
      fadeToNewBackground(newImage);
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [currentBg]);

  return (
    <View style={{ flex: 1 }}>
      {/* Current background */}
      <Image source={currentBg} style={styles.backgroundImg} />

      {/* Next background (fade animation) */}
      <Animated.Image
        source={nextBg}
        style={[styles.backgroundImg, { opacity: fadeAnim }]}
      />

      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.topBar}>
          <ProfileAvatarButton size={32} />
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 Streak : 12</Text>
          </View>
        </View>

        <View style={styles.header} />

        <View style={styles.playArea} onLayout={onPlayAreaLayout}>
          {playBounds
            ? unlockedPets.map((p) => (
                <WalkingPet key={p.id} pet={p} bounds={playBounds} />
              ))
            : null}
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
});
