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
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.container}>
        {/* SETTINGS CARD */}
        <View style={styles.card}>
          {/* Account */}
          <Pressable
            onPress={() => router.push("/settings/account")}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.label}>Account details</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#588157"
            />
          </Pressable>

          {/* Activity */}
          <Pressable
            onPress={() => router.push("/settings/activity")}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.label}>Activity</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#588157"
            />
          </Pressable>

          {/* Dark Mode */}
          <View style={styles.row}>
            <Text style={styles.label}>Dark Mode</Text>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: "red",
                true: "#A3CEF1",
              }}
              thumbColor="white"
            />
          </View>

          {/* About */}
          <Pressable
            onPress={() => router.push("/settings/about")}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.label}>About</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#588157"
            />
          </Pressable>
        </View>

        {/* LOGOUT */}
        <Pressable
          style={({ pressed }) => [
            styles.logout,
            pressed && styles.logoutPressed,
          ]}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F5F1",
  },

  /* HEADER */
  header: {
    backgroundColor: "#A3CEF1",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 22,
  },

  /* CARD */
  card: {
    backgroundColor: "#E7EFF0",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#B5E48C",
    overflow: "hidden",
  },

  /* ROWS */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 28,
    paddingHorizontal: 22,

    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  rowPressed: {
    backgroundColor: "#dce7ea",
  },

  label: {
    fontSize: 17,
    color: "#588157",
    fontWeight: "500",
  },

  /* LOGOUT */
  logout: {
    marginTop: 32,

    backgroundColor: "#E7EFF0",

    paddingVertical: 20,

    borderRadius: 22,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#B5E48C",
  },

  logoutPressed: {
    backgroundColor: "#dce7ea",
  },

  logoutText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#9A9696",
  },
});