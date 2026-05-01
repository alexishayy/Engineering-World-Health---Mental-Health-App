import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.container}>
        {/* CARD */}
        <View style={styles.card}>
          <Pressable
            onPress={() => router.push("/settings/account")}
            style={styles.row}
          >
            <Text style={styles.label}>Account details</Text>
            <Ionicons name="chevron-forward" size={20} color="#588157" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/settings/activity")}
            style={styles.row}
          >
            <Text style={styles.label}>Activity</Text>
            <Ionicons name="chevron-forward" size={20} color="#588157" />
          </Pressable>

          <View style={styles.row}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "red", true: "#A3CEF1" }}
              thumbColor="white"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "red", true: "#A3CEF1" }}
              thumbColor="white"
            />
          </View>

          <Pressable
            onPress={() => router.push("/settings/about")}
            style={styles.row}
          >
            <Text style={styles.label}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#588157" />
          </Pressable>
        </View>

        {/* LOGOUT */}
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
    backgroundColor: "#F8F5F1",
  },

  header: {
    backgroundColor: "#A3CEF1",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  card: {
    backgroundColor: "#E7EFF0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B5E48C",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  label: {
    fontSize: 16,
    color: "#588157",
  },

  logout: {
    marginTop: 30,
    backgroundColor: "#E7EFF0",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B5E48C",
  },

  logoutText: {
    color: "#9A9696",
    fontWeight: "600",
  },
});