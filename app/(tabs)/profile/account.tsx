import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>@username</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>user@email.com</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>2025</Text>
        </View>
      </View>

      <Pressable style={styles.button}>
        <Ionicons name="log-out-outline" size={20} />
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
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

  infoRow: {
    marginBottom: 15,
  },

  label: {
    color: "#dcdcdc",
  },

  value: {
    color: "white",
    fontSize: 16,
    marginTop: 3,
  },

  button: {
    backgroundColor: "#d5d9df",
    padding: 18,
    borderRadius: 15,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});