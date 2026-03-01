import { StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      <Text>Total Sessions: 54</Text>
      <Text>Longest Streak: 12 days</Text>
      <Text>Total Boxes Completed: 20</Text>
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