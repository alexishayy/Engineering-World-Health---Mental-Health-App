import { StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Stats</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>12 Days</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Boxes Completed</Text>
          <Text style={styles.statValue}>20</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Friends Added</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
      </View>
    </View>
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
    marginBottom: 20,
  },

  statRow: {
    marginBottom: 18,
  },

  statLabel: {
    color: "#dcdcdc",
  },

  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
});