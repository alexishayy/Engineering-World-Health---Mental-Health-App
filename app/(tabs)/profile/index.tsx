import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Ionicons name="person-circle-outline" size={90} color="black" />
          <View>
            <Text style={styles.name}>Name</Text>
            <Text style={styles.username}>@username</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text>Streaks</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>20</Text>
            <Text>Boxes</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text>Friends</Text>
          </View>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <Pressable
          style={styles.tabButton}
          onPress={() => router.push("/profile/account")}
        >
          <Text style={styles.tab}>Account</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={styles.tabButton}
          onPress={() => router.push("/profile/preferences")}
        >
          <Text style={styles.tab}>Preferences</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={styles.tabButton}
          onPress={() => router.push("/profile/stats")}
        >
          <Text style={styles.tab}>Stats</Text>
        </Pressable>
      </View>

      {/* Settings Buttons */}
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Edit profile</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Email settings</Text>
        <Ionicons name="chevron-forward" size={20} />
      </Pressable>

      <Pressable style={styles.button}>
        <Ionicons name="key-outline" size={20} />
        <Text style={styles.buttonText}>Password and security</Text>
        <Ionicons name="chevron-forward" size={20} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F2E6",
    padding: 20,
  },

  card: {
    backgroundColor: "#3E5870",
    borderRadius: 20,
    padding: 25,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  name: {
    fontSize: 22,
    color: "white",
    fontWeight: "600",
  },

  username: {
    color: "#dcdcdc",
    marginTop: 5,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  statBox: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: 80,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "600",
  },

  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    backgroundColor: "#ddd",
    borderRadius: 15,
    paddingVertical: 12,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
  },

  tab: {
    fontSize: 16,
    fontWeight: "400",
  },

  divider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  button: {
    backgroundColor: "#d5d9df",
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonText: {
    fontSize: 16,
  },
});