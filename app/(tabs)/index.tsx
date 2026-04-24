import { useAuth } from "@/src/auth/useAuth";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatarButton from "../../components/ProfileAvatarButton";

const dayBg = require("../../assets/images/dayBg.png");
const nightBg = require("../../assets/images/nightBg.png");
const sunsetBg = require("../../assets/images/sunset.jpg");

const backgroundImg = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 17) {
    return dayBg;
  } else if (hour >= 17 && hour < 21) {
    return sunsetBg;
  } else {
    return nightBg;
  }
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentBg, setCurrentBg] = useState(backgroundImg());
  const [nextBg, setNextBg] = useState(backgroundImg());
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const headerButtonText =
    user?.displayName || user?.email?.split("@")[0] || "Login";

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
          <Pressable
            style={styles.loginPill}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginText}>{headerButtonText}</Text>
          </Pressable>
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
  loginPill: {
    borderWidth: 1,
    borderColor: "#C9C2B6",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  loginText: { fontSize: 14, fontWeight: "700", color: "#1B1B1B" },
});
