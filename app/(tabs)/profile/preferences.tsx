import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Preferences</Text>

        {/* Notifications Switch */}
        <View style={styles.row}>
          <Text style={styles.label}>Notifications</Text>

          <Pressable
            style={[
              styles.switch,
              {
                backgroundColor: notificationsOn
                  ? "#4CD964"
                  : "#FF3B30",
              },
            ]}
            onPress={() => setNotificationsOn(!notificationsOn)}
          >
            <View
              style={[
                styles.circle,
                {
                  alignSelf: notificationsOn
                    ? "flex-end"
                    : "flex-start",
                },
              ]}
            />
          </Pressable>
        </View>

        {/* Theme Switch */}
        <View style={styles.row}>
          <Text style={styles.label}>Theme</Text>

          <Pressable
            style={[
              styles.themeSwitch,
              {
                backgroundColor: darkMode
                  ? "#1C1C1E"
                  : "#E5E5EA",
              },
            ]}
            onPress={() => setDarkMode(!darkMode)}
          >
            {/* Moon Icon */}
            <Ionicons
              name="moon"
              size={16}
              color={darkMode ? "white" : "#555"}
              style={styles.leftIcon}
            />

            {/* Sun Icon */}
            <Ionicons
              name="sunny"
              size={16}
              color={!darkMode ? "#000" : "#888"}
              style={styles.rightIcon}
            />

            {/* Sliding Circle */}
            <View
              style={[
                styles.sliderCircle,
                {
                  alignSelf: darkMode
                    ? "flex-start"
                    : "flex-end",
                },
              ]}
            />
          </Pressable>
        </View>
      </View>
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

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  label: {
    color: "white",
    fontSize: 16,
  },

  /* Notification Switch */
  switch: {
    width: 80,
    height: 36,
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    elevation: 3,
  },

  /* Theme Switch */
  themeSwitch: {
    width: 80,
    height: 36,
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 6,
    position: "relative",
  },

  leftIcon: {
    position: "absolute",
    left: 10,
  },

  rightIcon: {
    position: "absolute",
    right: 10,
  },

  sliderCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    elevation: 3,
  },
});