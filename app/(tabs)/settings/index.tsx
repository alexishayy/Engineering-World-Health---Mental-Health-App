import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePets } from "../../../context/PetsContext";

const CURRENT_STREAK = 12;
const FRIENDS_COUNT = 6;

export default function SettingsScreen() {
  const { pets } = usePets();
  const unlockedPets = pets.filter((p) => p.unlocked).length;

  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.petCard}>
          <View style={styles.petImageWrap}>
            <Image
              source={require("../../../assets/pets/pet1.png")}
              style={styles.petImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statTile}>
              <Text style={styles.statNumber}>🔥 {CURRENT_STREAK}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statTile}>
              <Text style={styles.statNumber}>{unlockedPets}</Text>
              <Text style={styles.statLabel}>Pets</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statTile}>
              <Text style={styles.statNumber}>{FRIENDS_COUNT}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Sound effects</Text>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: "#cfd6d7", true: "#A3CEF1" }}
              thumbColor="white"
            />
          </View>

          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.label}>Haptic feedback</Text>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: "#cfd6d7", true: "#A3CEF1" }}
              thumbColor="white"
            />
          </View>

          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#cfd6d7", true: "#A3CEF1" }}
              thumbColor="white"
            />
          </View>
        </View>

        <Pressable style={styles.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e7eff0",
  },

  header: {
    height: 72,
    backgroundColor: "#A3CEF1",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#95bdde",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.3,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  petCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#b5e48c",
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
    alignItems: "center",
  },
  petImageWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "stretch",
    backgroundColor: "#FBF7EF",
    borderWidth: 1,
    borderColor: "#C9C2B6",
    borderRadius: 14,
    paddingVertical: 12,
  },
  statTile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#C9C2B6",
    marginVertical: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1B1B1B",
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "800",
    color: "#9a9696",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#b5e48c",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  logout: {
    marginTop: 22,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0c2c8",
  },
  logoutText: {
    color: "#de2c44",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});
