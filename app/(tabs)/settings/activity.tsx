import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Activity</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.text}>Completed 3 tasks today</Text>
          <Text style={styles.text}>Logged in yesterday</Text>
          <Text style={styles.text}>Started streak 🔥</Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.buttonWrapper}>
          <View style={styles.buttonShadow} />
          <View style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F5F1" },

  header: {
    backgroundColor: "#A3CEF1",
    paddingVertical: 20,
    alignItems: "center",
  },

  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },

  container: { flex: 1, padding: 18 },

  card: {
    backgroundColor: "#E7EFF0",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B5E48C",
  },

  text: {
    fontSize: 16,
    marginBottom: 10,
    color: "#588157",
  },

  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },

  button: {
    backgroundColor: "#A3CEF1",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    position: "absolute",
  },

  buttonShadow: {
    backgroundColor: "#588157",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    top: 5,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});