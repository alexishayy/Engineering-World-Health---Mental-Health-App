import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Centered Title */}
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        {/* Account */}
        <Pressable style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed
        ]}>
          <Text style={styles.label}>Account details</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>

        {/* Activity */}
        <Pressable style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed
        ]}>
          <Text style={styles.label}>Activity</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>

        {/* Notifications */}
        <View style={styles.row}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "red", true: "#007AFF" }}
            thumbColor="white"
          />
        </View>

        {/* Dark Mode */}
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "red", true: "#007AFF" }}
            thumbColor="white"
          />
        </View>

        {/* About */}
        <Pressable style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed
        ]}>
          <Text style={styles.label}>About</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [
          styles.logout,
          pressed && styles.logoutPressed
        ]}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      {/* Bottom spacing */}
      <View style={{ height: 60 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F2E6",
    paddingHorizontal: 20, // spacing from edges
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center", // centered title
    marginTop: 10,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#E5E5E5",
    borderRadius: 18,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30, // 🔥 thicker rows
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },

  rowPressed: {
    backgroundColor: "rgba(0,0,0,0.08)", // darken on press
  },

  label: {
    fontSize: 16,
  },

  logout: {
    marginTop: 25,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  logoutPressed: {
    backgroundColor: "rgba(0,0,0,0.08)", // subtle shaded rectangle
  },

  logoutText: {
    fontSize: 16,
    color: "#8B0000",
    fontWeight: "500",
  },
});