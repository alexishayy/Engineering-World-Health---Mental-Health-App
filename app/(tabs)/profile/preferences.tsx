import { StyleSheet, Text, View } from "react-native";

export default function PreferencesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <Text>Notifications: On</Text>
      <Text>Theme: Light</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e2cc",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
});